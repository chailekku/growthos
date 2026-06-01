<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Student;
use App\Http\Controllers\Teacher;
use App\Http\Controllers\Psychologist;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────────────
Route::get('/', fn() => view('welcome'));

// ── Authentication ────────────────────────────────────────────
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::post('/demo-login', [LoginController::class, 'demoLogin'])->name('demo.login');

// KKU SSO – Microsoft Azure AD (@kkumail.com / @kku.ac.th)
Route::get('/auth/microsoft', [SocialAuthController::class, 'redirectToMicrosoft'])->name('auth.microsoft');
Route::get('/auth/microsoft/callback', [SocialAuthController::class, 'handleMicrosoftCallback']);

// Google OAuth – external teachers (@gmail.com etc.)
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
});

// ── Teacher Routes ─────────────────────────────────────────────
Route::prefix('teacher')->name('teacher.')->middleware(['auth', 'role:teacher'])->group(function () {
    Route::get('/dashboard', [Teacher\DashboardController::class, 'index'])->name('dashboard');
});

// ── Psychologist Routes ────────────────────────────────────────
Route::prefix('psychologist')->name('psychologist.')->middleware(['auth', 'role:psychologist'])->group(function () {
    Route::get('/dashboard', [Psychologist\DashboardController::class, 'index'])->name('dashboard');
});

// ── Admin Routes ───────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:super_admin,system_admin'])->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [Admin\DashboardController::class, 'users'])->name('users');
    Route::patch('/users/{user}/toggle', [Admin\DashboardController::class, 'toggleUserStatus'])->name('users.toggle');
});
