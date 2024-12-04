<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Influencer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InfluencerController extends Controller
{

    public function index()
    {

        return response()->json(['message' => 'Influencer Index', 'influencers' => Influencer::all()]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required',
            'instagram' => ['required', Rule::unique('influencers')],
            'followers' => 'required|numeric|min:0',
            'category_id' => 'required',
        ]);


        $influencer = new Influencer($data);
        $influencer->category()->associate($data['category_id']);
        $influencer->save();



//        dd($request->all());
        return response()->json([
            'message' => 'Influencer cadastrado com sucesso',
            'influencer' => $influencer->only('id','name')
        ]);
    }
}
