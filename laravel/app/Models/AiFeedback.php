<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AiFeedback extends Model {
    protected $table = 'ai_feedback';
    protected $fillable = ['user_id','coach_type','prompt','response','context','rating','model_used','tokens_used'];
    protected function casts(): array { return ['context'=>'array']; }
    public function user() { return $this->belongsTo(User::class); }
}
