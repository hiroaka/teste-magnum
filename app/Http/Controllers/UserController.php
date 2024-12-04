<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\Dashboard\MedicineCategoryResource;
use App\Http\Resources\Dashboard\PrescriptionResource;
use App\Http\Resources\Dashboard\ProgramResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\Dashboard\AlertResource;
use App\Http\Resources\UserPrescriptionResource;
use App\Http\Resources\UserResource;
use App\Models\MedicineCategory;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Models\Medicine;
use App\Models\Alert;
use App\Models\Program;
use App\Models\User;
use App\Models\UserPrescription;
use App\Models\UserPrescriptionItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use jeremykenedy\LaravelRoles\Models\Role;
use function Laravel\Prompts\error;

class UserController extends Controller
{


    public function search(Request $request)
    {
        // dd($request->input('query'));
        $search = $request->input('query');
        return response()->json(User::where(function ($query) use ($search) {
            $query->where('users.email', 'LIKE', '%' . $search . '%')
                ->orWhere('users.name', 'LIKE', '%' . $search . '%')
                ->orWhere('users.cpf', 'LIKE', '%' . $search . '%');
        })

            ->get());
    }
    public function index(Request $request, $id = null)
    {


        //        //tem o id?
        //        $user = null;
        //        if ($id) {
        //            $user = User::find($id);
        //        }
        $per_page = $request->input('per_page', 10);
        $search = $request->input('search');
        $roleId = $request->input('role_id');
        $users = UserResource::collection(User::with('userPrescription')->when($search, function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('users.email', 'LIKE', '%' . $search . '%')
                    ->orWhere('users.name', 'LIKE', '%' . $search . '%')
                    ->orWhere('users.cpf', 'LIKE', '%' . $search . '%');
            });
        })->when($roleId, function ($query) use ($roleId) {

            $query->join('role_user', 'role_user.user_id', '=', 'users.id')->where('role_id', $roleId);
        })
            ->orderBy('users.created_at', 'DESC')->paginate($per_page));
        $prescriptions = PrescriptionResource::collection(Prescription::with('prescriptionItems')->orderBy('name', 'ASC')->get());
        $roles = RoleResource::collection(Role::latest()->get());
        return inertia('Users/Index', [
            'users' => $users,
            //            'user' => $user,
            'prescriptions' => $prescriptions,
            'roles' => $roles,
            'per_page' => $per_page,
            'search' => $search
        ]);
    }



    public function store(UserRequest $request)
    {
        $attr = $request->toArray();
        //Usuario ou Admin
        if ($attr['type'] === 'user') {
            $attr['name'] = $attr['cpf'];
            $attr['email'] = $attr['cpf'];
            $attr['password'] = $attr['cpf'];
        }
        $attr['cpf']  = (int) filter_var($attr['cpf'], FILTER_SANITIZE_NUMBER_INT);
        $user = User::create($attr);


        if ($attr['type'] === 'user') {
            return to_route('users.prescription', ['id' => $user->id]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'User has been created',
        ]);
    }

    public function update(UserRequest $request, User $user)
    {
        $attr = $request->toArray();
        if (isset($attr['birth'])) {

            $date = Carbon::createFromFormat('d/m/Y', $attr['birth']);
            $attr['birth'] = $date;
        }
        $attr['cpf']  = preg_replace('/\D/', '', $attr['cpf']);

        $user->update($attr);

        $user->detachAllRoles();

        $user->attachRole($request->input('role_id'));

        //        $this->storePrescription($user, $attr);
        //dd('teste');

        return back()->with([
            'type' => 'success',
            'message' => 'Usuário atualizado',
        ]);
    }



    public function listPrescription($id, Request $request)
    {
        $prescriptions = UserPrescriptionResource::collection(
            UserPrescription::where('user_id', $id)->with('prescription')->orderBy('id', 'DESC')->paginate(50)
        );

        // dd($prescriptions);

        return inertia('Users/PrescriptionList', [

            'prescriptions' => $prescriptions,

        ]);
    }
    public function prescription($id, Request $request)
    {
        $prescriptions = PrescriptionResource::collection(Prescription::with('prescriptionItems')->groupBy('prescriptions.id')->orderBy('name', 'ASC')->get());
        $medicineCategories = MedicineCategoryResource::collection(MedicineCategory::latest()->get());

        $medicines = Medicine::select('id', 'name', 'medicine_category_id','color')->when(request()->input('medicine_category_id'), function ($query) {
            $query->where('medicine_category_id', request()->input('medicine_category_id'));
        })
            ->orderBy('name', 'ASC')
            ->get();

        $alerts = Alert::select('alerts.name', 'alerts.id', 'alerts.at', 'medicines.color','alerts.eye','alerts.status')
            ->join('medicines', 'medicines.id', '=', 'alerts.medicine_id')
            ->where('user_id', $id)->orderBy('at', 'ASC')->get();


        $user = User::where('id', $id)->with([
            'userPrescription' => function ($query) {
                $query->orderBy('id', 'DESC')
                    ->with('userPrescriptionItems');
            }
        ])->first();

        //        dd($user->toArray()['user_prescription']);
        return inertia('Users/Prescription', [
            'model' => $user,
            'prescriptions' => $prescriptions,
            'medicineCategories' => $medicineCategories,
            'medicines' => $medicines,
            'alerts' => $alerts
        ]);
    }


    public function storePrescription($id, Request $request)
    {

        $user = User::find($id);
        $attr = $request->toArray();


        if (!isset($attr['prescription_id'])) {
            throw new \Exception('Prescrição inválida');
        }
        //        dd($attr['day_surgery']);
        //salvar um plano de prescrição
        $attr['day_surgery'] = (isset($attr['day_surgery'])) ? Carbon::parse($attr['day_surgery'])->format('Y-m-d') : null;
        $attr['user_id'] = $user->id;

        $userPrescription = UserPrescription::firstOrCreate([
            'user_id' => $user->id,
            'prescription_id' => $attr['prescription_id'],
            'eye' => $attr['eye'],
        ]);

        $userPrescription->fill($attr)->save();

        $userPrescription->userPrescriptionItems()->delete();
        //        dd($attr);
        $medicines = collect($attr['medicines']);
        // dd($medicines);
        $userPrescription->createItemsFromParent($medicines->map(function($item) { return $item['id']; }), $request->input('wake_up'), $request->input('sleep'));

        // //        dd($medicines);
        // foreach ($attr['user_prescription_items'] as $key => $item) {
        //     //            if(is_null($item)){
        //     //                continue;
        //     //            }

        //     //            $ids = explode('_', $prescription_item_id);

        //     //            dd($attr['medicines']);
        //     $medicine_id = $medicines->where('medicine_category_id', PrescriptionItem::find($item['prescription_item_id'])->medicine_category_id)->first();
        //     if (!$medicine_id) {
        //         continue;
        //     }
        //     $newUserItemData = [
        //         'prescription_id' => $attr['prescription_id'],
        //         'prescription_item_id' => $item['prescription_item_id'],
        //         'user_prescription_id' => $userPrescription->id,
        //         'medicine_id' => $medicine_id['id'],
        //         'value' => $item['value'],
        //         'index' => $item['index']
        //     ];

        //     //            dd($newUserItemData);

        //     //            print_r($newUserItemData);
        //     //            foreach ($item as $value) {
        //     UserPrescriptionItem::firstOrCreate($newUserItemData);
        //     //            }
        // }
        //Mensagens que são disparadas por push ao usuário
        $userPrescription->createMessages();
        //Criar os alertas
        $userPrescription->createAlerts();

        return response()->json([
            'type' => 'success',
            'message' => 'Prescrição atualizada'
        ]);
    }


    public function deleteAlert($user_id = 0, $eye = '')
    {
        $alerts = Alert::where('eye', $eye)
            ->whereNull('user_prescription_id')
            ->where('user_id', $user_id)
            ->delete();

        return response()->json([
            'type' => 'success',
            'message' => 'Alertas deletados'
        ]);
    }

    public function deleteProgram($user_id = 0, $eye = '')
    {
        $prescription = UserPrescription::where('user_id', $user_id)
            ->where('eye', $eye)
            ->first();

        if (!$prescription) {
            return response()->json([
                'status' => 'not-found',
            ]);
        }
        $prescription->messages()->delete();
        $prescription->userPrescriptionItems()->delete();
        $prescription->alerts()->delete();
        $prescription->delete();

        return response()->json([
            'type' => 'success',
            'message' => 'Alertas deletados'
        ]);
    }



    public function destroy(User $user)
    {
        $user->delete();

        return back()->with([
            'type' => 'success',
            'message' => 'User has been deleted',
        ]);
    }

    public function show()
    {

        //        $user = UserResource::collection(User::find($id));
        return inertia('Users/Form', [
            //            'user' => $user,
        ]);
    }
}
