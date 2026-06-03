<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class PlatformAnalyticsController extends Controller
{
    public function index()
    {
        return view('admin.platform-analytics.index');
    }
}
