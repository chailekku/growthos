<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect($this->roleRedirectPath(Auth::user()->role));
        }
        return view('auth.login');
    }

    /**
     * Demo login — only active when DEMO_MODE=true
     */
    public function demoLogin(Request $request)
    {
        abort_unless(config('app.demo_mode', false), 403, 'Demo mode disabled');

        $role = $request->input('role', 'student');
        $demoEmails = [
            'student'      => 'demo.student@kkumail.com',
            'teacher'      => 'demo.teacher@kku.ac.th',
            'psychologist' => 'demo.psych@kku.ac.th',
            'super_admin'  => 'demo.admin@kku.ac.th',
        ];

        $email = $demoEmails[$role] ?? $demoEmails['student'];

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name'             => 'Demo ' . ucfirst($role),
                'role'             => $role,
                'auth_provider'    => 'local',
                'password'         => Hash::make('demo_password'),
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

        Auth::login($user, remember: true);

        return response()->json([
            'redirect' => $this->roleRedirectPath($role),
        ]);
    }

    public function logout(Request $request)
    {
        $provider = Auth::user()?->auth_provider;
        $idToken  = session('oidc_id_token'); // grab before session is invalidated

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // For KKU SSO — redirect to OIDC end_session_endpoint so the
        // KKU SSO session is terminated (Single Logout / RP-Initiated Logout)
        if ($provider === 'kku_sso') {
            $discovery  = Cache::get('oidc_discovery');
            $endSession = $discovery['end_session_endpoint']
                ?? rtrim(config('services.oidc.issuer'), '/') . '/openid-connect/logout';

            $params = http_build_query(array_filter([
                'id_token_hint'            => $idToken,
                'post_logout_redirect_uri' => config('services.oidc.redirect_logout'),
            ]));

            return redirect("{$endSession}?{$params}");
        }

        return redirect('/login');
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
