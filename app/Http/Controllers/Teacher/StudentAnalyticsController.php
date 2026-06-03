<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
class StudentAnalyticsController extends Controller {
    public function index() { return view('teacher.student-analytics.index'); }
}
