<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Task extends Model {
    use HasFactory, SoftDeletes;
    protected $fillable = ['user_id','title','description','priority','status','category','due_date','completed_at','estimated_minutes','actual_minutes','tags'];
    protected function casts(): array {
        return ['due_date'=>'date','completed_at'=>'datetime','tags'=>'array'];
    }
    public function user() { return $this->belongsTo(User::class); }
    public function focusSessions() { return $this->hasMany(FocusSession::class); }
    public function scopeForUser($q, $uid) { return $q->where('user_id', $uid); }
    public function scopePending($q) { return $q->whereIn('status',['todo','in_progress']); }
    public function scopeCompletedToday($q) { return $q->where('status','completed')->whereDate('completed_at',today()); }
}
