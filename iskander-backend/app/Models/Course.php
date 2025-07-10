<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;
    protected $table = 'courses';
    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'category_id',
        'thumbnail',
        'status_id'
    ];
}
