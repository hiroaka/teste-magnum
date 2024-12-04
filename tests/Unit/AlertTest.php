<?php

namespace Tests\Unit;

use App\Models\Program;
use App\Models\User;
use App\Models\Alert;
use PHPUnit\Framework\TestCase;

class AlertTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {

        //dado um conjunto de parametros, criar os alertas
        $service = 'catarata';
        $wake_up = '08:00';
        $sleep = '22:00';
        $daySurgery = '2024-04-05';
        $eye = 'left';


        $user = User::first();


        //atribuir a um
        $config  = [
            'service' => $service,
            'wake_up' => $wake_up,
            'sleep' => $sleep,
            'daySurgery' => $daySurgery,
            'eye' => $eye,
        ];

        $alertProgram = Program::addProgramToUser($user, $config);








        $this->assertTrue(true);
    }

    public function testAlertFrequencies(): void
    {
        $start = '2024-04-05';
        $end = '2024-05-05';
        $hour = '08:00:00';
        $sleep = '22:00:00';
        $times = 3;

        $frequencies = Alert::calculate($start, $end, $hour,$sleep, $times);

        dd($frequencies);
        $this->assertTrue(count($frequencies));
    }
}
