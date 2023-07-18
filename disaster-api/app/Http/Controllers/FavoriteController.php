<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the favorites.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $favorites = Favorite::all();
        return response()->json($favorites);
    }

    /**
     * Store a newly created favorite in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'country_name' => 'required',
            'user_id' => 'required'
        ]);

        $favorite = Favorite::create([
            'country_name' => $request->input('country_name'),
            'user_id' => $request->input('user_id')
        ]);

        return response()->json($favorite, 201);
    }

    /**
     * Display the specified favorite.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $favorite = Favorite::findOrFail($id);
        return response()->json($favorite);
    }

    /**
     * Update the specified favorite in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'country_name' => 'required',
            'user_id' => 'required'
        ]);

        $favorite = Favorite::findOrFail($id);
        $favorite->country_name = $request->input('country_name');
        $favorite->user_id = $request->input('user_id');
        $favorite->save();

        return response()->json($favorite);
    }

    public function getFavoritesByUserId($user_id){
        $favorites = Favorite::where('user_id', $user_id)->get();
        return response()->json($favorites);
    }

    /**
     * Remove the specified favorite from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $favorite = Favorite::findOrFail($id);
        $favorite->delete();

        return response()->json(['message' => 'Favorite deleted successfully']);
    }

    public function deleteFavoritesByUserId($user_id)
    {

        Favorite::where('user_id', $user_id)->delete();

        return response()->json([
            'message' => 'Favorites deleted successfully.'
        ]);
    }

}
?>