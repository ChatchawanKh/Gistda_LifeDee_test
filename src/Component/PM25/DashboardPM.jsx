import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// import { BarChart } from '@mui/x-charts';
import { Autocomplete, TextField, CircularProgress, Box, InputAdornment, IconButton, Tooltip, Paper, Modal } from '@mui/material';

import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

// import MyLocationIcon from '@mui/icons-material/MyLocation';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import Card_dash_bg from '/src/Icon/Dashboard_card_HID_bg.png';
import ModalPM25 from '/src/Icon/pm25_level_modal.svg';
import PM25levelChart from '/src/Icon/PM25Level.png';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PlaceIcon from '@mui/icons-material/Place';

import { motion } from "framer-motion";

import "./DashboardPM.css";

export default function Dashboard({ openDashboard, toggleDashboard }) {
    //on loading
    const [loading, setLoading] = useState(true);
    const [loadingDataCard, setLoadingDataCard] = useState(true);

    //จัดเก็บตัวเลือกจังหวัด อำเภอ ตำบล
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    //จัดเก็บตัวเลือกที่ผู้ใช้งานเลือกแล้ว
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
    const [pv_name_th, setpv_name_th] = useState(null);
    const [ap_name_th, setap_name_th] = useState(null);
    const [tb_name_th, settb_name_th] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    //จัดเก็บข้อมูลคุณภาพอากาศ
    const [fetchingData, setFetchingData] = useState(false);
    const [graphData, setGraphData] = useState(null);

    const [pm25Avg24hr, setPm25Avg24hr] = useState(null);
    const [pm25perhr, setPm25perhr] = useState(null);
    const [pm25BGColor, setPm25BGColor] = useState(null);

    //จัดเก็บวันที่
    const [pm25DateUpdate, setpm25DateUpdate] = useState(null);
    const [pm10DateUpdate, setpm10DateUpdate] = useState(null);

    //จัดเก็บตำแหน่ง
    const [location, setLocation] = useState('');

    //จัดเก็บตำแหน่งที่แปลงจาก lat,lon to address
    const [locationData, setLocationData] = useState({
        province: '',
        district: '',
        subdistrict: '',
        provinceId: null,
        districtId: null,
        subdistrictId: null
    });

    const getLoc = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation(`${latitude}, ${longitude}`);
            }
        )
    };

    //แสดงผลข้อมูลตามตำแหน่งปัจจุบัน
    useEffect(() => {
        getLoc();
    }, []);

    useEffect(() => {
        if (location) {
            handleLocationInput(location);
        }
    }, [location]);

    useEffect(() => {
        if (locationData.provinceId && locationData.districtId && locationData.subdistrictId) {
            fetchGraphData();
            fetchPm25();
            pm10Search();
        }
    }, [locationData]);

    // ดึงจังหวัดมาเป็นตัวเลือก
    useEffect(() => {
        axios.get('https://pm25.gistda.or.th/rest/getPm25byProvince')
            .then(response => {
                const sortedProvinces = response.data.data
                    .map(p => ({ id: p.pv_idn, name_th: p.pv_tn}))
                    .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'));
                setProvinces(sortedProvinces);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
                setLoading(false);
            });
    }, []);

    // ดึงอำเภอ เมื่อเลือกจังหวัดแล้ว
    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byAmphoe?pv_idn=${selectedProvince.id}`)
                .then(response => {
                    const sortedDistricts = response.data.data
                        .map(d => ({ id: d.ap_idn, name_th: d.ap_tn}))
                        .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'));
                    setDistricts(sortedDistricts);

                    // Only reset selected district if it's no longer in the new list
                    if (selectedDistrict && !sortedDistricts.some(d => d.id === selectedDistrict.id)) {
                        setSelectedDistrict(null);
                        setSubdistricts([]);
                        setSelectedSubdistrict(null);
                    }
                })
                .catch(error => {
                    console.error('Error fetching districts:', error);
                    setDistricts([]);
                });
        } else {
            setDistricts([]);
            setSelectedDistrict(null);
            setSubdistricts([]);
            setSelectedSubdistrict(null);
        }
    }, [selectedProvince]);

    // ดึงตำบลเมื่อเลือกอำเภอ
    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byTambon?ap_idn=${selectedDistrict.id}`)
                .then(response => {
                    const sortedSubdistricts = response.data.data
                        .map(s => ({ id: s.tb_idn, name_th: s.tb_tn}))
                        .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'));
                    setSubdistricts(sortedSubdistricts);

                    // Only reset selected subdistrict if it's no longer in the new list
                    if (selectedSubdistrict && !sortedSubdistricts.some(s => s.id === selectedSubdistrict.id)) {
                        setSelectedSubdistrict(null);
                    }
                })
                .catch(error => {
                    console.error('Error fetching subdistricts:', error);
                    setSubdistricts([]);
                });
        } else {
            setSubdistricts([]);
            setSelectedSubdistrict(null);
        }
    }, [selectedDistrict]);

    // Get Address from lat,lon handleInput
    const handleLocationInput = (loc = location) => {
        const [lat, long] = loc.split(',').map(val => val.trim());
        if (lat && long) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${long}`)
                .then(response => {
                    const data = response.data.data.loc;
                    setLocationData({
                        province: data.pv_tn,
                        district: data.ap_tn,
                        subdistrict: data.tb_tn,
                        provinceId: data.pv_idn,
                        districtId: data.ap_idn,
                        subdistrictId: data.tb_idn
                    });

                    // Update selected values for autocomplete
                    setSelectedProvince({ id: data.pv_idn, name_th: data.pv_tn });
                    setSelectedDistrict({ id: data.ap_idn, name_th: data.ap_tn });
                    setSelectedSubdistrict({ id: data.tb_idn, name_th: data.tb_tn });
                    setLoadingDataCard(true);
                })

                .catch(error => {
                    console.error('Error fetching location data:', error);
                    setLocationData({
                        province: '',
                        district: '',
                        subdistrict: '',
                        provinceId: null,
                        districtId: null,
                        subdistrictId: null
                    });
                });
        }
    };

    // Handle Enter key press
    const handleKeyDown = (event) => {
        
        if (event.key === 'Enter') {
            handleLocationInput();
            setLoadingDataCard(true)
        }
    };

    // format date and time
    const formatDate = (date) => {
        const zonedDate = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
        const time = formatInTimeZone(date, 'UTC', 'HH:mm');
        const [year, month, day] = zonedDate.split(/[-]/);
        const thaiDate = `${day}/${month}/${parseInt(year) + 543} ${time} น.`;
    
        return thaiDate;
    };
    
    // // ฟังก์ชันแปลงเดือนเป็นภาษาไทย
    // const getThaiMonth = (month) => {
    //     const months = [
    //         '/01/', '/02/', '/03/', '/04/', '/05/', '/06/',
    //         '/07/', '/08/', '/09/', '/10/', '/11/', '/12/'
    //     ];
    //     return months[parseInt(month) - 1];
    // };
    
    const fetchGraphData = () => {
        setFetchingData(true);
        let url = '';

        if (selectedSubdistrict) {
            url = `https://pm25.gistda.or.th/rest/getPM25byTambon24hrs?tb_idn=${selectedSubdistrict.id}`;
        } else if (selectedDistrict) {
            url = `https://pm25.gistda.or.th/rest/getPM25byAmphoe24hrs?ap_idn=${selectedDistrict.id}`;
        } else if (selectedProvince) {
            url = `https://pm25.gistda.or.th/rest/getPM25byProvince24hrs?pv_idn=${selectedProvince.id}`;
        } else {
            setFetchingData(false);
            setGraphData(null);
            return;
        }

        axios.get(url)
            .then(response => {
                const data = response.data.graphHistory24hrs.map(d => {
                    const date = d[1];
                    return {
                        date: formatDate(date),
                        pm25: d[0].toFixed(2)
                    };
                });

                setGraphData({
                    categories: data.map(d => `${d.date}`),
                    series: [{
                        name: 'PM2.5',
                        data: data.map(d => ({
                            y: parseFloat(d.pm25),
                            color: getLevelPm25AvgColor(parseFloat(d.pm25))
                        }))
                    }]
                });
                setTimeout(() => {
                    setFetchingData(false);
                }, 1500);
            })
            .catch(error => {
                console.error('Error fetching graph data:', error);
                setGraphData(null);
                setFetchingData(false);
            });
    };
    
    const fetchPm25 = () => {
        if (selectedSubdistrict) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byTambon?ap_idn=${selectedDistrict.id}`)
                .then(response => {
                const data = response.data.data;
                const subdistrictData = data.find(item => item.tb_idn === selectedSubdistrict.id);
                const fetchpm25avg = subdistrictData.pm25Avg24hr;
                const fetchpm25perhr = subdistrictData.pm25;
                const date = formatDate(subdistrictData.dt);
        
                setpv_name_th(selectedProvince.name_th);
                setap_name_th(selectedDistrict.name_th);
                settb_name_th(selectedSubdistrict.name_th);
                setPm25Avg24hr(fetchpm25avg);
                setPm25perhr(fetchpm25perhr);
                setpm25DateUpdate(date);

                setTimeout(() => {
                    setLoadingDataCard(false);
                }, 1500); 
                })

                .catch(error => {
                console.error('Error fetching PM2.5 average data:', error);
                setPm25Avg24hr(null);
                });
        
            } else if (selectedDistrict) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byAmphoe?pv_idn=${selectedProvince.id}`)
                .then(response => {
                const data = response.data.data;
                const districtData = data.find(item => item.ap_idn === selectedDistrict.id);
                const date = formatDate(districtData.dt);
                
                setPm25Avg24hr(districtData.pm25Avg24hr);
                setPm25perhr(districtData.pm25);
                setpm25DateUpdate(date);
                setpv_name_th(selectedProvince.name_th);
                setap_name_th(selectedDistrict.name_th);
                settb_name_th(null);
                    
                setTimeout(() => {
                    setLoadingDataCard(false);
                }, 1500); 

                })
                .catch(error => {
                console.error('Error fetching PM2.5 average data:', error);
                setPm25Avg24hr(null);
                });
        
            } else if (selectedProvince) {
            axios.get(`https://pm25.gistda.or.th/rest/getPm25byProvince`)
                .then(response => {
                const data = response.data.data;
                const provinceData = data.find(item => item.pv_idn === selectedProvince.id);
                const date = formatDate(provinceData.dt);
        
                setPm25Avg24hr(provinceData.pm25Avg24hr);
                setPm25perhr(provinceData.pm25);
                setpm25DateUpdate(date);
                setpv_name_th(selectedProvince.name_th);
                setap_name_th(null);
                settb_name_th(null);

                setTimeout(() => {
                    setLoadingDataCard(false);
                }, 1500); 
                    
                })
                .catch(error => {
                console.error('Error fetching PM2.5 average data:', error);
                setPm25Avg24hr(null);
                });
        
            } else {
            setPm25Avg24hr(null);
            return;
            }
    };

    //Background of Data card//
    const getPm25Color = (pmvalue) => {
        if (pmvalue < 15) return '#80D9E1'; // Very Good air quality
        if (pmvalue <= 25) return '#C9E7A7'; // Good
        if (pmvalue <= 37.5) return '#FFE38D'; // Medium
        if (pmvalue <= 75) return '#FFD2A6'; // Moderate
        if (pmvalue > 75) return '#FF9D9D'; 
        return '#AEAEAE';
    };

    const getPm10Color = (pm10value) => {
        if (pm10value < 0) return '#AEAEAE';
        if (pm10value < 51) return '#80D9E1'; // Very Good air quality
        if (pm10value <= 80) return '#CFE6AE'; // Good
        if (pm10value <= 120) return '#FFE38D'; // Medium
        if (pm10value <= 180) return '#FFD2A6'; // Moderate
        if (pm10value > 180) return '#FF9D9D'; // Unhealthy for sensitive group
    };

    const getAQIColor = (AQIvalue) => {
        if (AQIvalue < 0) return '#AEAEAE';
        if (AQIvalue < 26) return '#80D9E1'; // Very Good air quality
        if (AQIvalue <= 50) return '#CFE6AE'; // Good
        if (AQIvalue <= 100) return '#FFE38D'; // Medium
        if (AQIvalue <= 200) return '#FFD2A6'; // Moderate
        if (AQIvalue > 200) return '#FF9D9D'; // Unhealthy
    };

    const getLevelPm25AvgColor = (pmvalue) => {
        if (pmvalue < 15) return '#01B2C4'; // Very Good air quality
        if (pmvalue <= 25) return '#7DA34C'; // Good
        if (pmvalue <= 37.5) return '#FFBC00'; // Medium
        if (pmvalue <= 75) return '#FF7F01'; // Moderate
        if (pmvalue > 75) return '#FF3B3B'; 
        return '#5C5C5C';
    };

    const getLevelPm10Color = (pm10value) => {
        if (pm10value < 0) return '#5C5C5C';
        if (pm10value < 51) return '#01B2C4'; // Very Good air quality
        if (pm10value <= 80) return '#7DA34C'; // Good
        if (pm10value <= 120) return '#FFBC00'; // Medium
        if (pm10value <= 180) return '#FF7F01'; // Moderate
        if (pm10value > 180) return '#FF3B3B'; // Unhealthy for sensitive group
    };
    const getLevelAQIColor = (AQIvalue) => {
        if (AQIvalue < 0) return '#5C5C5C';
        if (AQIvalue < 26) return '#01B2C4'; // Very Good air quality
        if (AQIvalue <= 50) return '#7DA34C'; // Good
        if (AQIvalue <= 100) return '#FFBC00'; // Medium
        if (AQIvalue <= 200) return '#FF7F01'; // Moderate
        if (AQIvalue > 200) return '#FF3B3B'; // Unhealthy
    };

    const getPm25Level = (pmvalue) => {
        if (pmvalue < 15) return 'คุณภาพอากาศดีมากเหมาะสำหรับกิจกรรมกลางแจ้ง และการท่องเที่ยว';
        if (pmvalue <= 25) return 'คุณภาพอากาศดีเหมาะสำหรับกิจกรรมกลางแจ้ง และการท่องเที่ยว';
        if (pmvalue <= 37.5) return 'คุณภาพอากาศปานกลาง ลดระยะเวลาการทำกิจกรรมหรือการออกกำลังกายกลางแจ้งที่ใช้แรงมาก '; 
        if (pmvalue <= 75) return 'คุณภาพอากาศเริ่มมีผลต่อสุขภาพ ควรใช้อุปกรณ์ป้องกันตนเอง เช่น หน้ากากป้องกัน PM2.5 ทุกครั้งที่ออกนอกอาคาร';
        if (pmvalue > 75) return 'คุณภาพอากาศมีผลต่อสุขภาพ ประชาชนทุกคนควรงดกิจกรรมกลางแจ้ง'; 
        return 'ไม่มีข้อมูลให้บริการในขณะนี้ ขออภัยในความไม่สะดวก';
    };

    const pm25avgFormatted = pm25Avg24hr !== null ? pm25Avg24hr.toFixed(2) : null;
    const pm25perhrFormatted = pm25perhr !== null ? pm25perhr.toFixed(2) : null;
    const bg_pm25avg_color = pm25avgFormatted !== null ? getPm25Color(pm25Avg24hr) : null;
    const bg_pm25perhr_color = pm25perhrFormatted !== null ? getPm25Color(pm25perhrFormatted) : null;

    //level description and color//
    const level_pm25avg = pm25avgFormatted!== null? getPm25Level(pm25avgFormatted) : null;
    const level_pm25avg_color = pm25avgFormatted!== null? getLevelPm25AvgColor(pm25avgFormatted) : null;
    const level_pm25perhr_color = pm25perhrFormatted!== null? getLevelPm25AvgColor(pm25perhrFormatted) : null;

    const [pm10, setPm10] = useState(null);
    const [aqi, setAQI] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [stationName, setStation] = useState(null);

    const aqi_nb = Number(aqi);
    const pm10_nb = Number(pm10);

    const bg_pm10_color = pm10_nb !== null ? getPm10Color(pm10_nb) : null;
    const bg_aqi_color = aqi_nb !== null ? getAQIColor(aqi_nb) : null;
    const level_pm10_color = pm10_nb!== null? getLevelPm10Color(pm10_nb) : null;
    const level_AQI_color = aqi_nb!== null? getLevelAQIColor(aqi_nb) : null;
    

    const getDistance = (pointA, pointB) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (pointB.latitude - pointA.latitude) * (Math.PI / 180);
        const dLon = (pointB.longitude - pointA.longitude) * (Math.PI / 180);
        const lat1 = pointA.latitude * (Math.PI / 180);
        const lat2 = pointB.latitude * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    const getCoordinates = async () => {
        try {
            const parts = [
                selectedSubdistrict?.name_th,
                selectedDistrict?.name_th,
                selectedProvince?.name_th,
            ];
            const address = parts.filter(part => part).join(' ');

            if (!address) {
                throw new Error('Address is required to perform the search');
            }

            const sphereSearch = `https://api.sphere.gistda.or.th/services/search/search?keyword=${encodeURIComponent(address)}&limit=1&showdistance=true&key=test2022`;
            const response = await axios.get(sphereSearch);

            if (response.data && response.data.data && response.data.data.length > 0) {
                const locationGeo = response.data.data[0];
                return {
                    lat: parseFloat(locationGeo.lat),
                    lon: parseFloat(locationGeo.lon),
                };
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            setErrorMessage('ไม่สามารถดึงค่าละติจูดและลองจิจูดได้');
            console.error(error);
            throw error;
        }
    };

    const pm10Search = async () => {
        try {
            setErrorMessage('');
            setPm10(null);
            setAQI(null);
            setStation(null);

            const { lat, lon } = await getCoordinates();
            const response = await axios.get("http://localhost:4000/getAQI");
            const stations = response.data.stations;

            let nearestStation = null;
            let nearestDistance = Infinity;

            stations.forEach(station => {
                if (station.lat !== undefined && station.long !== undefined) {
                    const distance = getDistance(
                        { latitude: lat, longitude: lon },
                        { latitude: station.lat, longitude: station.long }
                    );

                    if (distance <= 50) {
                        if (distance < nearestDistance) {
                            nearestDistance = distance;
                            nearestStation = station;
                        }
                    }
                }
            });

            if (nearestStation) {
                if (nearestStation.AQILast && nearestStation.AQILast.PM10 && nearestStation.AQILast.AQI) {
                    const aqiValue = nearestStation.AQILast.AQI.aqi;
                    const pm10Value = nearestStation.AQILast.PM10.value;
                    const date = nearestStation.AQILast.date;
                    const time = nearestStation.AQILast.time;
                    const formattedDate = `${date} ${time}`;
                    const formattedDateTime = formatDate(formattedDate)

                        setPm10(pm10Value);
                        setAQI(aqiValue);
                        setpm10DateUpdate(formattedDateTime);
                        setStation(nearestStation.nameTH);

                        setTimeout(() => {
                            setLoadingDataCard(false);
                        }, 1500); 
                
                } else {
                    setErrorMessage('ไม่พบข้อมูล');
                    setPm10('ไม่มีข้อมูล');
                    setAQI('ไม่มีข้อมูล');
                    setStation('ไม่มีข้อมูล');
                }
            } else {
                setErrorMessage('ไม่มีสถานีที่อยู่ใกล้เคียง');
                setPm10('ไม่มีข้อมูล');
                setAQI('ไม่มีข้อมูล');
                setStation('ไม่มีสถานีที่อยู่ใกล้เคียง');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('ไม่สามารถดึงข้อมูล PM10 และ AQI ได้');
            setPm10('ไม่มีข้อมูล');
            setAQI('ไม่มีข้อมูล');
            setStation('ไม่มีสถานีที่อยู่ใกล้เคียง');
        }
    };

    const variants = {
        hidden: { x: '-100vw', transition: { type: 'tween', duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } },
        visible: { x: 0, transition: { type: 'tween', duration: 1.0, ease: [0.25, 0.1, 0.25, 1] } }
    };
    
    const [openModalHID, setModalHIDOpen] = React.useState(false);
    const handleOpenModalHID = () => setModalHIDOpen(true);
    const handleCloseModalHID = () => setModalHIDOpen(false);

    const [isFocused, setIsFocused] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 6000); // แสดงผลเป็นเวลา 5 วินาที

        return () => clearTimeout(timer); // เคลียร์ timer เมื่อ component ถูกทำลาย
    }, []);

    return (
        <>  
            <div className="open-dashboard-btn">
                <Tooltip
                    title="Dashboard" 
                    placement="right" 
                    arrow
                    classes={{ tooltip: 'open-dashboard-PM-tooltip' }}
                >
                    <IconButton
                        className='OpenDashboard-PM'
                        onClick={toggleDashboard}
                        sx={{
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            width: '60px',
                            height: '60px',
                            '&:hover': {
                                '& .MuiSvgIcon-root': {
                                    transform: 'scale(1.2)',
                                }
                            }
                        }}
                    >
                        <SpaceDashboardIcon className='openDashboard-PM' />
                    </IconButton>
                </Tooltip>
            </div>

            <div className={`dashboard-tutorial ${isVisible ? 'visible' : 'hidden'}`} >
                <ArrowBackIosNewRoundedIcon sx={{color:'#ffffff', paddingRight:'5px'}}/>
                <h1>กดปุ่มเพื่อแสดงข้อมูล</h1>
            </div>

            <Modal
                open={openModalHID}
                onClose={handleCloseModalHID}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#FFFFFF',
                        boxShadow: 15,
                        borderRadius: 5,
                        p: 0,
                        overflow: 'hidden',
                    }}
                >
                    <IconButton 
                        onClick={handleCloseModalHID} 
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#303C46',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img 
                        src={ModalPM25} 
                        alt="PM2.5 Details" 
                        style={{
                            display: 'block',
                            width: '100%', 
                            borderRadius: '5px',
                        }}
                    />
                </Box>
            </Modal>


                <motion.div
                    initial={openDashboard ? "visible" : "hidden"}
                    animate={openDashboard ? "visible" : "hidden"}
                    exit="hidden"
                    variants={variants}
                    className="Dashboard"
                >
                    <div className="Dashboard-container">
                        <motion.div className="Dashboard-card-data" 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.8,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}>
                                <div style={{ color: level_pm25avg_color }}>
                                    {loadingDataCard ? (
                                        <>
                                            <Skeleton animation="wave" width={300} height={40} />
                                            <Skeleton animation="wave" width={250} height={30} />
                                        </>
                                    ) : (
                                        <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0,
                                            ease: [0, 0.71, 0.2, 1.01],
                                        }}
                                        style={{
                                            fontFamily: 'Prompt',
                                            fontStyle: 'normal',
                                            fontWeight: 700,
                                            fontSize: '18px',
                                            zIndex: 1,
                                            margin: 0,
                                            padding: '20px',
                                            textAlign: 'center'
                                        }}
                                        >
                                        {level_pm25avg}
                                        </motion.div>
                                    )}
                                </div>
                            <div className="card-swipe-detail">
                                <Swiper
                                    freeMode={true}
                                    className="my-custom-swiper"
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    pagination={{ dynamicBullets: true }}
                                    modules={[Pagination]}
                                    style={{ "--swiper-pagination-color": "#FFFFFF" }}
                                >
                                    <SwiperSlide>
                                        <div className="pm25-1day-card" style={{ backgroundColor: bg_pm25avg_color }}>
                                            <div className="pm25-1day-card-data">
                                                <div style={{zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <>
                                                            <Skeleton animation="wave" width={200} height={20} />
                                                            <Skeleton animation="wave" width={180} height={20} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{
                                                                    duration: 0.8,
                                                                    delay: 0.5,
                                                                    ease: [0, 0.71, 0.2, 1.01]
                                                                }}
                                                                style={{
                                                                    fontFamily: 'Prompt',
                                                                    fontStyle: 'normal',
                                                                    fontWeight: 500,
                                                                    fontSize: '16px',
                                                                    lineHeight: '20px',
                                                                    color: '#303c46',
                                                                    zIndex: 1,
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {`${tb_name_th || ""} ${ap_name_th || ""} ${pv_name_th || ""}`}
                                                            <br />
                                                                PM2.5 (เฉลี่ย 24 ชั่วโมง)
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={100} height={60} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.0,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                marginTop:'10px'
                                                            }}
                                                        >
                                                            <h1 style={{ color: level_pm25avg_color, padding: "0", margin:"0" , lineHeight: '100%'}}>
                                                                {pm25avgFormatted || "ไม่มีข้อมูล"}
                                                            </h1>
                                                            {pm25avgFormatted === null ? '' : <span style={{ fontSize: '16px',fontWeight: '400', marginLeft: '10px', color:'303c46', padding:'0',marginBottom: '10px' }}>
                                                                µg/m³
                                                            </span>}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={80} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 5,
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {`อัพเดตเมื่อ ${pm25DateUpdate}`}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <img src={Card_dash_bg} alt="BG_card" />
                                                <InfoIcon style={{ position: 'absolute', top: '10px', right: '10px', color: '#2196F3',zIndex:'50' }} onClick={handleOpenModalHID} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="pm25-1hr-card" style={{ backgroundColor: bg_pm25perhr_color }}>
                                            <div className="pm25-1hr-card-data">
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <>
                                                            <Skeleton animation="wave" width={200} height={20} />
                                                            <Skeleton animation="wave" width={180} height={20} />
                                                        </>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 0.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '16px',
                                                                lineHeight: '20px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 0,
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {`${tb_name_th || ""} ${ap_name_th || ""} ${pv_name_th || ""}`}
                                                            <br />
                                                                PM2.5 (รายชั่วโมง)
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={100} height={60} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.0,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                marginTop:'10px'
                                                            }}
                                                        >
                                                            <h1 style={{ color: level_pm25perhr_color, padding: "0", margin:"0" , lineHeight: '100%'}}>
                                                                {pm25perhrFormatted || "ไม่มีข้อมูล"}
                                                            </h1>
                                                            {pm25avgFormatted === null ? '' : <span style={{ fontSize: '16px',fontWeight: '400', marginLeft: '10px', color:'303c46', padding:'0',marginBottom: '10px' }}>
                                                                µg/m³
                                                            </span>}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={80} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 5,
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {`อัพเดตเมื่อ ${pm25DateUpdate}` }
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <img src={Card_dash_bg} alt="BG_card" />
                                                <InfoIcon style={{ position: 'absolute', top: '10px', right: '10px', color: '#2196F3' }} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="pm10-1hr-card" style={{backgroundColor: bg_pm10_color}}>
                                            <div className="pm10-1hr-card-data">
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <>
                                                            <Skeleton animation="wave" width={200} height={20} />
                                                            <Skeleton animation="wave" width={180} height={20} />
                                                        </>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 0.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '16px',
                                                                lineHeight: '20px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 0,
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {stationName}
                                                            <br />
                                                            PM 10 (รายชั่วโมง)
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={100} height={60} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.0,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                marginTop:'10px'
                                                            }}
                                                        >
                                                            <h1 style={{ color: level_pm10_color, padding: "0", margin:"0" , lineHeight: '100%'}}>
                                                                {pm10 === "-1" ? 'ไม่มีข้อมูล' : pm10}
                                                            </h1>
                                                            {pm10 === "-1" || pm10 === null ? '' : 
                                                                <span style={{ fontSize: '16px', fontWeight: '400', marginLeft: '10px', marginBottom: '10px', color: '#303c46' }}>
                                                                    µg/m³
                                                                </span>
                                                            }
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={80} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 10,
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {`อัพเดตเมื่อ ${pm10DateUpdate || "ไม่มีข้อมูล"}`}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <img src={Card_dash_bg} alt="BG_card" />
                                                <InfoIcon style={{ position: 'absolute', top: '10px', right: '10px', color: '#2196F3' }} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="aqi-card" style={{backgroundColor: bg_aqi_color}}>
                                            <div className="aqi-card-data">
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <>
                                                            <Skeleton animation="wave" width={200} height={20} />
                                                            <Skeleton animation="wave" width={180} height={20} />
                                                        </>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 0.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '16px',
                                                                lineHeight: '20px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 0,
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {stationName}
                                                            <br />
                                                            AQI (รายชั่วโมง)
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={100} height={60} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.0,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                 marginTop:'10px'
                                                            }}
                                                        >
                                                            <h1 style={{ color: level_AQI_color, padding: "0", margin:"0" , lineHeight: '100%'}}>
                                                                {aqi === "-1" ? 'ไม่มีข้อมูล' : aqi}
                                                            </h1>
                                                            
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div style={{ zIndex:1}}>
                                                    {loadingDataCard ? (
                                                        <Skeleton animation="wave" width={80} />
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 1.5,
                                                                ease: [0, 0.71, 0.2, 1.01]
                                                            }}
                                                            style={{
                                                                fontFamily: 'Prompt',
                                                                fontStyle: 'normal',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                color: '#303c46',
                                                                zIndex: 1,
                                                                margin: 0,
                                                                padding: 10,
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {`อัพเดตเมื่อ ${pm10DateUpdate|| "ไม่มีข้อมูล"}`}
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <img src={Card_dash_bg} alt="BG_card" />
                                                <InfoIcon style={{ position: 'absolute', top: '10px', right: '10px', color: '#2196F3' }} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </motion.div>

                        <motion.div className="Dashboard-sortbylocation-date" initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 1.8,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}>
                            <div className="Dashboard-sortbylocation-date-head">
                                <h1>ข้อมูล PM2.5 ย้อนหลัง</h1>
                            </div>

                            <div className="Dashboard-sortby">
                                <div className="Dashboard-sortbylocation">
                                    <Box sx={{ maxWidth: 600, mx: 'auto'}}>
                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <>
                                            <div className="input_by_lat_long">
                                                <p>ค้นหาโดยใช้พิกัด</p>
                                                <TextField
                                                    label="พิกัดละติจูด, ลองจิจูด"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    onFocus={() => setIsFocused(true)}  // Set focus state
                                                    onBlur={() => setIsFocused(false)}  // Remove focus state
                                                    onKeyDown={handleKeyDown} // Added event handler
                                                    sx={{ width: '259px', mb: 1 }}
                                                    InputProps={{
                                                    style: { fontFamily: 'Prompt', color: isFocused ? 'black' : location ? '#9e9e9e' : 'black',},
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                        <Tooltip
                                                            title="ล้างข้อมูล"
                                                            arrow
                                                            componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                color: 'black',
                                                                bgcolor: 'white',
                                                                fontFamily: 'Prompt',
                                                                '& .MuiTooltip-arrow': {
                                                                    color: 'white',
                                                                },
                                                                },
                                                            },
                                                            }}
                                                        >
                                                            <IconButton onClick={() => setLocation('')} edge="end">
                                                            <ClearIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title="ค้นหาพิกัดของฉัน"
                                                            arrow
                                                            componentsProps={{
                                                            tooltip: {
                                                                sx: {
                                                                color: 'black',
                                                                bgcolor: 'white',
                                                                fontFamily: 'Prompt',
                                                                '& .MuiTooltip-arrow': {
                                                                    color: 'white',
                                                                },
                                                                },
                                                            },
                                                            }}
                                                        >
                                                            <IconButton onClick={getLoc} edge="end">
                                                            <PlaceIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        </InputAdornment>
                                                    ),
                                                    }}
                                                    InputLabelProps={{
                                                    style: { fontFamily: 'Prompt' },
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleLocationInput(location)}
                                                    sx={{
                                                    fontFamily: 'Prompt',
                                                    width: '100%',
                                                    mb: 1,
                                                    backgroundColor: '#4B87E3',
                                                    '&:hover': {
                                                        backgroundColor: '#3665AD',
                                                    },
                                                    }}
                                                >
                                                    ค้นหา
                                                </Button>
                                            </div>

                                            <div className="input-by-pv-ap-tb">
                                                <p>หรือ</p>
                                                <p>ค้นหาด้วยชื่อ จังหวัด อำเภอ ตำบล</p>
                                                <Autocomplete
                                                    value={selectedProvince}
                                                    onChange={(event, newValue) => {
                                                        setSelectedProvince(newValue);
                                                        // Clear the district and subdistrict selections
                                                        setSelectedDistrict(null);
                                                        setSelectedSubdistrict(null);
                                                    }}
                                                    options={provinces}
                                                    getOptionLabel={(option) => option.name_th}
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="จังหวัด"
                                                            sx={{ width: '259px', mb: 2 }}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                style: { fontFamily: 'Prompt' }, // Style for the input text
                                                            }}
                                                            InputLabelProps={{
                                                                style: { fontFamily: 'Prompt' } // Style for the label text
                                                            }}
                                                        />
                                                    )}
                                                />

                                                <Autocomplete
                                                    value={selectedDistrict}
                                                    onChange={(event, newValue) => {
                                                        setSelectedDistrict(newValue);
                                                        // Clear the subdistrict selection if not present in new data
                                                        if (newValue) {
                                                            setSelectedSubdistrict(null);
                                                        }
                                                    }}
                                                    options={districts}
                                                    getOptionLabel={(option) => option.name_th}
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="อำเภอ"
                                                            sx={{ width: '259px', mb: 2 }}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                style: { fontFamily: 'Prompt' }, // Style for the input text
                                                            }}
                                                            InputLabelProps={{
                                                                style: { fontFamily: 'Prompt' } // Style for the label text
                                                            }}
                                                        />
                                                    )}
                                                    disabled={!selectedProvince}
                                                />

                                                <Autocomplete
                                                    value={selectedSubdistrict}
                                                    onChange={(event, newValue) => {
                                                        setSelectedSubdistrict(newValue);
                                                    }}
                                                    options={subdistricts}
                                                    getOptionLabel={(option) => option.name_th}
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="ตำบล"
                                                            sx={{ width: '259px' , mb: 2}}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                style: { fontFamily: 'Prompt' }, // Style for the input text
                                                            }}
                                                            InputLabelProps={{
                                                                style: { fontFamily: 'Prompt' } // Style for the label text
                                                            }}
                                                        />
                                                    )}
                                                    disabled={!selectedDistrict}
                                                />
                                            </div>
                                            </>
                                        )}
                                    </Box>
                                </div>
                            </div>

                            <Button sx={{ fontFamily: 'Prompt', backgroundColor:'#4B87E3',
                                    '&:hover':{
                                    backgroundColor:'#3665AD',},
                            }} variant="contained" onClick={() => {fetchGraphData(); fetchPm25(); pm10Search(); setLoadingDataCard(true)}}  disabled={fetchingData || (!selectedProvince)}>แสดงกราฟ</Button>

                        </motion.div>

                        <motion.div className="Dashboard-graph" initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 1.5,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}>
                            {fetchingData ? (
                                <div className="onLoadingGraph">
                                    <CircularProgress /> <p>กำลังค้นหาข้อมูล...</p>
                                </div>
                            ) : graphData ? (
                                <>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={{
                                            chart: {
                                            type: 'column',
                                            backgroundColor: 'transparent',
                                            style: {
                                                fontFamily: 'Prompt, sans-serif',
                                            },
                                            zoomType: 'x',
                                            events: {
                                                load: function () {
                                                const xAxis = this.xAxis[0];
                                                const maxIndex = xAxis.max || graphData.categories.length - 1; // ดัชนีสุดท้ายของข้อมูล
                                                const minIndex = Math.max(0, maxIndex - 4); // ดัชนีของข้อมูล 5 ชุดล่าสุด
                                                xAxis.setExtremes(minIndex, maxIndex); // ซูมไปที่ข้อมูล 5 ชุดล่าสุด
                                                },
                                            },
                                            },
                                            title: {
                                            text: `ข้อมูล PM2.5 ย้อนหลัง ณ ${tb_name_th ? `${tb_name_th} ` : ''}${ap_name_th ? `${ap_name_th} ` : ''}${pv_name_th ? `${pv_name_th}` : ''}`,
                                            style: {
                                                fontSize: '18px',
                                                fontFamily: 'Prompt, sans-serif',
                                            },
                                            },
                                            xAxis: {
                                            categories: graphData.categories,
                                            title: {
                                                style: {
                                                fontFamily: 'Prompt, sans-serif',
                                                },
                                            },
                                            labels: {
                                                style: {
                                                fontSize: '10px',
                                                },
                                            },
                                            scrollbar: {
                                                enabled: true,
                                            },
                                            },
                                            yAxis: {
                                            title: {
                                                text: 'PM2.5 µg/m³',
                                                style: {
                                                fontSize: '12px',
                                                fontFamily: 'Prompt, sans-serif',
                                                },
                                            },
                                            },
                                            series: graphData.series,
                                            credits: {
                                            enabled: false,
                                            },
                                            plotOptions: {
                                            column: {
                                                borderWidth: 0,
                                                dataLabels: {
                                                enabled: true,
                                                style: {
                                                    fontSize: '10px',
                                                    fontFamily: 'Prompt, sans-serif',
                                                },
                                                },
                                            },
                                            },
                                            legend: {
                                            enabled: false,
                                            },
                                        }}
                                        />
                                    <div className='level-pm-pic'>
                                        <img src={PM25levelChart} alt="level" />
                                        <li>กดค้างแล้วลากบริเวณกราฟ เพื่อย่อ/ขยายกราฟ</li>
                                    </div>
                                </>
                            ) : (
                                <h1>กรุณาเลือกพื้นที่ที่ต้องการ</h1>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
        </>
    );
}
