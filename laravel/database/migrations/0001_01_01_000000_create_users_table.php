<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(); // nullable for SSO users
            $table->rememberToken();
            // KKU SSO fields
            $table->enum('role', ['student', 'teacher', 'psychologist', 'super_admin', 'system_admin'])->default('student');
            $table->enum('auth_provider', ['kku_sso', 'google', 'local'])->default('local');
            $table->string('provider_id')->nullable()->index();
            $table->string('avatar_url')->nullable();
            $table->string('student_id', 20)->nullable()->unique();
            $table->string('employee_id', 20)->nullable();
            $table->string('department')->nullable();
            $table->string('faculty')->nullable();
            $table->string('phone', 20)->nullable();
            $table->enum('language', ['th', 'en'])->default('th');
            $table->boolean('is_active')->default(true);
            $table->json('privacy_settings')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
