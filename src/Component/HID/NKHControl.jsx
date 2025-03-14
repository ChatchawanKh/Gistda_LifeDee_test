import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Box, Typography, Chip, Stack } from '@mui/material';

import MediaCard from '../Card_hid'

//LEGENDS
import HIDSatLegend from '/src/Icon/legend/HID_Sat_Legend.png';

//ICON
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
// import zIndex from "@mui/material/styles/zIndex";
//weather icon
import { renderToString } from 'react-dom/server';
import noRain from '../../weather/0_no_rain.svg';
import lightRain from '../../weather/1_light_rain.svg';
import moderateRain from '../../weather/2_moderate_rain.svg';
import heavyRain from '../../weather/3_heavy_rain.svg';
import veryHeavyRain from '../../weather/4_very_heavy.svg';

import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';

import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

const NKHControl = React.forwardRef((props, ref) => {
    const theme = useTheme();
    const { sphereMapRef, dataInf } = props;
    const [activeStep, setActiveStep] = useState(0);
    const [currentLayerType, setCurrentLayerType] = useState('AOD443');
    const totalSteps = 8;
    const [activeButton, setActiveButton] = useState('AOD443');

    const intervalRef = useRef(null);

    const map = sphereMapRef.current;

    const [dataInfo, setDataInfo] = useState('');

    useEffect(() => {
        if (dataInf) {
            dataInf(dataInfo);
        }
    }, [dataInfo, dataInf]);



    const createLayer = (name) => {
        return new window.sphere.Layer(
            name,
            {
                type: window.sphere.LayerType.WMS,
                url: 'https://pollution-app-33s3yn5pmq-as.a.run.app/mapservice/geoserver/airpollution/wms',
                format: 'image/png',
                transparent: 'true',
                zoomRange: { min: 1, max: 15 },
                zIndex: 5,
                opacity: 0.75,
            }
        );
    };

    const handleAODClick = () => {
        setCurrentLayerType('AOD443');
        updateLayer('AOD443', activeStep);
        setActiveButton('AOD443');
        const satLegend = document.getElementById("legend");
                            if (satLegend) {
                              satLegend.src = HIDSatLegend;
                              satLegend.style.width = "355px";
                              satLegend.style.position = "relative";
                              satLegend.style.top = "0";
                              satLegend.style.left = "0";
                              satLegend.style.right = "1rem";
                              satLegend.style.zIndex = "10";
                            }

        const getLoc = () => {
            const controller = new AbortController();
            const signal = controller.signal;
  
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
  
                axios
                  .get(
                    `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`,
                    { signal }
                  )
                  .then((response) => {
                    const data = response.data.data;
                    const tb = data.loc["tb_tn"];
                    const ap = data.loc["ap_tn"];
                    const pv = data.loc["pv_tn"];
                    const pm25 = data["pm25"];
                    // console.log(pv);
  
                    //fetch APi from Proxy.js//
                    function fetchTemp() {
                      const culture = "th-TH";
                      fetch(
                        `https://172.27.173.43:4000/3Hour?FilterText=${pv}&Culture=${culture}`
                      )
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error(
                              "Network response was not ok " + response.statusText
                            );
                          }
                          return response.json();
                        })
                        .then((data) => {
                          const dryBlubTemperature =
                            data.weather3Hour.dryBlubTemperature;
                          const temp = dryBlubTemperature.toFixed(0);
                          const rainFall = data.weather3Hour.rainfall;
                          // const rainFall = 60
  
                          // const tempIcon = renderToString(
                          //     <DeviceThermostatIcon
                          //     style={{
                          //         color: '#87c9ff',
                          //         width: '18px',
                          //         verticalAlign: 'middle',
                          //         top: '-0.5px'
                          //     }}
                          //     />
                          // );
  
                          //rainfall icon
                          let rainValue;
                          let rainfallIcon;
                          let rainText;
                          let mm;
                          if (rainFall < 0.1) {
                            rainfallIcon = noRain;
                            rainText = "ไม่มีฝนตก";
                            rainValue = "";
                            mm = "";
                          } else if (rainFall <= 10) {
                            rainfallIcon = lightRain;
                            rainText = "ฝนตก";
                            mm = "มม.";
                          } else if (rainFall <= 35) {
                            rainfallIcon = moderateRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          } else if (rainFall <= 90) {
                            rainfallIcon = heavyRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          } else {
                            rainfallIcon = veryHeavyRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          }
                          //rainfall icon
  
                          const weatherElement =
                            document.getElementById("weather");
                          weatherElement.innerHTML = `
                          <img style="width: 30px; vertical-align: middle;" src="${rainfallIcon}" 
                          alt="Rainfall Icon" /><span style="color: #a6a4a4; font-size: 16px;" >${temp} °C </span>`;
                          const rain = document.getElementById("rainfall");
                          rain.innerHTML = `<span style="font-size: 16px; color: #a6a4a4;"> ${rainText} ${rainValue} ${mm}</span>`;
                          // weatherElement.style.display = 'box';
                          // weatherElement.style.alignItems = 'center';
                          // <span style="font-size: 12px; font-weight: 500;">สภาพอากาศวันนี้</span>
                        })
                        .catch((error) => {
                          console.error(
                            "There has been a problem with your fetch operation:",
                            error
                          );
                        });
                    }
                    fetchTemp();
  
                    function fetchRain() {
                      const culture = "th-TH";
                      fetch(
                        `https://172.27.173.43:4000/7Day?FilterText=${pv}&Culture=${culture}`
                      )
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error(
                              "Network response was not ok " + response.statusText
                            );
                          }
                          return response.json();
                        })
                        .then((data) => {
                          const forecastData = data[0];
  
                          if (forecastData && forecastData.weatherForecast7Day) {
                            const weatherForecast =
                              forecastData.weatherForecast7Day;
                            const rainArea = weatherForecast.rainArea;
                            const windSpeed = weatherForecast.windSpeed;
                            const windDir = weatherForecast.windDirection;
  
                            const windDirDeg = renderToString(
                              <NavigationRoundedIcon
                                style={{
                                  color: "#758CA3",
                                  width: 18,
                                  verticalAlign: "middle",
                                  transform: `rotate(${windDir}deg)`,
                                }}
                              />
                            );
  
                            const waterDrop = renderToString(
                              <WaterDropRoundedIcon
                                style={{
                                  color: "#56c8f5",
                                  width: 18,
                                  verticalAlign: "middle",
                                }}
                              />
                            );
  
                            document.getElementById("rainPer").innerHTML =
                              `<span style="font-size: 16px; color: #a6a4a4;">${waterDrop} ${rainArea}% ของพื้นที่</span>`;
                            document.getElementById("wind").innerHTML =
                              `<span style="font-size: 16px; color: #a6a4a4;"> ${windDirDeg} ${windSpeed} กม./ชม.</span>`;
                          } else {
                            console.error(
                              "ค่าพยากรณ์อากาศไม่พร้อมใช้งาน ณ ขณะนี้"
                            );
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "There has been a problem with your fetch operation:",
                            error
                          );
                        });
                    }
                    fetchRain();
                    //fetch APi from Proxy.js//
  
                    const date = data.datetimeThai["dateThai"];
                    const time = data.datetimeThai["timeThai"];
  
                    // Update DOM elements
                    const locationElement = document.getElementById("location");
                    const updateElement = document.getElementById("update");
                    const titleElement = document.getElementById("title");
                    // const valueElement = document.getElementById("value");
                    const levelElement = document.getElementById("level");
  
                    locationElement.innerHTML = `${tb} ${ap} ${pv}`;
                    updateElement.innerHTML = `อัพเดทล่าสุด ${date} ${time}`;
  
                    // เกณฑ์ Sat HID NIGHT
                    let color;
                    let level;
                    if (pm25 < 0.005) {
                      color = "#1A9640";
                      level = "เกณฑ์ดีมาก";
                    } else if (pm25 > 0.005 && pm25 < 0.01) {
                      color = "#8ACC62";
                      level = "เกณฑ์ดี";
                    } else if (pm25 > 0.01 && pm25 < 0.015) {
                      color = "#DAF09E";
                      level = "เกณฑ์ปานกลาง";
                    } else if (pm25 > 0.015 && pm25 < 0.02) {
                      color = "#FDDF99";
                      level = "ร้อน";
                    } else if (pm25 > 0.02 && pm25 < 0.021) {
                        color = "#F49052";
                        level = "ร้อนมาก";
                      }else {
                      color = "#EB4E47";
                      level = "อันตราย";
                    }
                    const pm25Formatted = pm25 % 1 === 0 ? pm25 : pm25.toFixed(1);
                            titleElement.innerHTML = `<span style="font-size: 14px; font-weight: 500;">RCP 4.5 : GISTDA</span></br> `
                            const sat_UHIValue = document.getElementById('value');
                            sat_UHIValue.innerHTML = `
                    <span style="color: ${color};">
                        ${pm25Formatted}
                    </span>
                                `;
                  levelElement.innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`;

                            // Additional logic for other API calls or updates
                        })
                        .catch(error => console.error('Error fetching PM2.5 data:', error));
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        };

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        getLoc();
        intervalRef.current = setInterval(getLoc, 5000);
    };

    const handleO3Click = () => {
        setCurrentLayerType('O3Total');
        updateLayer('O3Total', activeStep);
        setActiveButton('O3Total');
        const satLegend = document.getElementById("legend");
                            if (satLegend) {
                              satLegend.src = HIDSatLegend;
                              satLegend.style.width = "355px";
                              satLegend.style.position = "relative";
                              satLegend.style.top = "0";
                              satLegend.style.left = "0";
                              satLegend.style.right = "1rem";
                              satLegend.style.zIndex = "10";
                            }

        const getLoc = () => {
            const controller = new AbortController();
            const signal = controller.signal;
  
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
  
                axios
                  .get(
                    `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`,
                    { signal }
                  )
                  .then((response) => {
                    const data = response.data.data;
                    const tb = data.loc["tb_tn"];
                    const ap = data.loc["ap_tn"];
                    const pv = data.loc["pv_tn"];
                    const pm25 = data["pm25"];
                    // console.log(pv);
  
                    //fetch APi from Proxy.js//
                    function fetchTemp() {
                      const culture = "th-TH";
                      fetch(
                        `https://172.27.173.43:4000/3Hour?FilterText=${pv}&Culture=${culture}`
                      )
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error(
                              "Network response was not ok " + response.statusText
                            );
                          }
                          return response.json();
                        })
                        .then((data) => {
                          const dryBlubTemperature =
                            data.weather3Hour.dryBlubTemperature;
                          const temp = dryBlubTemperature.toFixed(0);
                          const rainFall = data.weather3Hour.rainfall;
                          // const rainFall = 60
  
                          // const tempIcon = renderToString(
                          //     <DeviceThermostatIcon
                          //     style={{
                          //         color: '#87c9ff',
                          //         width: '18px',
                          //         verticalAlign: 'middle',
                          //         top: '-0.5px'
                          //     }}
                          //     />
                          // );
  
                          //rainfall icon
                          let rainValue;
                          let rainfallIcon;
                          let rainText;
                          let mm;
                          if (rainFall < 0.1) {
                            rainfallIcon = noRain;
                            rainText = "ไม่มีฝนตก";
                            rainValue = "";
                            mm = "";
                          } else if (rainFall <= 10) {
                            rainfallIcon = lightRain;
                            rainText = "ฝนตก";
                            mm = "มม.";
                          } else if (rainFall <= 35) {
                            rainfallIcon = moderateRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          } else if (rainFall <= 90) {
                            rainfallIcon = heavyRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          } else {
                            rainfallIcon = veryHeavyRain;
                            rainText = "ฝนตก";
                            rainValue = rainFall;
                            mm = "มม.";
                          }
                          //rainfall icon
  
                          const weatherElement =
                            document.getElementById("weather");
                          weatherElement.innerHTML = `
                          <img style="width: 30px; vertical-align: middle;" src="${rainfallIcon}" 
                          alt="Rainfall Icon" /><span style="color: #a6a4a4; font-size: 16px;" >${temp} °C </span>`;
                          const rain = document.getElementById("rainfall");
                          rain.innerHTML = `<span style="font-size: 16px; color: #a6a4a4;"> ${rainText} ${rainValue} ${mm}</span>`;
                          // weatherElement.style.display = 'box';
                          // weatherElement.style.alignItems = 'center';
                          // <span style="font-size: 12px; font-weight: 500;">สภาพอากาศวันนี้</span>
                        })
                        .catch((error) => {
                          console.error(
                            "There has been a problem with your fetch operation:",
                            error
                          );
                        });
                    }
                    fetchTemp();
  
                    function fetchRain() {
                      const culture = "th-TH";
                      fetch(
                        `https://172.27.173.43:4000/7Day?FilterText=${pv}&Culture=${culture}`
                      )
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error(
                              "Network response was not ok " + response.statusText
                            );
                          }
                          return response.json();
                        })
                        .then((data) => {
                          const forecastData = data[0];
  
                          if (forecastData && forecastData.weatherForecast7Day) {
                            const weatherForecast =
                              forecastData.weatherForecast7Day;
                            const rainArea = weatherForecast.rainArea;
                            const windSpeed = weatherForecast.windSpeed;
                            const windDir = weatherForecast.windDirection;
  
                            const windDirDeg = renderToString(
                              <NavigationRoundedIcon
                                style={{
                                  color: "#758CA3",
                                  width: 18,
                                  verticalAlign: "middle",
                                  transform: `rotate(${windDir}deg)`,
                                }}
                              />
                            );
  
                            const waterDrop = renderToString(
                              <WaterDropRoundedIcon
                                style={{
                                  color: "#56c8f5",
                                  width: 18,
                                  verticalAlign: "middle",
                                }}
                              />
                            );
  
                            document.getElementById("rainPer").innerHTML =
                              `<span style="font-size: 16px; color: #a6a4a4;">${waterDrop} ${rainArea}% ของพื้นที่</span>`;
                            document.getElementById("wind").innerHTML =
                              `<span style="font-size: 16px; color: #a6a4a4;"> ${windDirDeg} ${windSpeed} กม./ชม.</span>`;
                          } else {
                            console.error(
                              "ค่าพยากรณ์อากาศไม่พร้อมใช้งาน ณ ขณะนี้"
                            );
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "There has been a problem with your fetch operation:",
                            error
                          );
                        });
                    }
                    fetchRain();
                    //fetch APi from Proxy.js//
  
                    const date = data.datetimeThai["dateThai"];
                    const time = data.datetimeThai["timeThai"];
  
                    // Update DOM elements
                    const locationElement = document.getElementById("location");
                    const updateElement = document.getElementById("update");
                    const titleElement = document.getElementById("title");
                    // const valueElement = document.getElementById("value");
                    const levelElement = document.getElementById("level");
  
                    locationElement.innerHTML = `${tb} ${ap} ${pv}`;
                    updateElement.innerHTML = `อัพเดทล่าสุด ${date} ${time}`;
  
                    // เกณฑ์ Sat HID NIGHT
                    let color;
                    let level;
                    if (pm25 < 0.005) {
                      color = "#1A9640";
                      level = "เกณฑ์ดีมาก";
                    } else if (pm25 > 0.005 && pm25 < 0.01) {
                      color = "#8ACC62";
                      level = "เกณฑ์ดี";
                    } else if (pm25 > 0.01 && pm25 < 0.015) {
                      color = "#DAF09E";
                      level = "เกณฑ์ปานกลาง";
                    } else if (pm25 > 0.015 && pm25 < 0.02) {
                      color = "#FDDF99";
                      level = "ร้อน";
                    } else if (pm25 > 0.02 && pm25 < 0.021) {
                        color = "#F49052";
                        level = "ร้อนมาก";
                      }else {
                      color = "#EB4E47";
                      level = "อันตราย";
                    }
                    const pm25Formatted = pm25 % 1 === 0 ? pm25 : pm25.toFixed(1);
                            titleElement.innerHTML = `<span style="font-size: 14px; font-weight: 500;">RCP 8.5 : GISTDA</span></br> `
                            const sat_UHIValue = document.getElementById('value');
                            sat_UHIValue.innerHTML = `
                    <span style="color: ${color};">
                        ${pm25Formatted}
                    </span>
                                `;
                  levelElement.innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`;

                            // Additional logic for other API calls or updates
                        })
                        .catch(error => console.error('Error fetching PM2.5 data:', error));
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        };

        // Clear existing interval if any
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        getLoc();
        intervalRef.current = setInterval(getLoc, 5000);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const updateLayer = (layerType = 'AOD443', step = 0) => {
        const map = sphereMapRef.current;
        const layerName = `GK2_GEMS_L2_T-0_0${step}45_${layerType}`;
        const layerPrev = `GK2_GEMS_L2_T-0_0${step - 1}45_${layerType}`;
        const layerNext = `GK2_GEMS_L2_T-0_0${step + 1}45_${layerType}`;

        // Remove other layers that are not the current layerType
        const removeOtherLayers = (typeToRemove) => {
            const layersToRemove = ['AOD443', 'O3Total'].filter(type => type !== typeToRemove);
            layersToRemove.forEach(type => {
                const layerNameToRemove = `GK2_GEMS_L2_T-0_0${step}45_${type}`;
                const prevLayerToRemove = `GK2_GEMS_L2_T-0_0${step - 1}45_${type}`;
                const nextLayerToRemove = `GK2_GEMS_L2_T-0_0${step + 1}45_${type}`;

                [layerNameToRemove, prevLayerToRemove, nextLayerToRemove].forEach(layer => {
                    try {
                        const existingLayer = createLayer(layer);
                        map.Layers.remove(existingLayer);
                    } catch (error) {
                        console.error(`Error removing ${type} layer:`, error);
                    }
                });
            });
        };

        try {
            const tmdWMS = createLayer(layerName);
            const dataInf = tmdWMS.style.layers[0].id;
            document.getElementById('dataInf').innerHTML = `${dataInf}`;
            setDataInfo(dataInf);
            map.Layers.add(tmdWMS);
            setActiveStep(step);
        } catch (error) {
            console.error('Error adding tmdWMS WMS layer:', error);
        }

        // Remove other layers
        removeOtherLayers(layerType);

        // Optionally, remove the previous and next layers if needed
        [layerPrev, layerNext].forEach(layer => {
            try {
                const existingLayer = createLayer(layer);
                map.Layers.remove(existingLayer);
            } catch (error) {
                console.error('Error removing previous/next tmdWMS WMS layer:', error);
            }
        });
    };

    // Set Default Layer
    // useEffect(() => {
    //     if (sphereMapRef.current) {
    //         updateLayer('AOD443', 0);
    //     }
    // }, [sphereMapRef.current]);

    useEffect(() => {
        handleAODClick();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            const newStep = Math.min(prevActiveStep + 1, totalSteps - 1);
            updateLayer(currentLayerType, newStep);
            return newStep;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const newStep = Math.max(prevActiveStep - 1, 0);
            updateLayer(currentLayerType, newStep);
            return newStep;
        });
    };


    return (
        <>
            <MediaCard />
            <Box style={{
                zIndex: 20,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '5%'
            }}>
                <Stack className='Stack'
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        bottom: '90px',
                        left: '50%',
                        transform: 'translate(-50%)',
                    }}
                    direction="row" spacing={1}>
                    <Chip
                        onClick={handleAODClick}
                        id='AOD443'  // Make sure the id matches the state
                        size="medium"
                        sx={{
                            boxShadow: activeButton === 'AOD443'
                                ? 'inset 0px 3.88883px 3.88883px rgba(0, 0, 0, 0.3)'
                                : '3px 3px 2.5px 0.25px rgba(255, 140, 0, 0.5)',
                            background: activeButton === 'AOD443'
                                ? 'rgba(165, 179, 192, 0.5);'
                                : 'linear-gradient(50deg, #FFB74D 50%, #FF9800 80%)',
                            '&:hover': {
                                boxShadow: '0px 4px 6px rgba(255, 140, 0, 0.5)',
                                cursor: 'pointer',
                                background: 'linear-gradient(50deg, #FFA726 50%, #FF8A00 80%)',
                            },
                            '&:active': {
                                boxShadow: 'inset 0px 5px 5px rgba(0, 0, 0, 0.4)',
                                background: 'linear-gradient(50deg, #FF6D00 50%, #E65100 80%)',
                            }
                        }}
                        icon={
                            <WbSunnyRoundedIcon
                                style={{
                                    color: activeButton === 'AOD443' ? '#E65100' : '#FFBC57',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    boxShadow: 'inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)',
                                    padding: '2px',
                                }}
                            />
                        }
                        label={
                            <span id="LyrName" style={{ color: 'white', textShadow: '0.25px 0.25px white, -0.5px 0.2px #3e3e3e' }}>
                                RCP 4.5
                            </span>
                        }
                    />
                    <Chip
                        onClick={handleO3Click}
                        id='O3Total'
                        size="medium"
                        sx={{
                            boxShadow: activeButton === 'O3Total'
                                ? 'inset 0px 3.88883px 3.88883px rgba(0, 0, 0, 0.3)'
                                : '3px 3px 2.5px 0.25px rgba(255, 140, 0, 0.5)',
                            background: activeButton === 'O3Total'
                                // ? 'linear-gradient(50deg, #FF8A00 0%, #FF6D00 100%)'
                                ? 'rgba(165, 179, 192, 0.5);'
                                : 'linear-gradient(50deg, #FFB74D 50%, #FF9800 80%)',
                            '&:hover': {
                                boxShadow: '0px 4px 6px rgba(255, 140, 0, 0.5)',
                                cursor: 'pointer',
                                background: 'linear-gradient(50deg, #FFA726 50%, #FF8A00 80%)',
                            },
                            '&:active': {
                                boxShadow: 'inset 0px 5px 5px rgba(0, 0, 0, 0.4)',
                                background: 'linear-gradient(50deg, #FF6D00 50%, #E65100 80%)',
                            }
                        }}


                        icon={
                            <WbSunnyRoundedIcon
                                style={{
                                    color: activeButton === 'O3Total' ? '#E65100' : '#FFBC57',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    boxShadow: 'inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)',
                                    padding: '2px',
                                }}

                            />
                        }
                        label={
                            <span id="LyName" style={{ color: 'white' }}>
                                RCP 8.5
                            </span>
                        }
                    />
                </Stack>


                <Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            color: '#7a7a7a',
                            zIndex: 16,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Typography
                            id='dataInf'
                            className='dateTimeUpdate'
                            variant="subtitle1"
                            display="block"
                            sx={{ fontFamily: `'Prompt', sans-serif`, margin: '0.15rem' }}>
                        </Typography>
                    </Box>
                    <MobileStepper
                        variant="progress"
                        steps={totalSteps}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            height: '75px',
                            padding: '0',
                            maxWidth: '700px',
                            minWidth: '400px',
                            borderRadius: '18px',
                            flexGrow: 1,
                            zIndex: 15,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bottom: '5%',
                            "& .MuiLinearProgress-root.MuiLinearProgress-colorPrimary.MuiLinearProgress-determinate.MuiMobileStepper-progress.css-1be5mm1-MuiLinearProgress-root-MuiMobileStepper-progress": {
                                backgroundColor: 'lightgrey',
                                width: '500px',
                                height: '5px',
                                zIndex: 0,
                                borderRadius: '15px',
                                "@media (max-width: 1024px)": {
                                    maxWidth: '70%',
                                },
                                "@media (max-width: 768px)": {
                                    maxWidth: '50%',
                                },
                                "@media (max-width: 480px)": {
                                    maxWidth: '40%',
                                },
                            },
                            "& .MuiLinearProgress-bar.MuiLinearProgress-barColorPrimary.MuiLinearProgress-bar1Determinate": {
                                backgroundColor: '#FFB200',
                                borderRadius: '20px'
                            }
                        }}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === totalSteps - 1}
                            >
                                {theme.direction === 'rtl' ? (
                                    <ArrowCircleLeftIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                ) : (
                                    <ArrowCircleRightIcon sx={{ color: '#FF9900', fontSize: '3rem' }} />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                sx={{
                                    margin: '0',
                                    width: '50px',
                                }}
                            >
                                {theme.direction === 'rtl' ? (
                                    <ArrowCircleRightIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                ) : (
                                    <ArrowCircleLeftIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                )}
                            </Button>
                        }
                    />
                </Box >
            </Box >
        </>
    );
});

NKHControl.displayName = 'NKHControl';

export default NKHControl;