<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class AlertResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
//        dd($this, $request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'at' => $this->at,
            'eye' => $this->eye,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'color' => $this->color,
            'medicine_category' => $this->medicine_category,

        ];
    }
}
