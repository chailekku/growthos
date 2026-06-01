<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Microsoft Azure AD (KKU SSO)
     * - Students login with @kkumail.com
     * - Staff login with @kku.ac.th
     */
    public function redirectToMicrosoft()
    {
        return Socialite::driver('azure')
            ->scopes(['email', 'profile', 'openid'])
            ->redirect();
    }

    public function handleMicrosoftCallback()
    {
        try {
            $socialUser = Socialite::driver('azure')->user();
            return $this->loginOrRegister($socialUser, 'microsoft');
        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['sso' => 'KKU SSO ล้มเหลว: ' . $e->getMessage()]);
        }
    }

    /**
     * Google OAuth – for external teachers without @kku.ac.th
     */
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
            return $this->loginOrRegister($socialUser, 'google');
        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['sso' => 'Google login ล้มเหลว']);
        }
    }

    private function loginOrRegister($socialUser, string $provider)
    {
        $email  = strtolower($socialUser->getEmail());
        $domain = strtolower(substr($email, strpos($email, '@') + 1));

        // Domain-based role assignment
        $role = User::determineRoleFromEmail($email);

        // For Google logins, only allow teachers (not students)
        if ($provider === 'google' && $role === 'student') {
            return redirect('/login')->withErrors([
                'sso' => 'นักศึกษากรุณาล็อกอินด้วยบัญชี @kkumail.com ผ่าน KKU SSO',
            ]);
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name'          => $socialUser->getName() ?? explode('@', $email)[0],
                'role'          => $role,
                'auth_provider' => $provider,
                'provider_id'   => $socialUser->getId(),
                'avatar_url'    => $socialUser->getAvatar(),
                'is_active'     => true,
                'privacy_settings' => [
                    'reflections_visible' => false,
                    'analytics_shared'    => true,
                    'wellbeing_shared'    => true,
                    'focus_data_shared'   => true,
                ],
            ]
        );

        if (! $user->is_active) {
            return redirect('/login')->withErrors(['sso' => 'บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ']);
        }

        $user->update([
            'provider_id' => $socialUser->getId(),
            'avatar_url'  => $user->avatar_url ?? $socialUser->getAvatar(),
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
