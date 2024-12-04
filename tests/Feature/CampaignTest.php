<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CampaignTest extends TestCase
{
    /**
     * Testar a listagem de campaigns
     */
    public function test_list_campaign(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user,'api')
            ->json('get','/api/campaign')
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'campaigns'
            ]);

        $response->assertStatus(200);
    }


    /**
     *Criação de camapnha
     */
    public function test_create_campaign(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user,'api')
            ->json('post','/api/campaign/create',[
                'name' => 'Campanha de teste',
                'description' => 'Descrição da campanha',
                'budget' => 4500.11,
                'start_date' => '2021-10-10',
                'end_date' => '2021-10-20',
            ])
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'campaign'
            ]);

        $response->assertStatus(200);
    }


    
}
