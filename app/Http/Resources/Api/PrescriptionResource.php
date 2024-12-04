<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class PrescriptionResource extends JsonResource
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
            'eye' => $this->eye,
            'sleep' => $this->sleep,
            'wake_up' => $this->wake_up,
            'program' => $this->prescription->name,
            'day_surgery' => $this->day_surgery,
//            'alerts' => $this->alerts()->select('alerts.id','alerts.name','medicine_categories.name as medicine_category',
//            'medicines.color','alerts.at','alerts.status','alerts.eye')
//                ->leftJoin('medicines','medicines.id','=','alerts.medicine_id')
//                ->leftJoin('medicine_categories','medicine_categories.id','=','medicines.medicine_category_id')
//                ->orderBy('alerts.at','ASC')
//                ->get()

        ];
    }
}
