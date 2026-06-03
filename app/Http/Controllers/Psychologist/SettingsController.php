<?php
namespace App\Http\Controllers\Psychologist;
use App\Http\Controllers\Controller;
class SettingsController extends Controller {
    public function index() { return view('psychologist.settings.index'); }
    public function update() { return back()->with('success', 'บันทึกการตั้งค่าแล้ว'); }
}
