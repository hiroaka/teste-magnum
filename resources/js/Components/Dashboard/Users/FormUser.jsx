import React from 'react'
import MaskedInput from "react-text-mask";

export default function FormUser({errors, submit, data, setData, roles}) {
    const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });

    return (
        <>
            <div className="modal-body">

                <div className="form-group">
                    <label htmlFor="type" className="col-form-label">Tipo:</label>
                    <select
                        name="type"
                        id="type"
                        className="form-control"
                        value={data.type} // ...force the select's value to match the state variable...
                        onChange={(e) => { console.log('resset'); reset(); onChange(e) }} // ... and update the state variable on any change!
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="user">Paciente</option>
                        <option value="admin">Administrador</option>

                    </select>

                    {/*<input type="text" className="form-control" name='status' value={data.status} onChange={onChange} id="status"/>*/}

                    {errors && <div className='text-danger mt-1'>{errors.status}</div>}
                </div>
                {JSON.stringify(errors)}

                <div className="form-group" hidden={data.type === "user"}>
                    <label htmlFor="name" className="col-form-label">Name:</label>
                    <input type="text" className="form-control" name='name' value={data.name} onChange={onChange} id="name"/>
                    {errors && <div className='text-danger mt-1'>{errors.name}</div>}
                </div>

                <div className="form-group" hidden={data.type === "user"}>
                    <label htmlFor="email" className="col-form-label">Email:</label>
                    <input type="text" className="form-control" name='email' value={data.email} onChange={onChange} id="email"/>
                    {errors && <div className='text-danger mt-1'>{errors.email}</div>}
                </div>

                <div className="form-group" hidden={data.type === "user"}>
                    <label htmlFor="password" className="col-form-label">Senha:</label>
                    <input type="password" className="form-control" name='password' value={data.password} onChange={onChange} id="password"/>
                    {errors && <div className='text-danger mt-1'>{errors.password}</div>}
                </div>
                <div className="form-group" hidden={data.type === "admin"}>
                    <label htmlFor="birth" className="col-form-label">Data de Nascimento:</label>
                    <MaskedInput
                        className="form-control" name='birth' value={data.birth}
                        onChange={onChange}
                        id="birth"

                        mask={[/\d/, /\d/, '/', /\d/,/\d/, '/', /\d/, /\d/,/\d/,/\d/]}
                    />
                    {errors && <div className='text-danger mt-1'>{errors.birth}</div>}
                </div>
                <div className="form-group" hidden={data.type === "admin"}>
                    <label htmlFor="cpf" className="col-form-label">CPF:</label>
                    <MaskedInput
                        className="form-control" name='cpf' value={data.cpf}
                        onChange={onChange}
                        id="cpf"

                        mask={[/\d/, /\d/,/\d/, '.', /\d/,/\d/, /\d/, '.', /\d/, /\d/,/\d/,'-', /\d/, /\d/]}
                    />

                    {errors && <div className='text-danger mt-1'>{errors.cpf}</div>}
                </div>

            </div>
            <div className="modal-footer">
                <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn bg-gradient-primary">{submit}</button>
            </div>
        </>
    )
}
