import { Link,router } from '@inertiajs/react';
import React, { useState } from 'react'
import Dialog from '../../../Components/Dashboard/Dialog';
import Base from '../../../Layouts/Base'
import useDialog from '../../../Hooks/useDialog';
// import CreateRole from '../../../Components/Dashboard/Roles/CreateRole';
import CreateRole from './Partial/CreateRole';
import EditRole from './Partial/EditRole';
import moment from 'moment';



export default function Index(props) {

    const {data: roles, links, meta} = props.roles;
    const [state, setState] = useState([])
    const [addDialogHandler, addCloseTrigger,addTrigger] = useDialog()
    const [UpdateDialogHandler, UpdateCloseTrigger,UpdateTrigger] = useDialog()
    const [destroyDialogHandler, destroyCloseTrigger,destroyTrigger] = useDialog()
    const openUpdateDialog = (role) => {
        console.log('role', role)
        setState(role);
        UpdateDialogHandler()
    }

    const openDestroyDialog = (role) => {
        setState(role);
        destroyDialogHandler()
    };

    const destroyRole = () => {
        router.delete(
            route('roles.destroy', state.id),
            { onSuccess: () => destroyCloseTrigger() });
    }

    return (
        <>
            <div className="container-fluid py-4">
                <Dialog trigger={addTrigger} title="Cadastrar nova permissão">
                    <CreateRole close={addCloseTrigger}/>
                </Dialog>

                <Dialog trigger={UpdateTrigger} title={`Atualizar permissão: ${state.name}`}>
                    <EditRole model={state} close={UpdateCloseTrigger}/>
                </Dialog>

                <Dialog trigger={destroyTrigger} title={`Excluir permissão: ${state.name}`}>
                    <p>Tem certeza que deseja excluir esse registro?</p>
                    <div className="modal-footer">
                        <button type="button" className="btn bg-gradient-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="submit" onClick={destroyRole} className="btn bg-gradient-danger">Excluir</button>
                    </div>
                </Dialog>

                <div className="row pb-4">
                    <div className="col-12 w-100">
                        <div className="card h-100 w-100">
                            <div className="card-header pb-0">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6>Mensagens</h6>
                                </div>
                                <div className="col-md-6 d-flex justify-content-end">
                                    <button onClick={addDialogHandler} type="button" className="btn bg-gradient-success btn-block mb-3" data-bs-toggle="modal" data-bs-target="#exampleModalRole">
                                        Criar Nova Mensagem
                                    </button>


                                </div>
                            </div>
                            </div>
                            <div className="card-body px-0 pt-0 pb-2">
                            <div className="table-responsive-xxl p-0" width="100%">
                                <table className="table align-items-center justify-content-center mb-0" width="100%">
                                    <thead>
                                        <tr>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-centter">#</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Nome</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Slug</th>
                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-left">Data</th>



                                            <th className="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role, index) => (
                                            <tr key={role.id}>
                                                {/*<td className='text-center'>{meta.from + index}</td>*/}
                                                <td className='text-center'>{role.id}</td>
                                                <td className='text-left'>
                                                    <div className="d-flex px-2">
                                                        {/*<div>*/}
                                                        {/*    <img src="/img/team-2.jpg" className="avatar avatar-sm  me-3 " />*/}
                                                        {/*</div>*/}
                                                        <div className="my-auto">
                                                            <h6 className="mb-0 text-sm">{role.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/*<td className='text-left'>*/}
                                                {/*    <p className="text-sm font-weight-bold mb-0">{role.rolename}</p>*/}
                                                {/*</td>*/}
                                                <td className='text-left'>
                                                    <span className="text-xs font-weight-bold">{role.slug}</span>
                                                </td>
                                                <td className='text-left'>
                                                    <span className="text-xs font-weight-bold">{moment(role.created_at).format('DD/MM/YY HH:mm:ss')}</span>
                                                </td>
                                                {/*<td className="align-middle text-left">*/}
                                                {/*    <div className="d-flex align-items-center text-left">*/}
                                                {/*        <span className="text-xs font-weight-bold mb-0">{role.address}</span>*/}
                                                {/*    </div>*/}
                                                {/*</td>*/}
                                                <td className="align-middle text-center" width="10%">
                                                <div>
                                                    <button type="button" onClick={() => openUpdateDialog(role)} className="btn btn-vimeo btn-icon-only mx-2">
                                                        <span className="btn-inner--icon"><i className="fas fa-pencil-alt"></i></span>
                                                    </button>
                                                    <button type="button" onClick={() => openDestroyDialog(role)} className="btn btn-youtube btn-icon-only">
                                                        <span className="btn-inner--icon"><i className="fas fa-trash"></i></span>
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
                        { meta.links.map((link, k) => (
                            <li key={k} className="page-item">
                                <Link disabled={link.url == null ? true : false} as="button" className={`${link.active && 'bg-info'} ${link.url == null && 'btn bg-gradient-secondary text-white'} page-link`} href={link.url || ''} dangerouslySetInnerHTML={{ __html: link.label }}/>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}

Index.layout = (page) => <Base key={page} children={page} title={"Administrar mensagens"}/>
