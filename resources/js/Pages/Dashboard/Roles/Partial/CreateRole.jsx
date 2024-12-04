import { useForm } from '@inertiajs/react'

import React, { useState, useRef } from 'react'


export default function CreateRole({close}) {

    const {data, setData, post, reset, errors} = useForm({ name: '',slug: '', level: '', description: '' })


    const onChange = (e) => {
        console.log({[e.target.id]: e.target.value})
        return setData({ ...data, [e.target.id]: e.target.value });
    }


    const onSubmit = (e) => {
        console.log('onSubmit', data)
        e.preventDefault();

        post(route('roles.store'), {
            data,
            onSuccess: () => {
                reset(),
                    close()
            },
        });
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name" className="col-form-label">Título:</label>
                        <input type="text" className="form-control" name='name' value={data.name} onChange={onChange} id="name" required/>
                        {errors && <div className='text-danger mt-1'>{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="slug" className="col-form-label">Slug:</label>
                        <input type="text" className="form-control" name='slug' value={data.slug} onChange={onChange} id="slug" required/>
                        {errors && <div className='text-danger mt-1'>{errors.slug}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="level" className="col-form-label">Level:</label>
                        <input type="text" className="form-control" name='level' value={data.level} onChange={onChange} id="level" required/>
                        {errors && <div className='text-danger mt-1'>{errors.level}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="col-form-label">Descriçãi:</label>
                        <input type="text" className="form-control" name='description' value={data.description} onChange={onChange} id="description" required/>
                        {errors && <div className='text-danger mt-1'>{errors.level}</div>}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" className="btn bg-gradient-primary">Salvar</button>
                </div>
            </form>
        </>

    )
}
