import {useForm} from '@inertiajs/react'
import React, {useEffect, useState} from 'react'
import MaskedInput from 'react-text-mask'
import PrescriptionItemDetail from "@/Components/Dashboard/Prescription/PrescriptionItemDetail";
import moment from "moment";
import FormUser from "@/Components/Dashboard/Users/FormUser";


export default function EditUser({close, model, prescriptions, roles}) {

    console.log('model', model)

    const {data, setData, put, reset, errors} = useForm({
        name: '',
        email: '',
        cpf: '',
        birth: '',
        type:'user',
        password: '',

    })
    const [prescription, setPrescription] = useState('')


    const onChangeItem = (e) => {
        console.log('onChangeItem', e.target.id, e.target.value, e.target.name);

        console.log('old user pres', data.user_prescription_items)
        let user_prescription_items = {...data.user_prescription_items, [e.target.id + '_' + e.target.name] : e.target.value}

        setData({...data, ['user_prescription_items'] : user_prescription_items })
        console.log('new user pres', user_prescription_items)
    }

    const onChange = (e) => setData({...data, [e.target.id]: e.target.value});
    const onChangeProgram = (e) => {
        console.log('on Hange Program')
        if (e.target.value === "") {
            console.log('oi teste');
            setData({...data, ['prescription_id']: e.target.value});

            return
            // return setPrescriptions([])
        }
        const prescription = prescriptions.filter((i) => i.id !== e.target.value)
        console.log('prescri', prescription[0])
        if(prescription.length > 0 ){
            setPrescription(prescription[0])
        }

        setData({...data, [e.target.id]: e.target.value});
        // //mandar um axioss
        // axios.get(route('programs.get.prescriptions'), {
        //     params: {
        //         program_id: e.target.value
        //     }
        // })
        //     .then(function (response) {
        //         console.log('teste', response.data);
        //
        //         setPrescriptions(response.data)
        //
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('onSubmit', data)
        put(route('users.update', model.id), {
            data,
            onSuccess: () => {
                reset(),
                    close()
            },
        });
    }

    useEffect(() => {
        console.log('model editUser', model)
        let user_prescription_items = []
        if(model.user_prescription)
            model.user_prescription.user_prescription_items.map((item, index) => {
                user_prescription_items[item.prescription_item_id + '_' +item.index] = item.value
            })

        setData({
            ...data,
            name: model.name,
            email: model.email,
            username: model.username,
            cpf: model.cpf,
            birth: model.birth,
            password: model.password,


        });

        console.log('effect Data', user_prescription_items)
        setPrescription(prescriptions.filter((i) => i.id !== data.prescription_id)[0]);
    }, [model]);

    const renderPrescription = () => {
        console.log('meu prescrip', prescription, data.prescription_id)

        if(!prescription){
            return <></>
        }
        console.log('meu prescrip 2', prescription)
        return <>
                <h2>{prescription.name}</h2>
                <PrescriptionItemDetail  items={prescription.prescription_items}
                                         onChangeItem={onChangeItem} wakeUp={data.wake_up} sleep={data.sleep}
                                         userItems={data.user_prescription_items}
                />
        </>

    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <FormUser setData={setData} data={data} errors={errors} roles={roles} submit="Enviar" />

            </form>
        </>

    )
}
