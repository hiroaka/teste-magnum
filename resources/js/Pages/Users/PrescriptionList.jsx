import {Link, router} from '@inertiajs/react';
import React, {useEffect, useState} from 'react'
import Dialog from '../../Components/Dashboard/Dialog';
import Base from '../../Layouts/Base'
import useDialog from '../../Hooks/useDialog';


export default function PrescriptionList(props) {

    const {data: prescriptions, links, meta} = props.prescriptions;

    const [state, setState] = useState([])
    const [data, setData] = useState({per_page: props.per_page, search: props.search})
    const [addDialogHandler, addCloseTrigger, addTrigger] = useDialog()
    const [UpdateDialogHandler, UpdateCloseTrigger, UpdateTrigger] = useDialog()
    const [PrescriptionDialogHandler, PrescriptionCloseTrigger, PrescriptionTrigger] = useDialog()
    const [destroyDialogHandler, destroyCloseTrigger, destroyTrigger] = useDialog()

    const openPrescriptionDialog = (prescription) => {
        console.log('prescription', prescription)
        setState(prescription);
        UpdateDialogHandler()
    }

    const openUpdateDialog = (prescription) => {
        console.log('update prescription', prescription)
        setState(prescription);
        UpdateDialogHandler()
    }

    const openDestroyDialog = (prescription) => {
        setState(prescription);
        destroyDialogHandler()
    };

    const destroyPrescription = () => {
        axios.get(route('users.prescription.delete.program', { 
            'prescription_id': state.id
        })) 
        .then(function (response) {
            console.log('program by user', response.data);
            toast.success(response.data.message)
        })
        .catch(function (error) {
            console.log(error);
            toast.error(error)
        })
    }

    const onChange = (e) => {
        console.log({[e.target.id]: e.target.value})
        return setData({...data, [e.target.id]: e.target.value});
    }

    const onSearch = (e) => {
        e.preventDefault();
        console.log('on search')
        router.visit(route('prescriptions.index'), {
            only: ['prescriptions'],
            data: data,
            preserveState: true
        }, [data])
    }

    useEffect(() => {
        console.log('prescriptioneffec', prescriptions)
        // openPrescriptionDialog(prescription)
    },[prescriptions]);
    return (
        <>
            <div className="container-fluid py-4">
                <Dialog trigger={addTrigger} title="Cadastrar novo usuário" size="modal-fullscreen">
                    {/* <CreatePrescription close={addCloseTrigger}/> */}
                </Dialog>

                <Dialog trigger={UpdateTrigger} title={`Atualizar usuário: ${state.name}`}  size="modal-fullscreen">
                    {/* <EditPrescription model={state} close={UpdateCloseTrigger} prescriptions={prescriptions} roles={roles}/> */}
                </Dialog>

                {/*<Dialog trigger={PrescriptionTrigger} title={`Prescrição usuário: ${state.name}`}  size="modal-fullscreen">*/}
                {/*    <PrescriptionPrescription model={state} close={PrescriptionCloseTrigger} prescriptions={prescriptions} roles={roles}/>*/}
                {/*</Dialog>*/}

                <Dialog trigger={destroyTrigger} title={`Excluir usuário: ${state.name}`}>
                    <p>Tem certeza que deseja excluir esse registro?</p>
                    <div className="modal-footer">
                        <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar
                        </button>
                        <button type="submit" onClick={destroyPrescription} className="btn bg-gradient-danger">Excluir</button>
                    </div>
                </Dialog>


                <div className="py-3">
                    <form onSubmit={onSearch}>
                        <div className="row">


                            <div className="col-sm-2">
                                <select className="form-control" name="per_page" id="per_page" value={data.per_page}
                                        onChange={onChange}>
                                    <option value="10">10 por página</option>
                                    <option value="20">20 por página</option>
                                    <option value="50">50 por página</option>

                                </select>

                            </div>
                            <div className="col-sm-3">
                                <input type="text" className="form-control" name="search" id="search"
                                       value={data.search} placeholder="Procurar..." onChange={onChange}/>
                            </div>


                            <div className="col-sm-3">
                                
                            </div>
                            <div className="col-sm-3">
                                <button className="btn btn-secondary">Buscar</button>
                            </div>


                        </div>
                    </form>
                </div>

                <div className="row pb-4">
                    <div className="col-12 w-100">
                        <div className="card h-100 w-100">
                            <div className="card-header pb-0">
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <h6>Prescrições</h6>


                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end">
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="card-body px-0 pt-0 pb-2">


                                <div className="table-responsive-xxl p-0" width="100%">
                                    <table className="table align-items-center justify-content-center mb-0"
                                           width="100%">
                                        <thead>
                                        <tr>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-centter">#</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Nome</th>
                                            {/*<th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Prescriptionname</th>*/}
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-left opacity-7 ps-2">E-mail</th>

                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {prescriptions.map((prescription, index) => (
                                            <tr key={prescription.id}>
                                                <td className='text-center'>{prescription.id}</td>
                                                <td className='text-left'>
                                                    <div className="d-flex px-2">
                                                        {/*<div>*/}
                                                        {/*    <img src="/img/team-2.jpg" className="avatar avatar-sm  me-3 " />*/}
                                                        {/*</div>*/}
                                                        <div className="my-auto">
                                                            <h6 className="mb-0 text-sm">{prescription.prescription.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/*<td className='text-left'>*/}
                                                {/*    <p className="text-sm font-weight-bold mb-0">{prescription.prescriptionname}</p>*/}
                                                {/*</td>*/}
                                                <td className='text-left'>
                                                    <span className="text-xs font-weight-bold">{prescription.email}</span>
                                                </td>
                                                {/*<td className="align-middle text-left">*/}
                                                {/*    <div className="d-flex align-items-center text-left">*/}
                                                {/*        <span className="text-xs font-weight-bold mb-0">{prescription.address}</span>*/}
                                                {/*    </div>*/}
                                                {/*</td>*/}
                                                <td className="align-middle text-center" width="10%">
                                                    <div>
                                                        {/*<button type="button" onClick={() => openPrescriptionDialog(prescription)}*/}
                                                        {/*        className="btn btn-dribbble btn-icon-only mx-2">*/}
                                                        {/*    <span className="btn-inner--icon"><i*/}
                                                        {/*        className="fas fa-newspaper"></i></span>*/}
                                                        {/*</button>*/}
                                                        <Link type="button" href={route('users.prescription', prescription.id)}
                                                                className="btn btn-dribbble btn-icon-only mx-2">
                                                            <span className="btn-inner--icon"><i
                                                                className="fas fa-newspaper"></i></span>
                                                        </Link>
                                                        <button type="button" onClick={() => openUpdateDialog(prescription)}
                                                                className="btn btn-vimeo btn-icon-only mx-2">
                                                            <span className="btn-inner--icon"><i
                                                                className="fas fa-pencil-alt"></i></span>
                                                        </button>
                                                        <button type="button" onClick={() => openDestroyDialog(prescription)}
                                                                className="btn btn-youtube btn-icon-only">
                                                            <span className="btn-inner--icon"><i
                                                                className="fas fa-trash"></i></span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        {meta.links.map((link, k) => (
                            <li key={k} className="page-item">
                                <Link disabled={link.url == null ? true : false} as="button"
                                      className={`${link.active && 'bg-info'} ${link.url == null && 'btn bg-gradient-secondary text-white'} page-link`}
                                      href={link.url || ''} dangerouslySetInnerHTML={{__html: link.label}}/>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}

PrescriptionList.layout = (page) => <Base key={page} children={page} title={"Administrar prescrições do usuário"}/>
