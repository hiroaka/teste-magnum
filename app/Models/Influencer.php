<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Influencer extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'instagram',
        'followers',
        'category_id'
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
