<?php

namespace App\Http\Requests;

use App\Rules\UniqueCpf;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => optional($this->user)->type == 'admin' ? ['required', 'unique:users,email,' . optional($this->user)->id,] : '',
//            'username' => ['required', 'unique:users,username,' . optional($this->user)->id,],
            'name' => optional($this->user)->type == 'admin' ?  ['required'] : '',
            'password' => optional($this->user)->type == 'admin' ? (empty($this->user->password)) ? ['required', Password::defaults()] : '' : '',
//            'address' => ['required'],
            'cpf' => optional($this->user)->type == 'user' ? [ 'required', new UniqueCpf($this->user) ] : '',
            'birthday' => optional($this->user)->type == 'user' ? [ 'required', new UniqueCpf($this->user) ] : ''
        ];
    }
}
