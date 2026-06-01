<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ReflectionEntry;
use App\Services\AICoachService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReflectionController extends Controller
{
    public function index()
    {
        $user       = Auth::user();
        $entries    = ReflectionEntry::where('user_id', $user->id)->latest()->paginate(10);
        $todayDone  = ReflectionEntry::where('user_id', $user->id)->whereDate('created_at', today())->exists();
        return view('student.reflection.index', compact('user', 'entries', 'todayDone'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'                 => 'in:daily,weekly,monthly,goal',
            'content'              => 'required|string|min:10',
            'gratitude'            => 'nullable|array',
            'gratitude.*'          => 'nullable|string|max:200',
            'challenges'           => 'nullable|string',
            'goals_next'           => 'nullable|string',
            'mood'                 => 'nullable|integer|min:1|max:5',
            'is_private'           => 'boolean',
            'shared_with_advisor'  => 'boolean',
        ]);

        // Generate AI insight
        $aiInsight = null;
        try {
            $aiInsight = (new AICoachService)->generateReflectionInsight($validated['content'], Auth::user());
        } catch (\Exception) {}

        $entry = ReflectionEntry::create(array_merge($validated, [
            'user_id'    => Auth::id(),
            'ai_insight' => $aiInsight,
            'gratitude'  => array_filter($validated['gratitude'] ?? []),
        ]));

        if ($request->wantsJson()) {
            return response()->json(['entry' => $entry, 'ai_insight' => $aiInsight]);
        }

        return redirect()->route('student.reflection.index')->with('success', 'บันทึกการสะท้อนคิดแล้ว 🌱');
    }
}
