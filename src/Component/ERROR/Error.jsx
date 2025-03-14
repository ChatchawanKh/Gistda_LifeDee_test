import React from 'react'
import Error from '/src/Icon/404.svg';
import ResponsiveAppBar from '../NavigationBar/navbar_home.jsx'
import Footer from '../Home/Footer'

import './Error.css'


function Errorpage() {
  return (
    <>
        <ResponsiveAppBar />
        <div className="cont-404">
            <div className="err-container">
                <img src={Error} alt="404" />
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Errorpage
