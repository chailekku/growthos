<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Habit extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id','title','description','frequency','target_count','current_streak','longest_streak','color','icon','is_active'];
    protected function casts(): array { return ['is_active'=>'boolean']; }
    public function user() { return $this->belongsTo(User::class); }
    public function completions() { return $this->hasMany(HabitCompletion::class); }
    public function isCompletedToday(): bool {
        return $this->completions()->whereDate('completed_on', today())->exists();
    }
}
