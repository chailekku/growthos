<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ReflectionEntry extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id','type','prompt','content','gratitude','challenges','goals_next','ai_insight','mood','is_private','shared_with_advisor'];
    protected function casts(): array {
        return ['gratitude'=>'array','is_private'=>'boolean','shared_with_advisor'=>'boolean'];
    }
    public function user() { return $this->belongsTo(User::class); }
    public function scopePublic($q) { return $q->where('is_private', false); }
    public function scopeSharedWithAdvisor($q) { return $q->where('shared_with_advisor', true); }
}
