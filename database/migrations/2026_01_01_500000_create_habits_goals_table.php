<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('frequency', ['daily', 'weekly', 'monthly'])->default('daily');
            $table->unsignedTinyInteger('target_count')->default(1);
            $table->unsignedSmallInteger('current_streak')->default(0);
            $table->unsignedSmallInteger('longest_streak')->default(0);
            $table->string('color', 10)->default('#6366f1');
            $table->string('icon', 10)->default('🎯');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('habit_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('completed_on');
            $table->timestamps();
            $table->unique(['habit_id', 'completed_on']);
            $table->index(['user_id', 'completed_on']);
        });

        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['academic', 'health', 'personal', 'career', 'social'])->default('personal');
            $table->enum('status', ['active', 'completed', 'paused', 'cancelled'])->default('active');
            $table->date('target_date')->nullable();
            $table->unsignedTinyInteger('progress')->default(0); // 0-100
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('goal_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goal_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_milestones');
        Schema::dropIfExists('goals');
        Schema::dropIfExists('habit_completions');
        Schema::dropIfExists('habits');
    }
};
