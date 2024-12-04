<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class InfluencerTest extends TestCase
{
    /**
     * Criar influencer
     */
    public function test_create_influecer(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user,'api')
            ->json('post','/api/influencer/create',[
                'name' => fake()->name(),
                'instagram' => fake()->userName(),
                'followers' => fake()->numberBetween(1000, 1000000),
                'category_id' =>Category::first()->id
                
            ])
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'influencer'
            ]);

        $response->assertStatus(200);
    }

    public function test_list_influencer(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user,'api')
            ->json('get','/api/influencer')
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'influencers'
            ]);

        $response->assertStatus(200);
    }



}
