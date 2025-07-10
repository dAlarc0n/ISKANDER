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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('thumbnail');
            $table->unsignedBigInteger('status_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('teacher_id');
            $table->timestamps();
            $table->foreign('status_id')
                ->references('id')->on('statuses')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('teacher_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
