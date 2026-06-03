<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
class SettingsController extends Controller {
    public function index() { return view('teacher.settings.index'); }
    public function update() { return back()->with('success', 'บันทึกการตั้งค่าแล้ว'); }
}
