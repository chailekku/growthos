<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class FocusSession extends Model {
    use HasFactory;
    protected $fillable = ['user_id','task_id','type','status','planned_minutes','actual_minutes','break_minutes','distraction_count','flow_score','quality_score','notes','started_at','ended_at'];
    protected function casts(): array {
        return ['started_at'=>'datetime','ended_at'=>'datetime'];
    }
    public function user() { return $this->belongsTo(User::class); }
    public function task() { return $this->belongsTo(Task::class); }
    public function scopeToday($q) { return $q->whereDate('started_at',today()); }
    public function scopeCompleted($q) { return $q->where('status','completed'); }
}
