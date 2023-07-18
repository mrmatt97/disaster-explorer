<?php

use Illuminate\Support\Facades\Route;

Route::get('/users', 'App\Http\Controllers\UserController@index');
Route::post('/users', 'App\Http\Controllers\UserController@store');
Route::post('/users/login', 'App\Http\Controllers\UserController@login');
Route::get('/users/{id}', 'App\Http\Controllers\UserController@show');
Route::put('/users/{id}', 'App\Http\Controllers\UserController@update');
Route::delete('/users/{id}', 'App\Http\Controllers\UserController@destroy');

Route::get('/favorites', 'App\Http\Controllers\FavoriteController@index');
Route::post('/favorites', 'App\Http\Controllers\FavoriteController@store');
Route::get('/favorites/{id}', 'App\Http\Controllers\FavoriteController@show');
Route::put('/favorites/{id}', 'App\Http\Controllers\FavoriteController@update');
Route::get('/favorites/user/{user_id}', 'App\Http\Controllers\FavoriteController@getFavoritesByUserId');
Route::delete('/favorites/user/{user_id}', 'App\Http\Controllers\FavoriteController@deleteFavoritesByUserId');

Route::get('/disasters', 'App\Http\Controllers\DisasterController@index');
