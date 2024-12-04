import React from 'react'

export default function Footer() {
    return (
        <>
            <footer className="footer mt-auto pb-4">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-lg-between">
                        <div className="col-lg-6 mb-lg-0 mb-4">
                        <div className="copyright text-center text-sm text-muted text-lg-start">
                           &copy; 2024 Clinica de Olhos Moacir Cunha - desenvolvido por <i
                            className="far fa-hand-peace"></i>
                            <a href="https://www.neonexus.com.br" className="font-weight-bold" target="_blank"> Neonexus</a>

                        </div>
                        </div>
                        <div className="col-lg-6">
                        <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                            <li className="nav-item">
                                <a href="https://www.moacir-cunha.com.br/" className="nav-link text-muted" target="_blank">Site da clínica</a>
                            </li>

                        </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
