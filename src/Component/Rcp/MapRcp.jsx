/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import "./MapRcp.css";
import { renderToString } from "react-dom/server";
// import { styled, css } from '@mui/system';

//SLIDER
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/system";
import { Slider as BaseSlider, sliderClasses } from "@mui/base/Slider";

//LEGENDS
import DNGLegendSrc from "/assets/Icon/legend/RCP_legend.png";

//Mui infra
import {
  List,
  ListItemButton,
  Box,
  Chip,
  Stack,
  Typography,
  CardContent,
  CardActions,
  Button,
  useStepContext
} from "@mui/material";

import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import { Popper } from "@mui/base/Popper";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import StraightenIcon from "@mui/icons-material/Straighten";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Vaccines from "@mui/icons-material/Vaccines";
import MedicalInformation from "@mui/icons-material/MedicalInformation";
import InfoIcon from "@mui/icons-material/Info";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
// import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//Icon
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
// import CircularProgress from '@mui/material/CircularProgress';
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LayersIcon from "@mui/icons-material/Layers";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Street from "/assets/Icon/street.svg";
import Satt from "/assets/Icon/satt.svg";
import ClearIcon from "@mui/icons-material/Clear";
import WrongLocationIcon from "@mui/icons-material/WrongLocation";
import GoogleIcon from "@mui/icons-material/Google";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import NavigationIcon from '@mui/icons-material/Navigation';
// import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
//weather icon
// import noRain from "../../weather/0_no_rain.svg";
// import lightRain from "../../weather/1_light_rain.svg";
// import moderateRain from "../../weather/2_moderate_rain.svg";
// import heavyRain from "../../weather/3_heavy_rain.svg";
// import veryHeavyRain from "../../weather/4_very_heavy.svg";
// import CloudOffTwoToneIcon from "@mui/icons-material/CloudOffTwoTone";

// import MediaCard from "../Card_dng";
// import HealthInsert from './HealthInsert.jsx'
import MiniDrawer from "../NavigationBar/SidebarRcp.jsx";
// import Dashboard from "./DashboardRCP.jsx";

