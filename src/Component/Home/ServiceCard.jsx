import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import './ServiceCard.css';
import PM from '/assets/Icon/PM.png';
import Air from '/assets/Icon/Air.png';
import CN from '/assets/Icon/CN.png';
import Room from '/assets/Icon/Room.png';
import Form from '/assets/Icon/Form.png';
import Library from '/assets/Icon/Libary.png';
import phone_mock from '/assets/Icon/iPhone-12-mock.png';
import bg1 from '/assets/Icon/sc-bg-1.png';
import bg2 from '/assets/Icon/sc-bg-2.png';
import bg3 from '/assets/Icon/sc-bg-3.png';
import bg4 from '/assets/Icon/sc-bg-4.png';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

import Button from '@mui/material/Button';

const ServiceCard = () => {

    const [backgroundImage, setBackgroundImage] = useState(bg1);
    const [contentText, setcontentText] = useState('คลีนิคมลพิษออนไลน์');
    const [serviceLink, setserviceLink] = useState('https://www.pollutionclinic.com/home/front');


    const backgroundImages = [bg1, bg2, bg3, bg4];
    const Content = ['คลีนิคมลพิษออนไลน์', 'ประเมินอาการและพฤติกรรมจากการรับสัมผัสฝุ่น', 'สาระความรู้เกี่ยวกับฝุ่น', 'ค้นหาห้องปลอดฝุ่น'];
    const ServiceLink = ['https://www.pollutionclinic.com/home/front/', 'https://4health.anamai.moph.go.th/assessform', 'https://hia.anamai.moph.go.th/th/airpollution-health', 'https://podfoon.anamai.moph.go.th/'];


    return (
        <div 
            className="service-card-container" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="container-a">
                <div className="img-mock-mobile-sc">
                    
                    <img src={phone_mock} alt="phone" />
                </div>
                
                <div className="container-for-swiper">
                    <div className="swiper-description">

                        <h1>{contentText}</h1>
                        <Button
                            variant="outlined"
                            sx={{

                                color: '#ffffff',
                                fontWeight: 'normal',
                                fontFamily: 'Prompt',
                                fontSize: '16px',
                                borderRadius: '10px',
                                border:'1px solid #ffffff',
                                '&:hover': {
                                    backgroundColor: '#8DBAFF',
                                    border:'1px solid #8DBAFF',
                                    color: '#000000',
                                },
                            }}
                            onClick={() => {
                                window.open(serviceLink, '_blank');
                            }}
                        >
                            เข้าสู่เว็ปไซต์
                        </Button>
                    </div>

                    <div className="container-swiper-slide">
                        <Swiper
                            slidesPerView={'auto'}
                            centeredSlides={true}
                            spaceBetween={15}
                            navigation={true}
                            modules={[Navigation]}
                            className="mySwiper-custom-servicecard"
                            onInit={(swiper) => {
                                
                                // Set initial opacity for slides
                                swiper.slides.forEach((slide, index) => {
                                    slide.style.transition = "opacity 0.2s ease";
                                  if (index < swiper.activeIndex) {
                                    slide.style.opacity = 0;
                                  } else if (index === swiper.activeIndex) {
                                    slide.style.opacity = 1;
                                    slide.style.transform = 'scale(1.0)';
                                  } else {
                                    slide.style.opacity = 0.5;
                                    slide.style.transform = 'scale(0.95)';
                                  }
                                });
                            }}
                            onSlideChange={(swiper) => {
                                // Adjust the opacity for the slides
                                swiper.slides.forEach((slide, index) => {
                                    slide.style.transition = "opacity 0.2s ease";
                                  if (index < swiper.activeIndex) {
                                    slide.style.opacity = 0;
                                  } else if (index === swiper.activeIndex) {
                                    slide.style.opacity = 1;
                                    slide.style.transform = 'scale(1.0)';
                                  } else {
                                    slide.style.opacity = 0.5;
                                    slide.style.transform = 'scale(0.95)';
                                  }
                                });
                                // Update the background image based on the active slide index
                                setBackgroundImage(backgroundImages[swiper.activeIndex % backgroundImages.length]);
                                setcontentText(Content[swiper.activeIndex % Content.length]);
                                setserviceLink(ServiceLink[swiper.activeIndex % ServiceLink.length]);
                            }}
                        >
                            <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <a href="https://www.pollutionclinic.com/home/front/" target="_blank" rel="noopener noreferrer">
                            <div className="sv-card" style={{ backgroundImage: 'url(/assets/Icon/CN.png)' }}></div>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <a href="https://4health.anamai.moph.go.th/assessform" target="_blank" rel="noopener noreferrer">
                            <div className="sv-card" style={{ backgroundImage: 'url(/assets/Icon/Form.png)' }}></div>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <a href="https://hia.anamai.moph.go.th/th/airpollution-health" target="_blank" rel="noopener noreferrer">
                            <div className="sv-card" style={{ backgroundImage: 'url(/assets/Icon/Libary.png)' }}></div>
                        </a>
                    </SwiperSlide>
                    <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <a href="https://podfoon.anamai.moph.go.th/" target="_blank" rel="noopener noreferrer">
                            <div className="sv-card" style={{ backgroundImage: 'url(/assets/Icon/Room.png)' }}></div>
                        </a>
                    </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceCard;
