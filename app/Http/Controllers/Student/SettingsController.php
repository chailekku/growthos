<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return view('student.settings.index', compact('user'));
    }

    public function update(Request $request)
    {
        // Settings such as language, theme, privacy, notifications
        // Store in user meta or dedicated settings table when ready
        return back()->with('success', 'Settings saved successfully.');
    }
}
