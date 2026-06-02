<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Department extends Model {
    protected $fillable = ['faculty_id','name','name_en','code','head_id','is_active'];
    public function faculty() { return $this->belongsTo(Faculty::class); }
    public function head() { return $this->belongsTo(User::class,'head_id'); }
    public function courses() { return $this->hasMany(Course::class); }
}
