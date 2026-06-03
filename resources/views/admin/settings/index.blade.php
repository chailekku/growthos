<x-app-layout>
<x-slot:title>Settings</x-slot:title>

<div class="max-w-2xl mx-auto space-y-6">

    <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-sm text-gray-400 mt-0.5">Manage admin preferences and configuration</p>
    </div>

    <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-6">
        @csrf

        {{-- Profile Section --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide" style="color:#2D9375;">Profile</h2>

            {{-- Avatar + name + role --}}
            <div class="flex items-center gap-4 mb-6">
                <div class="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style="background-color:#2D9375;">
                    {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
                </div>
                <div>
                    <p class="text-base font-bold text-gray-900">{{ auth()->user()->name }}</p>
                    <p class="text-sm text-gray-400">{{ auth()->user()->email }}</p>
                    <span class="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold" style="background-color:#fee2e2; color:#991b1b;">Super Admin</span>
                </div>
            </div>

            <div class="space-y-4">
                {{-- Name — READ ONLY --}}
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                    <input type="text" value="{{ auth()->user()->name }}" disabled class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">Name cannot be changed — managed by KKU SSO</p>
                </div>

                {{-- Email — READ ONLY --}}
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                    <input type="text" value="{{ auth()->user()->email }}" disabled class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">Email cannot be changed — managed by KKU SSO</p>
                </div>
            </div>
        </div>

        {{-- Language & Theme --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide" style="color:#2D9375;">Language & Theme</h2>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">Language</label>
                    <div class="flex gap-2">
                        <button type="button" class="px-4 py-2 rounded-xl text-sm font-medium border" style="background-color:#2D9375; color:white; border:none;">🌐 English</button>
                        <button type="button" class="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">🌐 ไทย</button>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">Theme</label>
                    <div class="flex gap-2">
                        <button type="button" class="px-4 py-2 rounded-xl text-sm font-medium border" style="background-color:#2D9375; color:white; border:none;">☀️ Light</button>
                        <button type="button" class="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">🌙 Dark</button>
                    </div>
                </div>
            </div>
        </div>

        {{-- GrowthOS Footer --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6 text-center" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <p class="font-bold text-gray-900" style="color:#2D9375;">GrowthOS</p>
            <p class="text-xs text-gray-400 mt-1">Personal Growth Infrastructure Platform v1.0.0</p>
            <p class="text-xs text-gray-400 mt-2">A world-class AI-powered Personal Growth Infrastructure designed to help university students grow academically, emotionally, behaviorally, and as future leaders.</p>
        </div>

        {{-- Save Button --}}
        <div class="flex justify-end">
            <button type="submit" class="px-6 py-2 rounded-xl text-white font-medium" style="background-color:#2D9375;">💾 Save</button>
        </div>
    </form>
</div>
</x-app-layout>
