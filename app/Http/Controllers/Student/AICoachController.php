<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\AICoachService;
use Illuminate\Http\Request;

class AICoachController extends Controller
{
    public function index()
    {
        $history = auth()->user()->aiFeedback()->latest()->take(20)->get();
        return view('student.ai-coach.index', compact('history'));
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message'    => 'required|string|max:1000',
            'coach_type' => 'in:productivity,reflection,focus,self_leadership,wellbeing',
        ]);

        $response = (new AICoachService)->chat(
            auth()->user(),
            $request->message,
            $request->coach_type ?? 'productivity'
        );

        return response()->json(['response' => $response]);
    }
}
