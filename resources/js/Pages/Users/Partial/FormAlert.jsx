import {useForm} from '@inertiajs/react'
import React, {useEffect, useState} from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import MaskedInput from 'react-text-mask'
import CalculateDates, { CalculatePrescription } from "@/Function/CalculateDates";


export default function FormAlert({ alert, setAlert,  frequencies, setFrequency, onChangeAlert, errors, medicines, saveAlerts }) {
    const [alertStage, setAlertStage] = useState('add');
    const calculateFrequencias = (e) => {
        e.preventDefault()
        setAlertStage('frequency')
        console.log('CalculateDates', alert)
        setFrequency(CalculateDates(alert.dt_start, alert.dt_end, alert.hour, alert.frequency))
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
    return (
        <>
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
                                value={alert.frequency} />
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
        </>)
}