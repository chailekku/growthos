<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class CourseManagementController extends Controller
{
    public function index()
    {
        return view('admin.course-management.index');
    }
}
