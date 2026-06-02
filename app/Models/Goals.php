<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Goals extends Model {
    use SoftDeletes;
    protected $table = 'goals';
    protected $fillable = ['user_id','title','description','category','status','target_date','progress'];
    protected function casts(): array { return ['target_date'=>'date','progress'=>'integer']; }
    public function user() { return $this->belongsTo(User::class); }
    public function milestones() { return $this->hasMany(GoalMilestone::class,'goal_id')->orderBy('order'); }
}
