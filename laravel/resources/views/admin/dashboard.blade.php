<x-app-layout>
    <x-slot:title>แดชบอร์ด Admin</x-slot:title>

    <div x-data="{ lang: localStorage.getItem('lang') || 'th' }" class="space-y-6">

        <h1 class="text-2xl font-bold text-gray-900">⚙️ <span x-text="lang === 'th' ? 'แดชบอร์ดผู้ดูแลระบบ' : 'Admin Dashboard'"></span></h1>

        {{-- Platform Stats --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="card text-center">
                <div class="text-3xl font-bold text-indigo-600">{{ $totalUsers }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'ผู้ใช้ทั้งหมด' : 'Total Users'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-green-600">{{ $activeToday }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'แอคทีฟวันนี้' : 'Active Today'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-purple-600">{{ $totalFocusMinutes }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'นาทีโฟกัสรวม' : 'Total Focus Min'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-orange-600">{{ $aiInteractions }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'การใช้ AI รวม' : 'AI Interactions'"></div>
            </div>
        </div>

        {{-- User Breakdown --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '👥 ผู้ใช้ตามบทบาท' : '👥 Users by Role'"></h3>
                <div class="space-y-3">
                    @foreach($usersByRole as $role => $count)
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-700 capitalize">{{ str_replace('_', ' ', $role) }}</span>
                        <div class="flex items-center space-x-3">
                            <div class="w-32 bg-gray-200 rounded-full h-2">
                                <div class="h-2 bg-indigo-500 rounded-full"
                                     style="width: {{ $totalUsers > 0 ? ($count / $totalUsers * 100) : 0 }}%"></div>
                            </div>
                            <span class="text-sm font-medium text-gray-800 w-8 text-right">{{ $count }}</span>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="card">
                <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '🔐 Auth Providers' : '🔐 Auth Providers'"></h3>
                <div class="space-y-3">
                    @foreach($usersByProvider as $provider => $count)
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span>{{ $provider === 'microsoft' ? '🔷' : ($provider === 'google' ? '🔴' : '🔑') }}</span>
                            <span class="text-sm text-gray-700 capitalize">{{ $provider }}</span>
                        </div>
                        <span class="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{{ $count }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Recent Audit Logs --}}
        <div class="card">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800" x-text="lang === 'th' ? '📋 Audit Log ล่าสุด' : '📋 Recent Audit Logs'"></h3>
                <a href="{{ route('admin.users') }}" class="text-sm text-indigo-600 hover:text-indigo-800" x-text="lang === 'th' ? 'จัดการผู้ใช้ →' : 'Manage Users →'"></a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200 text-gray-500">
                            <th class="text-left py-2" x-text="lang === 'th' ? 'เวลา' : 'Time'"></th>
                            <th class="text-left py-2" x-text="lang === 'th' ? 'ผู้ใช้' : 'User'"></th>
                            <th class="text-left py-2">Action</th>
                            <th class="text-left py-2">Resource</th>
                            <th class="text-left py-2">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($auditLogs as $log)
                        <tr class="border-b border-gray-50">
                            <td class="py-2 text-gray-500">{{ $log->created_at->diffForHumans() }}</td>
                            <td class="py-2 text-gray-700">{{ $log->user?->name ?? 'System' }}</td>
                            <td class="py-2"><span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">{{ $log->action }}</span></td>
                            <td class="py-2 text-gray-600">{{ $log->resource }}#{{ $log->resource_id }}</td>
                            <td class="py-2 text-gray-400 font-mono">{{ $log->ip_address }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-4 text-gray-400">
                                <span x-text="lang === 'th' ? 'ยังไม่มีประวัติ' : 'No logs yet'"></span>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-app-layout>
