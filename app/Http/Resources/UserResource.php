<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'cpf' => $this->cpf,
            'email' => $this->email,
            'birth' => $this->birth,
            'type' => $this->type,
            'created_at' => $this->created_at,
            'role_id' => $this->roles()->first() ? $this->roles()->first()->id : null,
            'user_prescription' => $this->userPrescription()->with('userPrescriptionItems')->first() ,

        ];
    }
}
