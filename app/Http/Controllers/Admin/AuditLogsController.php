<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class AuditLogsController extends Controller
{
    public function index()
    {
        return view('admin.audit-logs.index');
    }
}
