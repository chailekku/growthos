<?php

namespace App\Http\Controllers\Psychologist;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WellbeingLog;

class DashboardController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'student')
            ->where('is_active', true)
            ->whereRaw("JSON_EXTRACT(privacy_settings, '$.wellbeing_shared') = true")
            ->select('id', 'name', 'email', 'last_login_at')
            ->get()
            ->map(function ($student) {
                $student->latestWellbeing = WellbeingLog::where('user_id', $student->id)
                    ->latest('recorded_at')->first();
                return $student;
            });

        $totalConsenting  = $students->count();
        $elevatedRiskCount = $students->filter(fn($s) =>
            $s->latestWellbeing && in_array($s->latestWellbeing->burnout_risk, ['elevated', 'high'])
        )->count();
        $avgWellbeing = $students->filter(fn($s) => $s->latestWellbeing)
            ->avg(fn($s) => $s->latestWellbeing->overall_wellbeing) ?? 0;
        $highRiskStudents = $students->filter(fn($s) =>
            $s->latestWellbeing && $s->latestWellbeing->burnout_risk === 'high'
        )->values();

        return view('psychologist.dashboard', compact(
            'students', 'totalConsenting', 'elevatedRiskCount', 'avgWellbeing', 'highRiskStudents'
        ));
    }

    private function getClassMoodTrend(): array
    {
        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $avg  = \App\Models\MoodEntry::whereDate('recorded_at', $date)->avg('mood');
            $trend[] = [
                'date'     => $i === 0 ? 'วันนี้' : ($i === 1 ? 'เมื่อวาน' : "{$i} วันที่แล้ว"),
                'avg_mood' => $avg ? round($avg, 1) : null,
            ];
        }
        return $trend;
    }
}
