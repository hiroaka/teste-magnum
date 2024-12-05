<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/users/search',  [UserController::class, 'search'])->name('users.search');
    Route::get('/users/prescription/{id?}',  [UserController::class, 'prescription'])->name('users.prescription');
    Route::get('/users/prescription/{user_id}/{eye?}/delete-alerts',  [UserController::class, 'deleteAlert'])->name('users.prescription.delete.alert');
    Route::get('/users/list-prescription/{id?}',  [UserController::class, 'listPrescription'])->name('users.prescription.list');
    Route::get('/users/prescription/{user_id}/{eye?}/delete-program',  [UserController::class, 'deleteProgram'])->name('users.prescription.delete.program');

    Route::post('/users/prescription/{id?}',  [UserController::class, 'storePrescription'])->name('users.prescription.store');
//    Route::get('/users/prescription/{id?}',  [UserController::class, 'prescription'])->name('users.prescription');

    Route::get('/users/{id?}/edit',  [UserController::class, 'index'])->name('admin.users.edit');
    Route::apiResource('users', UserController::class);
  
});

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
});

