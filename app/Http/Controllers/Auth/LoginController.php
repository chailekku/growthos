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
            return redirect($this->roleRedirectUrl(Auth::user()->role));
        }
        return view('auth.login');
    }

    /**
     * Demo login — only active when DEMO_MODE=true
     * รองรับทั้ง HTML form (redirect) และ AJAX/fetch (JSON)
     */
    public function demoLogin(Request $request)
    {
        abort_unless(config('app.demo_mode', false), 403, 'Demo mode is disabled');

        $role = $request->input('role', 'student');

        $demoEmails = [
            'student'      => 'demo.student@kkumail.com',
            'teacher'      => 'demo.teacher@kku.ac.th',
            'psychologist' => 'demo.psych@kku.ac.th',
            'super_admin'  => 'demo.admin@kku.ac.th',
        ];

        // role ไม่ถูกต้อง → ใช้ student แทน
        if (! array_key_exists($role, $demoEmails)) {
            $role = 'student';
        }

        $email = $demoEmails[$role];

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name'              => 'Demo ' . ucfirst(str_replace('_', ' ', $role)),
                'role'              => $role,
                'auth_provider'     => 'local',
                'password'          => Hash::make('demo_password_' . $role),
                'is_active'         => true,
                'email_verified_at' => now(),
                'privacy_settings'  => [
                    'reflections_visible' => false,
                    'analytics_shared'    => true,
                    'wellbeing_shared'    => true,
                    'focus_data_shared'   => true,
                ],
            ]
        );

        // อัปเดต role ถ้า user มีอยู่แล้วแต่ role เปลี่ยน
        if ($user->role !== $role) {
            $user->update(['role' => $role]);
        }

        // Sync Spatie role — จำเป็นสำหรับ route middleware 'role:xxx'
        $user->syncRoles([$role]);

        Auth::login($user, remember: true);

        $redirectUrl = $this->roleRedirectUrl($role);

        // AJAX / fetch → ส่ง JSON กลับ
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json(['redirect' => $redirectUrl]);
        }

        // HTML form → redirect ปกติ
        return redirect($redirectUrl);
    }

    public function logout(Request $request)
    {
        // ดึงข้อมูลก่อน invalidate session
        $provider = Auth::user()?->auth_provider;
        $idToken  = session('oidc_id_token');

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // KKU SSO Single Logout
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

        // Google / local → กลับหน้า login
        return redirect()->route('login');
    }

    /**
     * ใช้ named routes เพื่อให้ถูกต้องแม้ app อยู่ใน subdirectory
     */
    private function roleRedirectUrl(string $role): string
    {
        return match ($role) {
            'teacher'      => route('teacher.dashboard'),
            'psychologist' => route('psychologist.dashboard'),
            'super_admin'  => route('admin.dashboard'),
            default        => route('student.dashboard'),
        };
    }
}
