<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\InvokableRule;

class UniqueCpf implements InvokableRule, DataAwareRule
{
    protected $data = [];

    protected $ignoreID;
    public function __construct($ignoreID = null)
    {
        $this->ignoreID = $ignoreID;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     * @return void
     */
    public function __invoke($attribute, $value, $fail)
    {
//        dd($attribute);
        //
        if(User::where('cpf', preg_replace('/[^0-9]/', '', $value))
                ->when($this->ignoreID, function($query){
                    $query->where('id','<>', $this->ignoreID);
                })
                ->count() > 0){
            $fail('O :attribute já cadastrado no banco de dados');
        }


        if(!$this->validaCPF($value)){
            $fail('O :attribute é inválido');
        }

//        //procurar
//        if (strtoupper($value) !== $value) {
//            $fail('The :attribute must be uppercase.');
//        }
    }


    public function validaCPF($cpf) {

        // Extrai somente os números
        $cpf = preg_replace( '/[^0-9]/is', '', $cpf );

        // Verifica se foi informado todos os digitos corretamente
        if (strlen($cpf) != 11) {
            return false;
        }

        // Verifica se foi informada uma sequência de digitos repetidos. Ex: 111.111.111-11
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }

        // Faz o calculo para validar o CPF
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }
        return true;

    }

    public function setData($data)
    {
        // TODO: Implement setData() method.
        $this->data = $data;
    }
}
