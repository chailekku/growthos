<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Student;
use App\Http\Controllers\Teacher;
use App\Http\Controllers\Psychologist;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────────────
Route::get('/', fn() => view('welcome'))->name('home');

// ── Authentication ────────────────────────────────────────────
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
// GET logout — สำหรับลบ session ผ่าน URL โดยตรง (กรณี POST ไม่สะดวก)
Route::get('/logout', [LoginController::class, 'logout'])->name('logout.get');
Route::post('/demo-login', [LoginController::class, 'demoLogin'])->name('demo.login');

// KKU SSO – OIDC (ssonext.kku.ac.th) — @kkumail.com / @kku.ac.th
Route::get('/auth/kku', [SocialAuthController::class, 'redirectToKku'])->name('auth.kku');
Route::get('/auth/callback/login', [SocialAuthController::class, 'handleKkuCallback'])->name('auth.callback.login');
Route::get('/auth/callback/logout', [SocialAuthController::class, 'handleLogoutCallback'])->name('auth.callback.logout');

// Google OAuth – external teachers without @kku.ac.th
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// ── Student Routes ─────────────────────────────────────────────
Route::prefix('student')->name('student.')->middleware(['auth', 'role:student'])->group(function () {
    Route::get('/dashboard', [Student\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::get('/', [Student\TaskController::class, 'index'])->name('index');
        Route::post('/', [Student\TaskController::class, 'store'])->name('store');
        Route::patch('/{task}/toggle', [Student\TaskController::class, 'toggleComplete'])->name('toggle');
        Route::delete('/{task}', [Student\TaskController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('focus')->name('focus.')->group(function () {
        Route::get('/', [Student\FocusController::class, 'index'])->name('index');
        Route::post('/start', [Student\FocusController::class, 'start'])->name('start');
        Route::patch('/{session}/end', [Student\FocusController::class, 'end'])->name('end');
    });

    Route::prefix('reflection')->name('reflection.')->group(function () {
        Route::get('/', [Student\ReflectionController::class, 'index'])->name('index');
        Route::post('/', [Student\ReflectionController::class, 'store'])->name('store');
    });

    Route::prefix('ai-coach')->name('ai-coach.')->group(function () {
        Route::get('/', [Student\AICoachController::class, 'index'])->name('index');
        Route::post('/chat', [Student\AICoachController::class, 'chat'])->name('chat');
    });

    Route::prefix('courses')->name('courses.')->group(function () {
        Route::get('/', [Student\CourseController::class, 'index'])->name('index');
    });

    Route::prefix('growth')->name('growth.')->group(function () {
        Route::get('/', [Student\GrowthController::class, 'index'])->name('index');
    });

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [Student\SettingsController::class, 'index'])->name('index');
        Route::post('/', [Student\SettingsController::class, 'update'])->name('update');
    });
});

// ── Teacher Routes ─────────────────────────────────────────────
Route::prefix('teacher')->name('teacher.')->middleware(['auth', 'role:teacher'])->group(function () {
    Route::get('/dashboard', [Teacher\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/student-analytics', [Teacher\StudentAnalyticsController::class, 'index'])->name('student-analytics.index');
    Route::get('/course-analytics', [Teacher\CourseAnalyticsController::class, 'index'])->name('course-analytics.index');
    Route::get('/settings', [Teacher\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [Teacher\SettingsController::class, 'update'])->name('settings.update');
});

// ── Psychologist Routes ────────────────────────────────────────
Route::prefix('psychologist')->name('psychologist.')->middleware(['auth', 'role:psychologist'])->group(function () {
    Route::get('/dashboard', [Psychologist\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/emotional-trends', [Psychologist\EmotionalTrendsController::class, 'index'])->name('emotional-trends.index');
    Route::get('/support-recommendations', [Psychologist\SupportRecommendationsController::class, 'index'])->name('support-recommendations.index');
    Route::get('/settings', [Psychologist\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [Psychologist\SettingsController::class, 'update'])->name('settings.update');
});

// ── Admin Routes ───────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [Admin\DashboardController::class, 'users'])->name('users');
    Route::patch('/users/{user}/toggle', [Admin\DashboardController::class, 'toggleUserStatus'])->name('users.toggle');
    Route::get('/course-management', [Admin\CourseManagementController::class, 'index'])->name('course-management.index');
    Route::get('/platform-analytics', [Admin\PlatformAnalyticsController::class, 'index'])->name('platform-analytics.index');
    Route::get('/system-health', [Admin\SystemHealthController::class, 'index'])->name('system-health.index');
    Route::get('/audit-logs', [Admin\AuditLogsController::class, 'index'])->name('audit-logs.index');
    Route::get('/settings', [Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [Admin\SettingsController::class, 'update'])->name('settings.update');
});
