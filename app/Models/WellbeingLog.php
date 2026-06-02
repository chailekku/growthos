<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WellbeingLog extends Model {
    protected $fillable = ['user_id','stress_level','motivation_level','sleep_quality','social_connection','overall_wellbeing','burnout_risk','notes','recorded_at'];
    protected function casts(): array { return ['recorded_at'=>'datetime']; }
    public function user() { return $this->belongsTo(User::class); }
}
