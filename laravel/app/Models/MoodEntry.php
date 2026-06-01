<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MoodEntry extends Model {
    protected $fillable = ['user_id','mood','energy','emotions','notes','recorded_at'];
    protected function casts(): array {
        return ['recorded_at'=>'datetime','emotions'=>'array'];
    }
    public function user() { return $this->belongsTo(User::class); }
    public function scopeThisWeek($q) { return $q->whereBetween('recorded_at',[now()->startOfWeek(),now()->endOfWeek()]); }
}
