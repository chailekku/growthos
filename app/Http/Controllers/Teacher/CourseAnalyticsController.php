<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
class CourseAnalyticsController extends Controller {
    public function index() { return view('teacher.course-analytics.index'); }
}
