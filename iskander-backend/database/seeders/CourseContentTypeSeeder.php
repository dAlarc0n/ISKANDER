<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CourseContentType;
class CourseContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $types = [
            ['description' => 'file'],
            ['description' => 'forum'],
            ['description' => 'announcement'],
            ['description' => 'assignment'],
            ['description' => 'quiz'],
            ['description' => 'video'],
            
      ];
        foreach ($types as $type) {
            CourseContentType::create($type);
        }
    }
}
