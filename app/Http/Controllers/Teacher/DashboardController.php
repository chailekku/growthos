<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $teacher       = Auth::user();
        $students      = $this->getStudents($teacher);
        $atRiskStudents = $students->filter(fn($s) => in_array($s->risk_level, ['elevated', 'high']))->values();

        $totalStudents  = $students->count();
        $activeStudents = $students->filter(fn($s) => $s->last_login_at && $s->last_login_at->isAfter(now()->subDays(7)))->count();
        $atRiskCount    = $atRiskStudents->count();
        $avgEngagement  = (float) ($students->avg('engagement_score') ?? 0);

        return view('teacher.dashboard', compact(
            'students', 'atRiskStudents',
            'totalStudents', 'activeStudents', 'atRiskCount', 'avgEngagement'
        ));
    }

    private function getStudents($teacher)
    {
        $courseIds = $teacher->taughtCourses()->pluck('id');

        return User::where('role', 'student')
            ->where('is_active', true)
            ->whereHas('enrolledCourses', fn($q) => $q->whereIn('course_id', $courseIds))
            ->select('id', 'name', 'email', 'student_id', 'department', 'last_login_at', 'avatar_url')
            ->withCount([
                'reflectionEntries as reflection_count',
                'focusSessions as focus_count' => fn($q) => $q->where('status', 'completed'),
            ])
            ->get()
            ->map(function ($student) {
                $recentFocus = $student->focusSessions()
                    ->where('status', 'completed')
                    ->whereBetween('started_at', [now()->subDays(7), now()])
                    ->sum('actual_minutes');

                $student->weekly_focus_minutes = $recentFocus;
                $student->engagement_score     = $this->calcEngagement($student);
                $student->risk_level           = $this->calcRisk($student);
                return $student;
            });
    }

    private function calcEngagement($student): int
    {
        $reflectionRate = min(100, $student->reflection_count * 5);
        $focusScore     = min(100, (int) ($student->weekly_focus_minutes / 2));
        return (int) (($reflectionRate + $focusScore) / 2);
    }

    private function calcRisk($student): string
    {
        $engagement = $student->engagement_score;
        $daysSinceLogin = $student->last_login_at
            ? now()->diffInDays($student->last_login_at)
            : 999;

        if ($engagement < 20 || $daysSinceLogin > 5) return 'high';
        if ($engagement < 40 || $daysSinceLogin > 3) return 'elevated';
        if ($engagement < 60) return 'moderate';
        return 'low';
    }

}

