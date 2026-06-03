<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class SystemHealthController extends Controller
{
    public function index()
    {
        return view('admin.system-health.index');
    }
}
