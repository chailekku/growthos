<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiFeedback;
use App\Models\AuditLog;
use App\Models\FocusSession;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers        = User::where('is_active', true)->count();
        $activeToday       = User::whereDate('last_login_at', today())->count();
        $totalFocusMinutes = (int) FocusSession::where('status', 'completed')->sum('actual_minutes');
        $aiInteractions    = AiFeedback::count();
        $usersByRole       = User::groupBy('role')->selectRaw('role, COUNT(*) as count')->pluck('count', 'role');
        $usersByProvider   = User::groupBy('auth_provider')->selectRaw('auth_provider, COUNT(*) as count')->pluck('count', 'auth_provider');
        $auditLogs         = AuditLog::with('user:id,name')->latest()->take(10)->get();

        return view('admin.dashboard', compact(
            'totalUsers', 'activeToday', 'totalFocusMinutes',
            'aiInteractions', 'usersByRole', 'usersByProvider', 'auditLogs'
        ));
    }

    public function users()
    {
        $users = User::latest()->paginate(30);
        return view('admin.users', compact('users'));
    }

    public function toggleUserStatus(User $user)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $user->update(['is_active' => ! $user->is_active]);
        \App\Services\AuditService::log('toggle_status', 'users', $user->id, ['is_active' => !$user->is_active], ['is_active' => $user->is_active]);
        return back()->with('success', $user->is_active ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว');
    }
}
