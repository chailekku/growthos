<?php
namespace App\Http\Controllers\Psychologist;
use App\Http\Controllers\Controller;
class EmotionalTrendsController extends Controller {
    public function index() { return view('psychologist.emotional-trends.index'); }
}
