import {useForm, router} from '@inertiajs/react'
import React, {useEffect, useState} from 'react'
import Dialog from '../../Components/Dashboard/Dialog';
import useDialog from '../../Hooks/useDialog';

import MaskedInput from 'react-text-mask'
import PrescriptionItemDetail from "@/Components/Dashboard/Prescription/PrescriptionItemDetail";
import moment from "moment";


import {Typeahead} from 'react-bootstrap-typeahead';
import CalculateDates, {CalculatePrescription} from "@/Function/CalculateDates";
import  EyeHelper from "@/Function/EyeHelper";

import Base from "@/Layouts/Base";
import Index from "@/Pages/Users/Index";
import DatePicker from "react-date-picker";
import toast from "react-hot-toast";




export function UserItem({id = null, value = null, onChangeUserItem, prescription_item_id = 0, index = 0}) {
    // const   = props
    //name = prescription_item_id


    return <div className="col-2">
        <MaskedInput
            className="form-control"
            name={prescription_item_id} id={index} defaultValue={value} onChange={onChangeUserItem}
            mask={[/\d/, /\d/, ':', /\d/, /\d/]}
        />
    </div>
    // <input name={prescription_item_id} id={index} defaultValue={value} onChange={onChangeUserItem} />
}

export function Modification(props) {
    const {value, onChangeModification, name, id} = props
    // console.log('Mod Props', props)

    //achar o userItem


    // return (
    //     // <div className="col"><select
    //     //     name={name} id={id} value={value}
    //     //     data-key={id}
    //     //     className="form-control"
    //     //     onChange={onChangeModification}
    //     // >
    //     //     <option value="0">0</option>
    //     //     <option value="wake_up">Ao acordar</option>
    //     //     <option value="10">10 minutos após</option>
    //     //     <option value="20">20 minutos após</option>
    //     //     <option value="30">30 minutos após</option>
    //     //     <option value="before_bed">Antes de dormir</option>
    //     // </select></div>)
    //     <input name={name} id={id} value={value} onChange={onChangeModification} />)
}

export function Item(props) {
    const {
        item, onChangeItem, onChangeUserItem, onChangeMedicine,
        user_medicines,
        name, user_item, frequencies, medicines
    } = props


    //pegar o primeiro user_medicine que encontrar
    // console.log('findUserMedicine', user_item)
    let user_medicine_id = user_item ? user_item.filter((x) => x.prescription_item_id == item.id) : null
    if (user_medicine_id) {
        user_medicine_id = user_medicine_id[0]?.medicine_id

    }

    // console.log('itewm freq', frequencies)
    //para cada aplicação
    let applications = []
    //TODO:o objeto já recebe um applications que tem o valor de cada aplicação, vira um array
    for (var i = 0; i < item.applications; i++) {

        let inputValue = {};
        //Buscar no array do user items se eu tenho um valor para aquele cara
        let findValue = user_item.filter((x) => {
            // console.log('achar o item', item.id, x.prescription_item_id, x.index, i)
            return x.prescription_item_id == item.id && x.index == i
        })

        if (findValue.length > 0) {
            inputValue = findValue[0]

        } else {
            //criar um novo item
            inputValue = {index: i, value: frequencies[i]}
        }

        // console.log('findValue que vai para o item', inputValue)

        //@TODO: colocar no value o findValue
        applications.push(<UserItem
            value={inputValue.value}
            id={i}
            key={i}
            prescription_item_id={item.id}
            index={i}

            onChangeUserItem={onChangeUserItem}
        />)
    }

    return <>
         {/* <Typeahead
            id="medicine_id"
            labelKey="name"
            className="pb-3"
            //@TODO: essa linha aqui não deixa ficar selecionado oi item
            selected={user_medicine_id ? medicines.filter((medicine) => user_medicine_id == medicine.id
            ) : null}
            // selected={medicines.filter((medicine) =>  user_item.length > 0 ? user_item[0].medicine_id == medicine.id : false ) }
            onChange={(selected) => {
                // Handle selections...
                if (selected[0]) {
                    console.log('selected category', (selected[0]))
                    return onChangeMedicine({
                        target: {
                            value: selected[0].name,
                            id: selected[0].id,
                            prescription_item_id: item.id
                        }
                    }, i)
                }

            }}
            options={medicines.filter((medicine) => {
                // console.log('medicine fr', medicine)
                return item.medicine_category_id == medicine.medicine_category_id

            })}
        />  */}

        <h3>{user_medicine_id && medicines.length > 0 ? medicines.filter((medicine) => user_medicine_id == medicine.id
        )[0].name : null}</h3>

        {/*<input value={item.color} onChange={onChangeItem}/>*/}

        {/* Para item existe uma modificacao*/}

        <div className="row" >
            {/*{!!modifications && modifications.map((modification, modIndex) => {*/}
            {/*    return <Modification name={name} id={modIndex} onChangeModification={event => onChangeModification(event)} value={modification}/>*/}
            {/*})}*/}
            {applications}
        </div>

    </>
}

