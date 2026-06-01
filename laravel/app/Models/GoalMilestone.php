<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GoalMilestone extends Model {
    protected $fillable = ['goal_id','title','completed','completed_at','order'];
    protected function casts(): array { return ['completed'=>'boolean','completed_at'=>'datetime']; }
    public function goal() { return $this->belongsTo(Goals::class); }
}
