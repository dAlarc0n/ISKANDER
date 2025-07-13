<?php

namespace App\Http\Controllers\Course;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseContent;
use App\Models\CourseContentType;
use App\Models\CourseParticipant;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class CourseController extends Controller
{
    public function categories(){
        return response()->json([
            'data'=>[
                [
                    'name'=>'Ing. de Sistemas'
                ],
                [
                    'name'=>'Idiomas Modernos'
                ],
                [
                    'name'=>'Administración'
                ],
                [
                    'name'=>'Contaduría'
                ],
                [
                    'name'=>'Artes mención: Diseño Gráfico'
                ],
                [
                    'name'=>'Psicología'
                ],
            ]
        ]);
    }
    public function store(Request $request){
        $validate = Validator::make($request->all(),[
            'title'=>'required',
            'description'=>'required',
            'instructor'=>'required',
            'category'=>'required',
            'thumbnail'=>'required',

        ]);
        if($validate->fails()){
            return response()->json([
                'title'=>'Verifique los datos solicitados'
            ],400);
        }
        $teacher = User::where('name',$request->instructor)->first();
        $category = Category::where('description',$request->category)->first();
        $course= Course::create([
            'title'=>$request->title,
            'description'=>$request->description,
            'teacher_id'=>$teacher ? $teacher->id : null,
            'category_id'=>$category ? $category->id : null,
            'thumbnail'=>$request->thumbnail,
            'status_id'=>1
        ]); 
        return response()->json([
            'title'=>'Se ha creado el curso correctamente'
        ]);
    }
    public function index(){
        $user=Auth::user();
        if($user->id===1){
            $course = Course::whereNotIn('status_id',[2])->get();
        }else{
            $course = Course::whereNotIn('status_id',[2])->where('teacher_id',$user->id)->orWhereIn('id', CourseParticipant::where('user_id', $user->id)->pluck('course_id'))->get();

        }
        $courses = $course->map(function($item){
            return [
                'id'=>$item->id,
                'title'=>$item->title,
                'description'=>$item->description,
                'instructor'=>User::where('id',$item->teacher_id)->first()->name,
                'category'=>Category::where('id',$item->category_id)->first()->description,
                'enrolledStudents'=>Count(CourseParticipant::where('course_id',$item->id)->where('status_id',1)->get()),
                'createdDate'=>Carbon::parse($item->created_at)->format('d/m/Y'),
                'thumbnail'=>$item->thumbnail,
            ];
        });
        return response()->json([
            'data'=>$courses
        ]);
    }
    public function show($id)
    {
        $course = Course::find($id);
        $rol = Auth::user()->id === 1 ? true : ($course->teacher_id ==Auth::user()->id  ? true : false);

        return response()->json([
            'data'=>
            [
                'id'=>$course->id,
                'title'=>$course->title,
                'description'=>$course->description,
                'instructor'=> User::find($course->teacher_id)->name,
                'rol'=>$rol,
                'category'=> Category::find($course->category_id)->description,
                'enrolledStudents'=> count(CourseParticipant::where('status_id',1)->where('course_id',$course->id)->get()),
                'createdDate' => Carbon::parse($course->created_at)->format('d/m/Y'),
                'thumbnail'=> $course->thumbnail,
                'forums'=>[],
                'announcements'=>[],
                'grades'=>[],
                'students'=>CourseParticipant::where('status_id',1)->where('course_id',$course->id)->get()->map(function($item){
                    $user = User::find($item->user_id);
                    return [
                        'id'=>$item->id,
                        'name'=>$user->name,
                        'email'=>$user->email,
                        'enrolledDate'=>Carbon::parse($user->created_at)->format('d/m/Y'),
                        'lastAccess'=>Carbon::parse($user->created_at)->format('d/m/Y'),
                        'progress'=>0,
                        'avatar'=>"/placeholder.svg?height=40&width=40"
                    ];
                }),
                'sections'=>[
                    [
                        'id'=>1,
                        'title'=>'Contenidos del curso',
                        'description'=>'Foros | Contenidos | Anuncios',
                        'order'=>1,
                        'isVisible'=>true,
                        'contents'=> CourseContent::where('status_id',1)->where('course_id',$course->id)->get()->map(function($item)use($course){
                            return [
                                'id'=>$item->id,
                                'title'=>$item->title,
                                'description'=>$item->description,
                                'createdDate'=>Carbon::parse($item->created_at)->format('d/m/Y'),
                                'author'=>User::find($course->teacher_id)->name,
                                'type'=>CourseContentType::find($item->type_id)->description,
                                'fileUrl'=>$item->url,
                                'isVisible'=>true
                            ];
                        })
                    ]
                ]
            ]
        ]);
    }
    public function userCourse($course){
        $course = Course::find($course);
        $users = User::whereNotIn('id',[1,$course->teacher_id])
            ->whereNotIn('id',
            CourseParticipant::where('course_id',$course->id)->where('status_id',1)->get()->pluck('user_id')
            )->get()->map(function($item){
                return [
                    'id'=>$item->id,
                    'name'=>$item->name,
                    'email'=>$item->email,
                    'status'=> Status::find($item->status_id)->description,
                    'enrolledCourses'=> count(CourseParticipant::where('user_id',$item->id)->where('status_id',1)->get()),
                    'joinDate'=> Carbon::parse($item->created_at)->format('d/m/Y'),
                    'avatar'=> "/placeholder.svg?height=40&width=40",
                ];
            });
        return response()->json([
            'data'=>$users
        ]);        
    }
    public function enrollment(Request $request,$course){
        DB::beginTransaction();
        try{
            foreach($request->students as $item){
                $enrollment = CourseParticipant::where('user_id',$item['id'])->where('course_id', $course)->first();
                if(!$enrollment){
                    CourseParticipant::create([
                        'course_id'=>$course,
                        'user_id'=>$item['id'],
                        'status_id'=>1
                    ]);
                }else{
                    $enrollment->status_id=1;
                    $enrollment->save();
                }
            }
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'title'=>'Ha ocurrido un error inesperado',
                'Error'=>$e
            ],400);
        }
        DB::commit();
        return response()->json([
            'title'=>'Estudiantes inscritos exitosamente',
        ]);
    }
    public function content(Request $request,$course){
        $validate = Validator::make($request->all(),[
            'title' => 'required',
            'type'  => 'required',
            'fileUrl'  => 'sometimes',
            'file'  => 'nullable|file|max:20480', // max 20MB
        ]);
        if($validate->fails()){
            return response()->json([
                'title'=>'Verifique los datos suministrados o suba un archivo más pequeño'
            ],400);
        }
        $path='';
        if ($request->hasFile('file')) {
            $originalName = $request->file('file')->getClientOriginalName();

            $sanitizedName = str_replace(' ', '_', $originalName);

            $sanitizedName = preg_replace('/[^A-Za-z0-9.\-_]/', '', $sanitizedName);

            $filename = time() . '_' . $sanitizedName;
            $path = $request->file('file')->storeAs('contenidos', $filename, 'public');
        }else if ($request->fileUrl) {
            $path = $request->fileUrl;
        } 
        $type = CourseContentType::where('description', $request->type)->first();
        $content = CourseContent::create([
            'title'=>$request->title,
            'description'=>$request->description,
            'status_id'=>1,
            'type_id'=>$type ? $type->id : null,
            'course_id'=>$course,
            'url'=>$path
        ]);
        return response()->json([
            'title'=>'Se ha subido el contenido correctamente',
            'path'=>$path
        ]);
    }
    public function update(Request $request,$course){
        $validate = Validator::make($request->all(),[
            'title'=>'required',
            'description'=>'required',
            'instructor'=>'required',
            'category'=>'required',
            'thumbnail'=>'nullable',
        ]);
        if($validate->fails()){
            return response()->json([
                'title'=>'Verifique los datos solicitados'
            ],400);
        }
        $teacher = User::where('name',$request->instructor)->first();
        $category = Category::where('description',$request->category)->first();
        $course= Course::find($course);
        if(!$course){
            return response()->json([
                'title'=>'Curso no encontrado'
            ],404);
        }
        $course->title=$request->title;
        $course->description=$request->description;
        $course->teacher_id=$teacher ? $teacher->id : null;
        $course->category_id=$category ? $category->id : null;
        if($request->thumbnail){
            $course->thumbnail=$request->thumbnail;
        }
        $course->save();
        return response()->json([
            'title'=>'Se ha actualizado el curso correctamente'
        ]);
    }
    public function delete($course){
        $course = Course::find($course);
        if(!$course){
            return response()->json([
                'title'=>'Curso no encontrado'
            ],404);
        }
        $course->status_id=2;
        $course->save();
        return response()->json([
            'title'=>'Curso eliminado correctamente'
        ]);
    }
    public function banner($course){
        $course = Course::find($course);
        if(!$course){
            return response()->json([
                'title'=>'Curso no encontrado'
            ],404);
        }
        $validate = Validator::make(request()->all(),[
            'file' => 'required',
        ]);
        if($validate->fails()){
            return response()->json([
                'title'=>'Verifique los datos suministrados o suba un archivo más pequeño'
            ],400);
        }
        $path = '';
        if (request()->hasFile('file')) {
            $originalName = request()->file('file')->getClientOriginalName();

            $sanitizedName = str_replace(' ', '_', $originalName);
            $sanitizedName = preg_replace('/[^A-Za-z0-9.\-_]/', '', $sanitizedName);
            $filename = time() . '_' . $sanitizedName;
            $path = request()->file('file')->storeAs('banners', $filename, 'public');
        } else {
            return response()->json([
                'title'=>'Debe subir un archivo de imagen'
            ],400);
        }
        $course->thumbnail=$path;
        $course->save();
        return response()->json([
            'title'=>'Banner actualizado correctamente',
            'path'=>$path
        ]);
    }
}
