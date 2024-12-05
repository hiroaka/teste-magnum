<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Tests\TestCase;

class AuthTest extends TestCase
{
    /**
     * Login de sucesso
     */
    public function test_success_login(): void
    {
        $this->json('post', 'api/login',[
            'email' => 'admin@admin.com',
            'password' => 'password'
        ])
        
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'token',
                'type',
                'message'
            ]);

        // $response->assertStatus(200);
    }

    /**
     * Teste de login com email inválido
     */
    public function test_error_login(): void
    {
        $this->json('post', 'api/login',[
            'email' => 'test@admin.com',
            'password' => '123444'
        ])
        
            ->assertStatus(401)
            ->assertJsonStructure([
                'type',
                'message'
            ]);

        // $response->assertStatus(200);
    }


    /**
     * Teste de sem o email
     */
    public function test_validation(): void
    {
        $this->json('post', 'api/login',[
            'password' => '123444'
        ])
        
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors',
                'message'
            ]);

        // $response->assertStatus(200);
    }


    public function test_register_success(): void
    {
        $this->json('post', 'api/register',[
            'email' => fake()->email,
            'password' => fake()->password,
            'name' => fake()->name
        ])
        
            ->assertStatus(401)
            ->assertJsonStructure([
                'type',
                'message'
            ]);

        // $response->assertStatus(200);
    }

}
