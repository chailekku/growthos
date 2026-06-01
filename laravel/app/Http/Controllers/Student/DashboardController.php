<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\FocusSession;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $todayFocusMinutes = FocusSession::where('user_id', $user->id)
            ->whereDate('started_at', today())
            ->where('status', 'completed')
            ->sum('actual_minutes');

        $weeklyFocusMinutes = FocusSession::where('user_id', $user->id)
            ->whereBetween('started_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->where('status', 'completed')
            ->sum('actual_minutes');

        $tasksTotal     = Task::forUser($user->id)->count();
        $tasksCompleted = Task::forUser($user->id)->completedToday()->count();

        $currentStreak  = $this->calculateStreak($user->id);

        $recentTasks = Task::forUser($user->id)
            ->pending()
            ->orderByRaw("FIELD(priority,'urgent','high','medium','low')")
            ->take(6)
            ->get();

        $todayMood = $user->moodEntries()
            ->whereDate('recorded_at', today())
            ->latest()
            ->first();

        $recentReflection = $user->reflectionEntries()
            ->whereDate('created_at', today())
            ->exists();

        $weeklyData = $this->getWeeklyFocusData($user->id);
        $moodTrend  = $this->getMoodTrend($user->id);

        return view('student.dashboard', compact(
            'user', 'todayFocusMinutes', 'weeklyFocusMinutes',
            'tasksTotal', 'tasksCompleted', 'currentStreak',
            'recentTasks', 'todayMood', 'recentReflection',
            'weeklyData', 'moodTrend'
        ));
    }

    private function calculateStreak(int $userId): int
    {
        $streak = 0;
        $date   = today();

        while (true) {
            $hasActivity = FocusSession::where('user_id', $userId)
                ->whereDate('started_at', $date)
                ->where('status', 'completed')
                ->exists();

            if (! $hasActivity) break;
            $streak++;
            $date = $date->copy()->subDay();
        }

        return $streak;
    }

    private function getWeeklyFocusData(int $userId): array
    {
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $minutes = FocusSession::where('user_id', $userId)
                ->whereDate('started_at', $date)
                ->where('status', 'completed')
                ->sum('actual_minutes');
            $days[] = [
                'day'     => $date->locale('th')->isoFormat('dd'),
                'minutes' => (int) $minutes,
            ];
        }
        return $days;
    }

    private function getMoodTrend(int $userId): array
    {
        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $entry = \App\Models\MoodEntry::where('user_id', $userId)
                ->whereDate('recorded_at', $date)
                ->first();
            $trend[] = [
                'date'   => $i === 0 ? 'วันนี้' : ($i === 1 ? 'เมื่อวาน' : "{$i} วันที่แล้ว"),
                'mood'   => $entry?->mood ?? null,
                'energy' => $entry?->energy ?? null,
            ];
        }
        return $trend;
    }
}
