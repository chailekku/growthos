<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wellbeing_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('stress_level');       // 1-10
            $table->unsignedTinyInteger('motivation_level');   // 1-10
            $table->unsignedTinyInteger('sleep_quality');      // 1-10
            $table->unsignedTinyInteger('social_connection');  // 1-10
            $table->unsignedTinyInteger('overall_wellbeing');  // 1-10
            $table->enum('burnout_risk', ['low', 'moderate', 'elevated', 'high'])->default('low');
            $table->text('notes')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();
            $table->index(['user_id', 'recorded_at']);
        });

        Schema::create('ai_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('coach_type', ['productivity', 'reflection', 'focus', 'self_leadership', 'wellbeing']);
            $table->text('prompt');
            $table->longText('response');
            $table->json('context')->nullable();
            $table->unsignedTinyInteger('rating')->nullable(); // 1-5
            $table->string('model_used', 50)->nullable();
            $table->unsignedSmallInteger('tokens_used')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sent_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['reminder', 'encouragement', 'achievement', 'alert', 'system']);
            $table->string('title');
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->string('action_url')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'is_read', 'created_at']);
        });

        Schema::create('productivity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('log_date');
            $table->unsignedSmallInteger('tasks_completed')->default(0);
            $table->unsignedSmallInteger('tasks_created')->default(0);
            $table->unsignedSmallInteger('focus_minutes')->default(0);
            $table->unsignedTinyInteger('productivity_score')->default(0); // 0-100
            $table->timestamps();
            $table->unique(['user_id', 'log_date']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 100);
            $table->string('resource', 100);
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'resource']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('productivity_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('ai_feedback');
        Schema::dropIfExists('wellbeing_logs');
    }
};
