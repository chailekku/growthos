<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Faculty extends Model {
    protected $fillable = ['name','name_en','code','dean_id','is_active'];
    public function departments() { return $this->hasMany(Department::class); }
    public function dean() { return $this->belongsTo(User::class,'dean_id'); }
}
