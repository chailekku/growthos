<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Register Google Socialite provider (for external teachers)
        $this->app['events']->listen(
            SocialiteWasCalled::class,
            \SocialiteProviders\Google\GoogleExtendSocialite::class.'@handle'
        );
    }
}
