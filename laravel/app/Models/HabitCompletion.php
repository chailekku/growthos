<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class HabitCompletion extends Model {
    protected $fillable = ['habit_id','user_id','completed_on'];
    protected function casts(): array { return ['completed_on'=>'date']; }
    public function habit() { return $this->belongsTo(Habit::class); }
    public function user() { return $this->belongsTo(User::class); }
}
