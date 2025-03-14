import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Banner_slide.css';

// Import Banner Picture
import BannerSlide1 from '/src/Icon/BannerSlide1.png';
import BannerSlide2 from '/src/Icon/BannerSlide2.png';
import BannerSlide3 from '/src/Icon/BannerSlide3.png';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function App() {
  return (
    <div className="swiper-container">
      <Swiper
        spaceBetween={5}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="MySwiper-banner-slideeiei"
        speed={2000}
        effect="slide"
      >
        <SwiperSlide>
          <Link to="/pm" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="Bannerslide-pic">
              <img src={BannerSlide1} alt="BN1" />
            </div>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <div className="Bannerslide-pic">
            <img src={BannerSlide2} alt="BN2" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="Bannerslide-pic">
            <img src={BannerSlide3} alt="BN3" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
