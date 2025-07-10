<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\CourseParticipantFactory> */
    use HasFactory;
    protected $table = 'course_participants';
    protected $fillable=[
        'user_id',
        'course_id',
        'status_id'
    ];
}
