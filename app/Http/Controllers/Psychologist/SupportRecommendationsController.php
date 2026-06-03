<?php
namespace App\Http\Controllers\Psychologist;
use App\Http\Controllers\Controller;
class SupportRecommendationsController extends Controller {
    public function index() { return view('psychologist.support-recommendations.index'); }
}
