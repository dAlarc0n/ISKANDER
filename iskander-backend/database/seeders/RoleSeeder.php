<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role_admin = Role::create(['name' => 'admin']); 
        $role_generic = Role::create(['name' => 'generic']); 

        $permission_create_course = Permission::create(['name' => 'create course']);
        $permission_read_course = Permission::create(['name' => 'read course']);
        $permission_update_course = Permission::create(['name' => 'update course']);
        $permission_delete_course = Permission::create(['name' => 'delete course']);

        $permission_read_courses = Permission::create(['name'=> 'read courses']);

        $permission_create_user = Permission::create(['name' => 'create user']);
        $permission_read_user = Permission::create(['name' => 'read user']);
        $permission_update_user = Permission::create(['name' => 'update user']);
        $permission_delete_user = Permission::create(['name' => 'delete user']);
        
        $permission_read_users = Permission::create(['name' => 'read users']);

        $permission_create_content=Permission::create(['name' => 'create content']);
        $permission_read_content=Permission::create(['name' => 'read content']);
        $permission_update_content=Permission::create(['name' => 'update content']);
        $permission_delete_content=Permission::create(['name' => 'delete content']);

        $permission_admin = [
            $permission_create_course,
            $permission_read_course,
            $permission_update_course,
            $permission_delete_course,

            $permission_read_courses,

            $permission_read_users,

            $permission_create_user,
            $permission_read_user,
            $permission_update_user,
            $permission_delete_user,

            $permission_create_content,
            $permission_read_content,
            $permission_update_content,
            $permission_delete_content
        ];

        $permission_generic_user = [
            $permission_read_course,
            $permission_update_course,
            $permission_create_content,
            $permission_read_content,
            $permission_update_content,
        ];
        $role_admin->syncPermissions($permission_admin);
        $role_generic->syncPermissions($permission_generic_user);
    }
}
