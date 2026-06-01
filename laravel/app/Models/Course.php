<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Course extends Model {
    protected $fillable = ['code','name','name_en','teacher_id','department_id','semester','academic_year','credits','is_active'];
    protected function casts(): array { return ['is_active'=>'boolean']; }
    public function teacher() { return $this->belongsTo(User::class,'teacher_id'); }
    public function department() { return $this->belongsTo(Department::class); }
    public function students() { return $this->belongsToMany(User::class,'course_enrollments')->withPivot('status'); }
}
