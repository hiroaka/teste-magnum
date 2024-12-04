<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'budget',
        'description',
        'start_date',
        'end_date',
    ];

    protected $dates = ['created_at','updated_at','start_date','end_date'];

    public function influencers(){
        return $this->belongsToMany(Influencer::class);
    }
}
