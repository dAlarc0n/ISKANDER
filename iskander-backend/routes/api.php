<?php

use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Course\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/user/option', function (Request $request) {
    $user = $request->user();
    $admin = $user->hasRole('admin');
    $options = [];
    if($admin){
        $options [] = [
            'name'=>'Dashboard',
            'href'=>'/dashboard',
            'icon'=> 'Home'
        ];
        $options [] = [
            'name'=>'Usuarios',
            'href'=>'/dashboard/users',
            'icon'=> 'Users'
        ];
        $options [] = [
            'name'=>'Cursos',
            'href'=>'/dashboard/courses',
            'icon'=> 'BookOpen'
        ];
    }else{
        $options [] = [
            'name'=>'Cursos',
            'href'=>'/dashboard/courses',
            'icon'=> 'BookOpen'
        ];
    }
    return $options;
})->middleware('auth:sanctum');
Route::post('logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json([
        'title'=>'Cierre de sesión exitoso'
    ]);
})->middleware('auth:sanctum');
Route::post('login',[UserController::class,'login']);
Route::middleware('auth:sanctum')->group( function () {
    Route::post('user/create',[UserController::class,'register']);
    Route::get('users',[UserController::class,'users']);
    Route::get('categories',[CourseController::class,'categories']);
    Route::get('courses',[CourseController::class,'index']);
    Route::get('course/{id}',[CourseController::class,'show']);
    Route::get('course/user/{id}',[CourseController::class,'userCourse']);
    Route::post('course/enrollment/{id}',[CourseController::class,'enrollment']);
    Route::post('course/content/{id}',[CourseController::class,'content']);
    Route::post('course/create',[CourseController::class,'store']);
    Route::post('course/edit/{id}',[CourseController::class,'update']);
    Route::post('course/delete/{id}',[CourseController::class,'delete']);
});