import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CardData from './CardData2';
import ServiceCard from './ServiceCard';
import Banner_slide from './Banner_slide';
import Banner2 from './Banner2';
import Footer from './Footer';
import ResponsiveAppBar from '../NavigationBar/navbar_home';
import ScrollToTopButton from "./Scrolltotop";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ใช้ setTimeout จำลองเวลาโหลด
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // ตั้งเวลาให้สอดคล้องกับเวลาโหลดจริง
    return () => clearTimeout(timer); // เคลียร์ timer เมื่อ component ถูก unmount
  }, []);

  return (
    <>
      {/* UI หลัก */}
      <ResponsiveAppBar />
      <Banner_slide />
      <CardData />
      <ServiceCard />
      <Banner2 />
      <Footer />
      <ScrollToTopButton />

      {/* Loader ซ้อนทับขณะรอ */}
      {isLoading && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 1)', // พื้นหลังโปร่งใส
            zIndex: 1300, // ให้แสดงอยู่เหนือทุก component
          }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
        </Box>
      )}
    </>
  );
}

export default Home;
