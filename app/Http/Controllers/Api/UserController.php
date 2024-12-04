<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;


use App\Http\Resources\Api\AlertResource;

use App\Models\Alert;

use App\Models\PushToken;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request){
    $credentials = $request->validate([
        'email' => ['required'],
        'password' => ['required'],
    ]);

    $token = auth('api')->attempt($credentials);

    if($token){
        


        return response()->json([
            'type' => 'success',
            'message' => 'Login efetuado com sucesso',
            'token' => $token
        ]);
    }

    throw ValidationException::withMessages([
        'email' => 'Não encontramos um usuário com essas credenciais',
    ]);
}
}
