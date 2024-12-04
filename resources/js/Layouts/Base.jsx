import { Head, usePage } from '@inertiajs/react'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../Components/Dashboard/Navbar'
import Sidebar from '../Components/Dashboard/Sidebar'
import Footer from '../Components/Dashboard/Footer'

export default function Base({children, title}) {
    const { flash } = usePage().props;
    if(typeof flash.message !== "undefined" && flash.message) {
        flash.message && toast[flash.type](flash.message)
    }

    console.log('flash',flash)
    return (
        <div className="g-sidenav-show bg-gray-100">
            <div className="min-height-300 bg-primary position-absolute w-100"></div>
            <Head title={ title } />
            <Sidebar />


            <main className="main-content position-relative border-radius-lg d-flex flex-column min-vh-100 ">
                <Navbar pageName={ title } />
                <Toaster position='top-center' duration='4000'/>
                {children}
                <Footer/>
            </main>
        </div>
    )
}
