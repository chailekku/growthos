<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('focus_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('task_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['pomodoro', 'deep_work', 'short_focus', 'study'])->default('pomodoro');
            $table->enum('status', ['active', 'paused', 'completed', 'cancelled'])->default('active');
            $table->unsignedSmallInteger('planned_minutes')->default(25);
            $table->unsignedSmallInteger('actual_minutes')->default(0);
            $table->unsignedSmallInteger('break_minutes')->default(0);
            $table->unsignedTinyInteger('distraction_count')->default(0);
            $table->unsignedTinyInteger('flow_score')->default(0);   // 0-100
            $table->unsignedTinyInteger('quality_score')->default(0); // 0-100
            $table->text('notes')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'started_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('focus_sessions');
    }
};
