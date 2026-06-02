<?php

return [
    'default_model'        => env('OPENAI_MODEL', 'gpt-4o-mini'),
    'max_tokens'           => (int) env('OPENAI_MAX_TOKENS', 800),
    'temperature'          => (float) env('OPENAI_TEMPERATURE', 0.7),
    'kku_student_domain'   => env('KKU_STUDENT_DOMAIN', 'kkumail.com'),
    'kku_staff_domain'     => env('KKU_STAFF_DOMAIN', 'kku.ac.th'),
    'demo_mode'            => (bool) env('DEMO_MODE', false),
];
