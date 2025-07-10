<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('status_id');
            $table->timestamps();
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('course_id')
                ->references('id')->on('courses')
                ->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('status_id')
                ->references('id')->on('statuses')
                ->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_participants');
    }
};