const MapDng = () => {
  //MODAL

  const mapRef = useRef(null);
  const sphereMapRef = useRef(null);
  const intervalRef = useRef(null);
  const [wmsLayer, setWmsLayer] = useState(null);
  const [selectedYear45, setselectedYear45] = useState(2029);
  const [selectedYear85, setselectedYear85] = useState(2027);
  const [budhistYear, setbudhistYear] = useState();
  const [rcpLayer, setrcpLayer] = useState("");

  const [sliderValue, setSliderValue] = useState(1);
  // let sliderStep = null;
  const [sliderStep, setsliderStep] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false);
  const playInterval = useRef(null);
  const [limit, setLimit] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [updateDate, setupdateDate] = useState(null)

  const [bearingAngle, setbearingAngle] = useState(0);


  


  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://api.sphere.gistda.or.th/map/?key=F580F0C0ED264853B55FB58261D0E9E8";
    script.async = true;
    document.body.appendChild(script);

    const DNGLegend = document.getElementById("legend");
    if (DNGLegend) {
      DNGLegend.src = DNGLegendSrc;
      DNGLegend.style.width = "355px";
      DNGLegend.style.position = "relative";
      DNGLegend.style.top = "0";
      DNGLegend.style.left = "0";
      DNGLegend.style.right = "1rem";
      DNGLegend.style.zIndex = "10";
    }

    script.onload = () => {
      var sphere = window.sphere;
      var map = new window.sphere.Map({
        placeholder: mapRef.current,
      });
      sphereMapRef.current = map;

      map.Event.bind(sphere.EventName.Rotate, function () {
      });

      map.Event.bind(sphere.EventName.Ready, async function () {
        map.Ui.Geolocation.visible(false);
        map.Ui.Fullscreen.visible(false);
        map.Ui.DPad.visible(false);
        map.Ui.Zoombar.visible(false);
        map.Ui.Toolbar.visible(false);
        map.Ui.Scale.visible(false);
        map.Ui.LayerSelector.visible(false);

        let thBound = new sphere.Layer("0", {
          type: sphere.LayerType.WMS,
          url: "https://gistdaportal.gistda.or.th/data2/services/L05_Province_GISTDA_50k_nonlabel/MapServer/WMSServer",
          zoomRange: { min: 1, max: 15 },
          zIndex: 10,
          opacity: 1,
          id: "L05_Province_GISTDA_50k_nonlabel",
        });
        map.Layers.add(thBound);

        if (map && map.Ui && map.Ui.Geolocation) {
          map.goTo({
            center: { lon: 102.10759622496983, lat: 14.97385471711737 },
            zoom: 8,
          });
          //   map.Ui.Geolocation.trigger();
        } else {
          console.error("Geolocation control is not available.");
        }
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const rcp45Select = () => {

    setActiveScenario('rcp45');

    if (!sphereMapRef.current) return;

    const map = sphereMapRef.current;

    map.goTo({
      center: { lon: 102.10759622496983, lat: 14.97385471711737 },
      zoom: 8,
    });

    //////// RCP45 TIME + 4 1)2029 2)2033 3)2037 4)2042 5)2046 ////////
    
    const newWmsLayer = new window.sphere.Layer(`RCP45_Korat_26_50`, {
      type: window.sphere.LayerType.WMS,
      url: `https://gistdaportal.gistda.or.th/imagedata/services/GISTDA_LifeD/RCP45_Korat_26_50/ImageServer/WMSServer?&time=${selectedYear45}`,
      layers: `RCP45_Korat_26_50:UTFVI_Transparent`,
      format: "image/png",
      transparent: true,
      zoomRange: { min: 1, max: 15 },
      opacity: 0.6,
      zIndex: 5
    });

    if (wmsLayer) {
      map.Layers.remove(wmsLayer);
    }
    map.Layers.add(newWmsLayer);

    const startyear = [2028, 2030, 2035, 2040, 2042, 2047];
    const endYear = [2030, 2033, 2038, 2042, 2045, 2050];

    const pairedYears = startyear.map((start, index) => ({
      start,
      end: endYear[index]
    }));

    const match = pairedYears.find(pair => selectedYear45 >= pair.start && selectedYear45 <= pair.end);

    if (match) {
      const startBuddhist = match.start + 543;
      const endBuddhist = match.end + 543;
      setbudhistYear(`${startBuddhist} - ${endBuddhist}`);
    }

    setWmsLayer(newWmsLayer);
    setrcpLayer("RCP45");

    const rcp45Data = async () => {
      try {
        const res = await axios.get(
          `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/RCP45_Korat_26_50/ImageServer/identify`,
          {
            params: {
              geometry: `{ y: 14.97385471711737,x: 102.10759622496983 }`,
              geometryType: "esriGeometryPoint",
              time: `${selectedYear45}-01-01`,
              returnGeometry: false,
              returnCatalogItems: true,
              returnPixelValues: false,
              processAsMultidimensional: false,
              f: "pjson",
            },
          }
        );
    
        const updateDate = res.data.catalogItems.features[0].attributes.UpdateDate;
        const date = new Date(updateDate);

        const day = date.getDate();
        const yearBE = date.getFullYear() + 543;

        const monthNames = [
          "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
          "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const monthName = monthNames[date.getMonth()];

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedDateTime = `${day} ${monthName} ${yearBE} เวลา ${hours-7}:${minutes} น.`;
        setupdateDate(formattedDateTime)

      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      }
    };
    rcp45Data();
    

    let step = null;

    for (let i = 0; i < startyear.length; i++) {
      // console.log(`Checking range: ${startyear[i]} - ${endYear[i]}`);
      if (selectedYear45 >= startyear[i] && selectedYear45 <= endYear[i]) {
        step = i + 1;
        // console.log(`selectedYear45 (${selectedYear45}) is in range ${startyear[i]}-${endYear[i]}`);
        // console.log(`sliderStep is set to ${step}`);
        break;
      }
    }

    if (step === null) {
      // console.log(`selectedYear45 (${selectedYear45}) is not in any defined range.`);
    }

    setsliderStep(step);
    handleSlide("RCP45");

    

  };

  useEffect(() => {
  if (
    sphereMapRef.current &&
    selectedYear45 &&
    typeof setActiveScenario === 'function'
  ) {
    // console.log("rcp45Select กำลังจะรัน...");
    rcp45Select();
  }
}, [sphereMapRef.current, selectedYear45]);

  

  useEffect(() => {
    setTimeout(() => {
      rcp45Select();
    }, 3000);
  }, []);

  const rcp85Select = () => {

    setActiveScenario('rcp85');

    if (!sphereMapRef.current) return;

    const map = sphereMapRef.current;

    map.goTo({
      center: { lon: 102.10759622496983, lat: 14.97385471711737 },
      zoom: 8,
    });

    //////// RCP85 TIME + 4 1)2027 2)2032 3)2037 4)2042 5)2047 ////////
    
    const newWms85 = new window.sphere.Layer(`RCP85_Korat_26_50`, {
      type: window.sphere.LayerType.WMS,
      url: `https://gistdaportal.gistda.or.th/imagedata/services/GISTDA_LifeD/RCP85_Korat_26_50/ImageServer/WMSServer?&time=${selectedYear85}`,
      layers: `RCP85_Korat_26_50:UTFVI_Transparent`,
      format: "image/png",
      transparent: true,
      zoomRange: { min: 1, max: 15 },
      opacity: 0.6,
      zIndex: 5
    });

    if (wmsLayer) {
      map.Layers.remove(wmsLayer);
    }
    map.Layers.add(newWms85);

    const startyear = [2026, 2030, 2035, 2040, 2045];
    const endYear = [2028, 2033, 2038, 2042, 2047];

    const pairedYears = startyear.map((start, index) => ({
      start,
      end: endYear[index]
    }));

    const match = pairedYears.find(pair => selectedYear85 >= pair.start && selectedYear85 <= pair.end);

    if (match) {
      const startBuddhist = match.start + 543;
      const endBuddhist = match.end + 543;
      setbudhistYear(`${startBuddhist} - ${endBuddhist}`);
    }

    setWmsLayer(newWms85);
    setrcpLayer("RCP85")
    
    const rcp85Data = async () => {
      try {
        const res = await axios.get(
          `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/RCP45_Korat_26_50/ImageServer/identify`,
          {
            params: {
              geometry: `{ y: 14.97385471711737,x: 102.10759622496983 }`,
              geometryType: "esriGeometryPoint",
              time: `${selectedYear85}-01-01`,
              returnGeometry: false,
              returnCatalogItems: true,
              returnPixelValues: false,
              processAsMultidimensional: false,
              f: "pjson",
            },
          }
        );
    
        const updateDate = res.data.catalogItems.features[0].attributes.UpdateDate;
        const date = new Date(updateDate);

        const day = date.getDate();
        const yearBE = date.getFullYear() + 543;

        const monthNames = [
          "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
          "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const monthName = monthNames[date.getMonth()];

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedDateTime = `${day} ${monthName} ${yearBE} เวลา ${hours-7}:${minutes} น.`;
        setupdateDate(formattedDateTime)

      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      }
    };
    rcp85Data();


    // let sliderStep = null;

    let step = null;

    for (let i = 0; i < startyear.length; i++) {
      // console.log(`Checking range: ${startyear[i]} - ${endYear[i]}`);
      if (selectedYear85 >= startyear[i] && selectedYear85 <= endYear[i]) {
        step = i + 1;
        // console.log(`selectedYear85 (${selectedYear85}) is in range ${startyear[i]}-${endYear[i]}`);
        // console.log(`sliderStep is set to ${step}`);
        break;
      }
    }

    if (step === null) {
      // console.log(`selectedYear85 (${selectedYear85}) is not in any defined range.`);
    }

    setsliderStep(step);
    handleSlide("RCP85");

  };

  const handleSlide = (event, newValue) => {
    // console.log('----- Use Slide -----:', newValue);
    setSliderValue(newValue);

    if (rcpLayer === 'RCP45') {
      const baseYear = 2028;
      const maxYear = 2050;

      const targetYear = baseYear + (newValue - 1) * 4;

      setselectedYear45((prev) => {
        const newYear = Math.min(targetYear, maxYear);
        if (newYear >= baseYear && newYear <= maxYear) {
          rcp45Select();
          return newYear;
        }
        return prev;
      });
    } else if (rcpLayer === 'RCP85') {
      const baseYear = 2026;
      const maxYear = 2047;

      const targetYear = baseYear + (newValue - 1) * 6;

      setselectedYear85((prev) => {
        const newYear = Math.min(targetYear, maxYear);
        if (newYear >= baseYear && newYear <= maxYear) {
          rcp85Select();
          return newYear;
        }
        return prev;
      });
    }
  };


  const handlePlay = () => {
    if (isPlaying) {
      clearInterval(playInterval.current);
      playInterval.current = null;
      setIsPlaying(false);
    } else {
      const step = rcpLayer === 'RCP45' ? 4 : 5;
      const maxYear = rcpLayer === 'RCP45' ? 2050 : 2047;
      const baseYear = rcpLayer === 'RCP45' ? 2028 : 2026;

      playInterval.current = setInterval(() => {
        if (rcpLayer === 'RCP45') {
          setselectedYear45((prev) => {
            const next = prev + step;
            return next > maxYear ? baseYear : next;
          });
        } else if (rcpLayer === 'RCP85') {
          setselectedYear85((prev) => {
            const next = prev + step;
            return next > maxYear ? baseYear : next;
          });
        }
      }, 2000);

      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (rcpLayer === 'RCP45') {
      setSliderValue((prev) => prev + 1);
      rcp45Select();
    }
  }, [selectedYear45]);

  useEffect(() => {
    if (rcpLayer === 'RCP85') {
      setSliderValue((prev) => prev + 1);
      rcp85Select();
    }
  }, [selectedYear85]);
  

  const handleNext = () => {
    const step = rcpLayer === 'RCP45' ? 4 : 5;
  
    if (rcpLayer === 'RCP45') {
      setselectedYear45((prev) => {
        const nextYear = prev + step;
        if (nextYear <= 2050) {
          rcp45Select();
          setLimit(6)
          setSliderValue((prev) => prev + 1);
          return nextYear;
        }
        return prev;
      });
    } else if (rcpLayer === 'RCP85') {
      setselectedYear85((prev) => {
        const nextYear = prev + step;
        if (nextYear <= 2047) {
          rcp85Select();
          setLimit(5)
          setSliderValue((prev) => prev + 1);
          return nextYear;
        }
        return prev;
      });
    }
  };
  

  const handleBack = () => {
    const step = rcpLayer === 'RCP45' ? 4 : 5;
  
    if (rcpLayer === 'RCP45') {
      setselectedYear45((prev) => {
        const backYear = prev - step;
        if (backYear >= 2028) {
          rcp45Select();
          setSliderValue((prev) => prev - 1);
          return backYear;
        }
        return prev;
      });
    } else if (rcpLayer === 'RCP85') {
      setselectedYear85((prev) => {
        const backYear = prev - step;
        if (backYear >= 2026) {
          rcp85Select();
          setSliderValue((prev) => prev - 1);
          return backYear;
        }
        return prev;
      });
    }
  };
  

  useEffect(() => {
    if (rcpLayer === 'RCP45') {
      rcp45Select();
    }
  }, [selectedYear45]);
  
  useEffect(() => {
    if (rcpLayer === 'RCP85') {
      rcp85Select();
    }
  }, [selectedYear85]);


  
  let loadingCardAdded = false;

  const insertAllhospital = async () => {
    const map = sphereMapRef.current;
    map.Overlays.clear();

    // Function to show the loading card
    const showLoadingCard = () => {
      if (loadingCardAdded) {
        return;
      }

      const loadingAllHtml = `
            <div class="all" style="
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    border: 3px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 3px solid #3498db;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                "></div>
                <span style="font-size: 14px;">กำลังค้นหาสถานพยาบาลทั้งหมดใกล้ฉัน...</span>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

      document.body.insertAdjacentHTML("beforeend", loadingAllHtml);
      loadingCardAdded = true;

      // Remove the loading card after a delay
      setTimeout(() => {
        const loadingCardAllElements = document.getElementsByClassName("all");
        while (loadingCardAllElements.length > 0) {
          loadingCardAllElements[0].remove();
        }
        loadingCardAdded = false;
      }, 4500);
    };

    showLoadingCard();

    await Promise.all([insertHospital(), insertClinic(), insertHealthSt()]);
  };

  const insertHospital = async () => {
    const map = sphereMapRef.current;
    map.Overlays.clear();

    const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาโรงพยาบาลใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", loadingHtml);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const poiResponse = await axios.get(
          `https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=โรงพยาบาล&key=F580F0C0ED264853B55FB58261D0E9E8`
        );
        const responseData = poiResponse.data.data;
        // console.log(responseData);

        const routePromises = responseData.map(async (item) => {
          const { lat, lon } = item;

          try {
            const routeResponse = await axios.get(
              `https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
            );
            return routeResponse.data.data.distance;
          } catch (error) {
            console.error("Error fetching route data:", error);
            return null;
          }
        });

        const distances = await (routePromises);

        responseData.forEach((item, index) => {
          const { lat, lon, name, address, tel } = item;
          const distance = distances[index];

          const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
          const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

          const cardHtml = renderToString(
            <CardContent
              spacing={1}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, -4.5em)",
                transition: "opacity 0.3s",
                display: "flex",
                whiteSpace: "nowrap",
                borderRadius: "5px",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #FF6968",
              }}
            >
              <Typography component="div">
                <Box style={{ fontWeight: "bold", margin: 1 }}>{name}</Box>
                <Box style={{ fontWeight: "light", margin: 1 }}>{address}</Box>
                <Box
                  sx={{
                    fontWeight: "light",
                    m: 1,
                    color: "#FF6968",
                    verticalAlign: "middle",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tel && (
                    <>
                      <PhoneIcon
                        style={{
                          color: "#FF6968",
                          width: "20px",
                          verticalAlign: "middle",
                        }}
                      />
                      &nbsp;{tel}
                      <br />
                    </>
                  )}
                </Box>
                {distance !== null && (
                  <Box style={{ fontWeight: "light", margin: 1 }}>
                    <StraightenIcon
                      style={{
                        color: "#FF6968",
                        width: "20px",
                        verticalAlign: "middle",
                      }}
                    />
                    &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                  </Box>
                )}
                <CardActions style={{ display: "flex" }}>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={whereMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "20px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        src="https://where.gistda.or.th/favicon.ico"
                        alt="Favicon"
                        style={{
                          width: "1.5em",
                          borderRadius: "50%",
                          padding: "2px",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#FF6968" }}>
                        WHERE
                      </span>
                    </Button>
                  </Box>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={googleMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "20px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <GoogleIcon
                        style={{
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          backgroundColor: "#FF6968",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#FF6968" }}>
                        Google Map
                      </span>
                    </Button>
                  </Box>
                </CardActions>
              </Typography>
            </CardContent>
          );

          const iconHtml = renderToString(
            <LocalHospitalIcon
              style={{
                color: "white",
                borderRadius: "50%",
                backgroundColor: "#FF6968",
                padding: "2px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          );

          const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }

                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }

                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>

                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

          const marker = new window.sphere.Marker(
            { lat, lon },
            {
              icon: {
                html: markerHtml,
                offset: { x: 18, y: 21 },
              },
            }
          );

          map.Overlays.add(marker);
        });

        map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      } catch (error) {
        console.error("Error fetching POI data:", error);

        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      }
    });
  };

  const insertClinic = async () => {
    const map = sphereMapRef.current;
    map.Overlays.clear();

    // Show the loading card
    const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาคลินิกใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", loadingHtml);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const poiResponse = await axios.get(
          `https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Poly%20Clinic&key=F580F0C0ED264853B55FB58261D0E9E8`
        );
        const responseData = poiResponse.data.data;
        // console.log(responseData);

        const routePromises = responseData.map(async (item) => {
          const { lat, lon } = item;

          try {
            const routeResponse = await axios.get(
              `https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
            );
            return routeResponse.data.data.distance;
          } catch (error) {
            console.error("Error fetching route data:", error);
            return null;
          }
        });

        const distances = await (routePromises);

        responseData.forEach((item, index) => {
          const { lat, lon, name, address, tel } = item;
          const distance = distances[index];

          const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
          const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

          const cardHtml = renderToString(
            <CardContent
              spacing={1}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, -4.5em)",
                transition: "opacity 0.3s",
                display: "flex",
                whiteSpace: "nowrap",
                borderRadius: "5px",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #1DBEB8",
              }}
            >
              <Typography component="div">
                <Box style={{ fontWeight: "bold", margin: 1 }}>{name}</Box>
                <Box style={{ fontWeight: "light", margin: 1 }}>{address}</Box>
                <Box
                  sx={{
                    fontWeight: "light",
                    m: 1,
                    color: "#1DBEB8",
                    verticalAlign: "middle",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tel && (
                    <>
                      <PhoneIcon
                        style={{
                          color: "#1DBEB8",
                          width: "20px",
                          verticalAlign: "middle",
                        }}
                      />
                      &nbsp;{tel}
                      <br />
                    </>
                  )}
                </Box>
                {distance !== null && (
                  <Box style={{ fontWeight: "light", margin: 1 }}>
                    <StraightenIcon
                      style={{
                        color: "#1DBEB8",
                        width: "20px",
                        verticalAlign: "middle",
                      }}
                    />
                    &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                  </Box>
                )}
                <CardActions style={{ display: "flex" }}>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={whereMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "20px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        src="https://where.gistda.or.th/favicon.ico"
                        alt="Favicon"
                        style={{
                          width: "1.5em",
                          borderRadius: "50%",
                          padding: "2px",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#1DBEB8" }}>
                        WHERE
                      </span>
                    </Button>
                  </Box>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={googleMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "20px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <GoogleIcon
                        style={{
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          backgroundColor: "#1DBEB8",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#1DBEB8" }}>
                        Google Map
                      </span>
                    </Button>
                  </Box>
                </CardActions>
              </Typography>
            </CardContent>
          );

          const iconHtml = renderToString(
            <Vaccines
              style={{
                color: "white",
                borderRadius: "50%",
                backgroundColor: "#1DBEB8",
                padding: "2px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          );

          const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }

                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }

                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>

                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

          const marker = new window.sphere.Marker(
            { lat, lon },
            {
              icon: {
                html: markerHtml,
                offset: { x: 18, y: 21 },
              },
            }
          );

          map.Overlays.add(marker);
        });

        map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

        // Remove the loading card once markers are added
        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      } catch (error) {
        console.error("Error fetching POI data:", error);

        // Remove the loading card in case of an error
        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      }
    });
  };

  const insertHealthSt = async () => {
    const map = sphereMapRef.current;
    map.Overlays.clear();

    const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาสถานีอนามัยใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", loadingHtml);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const poiResponse = await axios.get(
          `https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Public%20Health%20Center&key=F580F0C0ED264853B55FB58261D0E9E8`
        );
        const responseData = poiResponse.data.data;
        // console.log(responseData);

        const routePromises = responseData.map(async (item) => {
          const { lat, lon } = item;

          try {
            const routeResponse = await axios.get(
              `https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
            );
            return routeResponse.data.data.distance;
          } catch (error) {
            console.error("Error fetching route data:", error);
            return null;
          }
        });

        const distances = await (routePromises);

        responseData.forEach((item, index) => {
          const { lat, lon, name, address, tel } = item;
          const distance = distances[index];

          const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
          const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

          const cardHtml = renderToString(
            <CardContent
              spacing={1}
              style={{
                transform: "translate(-50%, -4.5em)",
                position: "absolute",
                left: "50%",
                transition: "opacity 0.3s",
                display: "flex",
                whiteSpace: "nowrap",
                borderRadius: 15,
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #8DBAFF",
              }}
            >
              <Typography component="div">
                <Box style={{ fontWeight: "bold", margin: 1 }}>{name}</Box>
                <Box style={{ fontWeight: "light", margin: 1 }}>{address}</Box>
                <Box
                  sx={{
                    fontWeight: "light",
                    m: 1,
                    color: "#8DBAFF",
                    verticalAlign: "middle",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tel && (
                    <>
                      <PhoneIcon
                        style={{
                          color: "#8DBAFF",
                          width: "20px",
                          verticalAlign: "middle",
                        }}
                      />
                      &nbsp;{tel}
                      <br />
                    </>
                  )}
                </Box>
                {distance !== null && (
                  <Box style={{ fontWeight: "light", margin: 1 }}>
                    <StraightenIcon
                      style={{
                        color: "#8DBAFF",
                        width: "20px",
                        verticalAlign: "middle",
                      }}
                    />
                    &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                  </Box>
                )}
                <CardActions style={{ display: "flex" }}>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={whereMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "30px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        src="https://where.gistda.or.th/favicon.ico"
                        alt="Favicon"
                        style={{
                          width: "1.5em",
                          borderRadius: "50%",
                          padding: "2px",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#5686E1" }}>
                        WHERE
                      </span>
                    </Button>
                  </Box>
                  <Box style={{ display: "flex", margin: "5px" }}>
                    <Button
                      href={googleMapUrl}
                      target="_blank"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: "180px",
                        height: "30px",
                        padding: "0.5rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        boxShadow:
                          "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                        textDecoration: "none",
                      }}
                    >
                      <GoogleIcon
                        style={{
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          backgroundColor: "#5686E1",
                          boxShadow:
                            "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <span style={{ margin: "10px", color: "#5686E1" }}>
                        Google Map
                      </span>
                    </Button>
                  </Box>
                </CardActions>
              </Typography>
            </CardContent>
          );

          const iconHtml = renderToString(
            <MedicalInformation
              style={{
                color: "white",
                borderRadius: "50%",
                backgroundColor: "#2196F3",
                padding: "2px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          );

          const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }

                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }

                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>

                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

          const marker = new window.sphere.Marker(
            { lat, lon },
            {
              icon: {
                html: markerHtml,
                offset: { x: 18, y: 21 },
              },
            }
          );

          map.Overlays.add(marker);
        });

        map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

        // Remove the loading card once markers are added
        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      } catch (error) {
        console.error("Error fetching POI data:", error);

        // Remove the loading card in case of an error
        const loadingCard = document.getElementById("loading-card");
        if (loadingCard) {
          loadingCard.remove();
        }
      }
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// Search Bar ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const searchRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // const handleSearch = () => {
  //     // https://api.sphere.gistda.or.th/services/search/suggest?
  //     // https://api.sphere.gistda.or.th/services/search/search?keyword=%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%B1%E0%B8%A2&lat=13.7&lon=100.5&limit=3&showdistance=true&key=F580F0C0ED264853B55FB58261D0E9E8
  //     const search = 'https://api.sphere.gistda.or.th/services/search/search?';
  //     const sug = 'https://api.sphere.gistda.or.th/services/search/suggest?'
  //     const inputValue = searchRef.current.value.trim();

  //     if (!inputValue) {
  //         setSuggestions([]);
  //         setShowSuggestions(false);
  //         return;
  //     }

  //     const addressResponse = axios.get(search, {
  //         params: {
  //             keyword: inputValue,
  //             limit: 6,
  //             sdx: true,
  //             key: 'F580F0C0ED264853B55FB58261D0E9E8'
  //         }
  //     });
  //     const addressData = addressResponse.data.data;
  //     const addresses = addressData.map(item => item.address);

  //     axios.get(sug, {
  //         params: {
  //             keyword: inputValue,
  //             limit: 6,
  //             sdx: true,
  //             key: 'F580F0C0ED264853B55FB58261D0E9E8'
  //         }
  //     })
  //         .then(response => {
  //             const data = response.data.data;
              // console.log(data);

  //             // const addresses = data.map(item => item.address);
              // console.log(addresses);

  //             setSuggestions(data);
  //             setShowSuggestions(true);
  //             setSelectedIndex(-1);
  //         })
  // };

  const handleSearch = async () => {
    const sug = "https://api.sphere.gistda.or.th/services/search/suggest?";
    const search = "https://api.sphere.gistda.or.th/services/search/search?";
    const inputValue = searchRef.current.value.trim();

    if (!inputValue) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Fetch addresses
      const addressResponse = await axios.get(search, {
        params: {
          keyword: inputValue,
          limit: 6,
          sdx: true,
          key: "F580F0C0ED264853B55FB58261D0E9E8",
        },
      });
      const addressData = addressResponse.data.data;
      const addresses = addressData.map((item) => item.address);

      // Fetch suggestions
      const sugResponse = await axios.get(sug, {
        params: {
          keyword: inputValue,
          limit: 6,
          sdx: true,
          key: "F580F0C0ED264853B55FB58261D0E9E8",
        },
      });
      const sugData = sugResponse.data.data;

      const combinedSuggestions = sugData.map((item, index) => ({
        ...item,
        address: addresses[index] || "",
      }));

      // Update state with combined suggestions
      setSuggestions(combinedSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedItem = suggestions[selectedIndex];
        searchRef.current.value = selectedItem.name;
        navigate(selectedItem.name);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  useEffect(() => {
    const currentElement = searchRef.current;

    if (currentElement) {
      currentElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [suggestions, selectedIndex, handleKeyDown]);

  // Handle clear button click
  const handleClearClick = () => {
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const handleSuggestionClick = (itemName) => {
    searchRef.current.value = itemName;
    navigate(itemName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const navigate = (itemName) => {
    const loc = `${itemName}`;
    const API = "https://api.sphere.gistda.or.th/services/search/search?";

    axios
      .get(API, {
        params: {
          keyword: loc,
          limit: 6,
          showdistance: true,
          key: "F580F0C0ED264853B55FB58261D0E9E8",
        },
      })
      .then((response) => {
        const responseData = response.data.data;
        // console.log("navigate", responseData);

        if (responseData.length > 0) {
          const Item = responseData[0];
          const searchLat = Item.lat;
          const searchLon = Item.lon;

          const map = sphereMapRef.current;

          var marker = new window.sphere.Marker(
            { lat: searchLat, lon: searchLon },
            {
              icon: {
                html: `
                            <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                                <span style="font-family: 'Prompt'; background-color: white; padding: 10px; border-radius: 15px;">${Item.name}</span><br/>
                                <img src="/assets/Icon/Marker_Animation.gif" alt="Computer man" style="width:48px;height:48px;">
                            </div>
                            `,
                offset: { x: 18, y: 21 },
              },
              // popup: {
              //     title: `<div>
              //                 <span style="font-family: 'Prompt'; font-weight: light;">${Item.name}</span>
              //             </div>`,

              //     detail: `<a href="${googleMapUrl}" target="_blank">
              //                 Open in Google Maps
              //             </a>`
              // }
            }
          );
          map.Overlays.add(marker);
          map.goTo({ center: { lat: searchLat, lon: searchLon }, zoom: 13 });

          const showLoadingCard = () => {
            if (loadingCardAdded) {
              return;
            }

            const loadingAllHtml = `
                  <div class="all" style="
                      position: absolute;
                      top: 20%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 9999;
                      background-color: #fff;
                      border-radius: 10px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                      padding: 16px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                  ">
                      <div style="
                          border: 3px solid #f3f3f3;
                          border-radius: 50%;
                          border-top: 3px solid #3498db;
                          width: 24px;
                          height: 24px;
                          animation: spin 1s linear infinite;
                          margin-right: 8px;
                      "></div>
                      <span style="font-size: 14px;">กำลังค้นหาสถานพยาบาลทั้งหมดใกล้ฉัน...</span>
                  </div>
                  <style>
                      @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                      }
                  </style>
              `;

            document.body.insertAdjacentHTML("beforeend", loadingAllHtml);
            loadingCardAdded = true;

            // Remove the loading card after a delay
            setTimeout(() => {
              const loadingCardAllElements =
                document.getElementsByClassName("all");
              while (loadingCardAllElements.length > 0) {
                loadingCardAllElements[0].remove();
              }
              loadingCardAdded = false;
            }, 4500);
          };
          showLoadingCard();

          navigator.geolocation.getCurrentPosition(async () => {
            // const { searchLat, searchLon } = position.coords;
            const map = sphereMapRef.current;

            try {
              const poiResponse = await axios.get(
                `https://api.sphere.gistda.or.th/services/poi/search?lon=${searchLon}&lat=${searchLat}&limit=20&tag=โรงพยาบาล&key=F580F0C0ED264853B55FB58261D0E9E8`
              );
              const responseData = poiResponse.data.data;
              // console.log(responseData);
              // console.log(searchLon, searchLat);

              const routePromises = responseData.map(async (item) => {
                const { lat, lon } = item;

                try {
                  const routeResponse = await axios.get(
                    `https://api.sphere.gistda.or.th/services/route/route?flon=${searchLon}&flat=${searchLat}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
                  );
                  return routeResponse.data.data.distance;
                } catch (error) {
                  console.error("Error fetching route data:", error);
                  return null;
                }
              });

              const distances = await (routePromises);

              responseData.forEach((item, index) => {
                const { lat, lon, name, address, tel } = item;
                const distance = distances[index];

                const googleMapUrl = `https://www.google.com/maps/dir/${searchLat},${searchLon}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                const whereMapUrl = `https://where.gistda.or.th/route?dir=${searchLat}-${searchLon},${lat}-${lon}&result=true&swipe=1`;

                const cardHtml = renderToString(
                  <CardContent
                    spacing={1}
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -4.5em)",
                      transition: "opacity 0.3s",
                      display: "flex",
                      whiteSpace: "nowrap",
                      borderRadius: "5px",
                      padding: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #FF6968",
                    }}
                  >
                    <Typography component="div">
                      <Box style={{ fontWeight: "bold", margin: 1 }}>
                        {name}
                      </Box>
                      <Box style={{ fontWeight: "light", margin: 1 }}>
                        {address}
                      </Box>
                      <Box
                        sx={{
                          fontWeight: "light",
                          m: 1,
                          color: "#FF6968",
                          verticalAlign: "middle",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tel && (
                          <>
                            <PhoneIcon
                              style={{
                                color: "#FF6968",
                                width: "20px",
                                verticalAlign: "middle",
                              }}
                            />
                            &nbsp;{tel}
                            <br />
                          </>
                        )}
                      </Box>
                      {distance !== null && (
                        <Box style={{ fontWeight: "light", margin: 1 }}>
                          <StraightenIcon
                            style={{
                              color: "#FF6968",
                              width: "20px",
                              verticalAlign: "middle",
                            }}
                          />
                          &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                        </Box>
                      )}
                      <CardActions style={{ display: "flex" }}>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={whereMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "20px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <img
                              src="https://where.gistda.or.th/favicon.ico"
                              alt="Favicon"
                              style={{
                                width: "1.5em",
                                borderRadius: "50%",
                                padding: "2px",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#FF6968" }}>
                              WHERE
                            </span>
                          </Button>
                        </Box>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={googleMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "20px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <GoogleIcon
                              style={{
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px",
                                backgroundColor: "#FF6968",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#FF6968" }}>
                              Google Map
                            </span>
                          </Button>
                        </Box>
                      </CardActions>
                    </Typography>
                  </CardContent>
                );

                const iconHtml = renderToString(
                  <LocalHospitalIcon
                    style={{
                      color: "white",
                      borderRadius: "50%",
                      backgroundColor: "#FF6968",
                      padding: "2px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                );

                const markerHtml = `
                            <style>
                                .marker-container {
                                    position: relative;
                                    display: inline-block;
                                    z-index: 20;
                                }
    
                                .card-container {
                                    visibility: hidden;
                                    z-index: 100;
                                    top: -10em;
                                    position: absolute;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    transition: 0.25s ease-in-out;
                                }
    
                                .marker-container:hover .card-container {
                                    visibility: visible;
                                    position: absolute;
                                    z-index: 9999;
                                }
                            </style>
    
                            <div class='marker-container'>
                                <div class='marker-icon'>
                                    ${iconHtml}
                                </div>
                                <div class='card-container'>
                                    <div class='hover-card' style="z-index: 1000">
                                        ${cardHtml}
                                    </div>
                                </div>
                            </div>
                        `;

                const marker = new window.sphere.Marker(
                  { lat, lon },
                  {
                    icon: {
                      html: markerHtml,
                      offset: { x: 18, y: 21 },
                    },
                  }
                );

                map.Overlays.add(marker);
              });

              map.goTo({
                center: { lat: searchLat, lon: searchLon },
                zoom: 13,
              });

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            } catch (error) {
              console.error("Error fetching POI data:", error);

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            }
          });

          navigator.geolocation.getCurrentPosition(async () => {
            // const { searchLat, searchLon } = position.coords;
            const map = sphereMapRef.current;

            try {
              const poiResponse = await axios.get(
                `https://api.sphere.gistda.or.th/services/poi/search?lon=${searchLon}&lat=${searchLat}&limit=20&tag=Poly%20Clinic&key=F580F0C0ED264853B55FB58261D0E9E8`
              );
              const responseData = poiResponse.data.data;
              // console.log(responseData);
              // console.log(searchLon, searchLat);

              const routePromises = responseData.map(async (item) => {
                const { lat, lon } = item;

                try {
                  const routeResponse = await axios.get(
                    `https://api.sphere.gistda.or.th/services/route/route?flon=${searchLon}&flat=${searchLat}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
                  );
                  return routeResponse.data.data.distance;
                } catch (error) {
                  console.error("Error fetching route data:", error);
                  return null;
                }
              });

              const distances = await (routePromises);

              responseData.forEach((item, index) => {
                const { lat, lon, name, address, tel } = item;
                const distance = distances[index];

                const googleMapUrl = `https://www.google.com/maps/dir/${searchLat},${searchLon}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                const whereMapUrl = `https://where.gistda.or.th/route?dir=${searchLat}-${searchLon},${lat}-${lon}&result=true&swipe=1`;

                const cardHtml = renderToString(
                  <CardContent
                    spacing={1}
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -4.5em)",
                      transition: "opacity 0.3s",
                      display: "flex",
                      whiteSpace: "nowrap",
                      borderRadius: "5px",
                      padding: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #1DBEB8",
                    }}
                  >
                    <Typography component="div">
                      <Box style={{ fontWeight: "bold", margin: 1 }}>
                        {name}
                      </Box>
                      <Box style={{ fontWeight: "light", margin: 1 }}>
                        {address}
                      </Box>
                      <Box
                        sx={{
                          fontWeight: "light",
                          m: 1,
                          color: "#1DBEB8",
                          verticalAlign: "middle",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tel && (
                          <>
                            <PhoneIcon
                              style={{
                                color: "#1DBEB8",
                                width: "20px",
                                verticalAlign: "middle",
                              }}
                            />
                            &nbsp;{tel}
                            <br />
                          </>
                        )}
                      </Box>
                      {distance !== null && (
                        <Box style={{ fontWeight: "light", margin: 1 }}>
                          <StraightenIcon
                            style={{
                              color: "#1DBEB8",
                              width: "20px",
                              verticalAlign: "middle",
                            }}
                          />
                          &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                        </Box>
                      )}
                      <CardActions style={{ display: "flex" }}>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={whereMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "20px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <img
                              src="https://where.gistda.or.th/favicon.ico"
                              alt="Favicon"
                              style={{
                                width: "1.5em",
                                borderRadius: "50%",
                                padding: "2px",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#1DBEB8" }}>
                              WHERE
                            </span>
                          </Button>
                        </Box>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={googleMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "20px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <GoogleIcon
                              style={{
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px",
                                backgroundColor: "#1DBEB8",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#1DBEB8" }}>
                              Google Map
                            </span>
                          </Button>
                        </Box>
                      </CardActions>
                    </Typography>
                  </CardContent>
                );

                const iconHtml = renderToString(
                  <Vaccines
                    style={{
                      color: "white",
                      borderRadius: "50%",
                      backgroundColor: "#1DBEB8",
                      padding: "2px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                );

                const markerHtml = `
                            <style>
                                .marker-container {
                                    position: relative;
                                    display: inline-block;
                                    z-index: 20;
                                }
    
                                .card-container {
                                    visibility: hidden;
                                    z-index: 100;
                                    top: -10em;
                                    position: absolute;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    transition: 0.25s ease-in-out;
                                }
    
                                .marker-container:hover .card-container {
                                    visibility: visible;
                                    position: absolute;
                                    z-index: 9999;
                                }
                            </style>
    
                            <div class='marker-container'>
                                <div class='marker-icon'>
                                    ${iconHtml}
                                </div>
                                <div class='card-container'>
                                    <div class='hover-card' style="z-index: 1000">
                                        ${cardHtml}
                                    </div>
                                </div>
                            </div>
                        `;

                const marker = new window.sphere.Marker(
                  { lat, lon },
                  {
                    icon: {
                      html: markerHtml,
                      offset: { x: 18, y: 21 },
                    },
                  }
                );

                map.Overlays.add(marker);
              });

              map.goTo({
                center: { lat: searchLat, lon: searchLon },
                zoom: 13,
              });

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            } catch (error) {
              console.error("Error fetching POI data:", error);

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            }
          });

          navigator.geolocation.getCurrentPosition(async () => {
            // const { searchLat, searchLon } = position.coords;
            const map = sphereMapRef.current;

            try {
              const poiResponse = await axios.get(
                `https://api.sphere.gistda.or.th/services/poi/search?lon=${searchLon}&lat=${searchLat}&limit=20&tag=Public%20Health%20Center&key=F580F0C0ED264853B55FB58261D0E9E8`
              );
              const responseData = poiResponse.data.data;
              // console.log(responseData);
              // console.log(searchLon, searchLat);

              const routePromises = responseData.map(async (item) => {
                const { lat, lon } = item;

                try {
                  const routeResponse = await axios.get(
                    `https://api.sphere.gistda.or.th/services/route/route?flon=${searchLon}&flat=${searchLat}&tlon=${lon}&tlat=${lat}&mode=d&key=F580F0C0ED264853B55FB58261D0E9E8`
                  );
                  return routeResponse.data.data.distance;
                } catch (error) {
                  console.error("Error fetching route data:", error);
                  return null;
                }
              });

              const distances = await (routePromises);

              responseData.forEach((item, index) => {
                const { lat, lon, name, address, tel } = item;
                const distance = distances[index];

                const googleMapUrl = `https://www.google.com/maps/dir/${searchLat},${searchLon}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                const whereMapUrl = `https://where.gistda.or.th/route?dir=${searchLat}-${searchLon},${lat}-${lon}&result=true&swipe=1`;

                const cardHtml = renderToString(
                  <CardContent
                    spacing={1}
                    style={{
                      transform: "translate(-50%, -4.5em)",
                      position: "absolute",
                      left: "50%",
                      transition: "opacity 0.3s",
                      display: "flex",
                      whiteSpace: "nowrap",
                      borderRadius: 15,
                      padding: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #8DBAFF",
                    }}
                  >
                    <Typography component="div">
                      <Box style={{ fontWeight: "bold", margin: 1 }}>
                        {name}
                      </Box>
                      <Box style={{ fontWeight: "light", margin: 1 }}>
                        {address}
                      </Box>
                      <Box
                        sx={{
                          fontWeight: "light",
                          m: 1,
                          color: "#8DBAFF",
                          verticalAlign: "middle",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tel && (
                          <>
                            <PhoneIcon
                              style={{
                                color: "#8DBAFF",
                                width: "20px",
                                verticalAlign: "middle",
                              }}
                            />
                            &nbsp;{tel}
                            <br />
                          </>
                        )}
                      </Box>
                      {distance !== null && (
                        <Box style={{ fontWeight: "light", margin: 1 }}>
                          <StraightenIcon
                            style={{
                              color: "#8DBAFF",
                              width: "20px",
                              verticalAlign: "middle",
                            }}
                          />
                          &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                        </Box>
                      )}
                      <CardActions style={{ display: "flex" }}>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={whereMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "30px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <img
                              src="https://where.gistda.or.th/favicon.ico"
                              alt="Favicon"
                              style={{
                                width: "1.5em",
                                borderRadius: "50%",
                                padding: "2px",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#5686E1" }}>
                              WHERE
                            </span>
                          </Button>
                        </Box>
                        <Box style={{ display: "flex", margin: "5px" }}>
                          <Button
                            href={googleMapUrl}
                            target="_blank"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              maxWidth: "180px",
                              height: "30px",
                              padding: "0.5rem",
                              borderRadius: "15px",
                              backgroundColor: "white",
                              boxShadow:
                                "0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)",
                              textDecoration: "none",
                            }}
                          >
                            <GoogleIcon
                              style={{
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px",
                                backgroundColor: "#5686E1",
                                boxShadow:
                                  "inset 4px 4px 4px rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <span style={{ margin: "10px", color: "#5686E1" }}>
                              Google Map
                            </span>
                          </Button>
                        </Box>
                      </CardActions>
                    </Typography>
                  </CardContent>
                );

                const iconHtml = renderToString(
                  <MedicalInformation
                    style={{
                      color: "white",
                      borderRadius: "50%",
                      backgroundColor: "#2196F3",
                      padding: "2px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                );

                const markerHtml = `
                            <style>
                                .marker-container {
                                    position: relative;
                                    display: inline-block;
                                    z-index: 20;
                                }
    
                                .card-container {
                                    visibility: hidden;
                                    z-index: 100;
                                    top: -10em;
                                    position: absolute;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    transition: 0.25s ease-in-out;
                                }
    
                                .marker-container:hover .card-container {
                                    visibility: visible;
                                    position: absolute;
                                    z-index: 9999;
                                }
                            </style>
    
                            <div class='marker-container'>
                                <div class='marker-icon'>
                                    ${iconHtml}
                                </div>
                                <div class='card-container'>
                                    <div class='hover-card' style="z-index: 1000">
                                        ${cardHtml}
                                    </div>
                                </div>
                            </div>
                        `;

                const marker = new window.sphere.Marker(
                  { lat, lon },
                  {
                    icon: {
                      html: markerHtml,
                      offset: { x: 18, y: 21 },
                    },
                  }
                );

                map.Overlays.add(marker);
              });

              map.goTo({
                center: { lat: searchLat, lon: searchLon },
                zoom: 13,
              });

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            } catch (error) {
              console.error("Error fetching POI data:", error);

              const loadingCard = document.getElementById("loading-card");
              if (loadingCard) {
                loadingCard.remove();
              }
            }
          });
        } else {
          console.error("Selected item not found in the response data");
        }
      })
      .catch((error) => console.error("Error navigating:", error));
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// Search Bar ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const remove = () => {
    const map = sphereMapRef.current;
    map.Overlays.clear();
  };

  const location = () => {
    const map = sphereMapRef.current;
    map.Ui.Geolocation.trigger();

    if (map && map.Ui && map.Ui.Geolocation) {
      try {
        map.Ui.Geolocation.trigger();
      } catch (error) {
        console.error("Geolocation trigger error:", error);
      }
    } else {
      console.error("Geolocation functionality is not available.");
    }
    setTimeout(() => {
      locStatus();
    }, 2500);
  };

  const locStatus = () => {
    const map = sphereMapRef.current;

    var location = map.location();
    console.log(location);
    var latitude = location.lat;
    var longitude = location.lon;
    console.log(latitude, longitude);

    axios
      .get(
        `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`
      )
      .then((response) => {
        const data = response.data.data;
        const tb = data.loc["tb_tn"];
        const ap = data.loc["ap_tn"];

        const pv = data.loc["pv_tn"];

        const pm25 = data["pm25"];

        // update sect
        const date = data.datetimeThai["dateThai"];
        const time = data.datetimeThai["timeThai"];

        // update sect
        document.getElementById("location").innerHTML = `${tb} ${ap} ${pv}`;
        document.getElementById("update").innerHTML =
          `อัพเดทล่าสุด ${date} ${time}`;

        ///////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////// Text Color  /////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////
        let color;
        if (pm25 < 15) {
          color = "#4FAFBF"; // Very Good air quality
        } else if (pm25 > 15 && pm25 <= 25) {
          color = "#9FCF62";
        } else if (pm25 > 25 && pm25 <= 37.5) {
          color = "#F1E151"; // Good
        } else if (pm25 > 37.5 && pm25 <= 75) {
          color = "#F1A53B"; // Moderate
        } else {
          color = "#EB4E47"; // Unhealthy for sensitive group
        }

        let level;
        if (pm25 < 15) {
          level = "ดีมาก"; // Very Good air quality
        } else if (pm25 > 15 && pm25 <= 25) {
          level = "ดี";
        } else if (pm25 > 25 && pm25 <= 37.5) {
          level = "ปานกลาง"; // Good
        } else if (pm25 > 37.5 && pm25 <= 75) {
          level = "เริ่มมีผล"; // Moderate
        } else {
          level = "มีผล"; // Unhealthy for sensitive group
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////// Text Color  /////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////

        const pm25Formatted = pm25 % 1 === 0 ? pm25 : pm25.toFixed(1);
        const valueElement = document.getElementById("value");
        valueElement.innerHTML = `
                                                                <span style="font-size: 12px; font-weight: 500;">ค่า PM2.5</span>
                                                                <br />
                                                                <span style="color: ${color};">
                                                                    ${pm25Formatted} <span style="font-size: 10px; font-weight: 500; color: #000;">µg./m³</span>
                                                                </span>
                                                            `;
        document.getElementById("level").innerHTML =
          `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`;
      });
  };

  const thZoom = () => {
    const map = sphereMapRef.current;
    map.goTo({
      center: { lon: 100.590204861417, lat: 13.861545245028843 },
      zoom: 4.8,
    });
  };

  const zoomin = () => {
    const map = sphereMapRef.current;
    const currentZoom = map.zoom();
    map.zoom(currentZoom + 1);
  };

  const zoomout = () => {
    const map = sphereMapRef.current;
    const currentZoom = map.zoom();
    map.zoom(currentZoom - 1);
  };

  const compass = () => {
    const map = sphereMapRef.current;
    map.goTo({ pitch: 0, bearing: 0});
  };

 
  
useEffect(() => {
    const map = sphereMapRef.current;
    if (!map) return;
  
    const handleRotate = () => {
  
      const renderer = map.Renderer;
      const transform = renderer?.transform;
  
      const bearingAngle = transform?.bearing
      setbearingAngle(bearingAngle);
    };
  
    if (typeof map.Event?.bind === 'function') {
      map.Event.bind(sphere.EventName.Rotate, handleRotate);
    }
  
    return () => {
      if (typeof map.Event?.unbind === 'function') {
        map.Event.unbind(sphere.EventName.Rotate, handleRotate);
      }
    };
  
  }, [sphereMapRef.current]);

  const StreetBase = () => {
    const map = sphereMapRef.current;
    map.Layers.setBase(window.sphere.Layers.STREETS);
  };

  const HybridBase = () => {
    const map = sphereMapRef.current;
    map.Layers.setBase(window.sphere.Layers.HYBRID);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const popperRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle click outside to close the popper
  const handleClickOutside = (event) => {
    if (
      popperRef.current &&
      !popperRef.current.contains(event.target) &&
      !event.currentTarget.contains(event.target)
    ) {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    if (anchorEl) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const [openSidebar, setopenSidebar] = useState(false);
  // const [openDashboard, setopenDashboard] = useState(false);

  const toggleSidebar = () => {
    setopenSidebar((prev) => !prev);
    if (!openSidebar) setopenDashboard(false); // Close Dashboard when Sidebar opens
  };

  // const toggleDashboard = () => {
  //   setopenDashboard((prev) => !prev);
  //   if (!openDashboard) setopenSidebar(false);
  // };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

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
      width: 50%;
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
        background-color: #FFBD59;
        opacity: 0.3;
      }
    
      & .${sliderClasses.track} {
        display: block;
        position: absolute;
        height: 4px;
        border-radius: 6px;
        background-color: "currentColor";
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
      <div
        id="map"
        ref={mapRef}
        style={{
          width: "100%",
        }}
      >
        <>
          {/* <MediaCard /> */}
          <MiniDrawer openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
          {/* <Dashboard
            openDashboard={openDashboard}
            toggleDashboard={toggleDashboard}
          /> */}

          <div
            style={{
              position: "absolute",
              right: "1em",
              top: "1em",
              zIndex: "15",
            }}
          >
            {/* <HealthInsert /> */}
            <div className="healthStack">
              <Stack
                className="Stack"
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  top: "0.5rem",
                  right: 420,
                }}
                direction="row"
                spacing={1}
              >
                <Chip
                  onClick={insertAllhospital}
                  size="medium"
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    boxShadow:
                      "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  }}
                  label="สถานพยาบาลทั้งหมด"
                />
                <Chip
                  size="medium"
                  onClick={insertHospital}
                  sx={{
                    bgcolor: "white",
                    boxShadow:
                      "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  }}
                  label="โรงพยาบาล"
                  icon={
                    <LocalHospitalIcon
                      style={{
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px",
                        backgroundColor: "#FF6968",
                      }}
                    />
                  }
                />
                <Chip
                  onClick={insertClinic}
                  size="medium"
                  sx={{
                    bgcolor: "white",
                    boxShadow:
                      "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  }}
                  icon={
                    <Vaccines
                      style={{
                        color: "white",
                        borderRadius: "50%",
                        backgroundColor: "#1DBEB8",
                        padding: "2px",
                      }}
                    />
                  }
                  label="คลินิก"
                />

                <Chip
                  onClick={insertHealthSt}
                  size="medium"
                  sx={{
                    bgcolor: "white",
                    boxShadow:
                      "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  }}
                  icon={
                    <MedicalInformation
                      style={{
                        color: "white",
                        borderRadius: "50%",
                        backgroundColor: "#2196F3",
                        padding: "2px",
                      }}
                    />
                  }
                  label="สถานีอนามัย"
                />
              </Stack>
            </div>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
                height: 48,
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "24px",
              }}
            >
              <InputBase
                id="result"
                type="text"
                inputRef={searchRef}
                sx={{ ml: 1, flex: 1, fontFamily: "Prompt" }}
                placeholder="ระบุคำค้นหา เช่น ชื่อสถานที่"
                inputProps={{ "aria-label": "ระบุคำค้นหา เช่น ชื่อสถานที่" }}
                onChange={handleSearch}
              />
              <Tooltip
                title="ล้าง"
                arrow
                placement="bottom"
                TransitionComponent={Zoom}
                componentsProps={{
                  tooltip: {
                    sx: {
                      color: "black",
                      bgcolor: "white",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  },
                }}
              >
                <IconButton onClick={handleClearClick}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="ค้นหา"
                arrow
                placement="bottom"
                TransitionComponent={Zoom}
                componentsProps={{
                  tooltip: {
                    sx: {
                      color: "black",
                      bgcolor: "white",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  onClick={handleSearch}
                  id="myBtn"
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </Paper>
            {showSuggestions && (
              <Paper
                sx={{
                  borderRadius: "25px",
                  width: 400,
                  marginTop: "0.5rem",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Box
                  sx={{
                    // overflowY: 'auto',
                    maxHeight: "100vh",
                  }}
                >
                  {suggestions.length > 0 ? (
                    <List id="place">
                      {suggestions.map((item, index) => (
                        <ListItemButton
                          onClick={() => handleSuggestionClick(item.name)}
                          key={index}
                          selected={index === selectedIndex}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "0.25rem",
                            }}
                          >
                            <PlaceOutlinedIcon
                              sx={{ color: "#747474" }}
                              fontSize="medium"
                            />

                            <div
                              style={{
                                marginLeft: "0.5rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "340px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>
                                {item.name}
                              </span>
                              &nbsp;
                              <span
                                style={{ fontSize: "16px", color: "#747474" }}
                              >
                                {item.address}
                              </span>
                            </div>
                          </div>
                        </ListItemButton>
                      ))}
                    </List>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "3em",
                        padding: "0.5rem",
                        textAlign: "center",
                        fontSize: "16px",
                      }}
                    >
                      <p style={{ margin: 0 }}>ไม่พบข้อมูล</p>
                    </div>
                  )}
                </Box>
              </Paper>
            )}
          </div>
          <Box
            className="Box_rcp"
            sx={{
              zIndex: "10",
              marginTop: "-1.5%",
              justifyContent: "space-between",
            }}
          >
            {/* <img src={DNGLegendSrc} id="legend" alt="DNG Legend" /> */}

            <FormGroup
              className="RCPOpt"
              sx={{
                display: "flex",
                flexDirection: "row",
                margin: "0.5rem",
                gap: "16px",
              }}
            >
              {/* <Button variant="contained" onClick={() => rcp45Select()}>
                RCP45
              </Button>
              <Button variant="contained" onClick={() => rcp85Select()}>
                RCP85
              </Button> */}

            <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={rcp45Select}
                sx={{
                  backgroundColor: activeScenario === 'rcp45' ? 'rgba(128,128,128,0.5) !important' : undefined,
                  '&:hover': {
                    backgroundColor: '#ffad33',
                  },
                }}
              >
                RCP45
              </Button>
              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={rcp85Select}
                sx={{
                  backgroundColor: activeScenario === 'rcp85' ? 'rgba(128,128,128,0.5) !important' : undefined,
                  '&:hover': {
                    backgroundColor: '#ffad33',
                  },
                }}
              >
                RCP85
            </Button>

            </FormGroup>

            <Tooltip
              title="เข็มทิศ"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#ff9900",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#ff9900",
                    },
                  },
                },
              }}
            >
              <IconButton
                className="location_rcp"
                onClick={compass}
                sx={{
                  margin: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  color: "white",
                  "&:hover": {
                    color: "#ff9900",
                  },
                }}
              >
                <NavigationIcon 
                  sx={{ 
                        transform: `rotate(${-bearingAngle}deg)`,
                        transition: 'transform 0.5s ease',
                    }}/>
              </IconButton>
            </Tooltip>

            <FormGroup
              className="Zoom"
              sx={{
                margin: "0.5rem",
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
                borderRadius: "15px",
                backgroundColor: "#ff9900",
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                color: "white",
                width: "40px",
                "&:hover": {
                  color: "#ff9900",
                },
              }}
            >
              <Tooltip
                title="ซูมเข้า"
                arrow
                placement="left"
                TransitionComponent={Zoom}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#ff9900",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "#ff9900",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  className="zoomin_rcp"
                  onClick={zoomin}
                  sx={{
                    width: "35px",
                    color: "white",
                  }}
                >
                  <AddIcon />
                </IconButton>
                <hr style={{ width: "80%", opacity: "50%" }} />
              </Tooltip>
              <Tooltip
                title="ซูมออก"
                arrow
                placement="left"
                TransitionComponent={Zoom}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#ff9900",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "#ff9900",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  className="zoomout_rcp"
                  onClick={zoomout}
                  sx={{
                    borderRadius: "0",
                    width: "35px",
                    color: "white",
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>

              {/* <Tooltip
                                title="north"
                                arrow
                                placement="left"
                                TransitionComponent={Zoom}
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#ff9900',
                                            fontFamily: 'Prompt',
                                            '& .MuiTooltip-arrow': {
                                                color: '#ff9900',
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    className="zoomout_rcp"
                                    onClick={<Tooltip
                                title="ซูมออก"
                                arrow
                                placement="left"
                                TransitionComponent={Zoom}
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: '#ff9900',
                                            fontFamily: 'Prompt',
                                            '& .MuiTooltip-arrow': {
                                                color: '#ff9900',
                                            },
                                        },
                                    },
                                }}
                            >
                                <IconButton
                                    // className="zoomout_rcp"
                                    onClick={north}
                                    sx={{
                                        borderRadius: '0',
                                        width: '35px',
                                        color: 'white',
                                    }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Tooltip>}
                                    sx={{
                                        borderRadius: '0',
                                        width: '35px',
                                        color: 'white',
                                    }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Tooltip> */}
            </FormGroup>

            <Tooltip
              title="ขยายทั้งประเทศ"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#ff9900",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#ff9900",
                    },
                  },
                },
              }}
            >
              <IconButton
                className="thaiZoom_rcp"
                onClick={thZoom}
                sx={{
                  margin: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    fill: "#ff9900",
                  },
                  img: {
                    width: "25px",
                  },
                }}
              >
                <svg
                  className="thSvg_rcp"
                  width="800px"
                  height="800px"
                  viewBox="0 0 141 260"
                  xmlns="http://www.w3.org/2000/svg"
                  // xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                >
                  <polygon points="129.539,74.861 123.279,62.39 123.967,52.692 107.962,37.209 98.146,37.304 87.832,45.295 78.396,39.154 66.777,47.642 59.072,50.843 61.182,36.617 63.885,31.329 62.913,17.791 52.717,16.937 49.635,13.215 49.113,2 35.101,5.841 25.5,13.618 6.411,18.905 2.025,34.625 8.545,50.961 17.318,60.446 20.566,69.977 19.333,89.23 12.647,93.213 13.951,98.785 29.244,117.587 29.932,126.502 37.543,150.734 24.668,168.588 12.908,207.734 20.685,210.626 39.677,232.132 40.601,237.49 47.572,239.6 58.455,246.524 62.936,247.425 63.387,258 70.239,253.542 75.479,256.174 80.198,247.14 74.08,241.663 71.306,237.206 62.652,236.803 50.654,228.978 47.548,220.964 49.991,218.072 47.857,209.204 43.328,205.932 40.08,194.219 31.757,192.891 29.363,176.081 35.385,164.96 36.523,159.104 44.182,144.167 43.115,125.08 45.272,122.733 50.56,121.571 60.447,121.997 60.518,136.318 74.341,135.157 84.086,140.966 86.386,134.185 83.446,125.056 93.167,109.384 98.692,106.183 127.096,104.665 136.913,101.891 138.975,82.638" />
                </svg>
              </IconButton>
            </Tooltip>
            <Tooltip
              title="แผนที่ฐาน"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#ff9900",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#ff9900",
                    },
                  },
                },
              }}
            >
              <IconButton
                aria-describedby={id}
                type="button"
                onClick={handleClick}
                className="basemap_rcp"
                sx={{
                  margin: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  color: "white",
                  "&:hover": {
                    color: "#ff9900",
                  },
                }}
              >
                <LayersIcon />
              </IconButton>
            </Tooltip>

            <Popper
              className="Basemap"
              TransitionComponent={Zoom}
              placement="left-start"
              id={id}
              open={open}
              anchorEl={anchorEl}
              ref={popperRef}
            >
              <Card sx={{ marginRight: "1.5rem" }}>
                <Box
                  className="imgMap"
                  style={{
                    zIndex: "20",
                    textAlign: "center",
                    display: "flex",
                  }}
                >
                  <CardActionArea
                    onClick={StreetBase}
                    className="Street"
                    style={{ padding: "0.25rem" }}
                  >
                    <img src={Street} alt="Street" />
                    <br />
                    <span>เส้นถนน</span>
                  </CardActionArea>

                  <CardActionArea
                    onClick={HybridBase}
                    className="Sat"
                    style={{
                      padding: "0.25rem",
                      zIndex: "999",
                    }}
                  >
                    <img src={Satt} />
                    <br />
                    <span>ดาวเทียม</span>
                  </CardActionArea>
                </Box>
              </Card>
            </Popper>

            <Tooltip
              title="ตำแหน่งของฉัน"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#ff9900",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#ff9900",
                    },
                  },
                },
              }}
            >
              <IconButton
                className="location_rcp"
                onClick={location}
                sx={{
                  margin: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  color: "white",
                  "&:hover": {
                    color: "#ff9900",
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="ล้างการทำงาน"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    color: "#d52d2d",
                    bgcolor: "white",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "white",
                    },
                  },
                },
              }}
            >
              <IconButton
                className="remove"
                onClick={remove}
                sx={{
                  margin: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                  color: "white",
                  "&:hover": {
                    color: "white",
                    ".MuiSvgIcon-root": {
                      color: "#d52d2d",
                    },
                  },
                }}
              >
                <WrongLocationIcon
                  sx={{
                    color: "#ff9900",
                  }}
                />
              </IconButton>
            </Tooltip>
            <FormGroup style={{ position: "fixed", bottom: "2rem" }}>
              <Tooltip
                title="การใช้งาน"
                arrow
                placement="left"
                TransitionComponent={Zoom}
                componentsProps={{
                  tooltip: {
                    sx: {
                      color: "#707070",
                      bgcolor: "white",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  },
                }}
              >
                <a
                  href="https://lifedee-service.gistda.or.th/Files/heatindex-korat.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton
                    className="infoIcon"
                    sx={{
                      margin: "0.5rem",
                      boxShadow:
                        "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                      color: "white",
                    }}
                  >
                    <InfoIcon
                      sx={{
                        color: "#707070",
                      }}
                    />
                  </IconButton>
                </a>
              </Tooltip>
            </FormGroup>
          </Box>

          <Box
            className="rcpSlide"
            sx={{
              width: "100%",
              maxWidth: 650,
              mx: "auto",
              p: 2,
            }}
          >
            <Card
              sx={{
                width: "100%",
                boxShadow: 3,
                borderRadius: 3,
                height: "auto",
              }}
            >
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom
                    sx={{
                      color: "#f57542"
                    }}
                  >
                    แผนที่วิจัยดาวเทียมดัชนีความร้อน ({rcpLayer})
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    ข้อมูลจาก: GISTDA (งานวิจัยพื้นที่จังหวัดนครราชสีมา)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    วันที่ปรับปรุงข้อมูล: {updateDate}
                  </Typography>
                  <Typography variant="h6" 
                      sx={{ 
                        color: "#1976d2",
                        padding: "8px 16px",
                        borderTop: "2px solid #f5f5f5",
                        borderRadius: 2,
                        textAlign: "center",
                        marginTop: 2,

                        }}>
                      <img src={DNGLegendSrc} id="legend" alt="DNG Legend" /> <br/>
                      พ.ศ. {budhistYear}
                  </Typography>
                  
                </Box>

                <Stack direction="row" alignItems="center" spacing={2.25}
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlay}
                    sx={{
                      flexShrink: 0,
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      }
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

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      flexShrink: 0,
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      }
                    }}
                    onClick={handleBack}
                  >
                    <NavigateBeforeIcon
                      sx={{
                        color:
                        sliderStep === 1
                            ? "rgba(128, 128, 128, 0.5)"
                            : "#FF9900",
                        fontSize: "3rem",
                      }}
                    />
                  </Button>

                  {/* Slider Box */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Slider
                      aria-labelledby="slider-label"
                      valueLabelDisplay="auto"
                      min={1}
                      max={6}
                      step={1}
                      defaultValue={sliderStep}
                      onChange={handleSlide}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      flexShrink: 0,
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      }
                    }}
                    onClick={handleNext}
                  >
                    <NavigateNextIcon
                      sx={{
                        color:
                          sliderStep === limit
                            ? "rgba(128, 128, 128, 0.5)"
                            : "#FF9900",
                        fontSize: "3rem",
                      }}
                    />
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </>
      </div>
    </>
  );
};

export default MapDng;
