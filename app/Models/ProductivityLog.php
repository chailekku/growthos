<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ProductivityLog extends Model {
    protected $fillable = ['user_id','log_date','tasks_completed','tasks_created','focus_minutes','productivity_score'];
    protected function casts(): array { return ['log_date'=>'date']; }
    public function user() { return $this->belongsTo(User::class); }
}
