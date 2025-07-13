<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseContent extends Model
{
    /** @use HasFactory<\Database\Factories\CourseContentFactory> */
    use HasFactory;
    protected $table = 'course_contents';
    protected $fillable = [
        'title',
        'description',
        'status_id',
        'type_id',
        'course_id',
        'url'
    ];
}
