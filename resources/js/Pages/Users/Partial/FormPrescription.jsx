export default function FormPrescription({ errors, data, setData, onChange }){
    return (
        <>
            <h3>Programa de Alerta</h3>

            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <label htmlFor="day_surgery" className="col-form-label">Data da
                            Cirurgia:</label> <br />
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

        </>
    )
}