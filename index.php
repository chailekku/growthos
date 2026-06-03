<?php

/**
 * KKU GrowthOS — Entry Bridge
 *
 * Loads Laravel from public/index.php without exposing /public/ in URLs.
 * Apache routes all requests here (via .htaccess), then Laravel takes over.
 * SCRIPT_NAME stays as /growthos/index.php so URL generation is correct.
 */

define('LARAVEL_START', microtime(true));

require __DIR__ . '/public/index.php';
