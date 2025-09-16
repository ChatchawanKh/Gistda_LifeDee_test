import React from 'react';
import CardData from './CardData2';
import ServiceCard from './ServiceCard';
import Banner_slide from './Banner_slide';
import LifeDeeBannersComponent from './LifeDeeBanner';
import Banner2 from './Banner2';
import Footer from './Footer';
import ResponsiveAppBar from '../NavigationBar/navbar_home';
import ScrollToTopButton from "./Scrolltotop";

function Home() {
  return (
    <>
      {/* UI หลัก */}
      <ResponsiveAppBar />
      <LifeDeeBannersComponent />
      {/* <Banner_slide /> */}
      <CardData />
      <ServiceCard />
      <Banner2 />
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default Home;
