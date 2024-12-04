<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{

    public function index()
    {

        return response()->json(['message' => 'Campaign Index', 'campaigns' => Campaign::all()]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required',
            'budget' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);


        $campaign = new Campaign($data);
        $campaign->save();





//        dd($request->all());
        return response()->json([
            'message' => 'Campanha cadastrada com sucesso',
            'campaign' => $campaign->only('id','name')
        ]);
    }

    public function listInfluencer(Request $request, Campaign $campaign)

    {
        $campaign  = $campaign->with('influencers')->get();
        return response()->json(['message' => 'Influencers da campanha', 'campaign' => $campaign]);
    }

    public function attachInfluencer(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'influencer_id' => 'required|exists:influencers,id',
        ]);

        $data['campaign_id'] = $campaign->id;


        $campaign->influencers()->sync($data['influencer_id']);

        return response()->json([
            'message' => 'Influencer cadastrado na camapanha',
            'campaign' => $campaign->only('id','name')
        ]);
    }
}
