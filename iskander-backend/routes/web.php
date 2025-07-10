<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/contenidos/{filename}', function ($filename) {
    $path = storage_path('app/public/contenidos/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->download($path);
});