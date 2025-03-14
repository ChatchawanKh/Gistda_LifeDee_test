import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CardData.css';
import moph_logo from '/src/Icon/moph_logo.png';
import gistda_logo from '/src/Icon/Gistda_LOGO.png';
import PcLogo from '/src/Icon/pc.png'
import MeteoLogo from '/src/Icon/meteo.png'
import Skeleton from '@mui/material/Skeleton';
import temp_icon from '/src/Icon/thermostat_icon.png';
import rainy_icon from '/src/Icon/rainy_icon.png';
import pm25_icon from '/src/Icon/pm25_icon.png';
import heat_icon from '/src/Icon/heat_icon.png';
import dengue_icon from '/src/Icon/dengue_icon.png';
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const CardData = () => {
    const [location, setLocation] = useState({ tb: '', ap: '', pv: '' });
    const [pm25, setPm25] = useState(null);
    const [updateTime, setUpdateTime] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [rainData, setRainData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                // Fetch PM2.5 data
                const pm25Response = await axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`);
                const pm25Data = pm25Response.data.data;
                const tb = pm25Data.loc.tb_tn;
                const ap = pm25Data.loc.ap_tn;
                const pv = pm25Data.loc.pv_tn;
                const pm25Value = pm25Data.pm25;
                const date = pm25Data.datetimeThai.dateThai;
                const time = pm25Data.datetimeThai.timeThai;
        
                setLocation({ tb, ap, pv });
                setPm25(pm25Value);
                setUpdateTime(`อัพเดทล่าสุด: ${date} ${time}`);
    
              // Fetch Weather data
              // await fetchWeatherData(pv);
              // await fetchRainData(pv);
    
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }, []); 

    const fetchWeatherData = async (province) => {
        try {
            const response = await fetch(`http://localhost:4000/api/weather?province=${province}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const temp = data.weather3Hour.dryBlubTemperature.toFixed(0)
            setWeatherData(temp)
            setLoading(false);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // const fetchRainData = async (province) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/api/weather?province=${province}`);
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         const rain = data[0].weatherForecast7Day.rainArea            
    //         setRainData(rain)
            

    //     } catch (error) {
    //         console.error('There was a problem with the fetch operation:', error);
    //         setError(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    

    const getPm25Color = (pm25) => {
        if (pm25 < 15) return '#2AB9C6'; // Very Good air quality
        if (pm25 <= 25) return '#06D001'; // Good
        if (pm25 <= 37.5) return '#FCC314'; // Medium
        if (pm25 <= 75) return '#F69021'; // Moderate
        return '#F34B2D'; // Unhealthy for sensitive group
    };

    const getPm25Level = (pm25) => {
        if (pm25 < 15) return 'ดีมาก'; // Very Good air quality
        if (pm25 <= 25) return 'ดี';
        if (pm25 <= 37.5) return 'ปานกลาง'; // Medium
        if (pm25 <= 75) return 'เริ่มมีผล'; // Moderate
        return 'มีผล'; // Unhealthy for sensitive group
    };

    const pm25Formatted = pm25 !== null ? pm25.toFixed(1) : null;
    const color = pm25Formatted !== null ? getPm25Color(pm25) : null;
    const level = pm25Formatted !== null ? getPm25Level(pm25) : null;

    return (
        <section className="CardData-container">
            <div className="container-card-data">

                <div className="CardData-head">
                    <h1>ระบบบริการข้อมูลด้านสุขภาพ</h1>
                    <div className="CardData-head-logo">
                        <img src={moph_logo} alt="MOPH logo" />
                        <img src={gistda_logo} alt="GISTDA logo" />
                        <img src={PcLogo} alt="pc" />
                        <img src={MeteoLogo} alt="meteo" />
                    </div>
                </div>

                <div className="CardData-items">

                    <Swiper
                        freeMode
                        className="mySwiper-card-data"
                        slidesPerView="auto"
                        spaceBetween={60}
                        mousewheel
                        pagination={{ clickable: true }}
                        modules={[Mousewheel]}
                    >
                        <SwiperSlide>
                            <div className="card-container-home location-card">
                                <div className="card-head-text">
                                    <h1>{location.tb || <Skeleton animation="wave" height="70px" />}</h1>
                                    <p>{location.ap} {location.pv}</p>
                                </div>
                                <div className="level-location">
                                    <div className="weather-temp">
                                        <img src={temp_icon} alt="temp_icon" />
                                        <h2>{weatherData}°C</h2>
                                    </div>
                                    <div className="weather-rain">
                                        <img src={rainy_icon} alt="rainy_icon" />
                                        <h2>{rainData}%</h2>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <Link to="/pm" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-container-home">
                                    <div className="card-text-data">
                                        <h1 className='header-pm'>PM2.5</h1>
                                        <p>ที่มา: Gistda</p>
                                        <span>{updateTime || <Skeleton animation="wave" height="10px" />}</span>
                                    </div>
                                    <div className="level">
                                        <div className="level-detail">
                                            <img src={pm25_icon} alt="pm25_icon" />
                                            <h2>{pm25Formatted || <Skeleton animation="wave" width="50px" height="60px" />}</h2>
                                            <p>µg/m<sup>3</sup></p>
                                        </div>
                                        <div className="pm-level" style={{ backgroundColor: color, borderRadius: '10px' }}>
                                            <h2>{level || <Skeleton animation="wave" width="100px" height="60px" />}</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>

                        <SwiperSlide>
                            <Link to="/hid" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-container-home">
                                    <div className="card-text-data">
                                        <h1 className='header-heat'>ดัชนีความร้อน</h1>
                                        <p>ที่มา: กรมอุตุนิยมวิทยา</p>
                                        <span>{updateTime || <Skeleton animation="wave" height="10px" />}</span>
                                    </div>
                                    <div className="level">
                                        <div className="level-detail">
                                            <img src={heat_icon} alt="heat_icon" />
                                            <h2>{weatherData}</h2>
                                            <p>°C</p>
                                        </div>
                                        <div className="pm-level" style={{ backgroundColor: color, borderRadius: '10px' }}>
                                            <h2>{level || <Skeleton animation="wave" width="100px" height="60px" />}</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>

                        <SwiperSlide>
                            <Link to="/dng" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-container-home">
                                    <div className="card-text-data">
                                        <h1 className='header-dengue'>โรคไข้เลือดออก</h1>
                                        <p>ที่มา: Gistda</p>
                                        <span>{updateTime || <Skeleton animation="wave" height="10px" />}</span>
                                    </div>
                                    <div className="level">
                                        <div className="level-detail">
                                            <img src={dengue_icon} alt="dengue_icon" />
                                            <h2>10</h2>
                                            <p>ราย</p>
                                        </div>
                                        <div className="pm-level" style={{ backgroundColor: color, borderRadius: '10px' }}>
                                            <h2>{level || <Skeleton animation="wave" width="100px" height="60px" />}</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CardData;
