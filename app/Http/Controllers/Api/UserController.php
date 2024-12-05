<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;


use App\Http\Resources\Api\AlertResource;

use App\Models\Alert;

use App\Models\PushToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'email' => ['required', Rule::unique('users', 'email')],
            'password' => ['required'],
        ]);

       $user = User::create($data);

        if ($user) {

            return response()->json([
                'type' => 'success',
                'message' => 'Registro efetuado com sucesso',
                'user' => $user
            ]);
        }

        return response()->json([
            'type' => 'error',
            'message' => 'Houve um erro ao tentar registrar o usuário'
        ], 500);
        
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        $token = auth('api')->attempt($credentials);

        if ($token) {

            return response()->json([
                'type' => 'success',
                'message' => 'Login efetuado com sucesso',
                'token' => $token
            ]);
        }

        return response()->json([
            'type' => 'error',
            'message' => 'Não encontramos um usuário com essas credenciais'
        ], 401);
        
        // throw ValidationException::withMessages([
        //     'email' => '',
        // ]);
    }
}
