<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SyncUserRoles extends Command
{
    protected $signature   = 'roles:sync';
    protected $description = 'Sync all user role columns to Spatie permission roles';

    public function handle(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            if ($user->role) {
                $user->syncRoles([$user->role]);
                $this->line("✓ {$user->email} → {$user->role}");
            }
        }

        $this->info("Done — {$users->count()} users synced.");
    }
}
