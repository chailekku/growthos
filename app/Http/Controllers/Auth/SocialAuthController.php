<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    // ── KKU OIDC (ssonext.kku.ac.th) ─────────────────────────────

    /**
     * Fetch & cache the OIDC discovery document.
     * The discovery document contains all endpoint URLs (authorization,
     * token, userinfo, end_session) so we never hardcode them.
     */
    private function oidcDiscovery(): array
    {
        return Cache::remember('oidc_discovery', 3600, function () {
            $issuer = rtrim(config('services.oidc.issuer'), '/');
            $response = Http::timeout(10)->get("{$issuer}/.well-known/openid-configuration");
            abort_unless($response->successful(), 503, 'KKU SSO discovery failed');
            return $response->json();
        });
    }

    /**
     * Step 1 — redirect user to KKU SSO authorization endpoint.
     * Generates state + nonce stored in session to prevent CSRF.
     */
    public function redirectToKku()
    {
        $discovery = $this->oidcDiscovery();
        $state     = bin2hex(random_bytes(16));
        $nonce     = bin2hex(random_bytes(16));

        session(['oidc_state' => $state, 'oidc_nonce' => $nonce]);

        $params = http_build_query([
            'response_type' => 'code',
            'client_id'     => config('services.oidc.client_id'),
            'redirect_uri'  => config('services.oidc.redirect'),
            'scope'         => 'openid email profile',
            'state'         => $state,
            'nonce'         => $nonce,
        ]);

        return redirect($discovery['authorization_endpoint'] . '?' . $params);
    }

    /**
     * Step 2 — KKU SSO redirects back here with ?code=...&state=...
     * Registered Redirect URI: {APP_URL}/auth/callback/login
     */
    public function handleKkuCallback(Request $request)
    {
        if ($request->has('error')) {
            return redirect('/login')->withErrors([
                'sso' => $request->get('error_description', 'KKU SSO ล้มเหลว'),
            ]);
        }

        if ($request->get('state') !== session('oidc_state')) {
            return redirect('/login')->withErrors(['sso' => 'State ไม่ตรงกัน — กรุณาลองใหม่']);
        }

        try {
            $discovery = $this->oidcDiscovery();

            // Exchange authorization code for tokens
            $tokenResponse = Http::asForm()
                ->withBasicAuth(
                    config('services.oidc.client_id'),
                    config('services.oidc.client_secret')
                )
                ->post($discovery['token_endpoint'], [
                    'grant_type'   => 'authorization_code',
                    'code'         => $request->get('code'),
                    'redirect_uri' => config('services.oidc.redirect'),
                ])
                ->json();

            if (isset($tokenResponse['error'])) {
                throw new \RuntimeException(
                    $tokenResponse['error_description'] ?? $tokenResponse['error']
                );
            }

            $accessToken = $tokenResponse['access_token'];
            $idToken     = $tokenResponse['id_token'] ?? null;

            // Fetch user claims from userinfo endpoint
            $userInfo = Http::withToken($accessToken)
                ->get($discovery['userinfo_endpoint'])
                ->json();

            // Store id_token so logout can send id_token_hint to KKU SSO
            session(['oidc_id_token' => $idToken]);
            session()->forget('oidc_state');
            session()->forget('oidc_nonce');

            return $this->loginOrRegister($userInfo, 'kku_sso');
        } catch (\Exception $e) {
            Cache::forget('oidc_discovery'); // refresh on next attempt
            return redirect('/login')->withErrors(['sso' => 'KKU SSO ล้มเหลว — กรุณาลองใหม่อีกครั้ง']);
        }
    }

    /**
     * Post-logout redirect — KKU SSO sends user back here after sign-out.
     * Registered Post-logout Redirect URI: {APP_URL}/auth/callback/logout
     */
    public function handleLogoutCallback()
    {
        return redirect('/login')->with('success', 'ออกจากระบบสำเร็จ');
    }

    // ── Google OAuth (external teachers without @kku.ac.th) ──────

    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $socialUser = Socialite::driver('google')->user();
            $userInfo   = [
                'sub'   => $socialUser->getId(),
                'email' => $socialUser->getEmail(),
                'name'  => $socialUser->getName(),
            ];
            return $this->loginOrRegister($userInfo, 'google');
        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['sso' => 'Google login ล้มเหลว']);
        }
    }

    // ── Shared ────────────────────────────────────────────────────

    private function loginOrRegister(array $userInfo, string $provider)
    {
        $email = strtolower($userInfo['email'] ?? '');

        if (! $email) {
            return redirect('/login')->withErrors(['sso' => 'ไม่พบอีเมลจาก SSO กรุณาติดต่อผู้ดูแลระบบ']);
        }

        $role = User::determineRoleFromEmail($email);

        // Students must use KKU SSO — block Google login for student domains
        if ($provider === 'google' && $role === 'student') {
            return redirect('/login')->withErrors([
                'sso' => 'นักศึกษากรุณาล็อกอินด้วยบัญชี @kkumail.com ผ่าน KKU SSO',
            ]);
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name'             => $userInfo['name'] ?? explode('@', $email)[0],
                'role'             => $role,
                'auth_provider'    => $provider,
                'provider_id'      => $userInfo['sub'] ?? null,
                'is_active'        => true,
                'email_verified_at' => now(),
                'privacy_settings' => [
                    'reflections_visible' => false,
                    'analytics_shared'    => true,
                    'wellbeing_shared'    => true,
                    'focus_data_shared'   => true,
                ],
            ]
        );

        if (! $user->is_active) {
            return redirect('/login')->withErrors([
                'sso' => 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ',
            ]);
        }

        $user->update([
            'provider_id'   => $userInfo['sub'] ?? $user->provider_id,
            'last_login_at' => now(),
        ]);

        Auth::login($user, remember: true);
        AuditService::log('login', 'users', $user->id, details: ['provider' => $provider]);

        return redirect($this->roleRedirectPath($user->role));
    }

    private function roleRedirectPath(string $role): string
    {
        return match ($role) {
            'student'                     => '/student/dashboard',
            'teacher'                     => '/teacher/dashboard',
            'psychologist'                => '/psychologist/dashboard',
            'super_admin', 'system_admin' => '/admin/dashboard',
            default                       => '/student/dashboard',
        };
    }
}
