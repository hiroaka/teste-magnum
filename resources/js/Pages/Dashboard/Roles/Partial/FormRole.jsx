import React from 'react'


export default function FormRole({errors, submit }) {

    const { data, post, progress } = useForm({
        name: null,
        avatar: null,
    })

    const onChange = (e) => setData({ ...data, [e.target.id]: e.target.value });

    return (
        <>
            <div className="modal-body">
                <div className="form-group">
                    <label htmlFor="name" className="col-form-label">Name:</label>
                    <input type="text" className="form-control" name='name' value={data.name} onChange={onChange} id="name"/>
                    {errors && <div className='text-danger mt-1'>{errors.name}</div>}
                </div>

                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} />
                <input type="file" value={data.avatar} onChange={e => setData('avatar', e.target.files[0])} />
                {progress && (
                    <progress value={progress.percentage} max="100">
                        {progress.percentage}%
                    </progress>
                )}


            </div>
            <div className="modal-footer">
                <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn bg-gradient-primary">{submit}</button>
            </div>
        </>
    )
}
