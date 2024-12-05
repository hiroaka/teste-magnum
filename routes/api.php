<?php

use App\Http\Controllers\Api\InfluencerController;
use App\Http\Controllers\Api\CampaignController;

use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('api.json', function (Request $request) {
    return ['status' => 'ok'];
});
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

Route::middleware('auth:api')->prefix('influencer')->group(function(){
    Route::get('/', [InfluencerController::class, 'index'])->name('influencer.index');
    Route::post('/create', [InfluencerController::class, 'store'])->name('influencer.create');
    
});

Route::middleware('auth:api')->prefix('campaign')->group(function(){
    Route::get('/', [CampaignController::class, 'index'])->name('campaign.index');
    Route::post('/create', [CampaignController::class, 'store'])->name('campaign.create');
    Route::post('/{campaign}/influencer', [CampaignController::class, 'attachInfluencer'])->name('campaign.attach.influencer');
    Route::get('/{campaign}/influencer', [CampaignController::class, 'listInfluencer'])->name('campaign.list.influencer');
    
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->get('/clean-token', function (Request $request) {
    
    $user = $request->user();
    $user->tokens()->delete();
    return response()->json([
        'type' => 'success',
        'message' => 'Token deletado com sucesso'
    ]);
});

Route::middleware('auth:sanctum')->post('/user/refresh-token', function (Request $request) {
    //receber um token e fazer um novo
    // dd($request->user()->currentAccessToken(), );
    if($request->user()){
        session()->regenerate();

        $token = $request->user()->createToken('app');

        return response()->json([
            'cpf' => $request->user()->cpf,
            'birth' => $request->user()->birth,
            'type' => 'success',
            'message' => 'Token refreshed',
            'token' => $token->plainTextToken
        ]);
    }
    // return $request->user();
});

Route::middleware('auth:sanctum')->post('/user/register-token', [\App\Http\Controllers\Api\UserController::class, 'registerToken']);

Route::post('register-token', [\App\Http\Controllers\Api\UserController::class, 'registerToken']);

