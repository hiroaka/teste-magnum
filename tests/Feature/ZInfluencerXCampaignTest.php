<?php

namespace Tests\Feature;

use App\Models\Influencer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ZInfluencerXCampaignTest extends TestCase
{
    /**
     * Anexar o influenciador à campanha
     */
    public function test_create_campaign(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user,'api')
            ->json('post','/api/campaign/1/influencer',[
                'influencer_id' =>Influencer::first()->id,
            
            ])
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'campaign'
            ]);

        $response->assertStatus(200);
    }

    public function test__influencer_failed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user,'api')
            ->json('post','/api/campaign/1/influencer',[
                'influencer_id' => 0
            
            ])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors'
            ]);

    }

/**
     * Listar os influenciadores de uma campanha
     */
    public function test_list_campaign_influencer(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user,'api')
            ->json('get','/api/campaign/1/influencer')
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'campaign'
            ]);

        $response->assertStatus(200);
    }

}
