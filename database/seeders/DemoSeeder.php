<?php

namespace Database\Seeders;

use App\Models\FocusSession;
use App\Models\Habit;
use App\Models\MoodEntry;
use App\Models\ReflectionEntry;
use App\Models\Task;
use App\Models\User;
use App\Models\WellbeingLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::firstOrCreate(['email' => 'demo.student@kkumail.com'], [
            'name'              => 'นักศึกษาตัวอย่าง (Demo)',
            'role'              => 'student',
            'auth_provider'     => 'local',
            'password'          => Hash::make('demo_password'),
            'is_active'         => true,
            'email_verified_at' => now(),
            'privacy_settings'  => [
                'reflections_visible' => false,
                'analytics_shared'    => true,
                'wellbeing_shared'    => true,
                'focus_data_shared'   => true,
            ],
        ]);

        $teacher = User::firstOrCreate(['email' => 'demo.teacher@kku.ac.th'], [
            'name'              => 'อาจารย์ตัวอย่าง (Demo)',
            'role'              => 'teacher',
            'auth_provider'     => 'local',
            'password'          => Hash::make('demo_password'),
            'is_active'         => true,
            'email_verified_at' => now(),
            'privacy_settings'  => [],
        ]);

        $psych = User::firstOrCreate(['email' => 'demo.psych@kku.ac.th'], [
            'name'              => 'นักจิตวิทยาตัวอย่าง (Demo)',
            'role'              => 'psychologist',
            'auth_provider'     => 'local',
            'password'          => Hash::make('demo_password'),
            'is_active'         => true,
            'email_verified_at' => now(),
            'privacy_settings'  => [],
        ]);

        $admin = User::firstOrCreate(['email' => 'demo.admin@kku.ac.th'], [
            'name'              => 'แอดมินตัวอย่าง (Demo)',
            'role'              => 'super_admin',
            'auth_provider'     => 'local',
            'password'          => Hash::make('demo_password'),
            'is_active'         => true,
            'email_verified_at' => now(),
            'privacy_settings'  => [],
        ]);

        // Seed focus sessions
        foreach (range(1, 7) as $daysAgo) {
            FocusSession::firstOrCreate(
                ['user_id' => $student->id, 'started_at' => now()->subDays($daysAgo)->setTime(9, 0)],
                [
                    'type'            => 'pomodoro',
                    'status'          => 'completed',
                    'planned_minutes' => 25,
                    'actual_minutes'  => rand(20, 25),
                    'flow_score'      => rand(60, 95),
                    'quality_score'   => rand(65, 90),
                    'ended_at'        => now()->subDays($daysAgo)->setTime(9, 25),
                ]
            );
        }

        // Seed tasks
        $tasks = [
            ['title' => 'อ่านบทที่ 3 วิชา Data Science', 'priority' => 'high', 'category' => 'academic'],
            ['title' => 'ส่งรายงานกลุ่ม', 'priority' => 'urgent', 'category' => 'academic'],
            ['title' => 'ออกกำลังกาย 30 นาที', 'priority' => 'medium', 'category' => 'health'],
            ['title' => 'ทบทวนบท AI Ethics', 'priority' => 'high', 'category' => 'academic'],
            ['title' => 'โทรหาครอบครัว', 'priority' => 'low', 'category' => 'personal'],
        ];

        foreach ($tasks as $task) {
            Task::firstOrCreate(
                ['user_id' => $student->id, 'title' => $task['title']],
                array_merge($task, ['status' => 'todo', 'due_date' => now()->addDays(rand(1, 7))])
            );
        }

        // Seed mood entries
        foreach (range(0, 6) as $daysAgo) {
            MoodEntry::firstOrCreate(
                ['user_id' => $student->id, 'recorded_at' => now()->subDays($daysAgo)->startOfDay()],
                [
                    'mood'     => rand(3, 5),
                    'energy'   => rand(2, 5),
                    'emotions' => ['motivated', 'focused'],
                ]
            );
        }

        // Seed reflection entry
        ReflectionEntry::firstOrCreate(
            ['user_id' => $student->id, 'created_at' => today()],
            [
                'type'       => 'daily',
                'content'    => 'วันนี้ได้เรียนเรื่อง Machine Learning เพิ่มเติม รู้สึกว่าเริ่มเข้าใจมากขึ้นแล้ว ยังต้องฝึกฝนต่อไปอีกมาก',
                'mood'       => 4,
                'gratitude'  => ['สุขภาพที่แข็งแรง', 'อาจารย์ที่ใส่ใจ', 'เพื่อนที่ดี'],
                'ai_insight' => 'ยอดเยี่ยมมาก! การสังเกตความก้าวหน้าของตัวเองเป็นก้าวสำคัญสู่การเรียนรู้ที่ยั่งยืน',
                'is_private' => true,
            ]
        );

        // Wellbeing log for psych dashboard
        WellbeingLog::firstOrCreate(
            ['user_id' => $student->id, 'recorded_at' => today()],
            [
                'stress_level'     => 4,
                'motivation_level' => 7,
                'sleep_quality'    => 6,
                'social_connection'=> 7,
                'overall_wellbeing'=> 7,
                'burnout_risk'     => 'low',
            ]
        );

        // Seed habit
        Habit::firstOrCreate(
            ['user_id' => $student->id, 'title' => 'อ่านหนังสือ 30 นาที'],
            [
                'frequency'      => 'daily',
                'target_count'   => 1,
                'current_streak' => 5,
                'longest_streak' => 12,
                'color'          => '#6366f1',
                'icon'           => '📚',
                'is_active'      => true,
            ]
        );

        $this->command->info('✅ Demo data seeded successfully!');
    }
}
