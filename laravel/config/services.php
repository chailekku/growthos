<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    // KKU Single Sign On (OIDC — ssonext.kku.ac.th)
    'oidc' => [
        'issuer'          => env('OIDC_ISSUER', 'https://ssonext.kku.ac.th'),
        'client_id'       => env('OIDC_CLIENT_ID'),
        'client_secret'   => env('OIDC_CLIENT_SECRET'),
        'redirect'        => env('OIDC_REDIRECT_URI'),
        'redirect_logout' => env('OIDC_REDIRECT_LOGOUT_URI'),
    ],
    // Google OAuth — external teachers without @kku.ac.th
    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('APP_URL').'/auth/google/callback',
    ],

];
