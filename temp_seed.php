use Spatie\Permission\Models\Role;
foreach (['student','teacher','psychologist','super_admin'] as $r) {
    Role::firstOrCreate(['name' => $r, 'guard_name' => 'web']);
    echo "Role ready: $r\n";
}
