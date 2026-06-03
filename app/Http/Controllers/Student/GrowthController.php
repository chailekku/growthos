<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class GrowthController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Mock growth data — replace with real DB queries
        $overallScore = 64;

        $metrics = [
            'habit_consistency'   => 60,
            'goal_progress'       => 44,
            'emotional_wellbeing' => 78,
            'focus_quality'       => 73,
        ];

        $habits = [
            ['name' => 'Morning Journaling',   'streak' => 5,  'weekly' => 71, 'done' => true],
            ['name' => 'Daily Reading',         'streak' => 3,  'weekly' => 57, 'done' => true],
            ['name' => 'Exercise / Walk',       'streak' => 1,  'weekly' => 43, 'done' => false],
            ['name' => 'Pomodoro Sessions',     'streak' => 7,  'weekly' => 100,'done' => true],
            ['name' => 'Reflection Before Bed', 'streak' => 0,  'weekly' => 14, 'done' => false],
        ];

        $goals = [
            ['title' => 'Complete all CS101 assignments', 'progress' => 60, 'due' => 'Jun 30'],
            ['title' => 'Read 2 books this month',        'progress' => 50, 'due' => 'Jun 30'],
            ['title' => 'Improve focus to 4h/day',        'progress' => 36, 'due' => 'Jul 15'],
            ['title' => 'Build daily reflection habit',   'progress' => 20, 'due' => 'Jul 01'],
        ];

        $selfLeadership = [
            'self_awareness'  => 70,
            'self_regulation' => 65,
            'motivation'      => 80,
            'empathy'         => 75,
            'social_skills'   => 60,
        ];

        $productivityDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        $productivityData = [72, 85, 60, 78, 90, 45, 55];

        return view('student.growth.index', compact(
            'user', 'overallScore', 'metrics',
            'habits', 'goals', 'selfLeadership',
            'productivityDays', 'productivityData'
        ));
    }
}
