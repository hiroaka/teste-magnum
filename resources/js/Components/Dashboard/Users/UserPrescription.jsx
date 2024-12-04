import {useForm} from '@inertiajs/react'
import React, {useEffect, useState} from 'react'
import MaskedInput from 'react-text-mask'
import PrescriptionItemDetail from "@/Components/Dashboard/Prescription/PrescriptionItemDetail";
import moment from "moment";

import {Typeahead} from 'react-bootstrap-typeahead';
import CalculateDates from "@/Function/CalculateDates"; // ES2015

export default function UserPrescription({close, model, prescriptions, roles}) {
    console.log('model', model)

    const {data, setData, put, reset, errors} = useForm({
        name: model.name,
        email: model.email,
        username: model.username,
        role_id: model.role_id,
        birth: model.birth,
        cpf: model.cpf,
        password: model.password,
        wake_up: model.wake_up,
        sleep: model.sleep,
        day_surgery: model.day_surgery,
        prescription_id: model.prescription_id,
        user_prescription_id: '',
        eye: model.eye,

    })


    const [medicines, setMedicines] = useState([])
    const [alert, setAlert] = useState({
        eye: '',
        dt_start: moment().format('DD/MM/YYYY'),
        dt_end: moment().add('days', 30).format('DD/MM/YYYY'),
        hour: '00:00',
        frequency: ''
    })
    const [alerts, setAlerts] = useState([]);
    const [frequencies, setFrequency] = useState([])
    const [alertStage, setAlertStage] = useState('');
    const [prescription, setPrescription] = useState('')

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

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const onChangeItem = (e) => {
        console.log('onChangeItem', e.target.id, e.target.value, e.target.name);

        console.log('old user pres', data.user_prescription_items)
        let user_prescription_items = {
            ...data.user_prescription_items,
            [e.target.id + '_' + e.target.name]: e.target.value
        }

        setData({...data, ['user_prescription_items']: user_prescription_items})
        console.log('new user pres', user_prescription_items)
    }

    const onChangeAlert = (e) => setAlert({...alert, [e.target.id]: e.target.value});
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
        if (prescription.length > 0) {
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
        console.log('model user', model)
        let user_prescription_items = []
        if (model.user_prescription)
            model.user_prescription.user_prescription_items.map((item, index) => {
                user_prescription_items[item.prescription_item_id + '_' + item.index] = item.value
            })

        setData({
            ...data,
            name: model.name,
            email: model.email,
            username: model.username,
            cpf: model.cpf,
            birth: model.birth,
            password: model.password,
            role_id: model.role_id,
            prescription_id: model.user_prescription ? model.user_prescription.prescription_id : '',
            user_prescription_id: model.user_prescription ? model.user_prescription.id : '',
            wake_up: model.user_prescription ? model.user_prescription.wake_up : '',
            sleep: model.user_prescription ? model.user_prescription.sleep : '',
            day_surgery: model.user_prescription ? moment(model.user_prescription.day_surgery).format('DD/MM/YYYY') : '',
            eye: model.user_prescription ? model.user_prescription.eye : '',
            // user_prescription_items: model.user_prescription ?  model.user_prescription.user_prescription_items : [],
            user_prescription_items: user_prescription_items,

        });

        axios.get(route('medicines.get.category'), {})
            .then(function (response) {
                console.log(response);
                setMedicines(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        if(model.id) {
            axios.get(route('alerts.by.user', model.id), {})
                .then(function (response) {
                    console.log('alerts by user', response.data);
                    setAlerts(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        console.log('effect Data', user_prescription_items)
        setPrescription(prescriptions.filter((i) => i.id !== data.prescription_id)[0]);
    }, [model]);

    const renderPrescription = () => {
        console.log('meu prescrip', prescription, data.prescription_id)

        if (!prescription) {
            return <></>
        }
        console.log('meu prescrip 2', prescription)
        return <>
            <h2>{prescription.name}</h2>
            <PrescriptionItemDetail items={prescription.prescription_items}
                                    onChangeItem={onChangeItem} wakeUp={data.wake_up} sleep={data.sleep}
                                    userItems={data.user_prescription_items}
            />
        </>

    }

    const renderAlerts = () => {
        let items = [];
        console.log('renderAlerts', alerts)
        alerts.map((alert) => items.push(<tr><td style={{backgroundColor: alert.color}}>{alert.name} {moment(alert.at).format('DD/MM HH:mm')}</td></tr>));
        return items;
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="modal-body">

                    <div className="row">


                        <div className="col-6">
                            <h3>Programa de Alerta</h3>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="day_surgery" className="col-form-label">Data da
                                            Cirurgia:</label>
                                        <MaskedInput
                                            className="form-control" name='day_surgery' value={data.day_surgery}
                                            onChange={onChange}
                                            id="day_surgery"

                                            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                        />
                                        {errors && <div className='text-danger mt-1'>{errors.day_surgery}</div>}
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
                                            <option value="left">Ambos</option>
                                        </select>
                                        {errors && <div className='text-danger mt-1'>{errors.eye}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="wake_up" className="col-form-label">Hora de Acordar:</label>
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
                                        <label htmlFor="sleep" className="col-form-label">Hora de Dormir:</label>
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


                            <div className="form-group">
                                <label htmlFor="prescription_id" className="col-form-label">Programa:</label>
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
                        </div>
                        <div className="col-6">


                            <button className="btn btn-primary" type="button" onClick={addAlert}>Adicionar Alerta
                            </button>
                            <div className={`${alertStage === 'add' ? '' : 'collapse'}`}>


                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="day_surgery" className="col-form-label">Medicamento:</label>
                                            <Typeahead
                                                id="medicine_id"
                                                labelKey="name"
                                                onChange={(selected) => {
                                                    // Handle selections...
                                                    if (selected[0])
                                                        setAlert({...alert,
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
                                                required
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
                                            <label htmlFor="dt_start" className="col-form-label">Data de início:</label>
                                            <MaskedInput
                                                className="form-control" name='dt_start' value={alert.dt_start}
                                                onChange={onChangeAlert}
                                                id="dt_start"

                                                mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            />
                                            {errors && <div className='text-danger mt-1'>{errors.dt_start}</div>}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="dt_end" className="col-form-label">Data de início:</label>
                                            <MaskedInput
                                                className="form-control" name='dt_end' value={alert.dt_end}
                                                onChange={onChangeAlert}
                                                id="dt_end"

                                                mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            />
                                            {errors && <div className='text-danger mt-1'>{errors.dt_end}</div>}
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
                                            {errors && <div className='text-danger mt-1'>{errors.hour}</div>}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="frequency" className="col-form-label">Frequência:</label>
                                            <select
                                                name="frequency"
                                                id="frequency"
                                                className="form-control"
                                                value={alert.frequency} // ...force the select's value to match the state variable...
                                                onChange={onChangeAlert} // ... and update the state variable on any change!
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                <option value="24">1x ao dia</option>
                                                <option value="12">2x ao dia</option>
                                                <option value="8">3x ao dia</option>
                                                <option value="6">4x ao dia</option>
                                                <option value="3">6x ao dia</option>
                                            </select>
                                            <label htmlFor="frequency" className="col-form-label">Outra frequência (em
                                                horas):</label>
                                            <input type="text" placeholder="Outra frequência (em horas)"
                                                   onChange={onChangeAlert}
                                                   className="form-control"


                                                   name="frequency"
                                                   id="frequency"
                                                   value={alert.frequency}/>
                                            {errors && <div className='text-danger mt-1'>{errors.frequency}</div>}
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

                                <button className="btn btn-primary" type="button" onClick={saveAlerts}>Salvar</button>
                            </div>

                        </div>
                    </div>
                    <h3>Alertas</h3>

                    <div id="alert-list">
                        <table className="table table-striped">
                            <tbody>
                            {renderAlerts()}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" className="btn bg-gradient-primary">Atualizar</button>
                </div>
            </form>
        </>

    )
}
