import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactDOMServer from "react-dom/server";

import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
// import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
// import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { Box, Typography, Chip, Stack } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CloudOffTwoToneIcon from "@mui/icons-material/CloudOffTwoTone";

//SLIDER
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/system";
import { Slider as BaseSlider, sliderClasses } from "@mui/base/Slider";

import MediaCard from "../Card_hid";

//LEGENDS
import HIDSatLegend from "/assets/Icon/legend/HID_Sat_Legend.png";

//ICON
// import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
// import zIndex from "@mui/material/styles/zIndex";
//weather icon
import { renderToString } from "react-dom/server";
import noRain from "../../weather/0_no_rain.svg";
import lightRain from "../../weather/1_light_rain.svg";
import moderateRain from "../../weather/2_moderate_rain.svg";
import heavyRain from "../../weather/3_heavy_rain.svg";
import veryHeavyRain from "../../weather/4_very_heavy.svg";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";

import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

const SatControl = React.forwardRef((props, ref) => {
  const [currentLayerType, setCurrentLayerType] = useState("UTFVI_TH_D");
  const [activeButton, setActiveButton] = useState("UTFVI_TH_D");
  const [satLayerName, setsatLayerName] = useState("daytime_data");
  const [sattime, setsatTime] = useState("กลางวัน");

  const theme = useTheme();
  const { sphereMapRef, dataInf } = props;
  const [activeStep, setActiveStep] = useState(1);

  const [isEnabled, setIsEnabled] = useState(false);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [dataInfo, setDataInfo] = useState("");
  const debounceTimer = useRef(null);
  const satlayRef = useRef(activeStep);
  const [currentTime, setcurrentTime] = useState(null);

  const handleMapClickRef = useRef(null);
  const satLayerRef = useRef(null);
  const tmdTimeRef = useRef(null);

  // const map = sphereMapRef.current;
  // const mapRef = useRef(null);

  useEffect(() => {
    if (dataInf) {
      dataInf(dataInfo);
    }
  }, [dataInfo, dataInf]);

  // useEffect(() => {
  //   handleDayClick();

  //   const map = sphereMapRef.current;

  //   if (!window.sphere || !map) {
  //     console.error("Sphere SDK or map is not initialized.");
  //     return;
  //   }

  //   const handleMapClick = async (event) => {

  //     if (!event) {
  //       console.error("Event is null or undefined.");
  //       return;
  //     }

  //       const latTMD = event.lat;
  //       const lonTMD = event.lon;

  //       const response = await axios.get(
  //         "https://pm25.gistda.or.th/rest/getPm25byLocation",
  //         {
  //           params: {
  //             lat: latTMD,
  //             lng: lonTMD,
  //           },
  //         }
  //       );

  //       const pm25Data = response.data;
  //       const tb = pm25Data.data?.loc?.["tb_tn"];
  //       const ap = pm25Data.data?.loc?.["ap_tn"];
  //       const pv = pm25Data.data?.loc?.["pv_tn"];
  //       console.log("pm25Data:", pm25Data);

  //       function fetchTemp() {
  //                   const culture = "th-TH";
  //                   const url = `https://life-dee-proxy-552507355198.asia-southeast1.run.app/3Hour?FilterText=${pv}&Culture=${culture}`;

  //                   return fetch(url)
  //                     .then((response) => {
  //                       if (!response.ok) {
  //                         throw new Error(`fetchTemp response not ok: ${response.statusText}`);
  //                       }
  //                       return response.json();
  //                     })
  //                     .then((data) => {
  //                       if (!data.weather3Hour) {
  //                         throw new Error("Missing weather3Hour in fetchTemp");
  //                       }

  //                       const { dryBlubTemperature, rainfall } = data.weather3Hour;
  //                       const temp = dryBlubTemperature.toFixed(0);

  //                       let rainfallIcon, rainText = "ฝนตก", rainValue = rainfall, mm = "มม.";
  //                       if (rainfall < 0.1) {
  //                         rainfallIcon = noRain;
  //                         rainText = "ไม่มีฝนตก";
  //                         rainValue = "";
  //                         mm = "";
  //                       } else if (rainfall <= 10) {
  //                         rainfallIcon = lightRain;
  //                       } else if (rainfall <= 35) {
  //                         rainfallIcon = moderateRain;
  //                       } else if (rainfall <= 90) {
  //                         rainfallIcon = heavyRain;
  //                       } else {
  //                         rainfallIcon = veryHeavyRain;
  //                       }

  //                       return { rainfallIcon, rainText, rainValue, temp, mm };
  //                     })
  //                     .catch((error) => {
  //                       console.error("fetchTemp error:", error);
  //                       throw error;
  //                     });
  //       }

  //       function fetchRain() {
  //         const culture = "th-TH";
  //         const url = `https://life-dee-proxy-552507355198.asia-southeast1.run.app/7Day?FilterText=${pv}&Culture=${culture}`;

  //         return fetch(url)
  //           .then((response) => {
  //             if (!response.ok) {
  //               throw new Error(`Network response was not ok: ${response.statusText}`);
  //             }
  //             return response.json();
  //           })
  //           .then((data) => {
  //             const forecastData = data[0];
  //             if (forecastData && forecastData.weatherForecast7Day) {
  //               const weatherForecast = forecastData.weatherForecast7Day;
  //               const { rainArea, windSpeed, windDirection: windDir } = weatherForecast;

  //               const windDirDeg = renderToString(
  //                 <NavigationRoundedIcon
  //                   style={{
  //                     color: "#758CA3",
  //                     width: 18,
  //                     verticalAlign: "middle",
  //                     transform: `rotate(${windDir}deg)`,
  //                   }}
  //                 />
  //               );

  //               const waterDrop = renderToString(
  //                 <WaterDropRoundedIcon
  //                   style={{
  //                     color: "#56c8f5",
  //                     width: 18,
  //                     verticalAlign: "middle",
  //                   }}
  //                 />
  //               );

  //               return { waterDrop, rainArea, windDirDeg, windSpeed };
  //             } else {
  //               console.error("ค่าพยากรณ์อากาศไม่พร้อมใช้งาน ณ ขณะนี้");
  //               return {
  //                 waterDrop: null,
  //                 rainArea: null,
  //                 windDirDeg: null,
  //                 windSpeed: null,
  //               };
  //             }
  //           })
  //           .catch((error) => {
  //             console.error("fetchRain error:", error);
  //             throw error;
  //           });
  //       }

  //       const dataInfElement = document.getElementById("dataInf");
  //       const dataDate = dataInfElement.dataset.date;
  //       const apiTime = new Date(dataDate).getTime();

  //       // let dataName = "daytime_data";
  //       const dataInfSelect = document.getElementById("dataInf");
  //       // dataInfElementDay.setAttribute('data-layer', dataName);
  //       const LayerSelected = dataInfSelect.dataset.layer;

  //       const heatIndexResponse = await axios.get(
  //         `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/${LayerSelected}/ImageServer/identify`,
  //         {
  //           params: {
  //             geometry: `{y:${latTMD},x:${lonTMD}}`,
  //             geometryType: "esriGeometryPoint",
  //             time: encodeURIComponent(apiTime),
  //             returnGeometry: false,
  //             returnCatalogItems: true,
  //             returnPixelValues: true,
  //             processAsMultidimensional: false,
  //             maxItemCount: 10,
  //             f: "pjson",
  //           },
  //         }
  //       );

  //       const hidTMDValueCoor = heatIndexResponse.data?.value;
  //       const hidCoor = parseFloat(hidTMDValueCoor);
  //       console.log(`hidCoor`, hidCoor);

  //       const hidUpdateJson =
  //         heatIndexResponse.data.catalogItems.features[0].attributes.Date;

  //       const hidUnix = new Date(hidUpdateJson);
  //       const thaiWeekdays = [
  //         "อาทิตย์",
  //         "จันทร์",
  //         "อังคาร",
  //         "พุธ",
  //         "พฤหัส",
  //         "ศุกร์",
  //         "เสาร์",
  //       ];
  //       const weekday = thaiWeekdays[hidUnix.getDay()];

  //       let textColor, level, strokeColor, strokeWidth;

  //         if (hidCoor < 0) {
  //           textColor = "#C5E0D3";
  //           strokeColor = "#00000099";
  //           strokeWidth = "1";
  //           level = "ดีมาก";
  //         } else if (hidCoor >= 0 && hidCoor <= 0.005) {
  //           textColor = "#8CC2AB";
  //           strokeColor = "#00000099";
  //           strokeWidth = "1";
  //           level = "ดี";
  //         } else if (hidCoor >= 0.005 && hidCoor <= 0.01) {
  //           textColor = "#FFD046";
  //           strokeColor = "#00000099";
  //           strokeWidth = "1";
  //           level = "ปกติ";
  //         } else if (hidCoor >= 0.01 && hidCoor <= 0.015) {
  //           textColor = "#F49C30";
  //           level = "ควรระวัง";
  //         } else if (hidCoor >= 0.015 && hidCoor <= 0.02) {
  //           textColor = "#E9671C";
  //           level = "เฝ้าระวัง";
  //         } else {
  //           textColor = "#DC3546";
  //           level = "อันตราย";
  //         }

  //       const loadingHtml = `
  //           <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
  //               <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
  //               <span style="font-size: 14px;">กำลังค้นหาข้อมูล...</span>
  //           </div>
  //           <style>
  //               @keyframes spin {
  //                   0% { transform: rotate(0deg); }
  //                   100% { transform: rotate(360deg); }
  //               }
  //           </style>
  //       `;

  //       Promise.all([fetchTemp(), fetchRain()])
  //                 .then(([tempData, rainData]) => {
  //                   console.log("Promise.all resolved data:", {
  //                     tempData,
  //                     rainData,
  //                   });
  //                   if (tempData && rainData) {
  //                     const combinedData = { ...tempData, ...rainData };
  //                     updateWeatherDetails(combinedData);
  //                   } else {
  //                     console.error("Failed to fetch one or both data sources");

  //                     const errorData = {
  //                       rainfallIcon: "",
  //                       rainText: "",
  //                       rainValue: "",
  //                       temp: "",
  //                       mm: "",
  //                       waterDrop: "",
  //                       rainArea: "",
  //                       windDirDeg: "",
  //                       windSpeed: "",
  //                     };
  //                     updateWeatherDetails(errorData);
  //                   }
  //                 })
  //                 .catch((error) => {
  //                   console.error("Promise.all error:", error);
  //                   const errorData = {
  //                     rainfallIcon: "",
  //                     rainText: "",
  //                     rainValue: "",
  //                     temp: "",
  //                     mm: "",
  //                     waterDrop: "",
  //                     rainArea: "",
  //                     windDirDeg: "",
  //                     windSpeed: "",
  //                   };
  //                   updateWeatherDetails(errorData);
  //                 });

  //               function updateWeatherDetails({
  //                 rainfallIcon,
  //                 rainText,
  //                 rainValue,
  //                 temp,
  //                 mm,
  //                 waterDrop,
  //                 rainArea,
  //                 windDirDeg,
  //                 windSpeed,
  //               }) {

  //         // const titleElement = document.getElementById("title");
  //         // let sattime = titleElement ? titleElement.textContent : '';

  //         const rainIcon = (rainfallIcon !== undefined && rainfallIcon !== null && rainfallIcon !== "")
  //                 ? `${rainfallIcon}`
  //                 : "";

  //               const rainIconStyle = (rainfallIcon !== undefined && rainfallIcon !== null && rainfallIcon !== "")
  //                 ? ""
  //                 : "opacity: 0";
  //                 const formattedTemp = (temp !== undefined && temp !== null && temp !== "")
  //                 ? `${temp} °C`
  //                 : "";
  //                 const formattedRainArea = (rainArea !== undefined && rainArea !== null && rainArea !== "")
  //                     ? `${rainArea}% ของพื้นที่`
  //                     : ``;
  //                 const formattedWindSpeed = (windSpeed !== undefined && windSpeed !== null && windSpeed !== "")
  //                 ? `${windSpeed} กม./ชม.`
  //                 : "ค่าพยากรณ์อากาศไม่พร้อมใช้งาน <br>";

  //         const popupDetail = `
  //                 <div style="padding:0.5rem;">
  //                     <span id="location" style="font-size: 16px; font-weight: bold;">${tb} ${ap} ${pv}</span><br />
  //                     <span style="font-size: 14px;"></span>

  //                     <img style="width: 30px; vertical-align: middle; ${rainIconStyle}" src="${rainIcon}" alt="Rainfall Icon" />
  //                     <span style="color: #a6a4a4; font-size: 16px;">${formattedTemp}</span>
  //                     <span style="color: #a6a4a4; font-size: 16px;"> ${rainText} ${rainValue} ${mm}</span>
  //                     <span id="rainPer-pop"></span><span id="wind"></span></br>
  //                     <span style="color: #a6a4a4; font-size: 16px;">${waterDrop} ${formattedRainArea}</span>
  //                     <span style="font-size: 16px; color: #a6a4a4;"> ${windDirDeg} ${formattedWindSpeed}</span><br />

  //                     <span style="font-size: 14px;">${sattime}</span><br />
  //                     <span id='value' style={{ fontWeight: 'bold', fontSize: '30px' }}><span style="color: ${textColor}; font-weight: bold; font-size: 30px; -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
  //                     text-shadow: 0 0 ${strokeWidth}px ${strokeColor};">${hidCoor.toFixed(3)} </span></span>
  //                     <span id="level"><span style="color: ${textColor}; font-weight: bold; font-size: 30px; -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
  //                     text-shadow: 0 0 ${strokeWidth}px ${strokeColor};"> ${level}</span><br />
  //                     <span id="updateTMD" style="font-size: 12px; color: #a6a6a6;">
  //                       อัพเดตล่าสุด วัน${weekday}ที่ ${hidUnix.getDate()}
  //                       ${new Intl.DateTimeFormat("th-TH", { month: "long" }).format(hidUnix)}
  //                       ${hidUnix.getFullYear() + 543} เวลา
  //                       ${hidUnix.getHours()}:${
  //                         hidUnix.getMinutes() < 10
  //                           ? "0" + hidUnix.getMinutes()
  //                           : hidUnix.getMinutes()
  //                       } น.
  //                     </span>
  //                 </div>
  //               `;

  //         var popUp = new sphere.Popup(
  //           { lon: lonTMD, lat: latTMD },
  //           {
  //             title: `
  //               <span style='font-weight: 500; margin-left: 0.5rem;'>ตำแหน่งที่สนใจ</span>
  //               <span style='font-weight: 400; color: #a6a6a6;'>
  //                   ${latTMD.toFixed(4)}, ${lonTMD.toFixed(4)}
  //               </span>
  //           `,
  //             detail: loadingHtml,
  //             loadDetail: updateDetail,
  //             size: { width: "100%" },
  //             closable: true,
  //           }
  //         );

  //         // eslint-disable-next-line no-inner-declarations
  //         function updateDetail(element) {
  //           setTimeout(function () {
  //             element.innerHTML = popupDetail;
  //           }, 1000);
  //         }
  //         map.Overlays.add(popUp);
  //       }

  //   }
  //   map.Event.bind(sphere.EventName.Click, handleMapClick);

  //   return () => {
  //     if (map && map.Event) {
  //       map.Event.unbind(sphere.EventName.Click, handleMapClick);
  //     }
  //   };

  // }, [map]);

  useEffect(() => {
    const map = sphereMapRef.current;

    if (!window.sphere || !map) {
      console.error("Sphere SDK or map is not initialized.");
      return;
    }

    let thBound = new sphere.Layer('0', {
                    type: sphere.LayerType.WMS,
                    url: "https://gistdaportal.gistda.or.th/data2/services/L05_Province_GISTDA_50k_nonlabel/MapServer/WMSServer",
                    zoomRange: { min: 1, max: 15 },
                    zIndex: 10,
                    opacity: 0.8,
                    id: 'L05_Province_GISTDA_50k_nonlabel'
                })
                map.Layers.add(thBound);

    const handleMapClick = async (event) => {
      if (!event) {
        console.error("Event is null or undefined.");
        return;
      }

      const satLayer = satLayerRef.current;
      const tmdTime = tmdTimeRef.current;

      const latTMD = event.lat;
      const lonTMD = event.lon;

      const pm25Promise = await axios.get(
        "https://pm25.gistda.or.th/rest/getPm25byLocation",
        {
          params: {
            lat: latTMD,
            lng: lonTMD,
          },
        }
      );

      const loctext = pm25Promise.data.data.loc.loctext;

      // const dataInfElement = document.getElementById("dataInf");
      // const dataDate = dataInfElement.dataset.date;
      // const apiTime = new Date(dataDate).getTime();
      // console.log(apiTime);

      // const tmdTime = currentTime
      const fullDate = `${tmdTime}-01`;
      const unixTimestamp = new Date(fullDate).getTime();

      const heatIndexPromise = await axios.get(
        `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/${satLayer}/ImageServer/identify`,
        {
          params: {
            geometry: `{y:${latTMD},x:${lonTMD}}`,
            geometryType: "esriGeometryPoint",
            time: unixTimestamp,
            returnGeometry: false,
            returnCatalogItems: true,
            returnPixelValues: true,
            processAsMultidimensional: false,
            maxItemCount: 10,
            f: "pjson",
          },
        }
      );

      const hidCoorRaw = heatIndexPromise.data.value;
      const hidCoor = Number(hidCoorRaw);
      const hid = hidCoor.toFixed(3);
      const hidUpdateJson = heatIndexPromise.data?.catalogItems?.features?.[0]?.attributes?.Date;
      

      const hidUnix = new Date(hidUpdateJson);
      const thaiWeekdays = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัส",
        "ศุกร์",
        "เสาร์",
      ];
      const weekday = thaiWeekdays[hidUnix.getDay()];

      let level = "";
      let color = "";
      let strokeColor = "";
      let strokeWidth = "";
      let display = "";

      if (isNaN(hid)) {
        color = "#999999";
        level = "ไม่พบข้อมูล";
        display = "none"
      } else if (hid < 0) {
        color = "#C5E0D3";
        level = "ดีมาก";
      } else if (hid >= 0 && hid <= 0.005) {
        color = "#8CC2AB";
        level = "ดี";
      } else if (hid >= 0.005 && hid < 0.01) {
        color = "#FFD046";
        strokeColor = "#00000099";
        strokeWidth = "1";
        level = "ปกติ";
      } else if (hid >= 0.01 && hid < 0.015) {
        color = "#F49C30";
        level = "ควรระวัง";
      } else if (hid >= 0.015 && hid < 0.02) {
        color = "#E9671C";
        level = "เฝ้าระวัง";
      } else {
        color = "#DC3546";
        level = "อันตราย";
      }

      let timeLabel = "";

      if (satLayer === "nighttime_data") {
        timeLabel = "กลางคืน";
      } else if (satLayer === "daytime_data") {
        timeLabel = "กลางวัน";
      }

      const initialPopupContent = `
        <div style="padding:0.5rem;">
          <span style='font-weight: 600; font-size: 16px; display: ${display}'>${loctext}</span> <br />

          <span id="weather_click"></span>
          <span id="rainfall_click"></span>
          
          <span id="rainPer_click"></span>
          <span id="wind_click"></span>

          <span style="font-size: 12px; ">ดัชนีความร้อนจากดาวเทียม (${timeLabel})</span><br />
          <span id='value' style="font-weight: bold; font-size: 30px;">
            <span style="color: ${color}; font-weight: bold; font-size: 30px; -webkit-text-stroke: ${strokeWidth}px ${strokeColor}; 
            text-shadow: 0 0 ${strokeWidth}px ${strokeColor}; display: ${display} ">${hid} </span>
          </span>
          <span id="level">
            <span style="color: ${color}; font-weight: bold; font-size: 30px; -webkit-text-stroke: ${strokeWidth}px ${strokeColor}; 
            text-shadow: 0 0 ${strokeWidth}px ${strokeColor};"> ${level}</span>
          </span><br />

          <span id="updateTMD" style="font-size: 12px; color: #a6a6a6; display: ${display}">
            อัพเดตล่าสุด วัน${weekday}ที่ ${hidUnix.getDate()} 
            ${new Intl.DateTimeFormat("th-TH", { month: "long" }).format(hidUnix)} 
            ${hidUnix.getFullYear() + 543} เวลา 
            ${hidUnix.getHours()}:${
              hidUnix.getMinutes() < 10
                ? "0" + hidUnix.getMinutes()
                : hidUnix.getMinutes()
            } น.
          </span>
        </div>
      `;

      var popUp = new sphere.Popup(
        { lon: lonTMD, lat: latTMD },
        {
          title: `
            <span style='font-weight: 500; margin-left: 0.5rem;'>ตำแหน่งที่สนใจ</span>
            <span style='font-weight: 400; color: #a6a6a6;'>
                ${latTMD.toFixed(4)}, ${lonTMD.toFixed(4)}
            </span>
          `,
          detail: initialPopupContent,
          size: { width: "100%" },
          closable: true,
        }
      );

      map.Overlays.add(popUp);
    };

    handleMapClickRef.current = handleMapClick;
    map.Event.bind(sphere.EventName.Click, handleMapClick);
  }, [map]);

  const handleDayClick = (tmdTime) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const valueElement = document.getElementById("value");
    valueElement.innerHTML = "<span></span>";

    const newSatTime = "กลางวัน";
    setsatTime(newSatTime);

    const titleDay = document.getElementsByClassName("title");

    if (titleDay.length > 0) {
      titleDay[0].innerHTML = `<span style="font-size: 14px; font-weight: 500; color:#f57542;">ดัชนีความร้อนจากดาวเทียม (${newSatTime})</span><br>`;
    } else {
      console.error("ไม่พบ element ที่มี class 'title'");
    }

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

    const newLayerName = "daytime_data";
    const newLayerType = "UTFVI_TH_D";

    updateLayer({ layerName: newLayerName, step: activeStep });
    handleBack({ layerName: newLayerName, step: activeStep });
    handleNext({ layerName: newLayerName, step: activeStep });
    handleSlide({ layerName: newLayerName, step: activeStep });
    // togglePlayStop(newLayerName);

    getLoc(newLayerName);
    setsatLayerName(newLayerName);
    setCurrentLayerType(newLayerType);
    setActiveButton(newLayerType);
    createLayer(tmdTime, newLayerName);
  };

  const handleNightClick = (tmdTime) => {
    const valueElement = document.getElementById("value");
    valueElement.innerHTML = "<span></span>";
    const levelElement = document.getElementById("level");
    levelElement.innerHTML = "<span></span>";

    const newSatTime = "กลางคืน";
    setsatTime(newSatTime);

    const titleNight = document.getElementsByClassName("title");

    if (titleNight.length > 0) {
      titleNight[0].innerHTML = `<span style="font-size: 14px; font-weight: 500; color:#f57542;">ดัชนีความร้อนจากดาวเทียม (${newSatTime})</span><br>`;
    } else {
      console.error("ไม่พบ element ที่มี class 'title'");
    }

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

    const newLayerName = "nighttime_data";
    const newLayerType = "UTFVI_TH_N";

    updateLayer({ layerName: newLayerName, step: activeStep });
    handleBack({ layerName: newLayerName, step: activeStep });
    handleNext({ layerName: newLayerName, step: activeStep });
    handleSlide({ layerName: newLayerName, step: activeStep });

    getLoc(newLayerName);
    setsatLayerName(newLayerName);
    setCurrentLayerType(newLayerType);
    setActiveButton(newLayerType);
    createLayer(tmdTime, newLayerName);
  };

  const createLayer = (tmdTime, satLayer) => {
    getLoc(satLayer, tmdTime);

    satLayerRef.current = satLayer;
    tmdTimeRef.current = tmdTime;

    if (handleMapClickRef.current) {
      handleMapClickRef.current({ mock: true });
    }

    return new window.sphere.Layer(`${satLayer}`, {
      type: window.sphere.LayerType.WMS,
      url: `https://gistdaportal.gistda.or.th/imagedata/services/GISTDA_LifeD/${satLayer}/ImageServer/WMSServer?service=WMS&time=${tmdTime}`,
      zoomRange: { min: 1, max: 15 },
      zIndex: 5,
      opacity: 0.75,
    });
  };

  const activeLayersRef = useRef({});

  const updateLayer = ({ step = 1, layerName }) => {
    const map = sphereMapRef.current;
    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const startYear = 2021;
    const startMonth = 1;
    const endYear = 2025;
    const endMonth = 4;

    // Generate date array
    const dateArray = [];
    for (let year = startYear; year <= endYear; year++) {
      const start = year === startYear ? startMonth : 1;
      const end = year === endYear ? endMonth : 12;
      for (let month = start; month <= end; month++) {
        const formattedMonth = String(month).padStart(2, "0");
        dateArray.push({ year, month: formattedMonth });
      }
    }

    // Validate step
    if (step < 1 || step > dateArray.length) {
      console.warn("Step is out of range. No update performed.");
      return;
    }

    // Get the current date based on the step
    const { year, month } = dateArray[step - 1];
    const currentTime = `${year}-${month}`;

    // const fullmonth = `ดัชนีความร้อนจากดาวเทียม เดือน${monthNames[parseInt(month, 10) - 1]} พ.ศ.${
    //     parseInt(year, 10) + 543
    //   }`

    // SliderValueLabel(fullmonth);

    setcurrentTime(currentTime);

    // Update layer attribution
    const layerAttr = document.getElementById("dataInf");
    if (layerAttr) {
      layerAttr.setAttribute("data-date", currentTime);
      layerAttr.innerHTML = `ดัชนีความร้อนจากดาวเทียม เดือน${monthNames[parseInt(month, 10) - 1]} พ.ศ.${
        parseInt(year, 10) + 543
      }`;
    } else {
      console.error('Element with id="dataInf" not found.');
    }

    try {
      // Remove all existing layers from previous steps
      Object.values(activeLayersRef.current).forEach((layer) => {
        if (layer) {
          map.Layers.remove(layer);
        }
      });

      // Create and add the new layer using the current satLayerName
      const currentLayer = createLayer(currentTime, layerName);
      const dataInf = currentLayer.style.layers[0]?.id;
      setDataInfo(dataInf);
      map.Layers.add(currentLayer);

      // Store only the current layer
      activeLayersRef.current = { [step]: currentLayer };
    } catch (error) {
      console.error("Error updating WMS layer:", error);
    }
  };

  useEffect(() => {
    const waitForTitle = setInterval(() => {
      const titleEl = document.getElementsByClassName("title");
      if (titleEl.length > 0) {
        clearInterval(waitForTitle);
        handleDayClick();
        // getLoc();
        intervalRef.current = setTimeout(getLoc, 5000);        
      }
    }, 100);

    return () => clearInterval(waitForTitle);
  }, []);

  // useEffect(() => {

  const getLoc = (layerName, currentTime) => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const pm25Response = await axios.get(
          `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`,
          { signal }
        );

        const pm25Data = pm25Response.data.data;
        const { tb_tn: tb, ap_tn: ap, pv_tn: pv } = pm25Data.loc;
        const time = currentTime;

        const fullDate = `${time}-01`;

        const unixTimestamp = new Date(fullDate).getTime();

        const modis_hid = await axios.get(
          `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/${layerName}/ImageServer/identify`,
          {
            params: {
              geometry: `{y:${latitude},x:${longitude}}`,
              geometryType: "esriGeometryPoint",
              time: unixTimestamp,
              returnGeometry: false,
              returnCatalogItems: true,
              returnPixelValues: true,
              processAsMultidimensional: false,
              maxItemCount: 10,
              f: "pjson",
            },
          }
        );

        const hid_value = modis_hid.data.value;
        const hid = parseFloat(hid_value);

        const hidUnix = new Date();
        const thaiWeekdays = [
          "อาทิตย์",
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัสบดี",
          "ศุกร์",
          "เสาร์",
        ];
        const weekday = thaiWeekdays[hidUnix.getDay()];

        const updateElement = document.getElementById("update");
        updateElement.innerHTML = `* ค่าพยากรณ์อากาศ วัน${weekday}ที่ ${hidUnix.getDate()} 
                                                           ${new Intl.DateTimeFormat("th-TH", { month: "long" }).format(hidUnix)} 
                                                           ${hidUnix.getFullYear() + 543}`;

        const locationElement = document.getElementById("location");
        locationElement.innerHTML = `${tb} ${ap} ${pv}`;

        let color, level, strokeColor, strokeWidth;

        const valueElement = document.getElementById("value");
        const levelElement = document.getElementById("level");

        // แสดง spinner และข้อความโหลดล่วงหน้า
        valueElement.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: center; height: 30px;">
                <div style="width: 24px; height: 24px; border: 3px solid #ccc; border-top: 3px solid #333; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              </div>
            `;
        levelElement.innerHTML = `<span style="color: #999999; font-weight: bold; font-size: 30px;"></span>`;

        // เพิ่ม keyframes สำหรับ spinner
        const style = document.createElement("style");
        style.innerHTML = `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `;
        document.head.appendChild(style);

        // โหลดข้อมูลและอัปเดตผลลัพธ์
        setTimeout(() => {
          if (isNaN(hid)) {
            color = "#999999";
            level = "ไม่พบข้อมูล";
          } else if (hid < 0) {
            color = "#C5E0D3";
            level = "ดีมาก";
          } else if (hid >= 0 && hid <= 0.005) {
            color = "#8CC2AB";
            level = "ดี";
          } else if (hid >= 0.005 && hid <= 0.01) {
            color = "#FFD046";
            strokeColor = "#00000099";
            strokeWidth = "1";
            level = "ปกติ";
          } else if (hid >= 0.01 && hid <= 0.015) {
            color = "#F49C30";
            level = "ควรระวัง";
          } else if (hid >= 0.015 && hid <= 0.02) {
            color = "#E9671C";
            level = "เฝ้าระวัง";
          } else {
            color = "#DC3546";
            level = "อันตราย";
          }

          valueElement.innerHTML =
            isNaN(hid) || hid === ""
              ? `<span style="color: ${color}; -webkit-text-stroke: ${strokeWidth}px ${strokeColor}; text-shadow: 0 0 ${strokeWidth}px ${strokeColor};"></span>`
              : `<span style="color: ${color}; -webkit-text-stroke: ${strokeWidth}px ${strokeColor}; text-shadow: 0 0 ${strokeWidth}px ${strokeColor};">
                    ${hid.toFixed(3)}
                  </span>`;

          levelElement.innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px; -webkit-text-stroke: ${strokeWidth}px ${strokeColor};"> ${level}</span>`;
        }, 2500);

        const fetchTemp = () => {
          const culture = "th-TH";
          const forecastStatus = (
            <span style={{ color: "#a6a4a4", fontSize: "16px" }}>
              <CloudOffTwoToneIcon
                style={{
                  color: "#a6a4a4",
                  width: 30,
                  verticalAlign: "middle",
                }}
              />
              ค่าพยากรณ์อากาศไม่พร้อมใช้งาน
            </span>
          );
          fetch(
            `https://life-dee-proxy-552507355198.asia-southeast1.run.app/3Hour?FilterText=${pv}&Culture=${culture}`
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
              const dryBlubTemperature = data.weather3Hour.dryBlubTemperature;
              const temp = dryBlubTemperature.toFixed(0);
              const rainFall = data.weather3Hour.rainfall;

              let rainValue;
              let rainfallIcon;
              let rainText;
              let mm;

              if (rainFall === undefined || rainFall === null) {
                // No rainfall data available
                rainfallIcon = (
                  <CloudOffTwoToneIcon
                    style={{
                      color: "#a6a4a4",
                      width: 30,
                      verticalAlign: "middle",
                    }}
                  />
                );
                rainText = forecastStatus;
                rainValue = "";
                mm = "";
              } else {
                // Rainfall data processing
                if (rainFall < 0.1) {
                  rainfallIcon = noRain;
                  rainText = "ไม่มีฝนตก";
                  rainValue = "";
                  mm = "";
                } else if (rainFall <= 10) {
                  rainfallIcon = lightRain;
                  rainText = "ฝนตก";
                  rainValue = rainFall;
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
              }

              const weatherElement = document.getElementById("weather");
              weatherElement.innerHTML = `
                      ${rainfallIcon ? `<img style="width: 30px; vertical-align: middle;" src="${rainfallIcon}" alt="Rainfall Icon" />` : ReactDOMServer.renderToString(rainfallIcon)}
                      <span style="color: #a6a4a4; font-size: 16px;">${temp || ReactDOMServer.renderToString(forecastStatus)} °C</span>
                    `;

              // Update rainfall info
              const rain = document.getElementById("rainfall");
              rain.innerHTML = `
                      <span style="font-size: 16px; color: #a6a4a4;">
                        ${ReactDOMServer.renderToString(rainText || forecastStatus)}
                        ${rainValue !== undefined ? rainValue : ReactDOMServer.renderToString(forecastStatus)} 
                        ${mm || ""}
                      </span>
                    `;
            })
            .catch((error) => {
              console.error(
                "There has been a problem with your fetch operation:",
                error
              );

              const weatherElement = document.getElementById("weather");
              weatherElement.innerHTML = `
                      <span style="color: #a6a4a4; font-size: 16px;"></span>
                    `;

              const rain = document.getElementById("rainfall");
              rain.innerHTML = `
                      <span style="font-size: 16px; color: #a6a4a4;">
                        
                        </span>
                    `;

              const rainper = document.getElementById("rainPer");
              rainper.innerHTML = `
                      <span style="font-size: 16px; color: #a6a4a4;">
                        ${ReactDOMServer.renderToString(forecastStatus)}
                        </span>
                    `;

              const wind = document.getElementById("wind");
              wind.innerHTML = `
                      <span style="font-size: 16px; color: #a6a4a4;">
                        
                        </span>
                    `;
            });
        };
        fetchTemp();

        const fetchRain = () => {
          const culture = "th-TH";
          fetch(
            `https://life-dee-proxy-552507355198.asia-southeast1.run.app/7Day?FilterText=${pv}&Culture=${culture}`
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
                const weatherForecast = forecastData.weatherForecast7Day;
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
                console.error("ค่าพยากรณ์อากาศไม่พร้อมใช้งาน ณ ขณะนี้");
              }
            })
            .catch((error) => {
              console.error(
                "There has been a problem with your fetch operation:",
                error
              );
            });
        };
        fetchRain();
      });
    } catch (error) {
      console.error("Error in getLoc:", error);
    }
  };

  useEffect(() => {
    if (satLayerName) {
      updateLayer({ step: 1 });
    }
  }, []);

  const togglePlayStop = (layerName) => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(() => {
        setActiveStep((prevActiveStep) => {
          const newStep = prevActiveStep < 51 ? prevActiveStep + 1 : 1;
          updateLayer({ step: newStep, layerName });
          if (newStep > 51) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
          }
          return newStep;
        });
      }, 1500);
      setIsPlaying(true);
    }
  };

  const handleSlide = ({ step, layerName }) => {
    satlayRef.current = step;

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateLayer({ step, layerName });
      setActiveStep(step);
    }, 500);
  };

  // const handleSlide = ({ step, layerName }) => {
  //   console.log("New step:", step);
  //   console.log("LayerName:", layerName, typeof layerName);
  //   satlayRef.current = step;

  //   clearTimeout(debounceTimer.current);
  //   debounceTimer.current = setTimeout(() => {
  //     setActiveStep(() => {
  //       console.log("Updating active step to:", step);
  //       if (typeof layerName !== "string") {
  //         console.error("layerName is not string! Fix it before updateLayer.");
  //         return step; // หรือ handle error
  //       }
  //       updateLayer({ step, layerName });
  //       return step;
  //     });
  //   }, 500);
  // };

  const handleNext = () => {
    const nextStep = Math.min(activeStep + 1, 52);
    updateLayer({ step: nextStep, layerName: satLayerName });
    setActiveStep(nextStep);
  };

  const handleBack = () => {
    const prevStep = Math.max(activeStep - 1, 1);
    updateLayer({ step: prevStep, layerName: satLayerName });
    setActiveStep(prevStep);
  };

  useEffect(() => {
    if (sphereMapRef.current) {
      console.log("Directly calling updateLayer...");
      updateLayer({ step: 1 });
    }
  }, [sphereMapRef.current]);

  ////////////// SLider Style //////////////
  function SliderValueLabel() {
    return (
      <span className="label">
        <div id="slideLabel" className="value"></div>
      </span>
    );
  }
  ////////////// SLider Style //////////////

  SliderValueLabel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
  };

  const blue = {
    100: "#DAECFF",
    200: "#99CCF3",
    400: "#3399FF",
    300: "#66B2FF",
    500: "#007FFF",
    600: "#0072E5",
    700: "#0059B3",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Slider = styled(BaseSlider)(
    ({ theme }) => `
    // color: ${theme.palette.mode === "light" ? blue[500] : blue[400]};
    color: #FFBD59;
    height: 6px;
    width: 100%;
    display: inline-flex;
    align-items: center;
    position: absolute;
    cursor: pointer;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  
    &.${sliderClasses.disabled} {
      pointer-events: none;
      cursor: default;
      color: ${theme.palette.mode === "light" ? grey[300] : grey[600]};
      opacity: 0.4;
    }
  
    & .${sliderClasses.rail} {
      display: block;
      position: absolute;
      width: 100%;
      height: 4px;
      border-radius: 6px;
      background-color: currentColor;
      opacity: 0.3;
    }
  
    & .${sliderClasses.track} {
      display: block;
      position: absolute;
      height: 4px;
      border-radius: 6px;
      background-color: currentColor;
    }
  
    & .${sliderClasses.thumb} {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      margin-left: -6px;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border-radius: 50%;
      outline: 0;
      // background-color: ${theme.palette.mode === "light" ? blue[500] : blue[400]};
      background-color: #FF9900;
      transition-property: box-shadow, transform;
      transition-timing-function: ease;
      transition-duration: 120ms;
      transform-origin: center;
  
      &:hover {
        box-shadow: 0 0 0 6px ${alpha(
          theme.palette.mode === "light" ? blue[200] : blue[300],
          0.3
        )};
      }
  
      &.${sliderClasses.focusVisible} {
        box-shadow: 0 0 0 8px ${alpha(
          theme.palette.mode === "light" ? blue[200] : blue[400],
          0.5
        )};
        outline: none;
      }
  
      &.${sliderClasses.active} {
        box-shadow: 0 0 0 8px ${alpha(
          theme.palette.mode === "light" ? blue[200] : blue[400],
          0.5
        )};
        outline: none;
        transform: scale(1.2);
      }
    }
  
      & .label {
        font-family: "IBM Plex Sans", sans-serif;
        font-weight: 600;
        font-size: 14px;
        background: unset;
        // background-color: ${theme.palette.mode === "light" ? blue[600] : blue[900]};
        background-color: #FF9900;
        width: 32px;
        height: 32px;
        padding: 0;
        visibility: hidden;
        color: #fff;
        border-radius: 50% 50% 50% 0;
        position: absolute;
        transform: translate(0%, -140%) rotate(-45deg) scale(0);
        transition: transform 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
  
      :hover .label {
        visibility: visible;
        transform: translate(0%, -140%) rotate(-45deg) scale(1);
      }
  
      :hover .value {
        transform: rotate(45deg);
        text-align: center;
      }
  `
  );

  return (
    <>
      <MediaCard />
      <Box
        style={{
          zIndex: 20,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "5%",
        }}
      >
        <Stack
          className="Stack"
          sx={{
            position: "absolute",
            zIndex: 10,
            bottom: "90px",
            left: "50%",
            transform: "translate(-50%)",
          }}
          direction="row"
          spacing={1}
        >
          <Chip
            className="layerChip"
            onClick={handleDayClick}
            id="UTFVI_TH_D"
            layer=""
            size="medium"
            sx={{
              boxShadow:
                activeButton === "UTFVI_TH_D"
                  ? "inset 0px 3.88883px 3.88883px rgba(0, 0, 0, 0.3)"
                  : "3px 3px 2.5px 0.25px rgba(255, 140, 0, 0.5)",
              background:
                activeButton === "UTFVI_TH_D"
                  ? // ? 'linear-gradient(50deg, #FF8A00 0%, #FF6D00 100%)'
                    "rgba(165, 179, 192, 0.5);"
                  : "linear-gradient(50deg, #FFB74D 50%, #FF9800 80%)",
              "&:hover": {
                boxShadow: "0px 4px 6px rgba(255, 140, 0, 0.5)",
                cursor: "pointer",
                background: "linear-gradient(50deg, #FFA726 50%, #FF8A00 80%)",
              },
              "&:active": {
                boxShadow: "inset 0px 5px 5px rgba(0, 0, 0, 0.4)",
                background: "linear-gradient(50deg, #FF6D00 50%, #E65100 80%)",
              },
            }}
            icon={
              <CloudRoundedIcon
                style={{
                  color: activeButton === "UTFVI_TH_D" ? "#E65100" : "#FFBC57",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)",
                  padding: "2px",
                }}
              />
            }
            label={
              <span
                id="LyrName"
                style={{
                  color: "white",
                  textShadow: "0.25px 0.25px white, -0.5px 0.2px #3e3e3e",
                }}
              >
                ดัชนีความร้อนจากดาวเทียม (กลางวัน)
              </span>
            }
          />
          <Chip
            className="layerChip"
            onClick={handleNightClick}
            id="UTFVI_TH_N"
            layer=""
            size="medium"
            sx={{
              boxShadow:
                activeButton === "UTFVI_TH_N"
                  ? "inset 0px 3.88883px 3.88883px rgba(0, 0, 0, 0.3)"
                  : "3px 3px 2.5px 0.25px rgba(255, 140, 0, 0.5)",
              background:
                activeButton === "UTFVI_TH_N"
                  ? // ? 'linear-gradient(50deg, #FF8A00 0%, #FF6D00 100%)'
                    "rgba(165, 179, 192, 0.5);"
                  : "linear-gradient(50deg, #FFB74D 50%, #FF9800 80%)",
              "&:hover": {
                boxShadow: "0px 4px 6px rgba(255, 140, 0, 0.5)",
                cursor: "pointer",
                background: "linear-gradient(50deg, #FFA726 50%, #FF8A00 80%)",
              },
              "&:active": {
                boxShadow: "inset 0px 5px 5px rgba(0, 0, 0, 0.4)",
                background: "linear-gradient(50deg, #FF6D00 50%, #E65100 80%)",
              },
            }}
            icon={
              <NightsStayRoundedIcon
                style={{
                  color: activeButton === "UTFVI_TH_N" ? "#E65100" : "#FFBC57",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)",
                  padding: "2px",
                }}
              />
            }
            label={
              <span id="LyName" style={{ color: "white" }}>
                ดัชนีความร้อนจากดาวเทียม (กลางคืน)
              </span>
            }
          />
        </Stack>

        <Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              color: "#7a7a7a",
              zIndex: 16,
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              id="dataInf"
              LayerSelected=""
              dataDate=""
              className="dateTimeUpdate"
              variant="subtitle1"
              display="block"
              sx={{ fontFamily: `'Prompt', sans-serif`, margin: "0.15rem" }}
            >
              {/* {activeStep} */}
            </Typography>
          </Box>

          <Slider
            defaultValue={activeStep}
            shiftStep={1}
            max={52}
            min={1}
            step={1}
            marks
            onChange={(_, value) =>
              handleSlide({ step: value, layerName: satLayerName })
            }
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value}
            aria-label="Small"
            // slots={{
            //   valueLabel: (props) => (
            //     <SliderValueLabel {...props} value={activeStep} />
            //   ),
            // }}
            sx={{
              height: "75px",
              padding: "0",
              width: 510,
              borderRadius: "18px",
              flexGrow: 1,
              zIndex: 17,
              position: "absolute",
              left: "calc(50% + 2rem)",
              transform: "translateX(-50%)",
              bottom: "5%",
              "@media (max-width: 1024px)": {
                maxWidth: "70%",
              },
              "@media (max-width: 768px)": {
                maxWidth: "50%",
              },
              "@media (max-width: 480px)": {
                maxWidth: "40%",
              },
              "& .MuiLinearProgress-bar": {
                backgroundColor: "rgba(255, 178, 0, 0)",
                borderRadius: "20px",
              },
            }}
          />

          <MobileStepper
            variant="progress"
            steps={60}
            position="static"
            activeStep={activeStep}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              height: "75px",
              padding: "0",
              maxWidth: "700px",
              minWidth: "400px",
              borderRadius: "18px",
              flexGrow: 1,
              zIndex: 15,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "5%",
              "& .MuiLinearProgress-root": {
                backgroundColor: "lightgrey",
                width: "500px",
                height: "5px",
                zIndex: 0,
                borderRadius: "15px",
                "@media (max-width: 1024px)": {
                  maxWidth: "70%",
                },
                "@media (max-width: 768px)": {
                  maxWidth: "50%",
                },
                "@media (max-width: 480px)": {
                  maxWidth: "40%",
                },
              },
              "& .MuiLinearProgress-bar": {
                backgroundColor: "rgba(255, 178, 0, 0)",
                borderRadius: "20px",
              },
            }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === 60}
              >
                {theme.direction === "rtl" ? (
                  <NavigateBeforeIcon
                    sx={{
                      color:
                        activeStep === 60
                          ? "rgba(128, 128, 128, 0.5)"
                          : "#FF10900",
                      fontSize: "3rem",
                    }}
                  />
                ) : (
                  <NavigateNextIcon
                    sx={{
                      color:
                        activeStep === 60
                          ? "rgba(128, 128, 128, 0.5)"
                          : "#FF9900",
                      fontSize: "3rem",
                    }}
                  />
                )}
              </Button>
            }
            backButton={
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Play Button */}
                <Button
                  onClick={() => togglePlayStop(satLayerName)}
                  sx={{
                    marginRight: "0.5rem",
                    padding: "0",
                  }}
                >
                  {isPlaying ? (
                    <StopCircleIcon
                      sx={{
                        color: "#FF9900",
                        bgColor: "#9d0300",
                        fontSize: "3rem",
                      }}
                    />
                  ) : (
                    <PlayCircleIcon
                      sx={{ color: "#FF9900", fontSize: "3rem" }}
                    />
                  )}
                </Button>
                {/* Play Button */}

                {/* Previous Button */}
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 1}
                  sx={{
                    margin: "0",
                    width: "50px",
                  }}
                >
                  {theme.direction === "rtl" ? (
                    <NavigateNextIcon
                      sx={{
                        color:
                          activeStep === 1
                            ? "rgba(128, 128, 128, 0.5)"
                            : "#FF9900",
                        fontSize: "3rem",
                      }}
                    />
                  ) : (
                    <NavigateBeforeIcon
                      sx={{
                        color:
                          activeStep === 1
                            ? "rgba(128, 128, 128, 0.5)"
                            : "#FF9900",
                        fontSize: "3rem",
                      }}
                    />
                  )}
                </Button>
              </div>
            }
          />
        </Box>
      </Box>
    </>
  );
});

SatControl.displayName = "SatControl";

export default SatControl;