export default function Prescription(props) {


    const {model, alerts,medicines} = props
    const {data: prescriptions} = props.prescriptions;
    const {data: medicineCategories} = props.medicineCategories;

    const [deleteAlertDialogHandler, deleteAlertCloseTrigger,deleteAlertTrigger] = useDialog();
    const [deleteProgramDialogHandler, deleteProgramCloseTrigger,deleteProgramTrigger] = useDialog();

    console.log('model', model, prescriptions, medicineCategories)

    const {data, setData, put, reset, errors} = useForm({
        name: '',
        email: '',
        username: '',
        role_id: '',
        birth: '',
        cpf: '',
        password: '',
        wake_up: '',
        sleep: '',
        day_surgery: '',
        prescription_id: '',
        user_prescription_id: '',
        user_prescription_items: [],
        eye: '',

    })

    // const [medicines, setMedicines] = useState([])
    const [userMedicines, setUserMedicines] = useState([])

    const [alert, setAlert] = useState({
        eye: '',
        dt_start: moment().format('DD/MM/YYYY'),
        dt_end: moment().add('days', 30).format('DD/MM/YYYY'),
        hour: '00:00',
        frequency: ''
    })
    // const [alerts, setAlerts] = useState([]);
    const [frequencies, setFrequency] = useState([]);
    const [alertStage, setAlertStage] = useState('');
    const [prescription, setPrescription] = useState('');
    const [onlyCategories, setOnlyCategories] = useState(new Set());


    const calculateFrequencias = (e) => {
        e.preventDefault()
        setAlertStage('frequency')
        console.log('CalculateDates', alert)
        setFrequency(CalculateDates(alert.dt_start, alert.dt_end, alert.hour, alert.frequency))
    }

    const addAlert = (e) => {
        e.preventDefault()
        setAlertStage('add')
    }

    const renderFrequencias = () => {
        //calcular para cada frequencia
        //
        let items = []
        frequencies.map((frequency) => {
            items.push(<tr>
                <td>{frequency.format('DD/MM/YYYY HH:mm')}</td>
            </tr>)
        })
        return items
    }

    const saveAlerts = () => {
        axios.post(route('alerts.save.alerts', model.id), {
            ...alert,
            frequencies: frequencies.map((moment) => moment.format('YYYY-MM-DD HH:mm:ss')),
            ...data,
        })
            .then(function (response) {
                console.log(response);
                toast.success(response.data.message)
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Houve um erro ao salvar os alertas')

            });
    }

    const onChangeItem = (e, index = 0) => {
        console.log('onChangeItem', e.target.id, e.target.value, e.target.name);

        console.log('old user pres', data.user_prescription_items)

        //preciso achar o item igual

        let foundItem = data.user_prescription_items.filter((item) => {
            console.log('foundItem', item.prescription_item_id, e.target.id, item.index, e.target.name)
            //que tenha o mesmo id e no mesmo index
            return item.prescription_item_id == e.target.id && item.index == e.target.name
        })

        if (!foundItem) {
            return true
        }

        console.log('foundItem', foundItem, data.user_prescription_items)
        foundItem[0].value = e.target.value

        // let user_prescription_items = {
        //     ...data.user_prescription_items,
        //     [e.target.id + '_' + e.target.name]: e.target.value
        // }

        setData({...data, ['user_prescription_items']: {...foundItem, ...user_prescription_items}})
        console.log('foundItem new props', user_prescription_items)
    }

    const onChangeAlert = (e) => setAlert({...alert, [e.target.id]: e.target.value});
    const onChange = (e) => setData({...data, [e.target.id]: e.target.value});

    //preencher o objeto já de user items ao selecionar o programa, ou ao carregar a página
    const fillUserItems = (prescription) => {

        //Loopar cada item da prescriçã
        console.log('fillUserItems', prescription)


        prescription.prescription_items.map((prescription_item, prescription_item_index) => {
            console.log('fillUserItems', prescription_item, prescription_item_index)
            let user_prescription_items = data.user_prescription_items
            //para cada aplicação fazer um looop tbm
            for (var i = 0; i < prescription_item.applications; i++) {

                console.log('fillUserItems data.', data.day_surgery)


                const calculatePrescription = new CalculatePrescription(data.day_surgery, data.wake_up, data.sleep, prescription_item)
                calculatePrescription.calculateDates()


                console.log('fillUserItems application', i, prescription_item.id, calculatePrescription)

                //existe esse valor no user_items?
                const findUserItemIndex = user_prescription_items.findIndex((item) => item.index == i && item.prescription_item_id == prescription_item.id)
                console.log('fillUserItems filter', findUserItemIndex)
                if (findUserItemIndex > -1) {

                    //encontrei o index atualizar e substituir
                    // user_prescription_items[findUserItemIndex].value = event.target.value
                    // data.user_prescription_items.splice(findUserItemIndex, 1, foundUserItem)
                } else {
                    //CRIAR UM NOVO
                    user_prescription_items.push({
                        index: i,
                        value: calculatePrescription.frequencies[i],
                        prescription_item_id: prescription_item.id
                    })
                }

                console.log('fillUserItems user_items', user_prescription_items)
                //criar um novo objeto com  valor
            }
        })
    }

    const onChangeProgram = (e) => {

        /**
         * @TODO Quando muda o programa, não está calculando o objeto corretamente de modificações.
         * Exemplo, estava com o de catarata já cadastrado. Mudei no front para o Refrativa.
         */
        console.log('on Hange Program')
        if (e.target.value === "") {
            setData({...data, ['prescription_id']: e.target.value});
            return
            // return setPrescriptions([])
        }
        let prescription = prescriptions.filter((i) => i.id == e.target.value)

        if (prescription.length > 0) {
            setPrescription(prescription[0])
        }

        setData({...data, [e.target.id]: e.target.value});

        //Preencher os user_items tbm
        fillUserItems(prescription[0])

        //pegar todos os medicine_category_id dentro dos prescription_items

        setOnlyCategories(new Set(prescription[0].prescription_items.map((item) => item.medicine_category_id)))
        //filtrar os medicamentos por categorias

        // setOnlyCategories(medicines.filter((medicine) => prescription[0].medicine_category_id == medicine.medicine_category_id))

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
        // put(route('users.update', model.id), {
        //     data,
        //     onSuccess: () => {
        //         reset(),
        //             close()
        //     },
        // });
        fillUserItems(prescription)

        axios.post(route('users.prescription.store', model.id), {
            ...data,
            ['user']: prescription.prescription_item,
            ['medicines']: userMedicines

        })
            .then(function (response) {
                console.log(response);
                toast.success(response.data.message)
                router.visit(route('users.prescription', model.id), {

                    preserveState: true
                })

            })
            .catch(function (error) {
                console.log(error);
                toast.error(error)


            });


    }

    useEffect(() => {
        console.log('model user', model)
        let user_prescription_items = []

        console.log('model.user_prescription[0]?', model.user_prescription[0]);
        if (!!model.user_prescription && !!model.user_prescription[0]?.user_prescription_items) {

            model.user_prescription[0]?.user_prescription_items.map((item, index) => {
                user_prescription_items.push(item)
            })

            setOnlyCategories(new Set(prescriptions.find((v) => v.id == model.user_prescription[0]?.prescription_id).prescription_items.map((item) => item.medicine_category_id)))

            //colocar os set medicines
            let userMedicineSelecteds = new Set(model.user_prescription[0]?.user_prescription_items.map( (item)  => item.medicine_id))

            // console.log('prescr12343', userMedicineSelecteds )
            setUserMedicines( medicines.filter( (medicine) =>  {
                // console.log('prescr12343 has?', userMedicineSelecteds.has(medicine.id), medicine.id)
                return userMedicineSelecteds.has(medicine.id) ? medicine : false
            }))
            // console.log('prescr12343 userMEdicines123', userMedicines)

        }


        // {
        //     prescription_item_id: 2,
        //         value: 12:00,
        //     index: 2
        // }
        // }
        // console.log('user_prescription_item')

        setData({
            ...data,
            name: model.name,
            email: model.email,
            username: model.username,
            cpf: model.cpf,
            birth: model.birth,
            password: model.password,
            role_id: model.role_id,
            prescription_id: model.user_prescription[0] ? model.user_prescription[0].prescription_id : '',
            user_prescription_id: model.user_prescription[0] ? model.user_prescription[0].id : '',
            wake_up: model.user_prescription[0] ? model.user_prescription[0].wake_up : '',
            sleep: model.user_prescription[0] ? model.user_prescription[0].sleep : '',
            day_surgery: model.user_prescription[0] ? model.user_prescription[0].day_surgery : new Date(),
            eye: model.user_prescription[0] ? model.user_prescription[0].eye : '',
            // user_prescription_items: model.user_prescription ?  model.user_prescription.user_prescription_items : [],
            user_prescription_items: user_prescription_items,
            user_prescription: model.user_prescription
        });

        // axios.get(route('medicines.get.category'), {})
        //     .then(function (response) {
        //         console.log('medicines.get.category', response);
        //         setMedicines(response.data)
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        // if (model.id) {
        //     axios.get(route('alerts.by.user', model.id), {})
        //         .then(function (response) {
        //             console.log('alerts by user', response.data);
        //             setAlerts(response.data)
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        // }

        //
        // //deixar aberto já no ultimo programa cadasdtrado para o usuaários
        if (model.user_prescription[0]) {
            const userPrescription = prescriptions.filter((prescription) => prescription.id == model.user_prescription[0].prescription_id)[0]
            setPrescription(userPrescription);
            //     //preencher itens do user_prescription_items que não existam
        }


    }, [model]);

    const updateItem = (event, index) => {
        console.log('event', event, 'index', index)

        let foundItem = data.user_prescription_items[index]
        if (typeof foundItem == "undefined") {
            foundItem = {}
        }


        console.log('foundItem', foundItem, data.user_prescription_items)
        foundItem.value = event.target.value
    }

    const updateUserMedicine = (event, index) => {
        console.log('updateUserMedicne', event, 'index', index)
        // let newUserMedicines = userMedicines
        // newUserMedicines[index] = event
        setUserMedicines({
            ...userMedicines, [index]: {
                name: event.target.value,
                id: event.target.id,
                prescription_item_id: event.target.prescription_item_id
            }
        })

    }

    const updateUserItem = (event) => {
        console.log('updateUserItem event', event.target.value, 'itemIndex', event.target.name, 'index', event.target.id)
        const itemIndex = event.target.name
        const modIndex = event.target.id

        // ``atualizar o user itens
        const user_prescription_items = data.user_prescription_items
        //procurar o index
        const findUserItemIndex = user_prescription_items.findIndex((item) => item.index == event.target.id && item.prescription_item_id == event.target.name)
        console.log('filter', findUserItemIndex)
        if (findUserItemIndex > -1) {

            //encontrei o index atualizar e substituir
            user_prescription_items[findUserItemIndex].value = event.target.value
            // data.user_prescription_items.splice(findUserItemIndex, 1, foundUserItem)
        } else {
            //CRIAR UM NOVO
            user_prescription_items.push({
                index: event.target.id,
                value: event.target.value,
                prescription_item_id: event.target.name
            })
        }

        setData({...data, ['user_prescription_items']: user_prescription_items})
        console.log('foundUserItems', user_prescription_items)
        // setPrescription({...prescription, ['prescription_items'] : prescription_items })
        console.log('novo sta te do prescriptions', data.user_prescription_items)

    }


    const updateModification = (event) => {
        console.log('event', event.target.value, 'itemIndex', event.target.name, 'index', event.target.id)
        const itemIndex = event.target.name
        const modIndex = event.target.id
        //pegar o itens atual
        const prescription_items = user_prescription.prescription_items
        console.log('modifications1', prescription_items[itemIndex].modifications)
        //transformar a modifications
        prescription_items[itemIndex].modifications = typeof prescription_items[itemIndex].modifications == 'string' ? prescription_items[itemIndex].modifications.split(',') : []
        prescription_items[itemIndex].modifications[modIndex] = event.target.value
        prescription_items[itemIndex].modifications = prescription_items[itemIndex].modifications.join(',')


        // setPrescription({...prescription, ['prescription_items'] : prescription_items })
        console.log('novo state do prescriptions', prescriptions)
    }



    const renderPrescription = () => {

        if (!prescription) {
            return <></>
        }
        const userItems = data.user_prescription_items.filter((item) => {
            return item.prescription_id == prescription.id
        })

        //os horarios do sistema
        console.log('renderPrescription userItem', userItems)
        return <>

            {/*{JSON.stringify(data.user_prescription_items)}*/}
            {/*<hr/>*/}
            {/*{JSON.stringify(userMedicines)}*/}


            <h2> {prescription.name}</h2>


            <label htmlFor="prescription_id"
                className="col-form-label"> Selecionar os medicamentos
            </label>
            {medicines.filter((medicine) => onlyCategories.has(medicine.medicine_category_id) ).map((medicine) => <>
                <div className="form-check">
                    <input  value={medicine.id}
                    onChange={(event) =>
                    {
                        const checkedId = event.target.value;
                        if(event.target.checked){
                            setUserMedicines([...userMedicines, medicine])
                        }else{
                            // console.log('filtrado','checkedID',checkedId,userMedicines.filter(medicine => { console.log('medicine.id', medicine.id, checkedId );return medicine.id != checkedId }) )
                            setUserMedicines(userMedicines.filter(medicine=> medicine.id != checkedId))
                        }
                    }}
                    checked={userMedicines.filter((userMedicine) => userMedicine.id == medicine.id).length > 0}
                    name='user_medicines[]' id={'medicine_id_'+medicine.id}
                    className="form-check-input"
                    type="checkbox" />
                    <label className="form-check-label" htmlFor={'medicine_id_'+medicine.id}>
                    <span className="medicine-type" style={{ 'display': 'block','float': 'left', backgroundColor: medicine.color, width: 20, height: 20, borderRadius: 10 }} ></span>  {medicine.name}</label>
                </div>
            </>) }
            {/* {JSON.stringify(userMedicines)  } */}

            {/* <Typeahead
            id="medicine_id"
            labelKey="name"
            className="pb-3"
            //@TODO: essa linha aqui não deixa ficar selecionado oi item
            selected={null}
            // selected={medicines.filter((medicine) =>  user_item.length > 0 ? user_item[0].medicine_id == medicine.id : false ) }
            onChange={(selected) => {
                console.log('selected', selected)
            }}
            options={medicines.filter((medicine) => onlyCategories.has(medicine.medicine_category_id) ) }
            /> */}

            {/*
                //passar o user item respectivo
                prescription.prescription_items.map((prescription_item, index) => {
                    let calculatePrescription = new CalculatePrescription(data.day_surgery, data.wake_up, data.sleep, prescription_item)
                    calculatePrescription.calculateDates()
                    // console.log('frequencies', calculatePrescription.frequencies)
                    return <div className="prescription-item p-3"
                                style={{['backgroundColor']: prescription_item.color}}>
                        <h4>{prescription_item.start === 0 ? "Dia da Cirugia" : (prescription_item.start +1) + "º"} - {prescription_item.end + 1}º
                            Dia</h4>

                            {data.wake_up}

                        <Item
                            name={index}
                            item={prescription_item}
                            onChangeItem={event => updateItem(event, index)}
                            onChangeUserItem={event => updateUserItem(event)}
                            onChangeMedicine={event => updateUserMedicine(event, index)}
                            user_item={userItems}
                            medicines={medicines}
                            frequencies={calculatePrescription.frequencies}
                            user_medicines={userMedicines}


                        />
                    </div>
                })
            */}

            {/*<PrescriptionItemDetail*/}
            {/*    medicine_categories={medicineCategories}*/}
            {/*    items={prescription.prescription_items}*/}
            {/*                        onChangeItem={onChangeItem} wakeUp={data.wake_up} sleep={data.sleep}*/}
            {/*                        userItems={data.user_prescription_items}*/}
            {/*/>*/}
        </>

    }

    const renderAlerts = () => {
        let items = [];
        let days = [];
        console.log('renderAlerts', alerts)
        let lastDay = null
        alerts.map((alert) => {
            var at =  moment(alert.at)
            if(lastDay != at.format('DD/MM/YYYY')){
                lastDay = at.format('DD/MM/YYYY')
                days.push({'at' : at.format('DD/MM/YYYY'), items: [] })
            }

            let whichArrray = days.findIndex(i => i.at == lastDay)
            days[whichArrray].items.push(<tr>
                         <td style={{backgroundColor: alert.color, textDecoration: alert.status != 2 ? 'lineThrough'  : null }}>
                             {alert.name} { moment(alert.at).format(' HH:mm')} - {EyeHelper( alert.eye )}
                         </td>
                     </tr>)
            console.log('whichArray', whichArrray)
        });



        console.log('Os dias', days)
        // <>
        //
        //     <tr>
        //         <td style={{backgroundColor: alert.color}}>{alert.name}{ moment(alert.at).format('DD/MM HH:mm')} : ''} </td>
        //     </tr>
        // </>
        return days
    }

    const deleteAlert = (eye) =>{
        if(confirm('Tem certeza que deseja excluir?')){
            axios.get(route('users.prescription.delete.alert', {
                'user_id': model.id,
                'eye': eye
            }))
            .then(function (response) {
                console.log('alerts by user', response.data);
                toast.success(response.data.message)
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error)
            })

        }
    }

    const deleteProgram = (eye) =>{
        if(confirm('Tem certeza que deseja excluir?')){
            axios.get(route('users.prescription.delete.program', {
                'user_id': model.id,
                'eye': eye
            }))
            .then(function (response) {
                console.log('program by user', response.data);
                toast.success(response.data.message)

                router.reload()
            })
            .catch(function (error) {
                console.log(error);
                toast.error(error)
            })

        }
    }



    return (
        <>
        <Dialog trigger={deleteAlertTrigger} title="Excluir alerta" size='modal-lg'>
            <div close={deleteAlertCloseTrigger}>
            <div className="d-flex justify-content-center "></div>
                <button type="submit" onClick={()=>deleteAlert('right')} className="btn bg-gradient-danger">Direito</button>
                <button type="submit" onClick={()=>deleteAlert('left')} className="btn bg-gradient-danger ms-2 ">Esquerdo</button>

                <button type="submit" onClick={()=>deleteAlert('both')} className="btn bg-gradient-danger ms-2">Ambos</button>

            </div>
        </Dialog>

        <Dialog trigger={deleteProgramTrigger} title="Excluir programa de colírio" size='modal-lg'>
            <div close={deleteProgramCloseTrigger}>
            <div className="d-flex justify-content-center align-item-cent"></div>
                <button type="submit" onClick={()=>deleteProgram('right')} className="btn bg-gradient-danger ">Direito</button>
                <button type="submit" onClick={()=>deleteProgram('left')} className="btn bg-gradient-danger ms-2">Esquerdo</button>

                <button type="submit" onClick={()=>deleteProgram('both')} className="btn bg-gradient-danger ms-2">Ambos</button>

            </div>
        </Dialog>
            <div className="container-fluid py-4">

                <div className="card">
                    <div className="card-body">

                        <form onSubmit={onSubmit}>
                            <div className="py-3">

                                <div className="row">


                                    <div className="col-lg-12">
                                        <h3>Programa de Alerta</h3>

                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="day_surgery" className="col-form-label">Data da
                                                        Cirurgia:</label> <br/>
                                                    {/*<MaskedInput*/}
                                                    {/*    className="form-control" name='day_surgery'*/}
                                                    {/*    value={data.day_surgery}*/}
                                                    {/*    onChange={onChange}*/}
                                                    {/*    id="day_surgery"*/}

                                                    {/*    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}*/}
                                                    {/*/>*/}

                                                    <DatePicker className=""
                                                                id="day_surgery"
                                                                format="dd/MM/y"
                                                                value={data.day_surgery}
                                                        // onChange={onChange}
                                                                onChange={(value => setData({
                                                                    ...data,
                                                                    day_surgery: value
                                                                }))}
                                                    />

                                                    {errors &&
                                                    <div className='text-danger mt-1'>{errors.day_surgery}</div>}
                                                </div>
                                            </div>


                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="sleep" className="col-form-label">Olho:</label>
                                                    <select
                                                        name="eye"
                                                        id="eye"
                                                        className="form-control"
                                                        value={data.eye} // ...force the select's value to match the state variable...
                                                        onChange={onChange} // ... and update the state variable on any change!
                                                        required
                                                    >
                                                        <option value="">Selecione</option>
                                                        <option value="right">Direito</option>
                                                        <option value="left">Esquerdo</option>
                                                        <option value="both">Ambos</option>
                                                    </select>
                                                    {errors && <div className='text-danger mt-1'>{errors.eye}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="wake_up" className="col-form-label">Hora de
                                                        Acordar:</label>
                                                    <MaskedInput
                                                        className="form-control" name='wake_up' value={data.wake_up}
                                                        onChange={onChange}
                                                        id="wake_up"

                                                        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                                                    />
                                                    {errors && <div className='text-danger mt-1'>{errors.wake_up}</div>}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="sleep" className="col-form-label">Hora de
                                                        Dormir:</label>
                                                    <MaskedInput
                                                        className="form-control" name='sleep' value={data.sleep}
                                                        onChange={onChange}
                                                        id="sleep"

                                                        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                                                    />
                                                    {errors && <div className='text-danger mt-1'>{errors.sleep}</div>}
                                                </div>
                                            </div>
                                        </div>


                                        <div className="form-group" hidden={!data.sleep}>
                                            <label htmlFor="prescription_id"
                                                   className="col-form-label">Programa:</label>
                                            <select
                                                name="prescription_id"
                                                id="prescription_id"
                                                className="form-control"
                                                value={data.prescription_id} // ...force the select's value to match the state variable...
                                                onChange={onChangeProgram} // ... and update the state variable on any change!

                                            >
                                                <option value="">Selecione</option>
                                                {prescriptions.map((option, index) => (
                                                    <option key={index} value={option.id}>{option.name}</option>
                                                ))}
                                            </select>

                                            {errors && <div className='text-danger mt-1'>{errors.prescription_id}</div>}
                                        </div>


                                        {renderPrescription()}

                                        <button type="submit" className="btn bg-gradient-primary mt-2">Atualizar</button>
                                        <button type="button" className="btn bg-gradient-danger ms-2 mt-2" onClick={deleteProgramDialogHandler}>Apagar Programa</button>

                                    </div>
                                    <div className="col-lg-12">

                                        <h3>Alerta individual</h3>

                                        <button className="btn bg-gradient-primary" type="button" onClick={addAlert}>Adicionar
                                            Alerta
                                        </button>

                                        <button className="btn bg-gradient-danger ms-2" type="button" onClick={deleteAlertDialogHandler}>
                                            Excluir alertas
                                        </button>

                                        <div className={`${alertStage === 'add' ? '' : 'collapse'}`}>


                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="day_surgery"
                                                               className="col-form-label">Medicamento:</label>
                                                        <Typeahead
                                                            id="medicine_id"
                                                            labelKey="name"
                                                            onChange={(selected) => {
                                                                // Handle selections...
                                                                if (selected[0])
                                                                    setAlert({
                                                                        ...alert,
                                                                        ['medicine']: selected[0].name,
                                                                        ['medicine_id']: selected[0].id
                                                                    })
                                                            }}
                                                            options={medicines}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="sleep" className="col-form-label">Olho:</label>
                                                        <select
                                                            name="eye"
                                                            id="eye"
                                                            className="form-control"
                                                            value={alert.eye} // ...force the select's value to match the state variable...
                                                            onChange={onChangeAlert} // ... and update the state variable on any change!
                                                        >
                                                            <option value="">Selecione</option>
                                                            <option value="right">Direito</option>
                                                            <option value="left">Esquerdo</option>
                                                            <option value="left">Ambos</option>
                                                        </select>
                                                        {errors && <div className='text-danger mt-1'>{errors.eye}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="dt_start" className="col-form-label">Data de
                                                            início:</label>
                                                        <MaskedInput
                                                            className="form-control" name='dt_start'
                                                            value={alert.dt_start}
                                                            onChange={onChangeAlert}
                                                            id="dt_start"
                                                            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                        />
                                                        {errors &&
                                                        <div className='text-danger mt-1'>{errors.dt_start}</div>}
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="dt_end" className="col-form-label">Data de
                                                            início:</label>
                                                        <MaskedInput
                                                            className="form-control" name='dt_end' value={alert.dt_end}
                                                            onChange={onChangeAlert}
                                                            id="dt_end"

                                                            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                                        />
                                                        {errors &&
                                                        <div className='text-danger mt-1'>{errors.dt_end}</div>}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="hour" className="col-form-label">Hora:</label>
                                                        <MaskedInput
                                                            className="form-control" name='hour' value={alert.hour}
                                                            onChange={onChangeAlert}
                                                            id="hour"

                                                            mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                                                        />
                                                        {errors &&
                                                        <div className='text-danger mt-1'>{errors.hour}</div>}
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="frequency"
                                                               className="col-form-label">Frequência:</label>
                                                        <select
                                                            name="frequency"
                                                            id="frequency"
                                                            className="form-control"
                                                            value={alert.frequency} // ...force the select's value to match the state variable...
                                                            onChange={onChangeAlert} // ... and update the state variable on any change!
                                                        >
                                                            <option value="">Selecione</option>
                                                            <option value="24">1x ao dia</option>
                                                            <option value="12">2x ao dia</option>
                                                            <option value="8">3x ao dia</option>
                                                            <option value="6">4x ao dia</option>
                                                            <option value="3">6x ao dia</option>
                                                        </select>
                                                        <label htmlFor="frequency" className="col-form-label">Outra
                                                            frequência
                                                            (em
                                                            horas):</label>
                                                        <input type="text" placeholder="Outra frequência (em horas)"
                                                               onChange={onChangeAlert}
                                                               className="form-control"


                                                               name="frequency"
                                                               id="frequency"
                                                               value={alert.frequency}/>
                                                        {errors &&
                                                        <div className='text-danger mt-1'>{errors.frequency}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <button className="btn btn-vimeo" type="button"
                                                            onClick={calculateFrequencias}>Frequencias
                                                    </button>
                                                </div>
                                            </div>


                                        </div>

                                        <div className={`${alertStage === 'frequency' ? '' : 'collapse'}`}>
                                            <h3>Frequencias</h3>
                                            <table className="table table-striped">
                                                <tbody>
                                                {renderFrequencias()}
                                                </tbody>
                                            </table>

                                            <button className="btn btn-primary" type="button"
                                                    onClick={saveAlerts}>Salvar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <h3>Alertas</h3>

                                <div id="alert-list">
                                    <table className="table ">
                                        <tbody>
                                        {renderAlerts().map((day) => <><tr><td>{day.at}</td></tr>
                                            {day.items.map((item) => item )}
                                        </>)}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <a href={route('users.index')} className="btn bg-gradient-secondary"
                                >Voltar
                                </a>
                                <button type="submit" className="btn bg-gradient-primary ms-2">Atualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}
Prescription.layout = (page) => <Base key={page} children={page} title={"Administrar usuários"}/>
