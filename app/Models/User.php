<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'auth_provider', 'provider_id',
        'avatar_url', 'student_id', 'employee_id', 'department', 'faculty',
        'phone', 'language', 'is_active', 'privacy_settings', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token', 'provider_id'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'is_active'         => 'boolean',
            'privacy_settings'  => 'array',
            'password'          => 'hashed',
        ];
    }

    public function isStudent(): bool      { return $this->role === 'student'; }
    public function isTeacher(): bool      { return $this->role === 'teacher'; }
    public function isPsychologist(): bool { return $this->role === 'psychologist'; }
    public function isAdmin(): bool        { return $this->role === 'super_admin'; }

    public static function determineRoleFromEmail(string $email): string
    {
        $domain = strtolower(substr($email, strpos($email, '@') + 1));
        $studentDomain = config('auth.kku_student_domain', 'kkumail.com');
        $staffDomain   = config('auth.kku_staff_domain', 'kku.ac.th');
        return match ($domain) {
            $studentDomain => 'student',
            $staffDomain   => 'teacher',
            default        => 'teacher',
        };
    }

    public function getAvatarAttribute(): string
    {
        return $this->avatar_url
            ?? "https://api.dicebear.com/7.x/initials/svg?seed=" . urlencode($this->name);
    }

    public function tasks(): HasMany             { return $this->hasMany(Task::class); }
    public function focusSessions(): HasMany     { return $this->hasMany(FocusSession::class); }
    public function moodEntries(): HasMany       { return $this->hasMany(MoodEntry::class); }
    public function reflectionEntries(): HasMany { return $this->hasMany(ReflectionEntry::class); }
    public function habits(): HasMany            { return $this->hasMany(Habit::class); }
    public function goals(): HasMany             { return $this->hasMany(Goals::class); }
    public function wellbeingLogs(): HasMany     { return $this->hasMany(WellbeingLog::class); }
    public function aiFeedback(): HasMany        { return $this->hasMany(AiFeedback::class); }
    public function userNotifications(): HasMany { return $this->hasMany(UserNotification::class); }
    public function productivityLogs(): HasMany  { return $this->hasMany(ProductivityLog::class); }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments')->withPivot('status');
    }

    public function taughtCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }
}
