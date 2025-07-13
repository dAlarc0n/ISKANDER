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
        Schema::create('course_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->text('url');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('type_id');
            $table->string('prelation_id')->nullable();
            $table->unsignedBigInteger('status_id');
            $table->timestamps();
            $table->foreign('course_id')
                ->references('id')->on('courses')
                    ->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('status_id')
                ->references('id')->on('statuses')
                    ->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('type_id')
                ->references('id')->on('course_content_types')
                    ->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_contents');
    }
};
