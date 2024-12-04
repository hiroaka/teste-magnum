<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campaign_influencer', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Campaign::class)
                ->constrained()
                ->onDelete('cascade');

            $table->foreignIdFor(\App\Models\Influencer::class)
                ->constrained()
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_influencer');
    }
};
