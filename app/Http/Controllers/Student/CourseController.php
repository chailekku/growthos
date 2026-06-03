<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Mock course data — replace with real DB queries when Course model is ready
        $courses = collect([
            [
                'id'       => 1,
                'code'     => 'CS101',
                'name'     => 'Introduction to Computer Science',
                'teacher'  => 'Assoc. Prof. Somchai Jaidee',
                'schedule' => 'Mon/Wed 09:00-10:30',
                'credits'  => 3,
                'type'     => 'Required',
                'progress' => 0,
                'color'    => 'teal',
            ],
            [
                'id'       => 2,
                'code'     => 'MATH201',
                'name'     => 'Calculus II',
                'teacher'  => 'Dr. Wanpen Khuankham',
                'schedule' => 'Tue/Thu 13:00-14:30',
                'credits'  => 3,
                'type'     => 'Required',
                'progress' => 0,
                'color'    => 'blue',
            ],
            [
                'id'       => 3,
                'code'     => 'ENG101',
                'name'     => 'English Communication I',
                'teacher'  => 'Aj. Sarah Mitchell',
                'schedule' => 'Fri 10:00-12:00',
                'credits'  => 2,
                'type'     => 'General Education',
                'progress' => 0,
                'color'    => 'purple',
            ],
            [
                'id'       => 4,
                'code'     => 'PHY101',
                'name'     => 'Physics for Engineers',
                'teacher'  => 'Dr. Narong Prasit',
                'schedule' => 'Mon/Wed/Fri 11:00-12:00',
                'credits'  => 3,
                'type'     => 'Required',
                'progress' => 0,
                'color'    => 'orange',
            ],
            [
                'id'       => 5,
                'code'     => 'SOC201',
                'name'     => 'Thai Society and Culture',
                'teacher'  => 'Aj. Panida Suwannarat',
                'schedule' => 'Thu 13:00-16:00',
                'credits'  => 3,
                'type'     => 'Elective',
                'progress' => 0,
                'color'    => 'rose',
            ],
            [
                'id'       => 6,
                'code'     => 'LAB201',
                'name'     => 'Computer Lab Practice',
                'teacher'  => 'Aj. Kittipong Lertwattanakul',
                'schedule' => 'Tue 14:00-17:00',
                'credits'  => 1,
                'type'     => 'Laboratory',
                'progress' => 0,
                'color'    => 'emerald',
            ],
        ]);

        $totalCredits     = $courses->sum('credits');
        $activeCourses    = $courses->count();
        $completedCourses = 0;

        return view('student.courses.index', compact(
            'user', 'courses', 'totalCredits', 'activeCourses', 'completedCourses'
        ));
    }
}
