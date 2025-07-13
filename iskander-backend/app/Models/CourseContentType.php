<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseContentType extends Model
{
    /** @use HasFactory<\Database\Factories\CourseContentTypeFactory> */
    use HasFactory;
    protected $table = 'course_content_types';
    protected $fillable = [
        'description',
    ];
}
