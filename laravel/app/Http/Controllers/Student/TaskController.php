<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user   = Auth::user();
        $status = $request->get('status', 'all');

        $query = Task::forUser($user->id)->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $tasks = $query->paginate(20);

        return view('student.tasks.index', compact('tasks', 'status'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'description'         => 'nullable|string',
            'priority'            => 'in:low,medium,high,urgent',
            'category'            => 'in:academic,personal,health,social,career,other',
            'due_date'            => 'nullable|date',
            'estimated_minutes'   => 'nullable|integer|min:1|max:480',
        ]);

        $task = Auth::user()->tasks()->create($validated);

        if ($request->wantsJson()) {
            return response()->json(['task' => $task, 'message' => 'เพิ่มงานแล้ว']);
        }

        return back()->with('success', 'เพิ่มงานแล้ว');
    }

    public function toggleComplete(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        if ($task->status === 'completed') {
            $task->update(['status' => 'todo', 'completed_at' => null]);
        } else {
            $task->update(['status' => 'completed', 'completed_at' => now()]);
        }

        return back();
    }

    public function destroy(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);
        $task->delete();
        return back()->with('success', 'ลบงานแล้ว');
    }
}
