<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\CourseParticipant;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;

class UserController extends Controller
{
    public function login(Request $request){
    $validate = Validator::make($request->all(),[
      'email'=>'sometimes|email',
      'name'=>'sometimes|string',
      'password'=>'required'
    ]);
    if($validate->fails()){
      return response()->json([
        'title'=>'Por favor introduce los datos correctamente',
        'message'=>$validate->errors()
      ],400);
    }
  
    $credentials = $request->has('email') 
        ? $request->only('email','password') 
        : $request->only('name','password');
  
    if(Auth::attempt($credentials)){
      $user = $request->user();
  
      // Solo una sesión activa
      $user->tokens()->delete();
  
      $token = $user->createToken('server-update', ['server:update'])->plainTextToken;
  
      return response()->json([
        'token' => $token,
        'token_type' => 'Bearer',
        'title' => 'Inicio de sesión exitoso',
      ],200);
    }
  
    return response()->json([
      'title'=>'Error de autenticación',
      'message'=>'Usuario o contraseña incorrectos'
    ],400);
  }
  public function register(Request $request){
    $validate = Validator::make($request->all(),[
      'name'=>'required',
      'email'=>'required|email',
      'password'=>'required',

    ]);
    if($validate->fails()){
      return response()->json([
        'title'=>'Por favor verifique los datos ingresados'
      ],400);
    }
    $user = User::where('email',$request->email)->first();
    if($user){
      return response()->json([
        'title'=>'Ya hay un usuario registrado con ese correo electrónico'
      ],400);
    }
    $user = User::create([
      'name'=>$request->name,
      'email'=>$request->email,
      'password'=>$request->password,
      'status_id'=>1
    ]);
    $user->assignRole('generic');
    return response()->json([
      'title'=>'Se ha registrado el usuario correctamente'
    ]);
  }
  public function users(){
    $users = User::where('status_id',1)->whereNotIn('id',[1])->get()->map(function($item){
      return [
        'id'=>$item->id,
        'name'=>$item->name,
        'email'=>$item->email,
        'enrolledCourses'=>count(CourseParticipant::where('user_id',$item->id)->where('status_id',1)->get()),
        'status'=>Status::find($item->status_id)->description,
        'joinDate'=>Carbon::parse($item->created_at)->format('d/m/Y'),
        'avatar'=>"/placeholder.svg?height=40&width=40",
      ];
    });
    return response()->json([
      'data'=>$users
    ]);
  }
}
