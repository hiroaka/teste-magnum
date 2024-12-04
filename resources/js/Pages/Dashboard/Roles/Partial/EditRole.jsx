import {useForm} from '@inertiajs/react'
import React, {useEffect, useRef, useState} from 'react'

export default function EditRole({close, model}) {

    console.log('model edit role', model)
    const {data, setData, put, reset, errors} = useForm({
        name:'',
        slug:'',
        level:'',
        description:'',
    });

    console.log('data', data)


    const onChange = (e) => setData({...data, [e.target.id]: e.target.value});


    //editar aqui campos

    useEffect(() => {
        setData({
            ...data,
            name: model.name ? model.name : '',
            slug: model.slug ? model.slug : '',
            level: model.level ? model.level : '',
            description: model.description ? model.description : '',

        });
    }, [model]);



    const onSubmit = (e) => {
        e.preventDefault();
        put(route('roles.update', model.id), {
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
                            <label htmlFor="description" className="col-form-label">Descrição:</label>
                            <input type="text" className="form-control" name='description' value={data.description} onChange={onChange} id="description" required/>
                            {errors && <div className='text-danger mt-1'>{errors.level}</div>}
                        </div>

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
