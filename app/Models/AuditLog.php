<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class AuditLog extends Model {
    protected $fillable = ['user_id','action','resource','resource_id','old_values','new_values','ip_address','user_agent'];
    protected function casts(): array { return ['old_values'=>'array','new_values'=>'array']; }
    public function user() { return $this->belongsTo(User::class); }
    public $timestamps = true;
    const UPDATED_AT = null; // audit logs are immutable
}
