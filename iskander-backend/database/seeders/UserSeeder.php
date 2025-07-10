<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $admin= User::create([
            'name' => 'fmoreno.1690',
            'email' => 'fmoreno.1690@iskander.edu.ve',
            'password'=> Hash::make('admin123'),
            'status_id'=>1
        ]);
        $admin->assignRole('admin');
    }
}
