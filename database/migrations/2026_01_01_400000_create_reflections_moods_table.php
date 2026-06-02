<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mood_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('mood');    // 1-5
            $table->unsignedTinyInteger('energy');  // 1-5
            $table->json('emotions')->nullable();   // array of emotion strings
            $table->text('notes')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();
            $table->index(['user_id', 'recorded_at']);
        });

        Schema::create('reflection_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['daily', 'weekly', 'monthly', 'goal'])->default('daily');
            $table->text('prompt')->nullable();
            $table->longText('content');
            $table->json('gratitude')->nullable(); // array of strings
            $table->text('challenges')->nullable();
            $table->text('goals_next')->nullable();
            $table->text('ai_insight')->nullable();
            $table->unsignedTinyInteger('mood')->nullable(); // 1-5
            $table->boolean('is_private')->default(true);
            $table->boolean('shared_with_advisor')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reflection_entries');
        Schema::dropIfExists('mood_entries');
    }
};
