<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditService
{
    public static function log(
        string $action,
        string $resource,
        ?int $resourceId = null,
        array $oldValues = [],
        array $newValues = [],
        array $details = []
    ): void {
        try {
            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => $action,
                'resource'    => $resource,
                'resource_id' => $resourceId,
                'old_values'  => empty($oldValues) ? null : $oldValues,
                'new_values'  => array_merge($newValues, $details),
                'ip_address'  => Request::ip(),
                'user_agent'  => Request::userAgent(),
            ]);
        } catch (\Exception) {
            // Never crash the app due to audit failure
        }
    }
}
