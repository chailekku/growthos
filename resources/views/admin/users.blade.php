<x-app-layout>
    <x-slot:title>จัดการผู้ใช้</x-slot:title>

    <div x-data="{ lang: localStorage.getItem('lang') || 'th' }" class="space-y-6">

        <h1 class="text-2xl font-bold text-gray-900" x-text="lang === 'th' ? '👥 จัดการผู้ใช้' : '👥 User Management'"></h1>

        <div class="card">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 text-gray-500 font-medium">Name</th>
                            <th class="text-left py-3 text-gray-500 font-medium">Email</th>
                            <th class="text-center py-3 text-gray-500 font-medium">Role</th>
                            <th class="text-center py-3 text-gray-500 font-medium">Provider</th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'เข้าสู่ระบบล่าสุด' : 'Last Login'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'สถานะ' : 'Status'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'จัดการ' : 'Actions'"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($users as $user)
                        <tr class="border-b border-gray-50 hover:bg-gray-50 {{ !$user->is_active ? 'opacity-50' : '' }}">
                            <td class="py-3">
                                <div class="flex items-center space-x-2">
                                    <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                        {{ strtoupper(substr($user->name, 0, 1)) }}
                                    </div>
                                    <span class="font-medium text-gray-800">{{ $user->name }}</span>
                                </div>
                            </td>
                            <td class="py-3 text-gray-500 font-mono text-xs">{{ $user->email }}</td>
                            <td class="py-3 text-center">
                                <span class="px-2 py-0.5 text-xs rounded-full {{ match($user->role) {
                                    'student'      => 'bg-blue-100 text-blue-700',
                                    'teacher'      => 'bg-green-100 text-green-700',
                                    'psychologist' => 'bg-purple-100 text-purple-700',
                                    default        => 'bg-gray-100 text-gray-700'
                                } }}">{{ $user->role }}</span>
                            </td>
                            <td class="py-3 text-center text-xs text-gray-500">{{ $user->auth_provider }}</td>
                            <td class="py-3 text-center text-xs text-gray-400">
                                {{ $user->last_login_at?->diffForHumans() ?? 'Never' }}
                            </td>
                            <td class="py-3 text-center">
                                <span class="{{ $user->is_active ? 'text-green-600' : 'text-red-500' }} text-xs font-medium">
                                    {{ $user->is_active ? '● Active' : '● Inactive' }}
                                </span>
                            </td>
                            <td class="py-3 text-center">
                                @if(auth()->id() !== $user->id)
                                <form method="POST" action="{{ route('admin.users.toggle', $user) }}">
                                    @csrf @method('PATCH')
                                    <button type="submit"
                                            class="text-xs px-3 py-1 rounded-lg border transition-colors {{ $user->is_active ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50' }}">
                                        {{ $user->is_active ? 'Disable' : 'Enable' }}
                                    </button>
                                </form>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" class="text-center py-8 text-gray-400" x-text="lang === 'th' ? 'ไม่มีผู้ใช้' : 'No users found'"></td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="mt-4">{{ $users->links() }}</div>
        </div>
    </div>
</x-app-layout>
