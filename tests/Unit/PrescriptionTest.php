<?php

namespace Tests\Unit;

use App\Models\UserPrescription;
use jeremykenedy\LaravelRoles\Test\User;
use Tests\TestCase;


class PrescriptionTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_create_user_prescription(): void
    {

        $medicines = [1,3,6];
        $wakeUp = '08:00';
        $sleep = '22:00';

        $userPrescription = UserPrescription::get()->first();
        $this->assertTrue(isset($userPrescription->id));
        $userPrescription->createItemsFromParent($medicines, $wakeUp, $sleep);


        $this->assertTrue($userPrescription->userPrescriptionItems->count() >0);

    }
}
