<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\FocusSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FocusController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $recentSessions = FocusSession::where('user_id', $user->id)
            ->latest('started_at')
            ->take(10)
            ->get();

        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $weeklyData[] = [
                'day'     => $date->locale('th')->isoFormat('dd'),
                'minutes' => (int) FocusSession::where('user_id', $user->id)
                    ->whereDate('started_at', $date)->where('status', 'completed')->sum('actual_minutes'),
            ];
        }

        return view('student.focus.index', compact('user', 'recentSessions', 'weeklyData'));
    }

    public function start(Request $request)
    {
        $validated = $request->validate([
            'type'            => 'in:pomodoro,deep_work,short_focus,study',
            'planned_minutes' => 'integer|min:5|max:180',
            'task_id'         => 'nullable|exists:tasks,id',
        ]);

        $session = FocusSession::create([
            'user_id'         => Auth::id(),
            'type'            => $validated['type'] ?? 'pomodoro',
            'status'          => 'active',
            'planned_minutes' => $validated['planned_minutes'] ?? 25,
            'started_at'      => now(),
            'task_id'         => $validated['task_id'] ?? null,
        ]);

        return response()->json(['session_id' => $session->id]);
    }

    public function end(Request $request, FocusSession $session)
    {
        abort_unless($session->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'actual_minutes'    => 'required|integer|min:0',
            'distraction_count' => 'integer|min:0',
            'flow_score'        => 'integer|min:0|max:100',
            'notes'             => 'nullable|string|max:500',
        ]);

        $flowScore    = $validated['flow_score'] ?? max(0, 100 - ($validated['distraction_count'] ?? 0) * 15);
        $qualityScore = (int) (($flowScore + min(100, ($validated['actual_minutes'] / $session->planned_minutes) * 100)) / 2);

        $session->update([
            'status'            => 'completed',
            'actual_minutes'    => $validated['actual_minutes'],
            'distraction_count' => $validated['distraction_count'] ?? 0,
            'flow_score'        => $flowScore,
            'quality_score'     => $qualityScore,
            'notes'             => $validated['notes'] ?? null,
            'ended_at'          => now(),
        ]);

        $this->updateProductivityLog(Auth::id());

        return response()->json(['message' => 'Session saved', 'quality_score' => $qualityScore]);
    }

    private function updateProductivityLog(int $userId): void
    {
        $log = \App\Models\ProductivityLog::firstOrCreate(
            ['user_id' => $userId, 'log_date' => today()],
            ['tasks_completed' => 0, 'tasks_created' => 0, 'focus_minutes' => 0, 'productivity_score' => 0]
        );

        $focusMinutes    = FocusSession::where('user_id', $userId)->whereDate('started_at', today())->where('status', 'completed')->sum('actual_minutes');
        $tasksCompleted  = \App\Models\Task::where('user_id', $userId)->whereDate('completed_at', today())->count();
        $reflected       = \App\Models\ReflectionEntry::where('user_id', $userId)->whereDate('created_at', today())->exists();

        $score = min(100,
            min(40, $tasksCompleted * 10) +
            min(40, (int) ($focusMinutes / 3)) +
            ($reflected ? 20 : 0)
        );

        $log->update(['focus_minutes' => $focusMinutes, 'tasks_completed' => $tasksCompleted, 'productivity_score' => $score]);
    }
}
