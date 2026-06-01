<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class UserNotification extends Model {
    protected $table = 'notifications';
    protected $fillable = ['user_id','sent_by','type','title','body','is_read','action_url','read_at'];
    protected function casts(): array { return ['is_read'=>'boolean','read_at'=>'datetime']; }
    public function user() { return $this->belongsTo(User::class); }
    public function sender() { return $this->belongsTo(User::class,'sent_by'); }
    public function scopeUnread($q) { return $q->where('is_read',false); }
}
