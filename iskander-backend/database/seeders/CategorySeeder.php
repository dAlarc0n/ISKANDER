<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
                [
                    'name'=>'Ing. de Sistemas'
                ],
                [
                    'name'=>'Idiomas Modernos'
                ],
                [
                    'name'=>'Administración'
                ],
                [
                    'name'=>'Contaduría'
                ],
                [
                    'name'=>'Artes mención: Diseño Gráfico'
                ],
                [
                    'name'=>'Psicología'
                ],
            ];
        foreach($categories as $category){
            Category::create([
                'description'=>$category['name']
            ]);
        }
    }
}
