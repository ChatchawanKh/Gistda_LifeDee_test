/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import "./MapDrowning.css";
import { renderToString } from "react-dom/server";
// import { styled, css } from '@mui/system';

//SLIDER
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/system";
import { Slider as BaseSlider, sliderClasses } from "@mui/base/Slider";

//LEGENDS
import drowningLegendSrc from "/assets/Icon/legend/drowning.png";
import deadCountLegendSrc from "/assets/Icon/legend/dead_count.png";
import hosp8LegendSrc from "/assets/Icon/legend/hosp_8m.png";
import satWaterLegendSrc from "/assets/Icon/legend/sat_water.png";
import waterManageLegendSrc from "/assets/Icon/legend/water_manage.png";

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
  useStepContext,
} from "@mui/material";

import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import { Popper } from "@mui/base/Popper";
import Card from "@mui/material/Card";
import {
  CardActionArea,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import { KeyboardArrowDown } from "@mui/icons-material";

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
import NavigationIcon from "@mui/icons-material/Navigation";
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
import MiniDrawer from "../NavigationBar/SidebarDrowning.jsx";
import Dashboard from "./DashboardDrowning.jsx";

// Layer Dropdown //
// import { ChevronDown } from 'lucide-react';

const MapLamCh = () => {
  //MODAL

  const mapRef = useRef(null);
  const sphereMapRef = useRef(null);
  const intervalRef = useRef(null);

  const [bearingAngle, setbearingAngle] = useState(0);

  const [wmsLayer, setWmsLayer] = useState(null);
  const [overLayers, setOverLayers] = useState([]);

  // let sliderStep = null;
  const [activeScenario, setActiveScenario] = useState(null);

  const [layers, setLayers] = useState({
    drowning: true,
    waterManage: false,
    deadLoc: false,
    waterSrc: false,
    hosp: false,
  });

  const legendMap = {
    drowning: drowningLegendSrc,
    waterManage: waterManageLegendSrc,
    deadLoc: deadCountLegendSrc,
    waterSrc: satWaterLegendSrc,
    hosp: hosp8LegendSrc,
  };

  const [anchorE2, setAnchorE2] = useState(null);

  const openLayers = Boolean(anchorE2);

  const handleLayersClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleLayersClose = () => {
    setAnchorE2(null);
  };

  const handleToggleWaterMng = (layerKey) => {
    var sphere = window.sphere;
    const map = sphereMapRef.current;

    if (!map) {
      console.error("Map instance is not available");
      return;
    }

    const pm25wms = new sphere.Layer("1", {
      type: sphere.LayerType.WMS,
      url: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning/MapServer/WMSServer",
      zoomRange: { min: 1, max: 15 },
      zIndex: 7,
      opacity: 0.75,
    });

    setLayers((prev) => {
      const isCurrentlyVisible = prev[layerKey];

      if (!sphereMapRef.current) return prev;
      const map = sphereMapRef.current;

      if (isCurrentlyVisible) {
        // ใช้ตัวแปร pm25wms ที่สร้างไว้แล้วลบเลย
        map.Layers.remove(pm25wms);
        console.log("PM2.5 Removed");
      } else {
        map.Layers.add(pm25wms);
        console.log("PM2.5 Added");
      }
      return {
        ...prev,
        [layerKey]: !isCurrentlyVisible,
      };
    });
  };

  const handleToggleDeadLoc = (layerKey) => {
    var sphere = window.sphere;
    const map = sphereMapRef.current;

    if (!map) {
      console.error("Map instance is not available");
      return;
    }

    const pm25wms = new sphere.Layer("0", {
      type: sphere.LayerType.WMS,
      url: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning/MapServer/WMSServer",
      zoomRange: { min: 1, max: 15 },
      zIndex: 6,
      // opacity: 0.75,
    });

    setLayers((prev) => {
      const isCurrentlyVisible = prev[layerKey];

      if (!sphereMapRef.current) return prev;
      const map = sphereMapRef.current;

      if (isCurrentlyVisible) {
        // ใช้ตัวแปร pm25wms ที่สร้างไว้แล้วลบเลย
        map.Layers.remove(pm25wms);
        console.log("PM2.5 Removed");
      } else {
        map.Layers.add(pm25wms);
        console.log("PM2.5 Added");
      }

      return {
        ...prev,
        [layerKey]: !isCurrentlyVisible,
      };
    });
  };

  const handleToggleWaterSrc = (layerKey) => {
    var sphere = window.sphere;
    const map = sphereMapRef.current;

    if (!map) {
      console.error("Map instance is not available");
      return;
    }

    const pm25wms = new sphere.Layer("3", {
      type: sphere.LayerType.WMS,
      url: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning/MapServer/WMSServer",
      zoomRange: { min: 1, max: 15 },
      zIndex: 5,
      opacity: 0.75,
    });

    setLayers((prev) => {
      const isCurrentlyVisible = prev[layerKey];

      if (!sphereMapRef.current) return prev;
      const map = sphereMapRef.current;

      if (isCurrentlyVisible) {
        // ใช้ตัวแปร pm25wms ที่สร้างไว้แล้วลบเลย
        map.Layers.remove(pm25wms);
        console.log("PM2.5 Removed");
      } else {
        map.Layers.add(pm25wms);
        console.log("PM2.5 Added");
      }

      return {
        ...prev,
        [layerKey]: !isCurrentlyVisible,
      };
    });
  };

  const handleToggleHosp = (layerKey) => {
    var sphere = window.sphere;
    const map = sphereMapRef.current;

    if (!map) {
      console.error("Map instance is not available");
      return;
    }

    const pm25wms = new sphere.Layer("2", {
      type: sphere.LayerType.WMS,
      url: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning/MapServer/WMSServer",
      zoomRange: { min: 1, max: 15 },
      zIndex: 4,
      opacity: 0.75,
    });

    setLayers((prev) => {
      const isCurrentlyVisible = prev[layerKey];

      if (!sphereMapRef.current) return prev;
      const map = sphereMapRef.current;

      if (isCurrentlyVisible) {
        // ใช้ตัวแปร pm25wms ที่สร้างไว้แล้วลบเลย
        map.Layers.remove(pm25wms);
        console.log("PM2.5 Removed");
      } else {
        map.Layers.add(pm25wms);
        console.log("PM2.5 Added");
      }

      return {
        ...prev,
        [layerKey]: !isCurrentlyVisible,
      };
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://api.sphere.gistda.or.th/map/?key=F580F0C0ED264853B55FB58261D0E9E8";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      var sphere = window.sphere;
      var map = new window.sphere.Map({
        placeholder: mapRef.current,
      });
      sphereMapRef.current = map;

      map.Event.bind(sphere.EventName.Rotate, function () {});

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
            center: { lon: 102.81966882576032, lat: 15.540907826316234 },
            zoom: 7.5,
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

  const overLayersRef = useRef([]);

  const layerConfigs = {
    all: {
      center: { lon: 102.81966882576032, lat: 15.540907826316234 },
      zoom: 7.5,
      layerId: "4",
      wmsUrl: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning/MapServer/WMSServer",
      scenario: "lastedData",
      polygonStyle: {
        fillColor: "transparent",
        lineColor: "#9fadc4",
        lineWidth: 3,
        strokeOpacity: 1,
      }
    },
    ch: {
      center: { lon: 101.88817881115101, lat: 16.02194716450219 },
      zoom: 8,
      layerId: "1",
      wmsUrl: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning_each_pv/MapServer/WMSServer",
      scenario: "chLayer",
      filterProperty: "PV_EN",
      filterValue: "Chaiyaphum",
      polygonStyle: {
        fillColor: "transparent",
        lineColor: "#212121",
        lineWidth: 3,
        strokeOpacity: 1,
      }
    },
    kr: {
      center: { lon: 102.15680078089801, lat: 14.875800006671316 },
      zoom: 8,
      layerId: "2",
      wmsUrl: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning_each_pv/MapServer/WMSServer",
      scenario: "krLayer",
      filterProperty: "PV_EN",
      filterValue: "Nakhon Ratchasima",
      polygonStyle: {
        fillColor: "transparent",
        lineColor: "#212121",
        lineWidth: 3,
        strokeOpacity: 1,
      }
    },
    br: {
      center: { lon: 102.97160662784293, lat: 14.855824116852034 },
      zoom: 8,
      layerId: "3",
      wmsUrl: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning_each_pv/MapServer/WMSServer",
      scenario: "brLayer",
      filterProperty: "PV_EN",
      filterValue: "Buri Ram",
      polygonStyle: {
        fillColor: "transparent",
        lineColor: "#212121",
        lineWidth: 3,
        strokeOpacity: 1,
      }
    },
    sr: {
      center: { lon: 103.68682389796034, lat: 14.925852356644361 },
      zoom: 8,
      layerId: "4",
      wmsUrl: "https://gistdaportal.gistda.or.th/data2/services/GISTDA_LifeD/Drowning_each_pv/MapServer/WMSServer",
      scenario: "srLayer",
      filterProperty: "PV_EN",
      filterValue: "Surin",
      polygonStyle: {
        fillColor: "transparent",
        lineColor: "#212121",
        lineWidth: 3,
        strokeOpacity: 1,
      }
    }
  };

  
  const loadLayer = (layerType, functionRef) => {
    setSelectFunction(() => functionRef);

    if (!sphereMapRef.current) return;
    
    const sphere = window.sphere;
    const map = sphereMapRef.current;
    const config = layerConfigs[layerType];

    // ย้ายแผนที่ไปยังตำแหน่งที่กำหนด
    map.goTo({
      center: config.center,
      zoom: config.zoom,
    });

    // โหลด GeoJSON Layer
    loadGeoJSONLayer(map, sphere, config);
    
    // โหลด WMS Layer
    loadWMSLayer(map, sphere, config);
    
    setActiveScenario(config.scenario);
  };

  // ฟังก์ชันสำหรับโหลด GeoJSON Layer
  const loadGeoJSONLayer = (map, sphere, config) => {
    const geojsonUrl = "https://gistdaportal.gistda.or.th/data2/rest/services/GISTDA_LifeD/Drowning_each_pv/MapServer/4/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";

    fetch(geojsonUrl)
      .then((res) => res.json())
      .then((geojsonData) => {
        const newOverlays = [];

        // ลบ overlays เก่าถ้ามี
        if (overLayersRef.current && overLayersRef.current.length > 0) {
          overLayersRef.current.forEach((layer) => {
            map.Overlays.remove(layer);
          });
        }

        // สร้าง overlays ใหม่
        geojsonData.features.forEach((feature) => {
          // กรองข้อมูลตามเงื่อนไข (ถ้ามี)
          if (config.filterProperty && config.filterValue) {
            if (!feature.properties || feature.properties[config.filterProperty] !== config.filterValue) {
              return;
            }
          }

          const geometryType = feature.geometry.type;
          if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
            const polygon_geojson = new sphere.Polygon(feature, config.polygonStyle);
            newOverlays.push(polygon_geojson);
          }
        });

        // เพิ่ม overlays ใหม่เข้าไปในแผนที่
        newOverlays.forEach((layer) => {
          map.Overlays.add(layer);
        });

        setOverLayers(newOverlays);
        overLayersRef.current = newOverlays;

        console.log(`=== ${config.scenario} Overlay ===`, newOverlays);
      })
      .catch((err) => {
        console.error("Error loading GeoJSON:", err);
      });
  };

  // ฟังก์ชันสำหรับโหลด WMS Layer
  const loadWMSLayer = (map, sphere, config) => {
    const newWmsLayer = new sphere.Layer(config.layerId, {
      type: sphere.LayerType.WMS,
      url: config.wmsUrl,
      zoomRange: { min: 1, max: 15 },
      zIndex: 4,
      opacity: 0.75,
    });

    console.log("=== WMS Layer", newWmsLayer);

    if (wmsLayer) {
      map.Layers.remove(wmsLayer);
    }
    map.Layers.add(newWmsLayer);
    setWmsLayer(newWmsLayer);
  };

  // ฟังก์ชันต่างๆ ที่เรียกใช้งาน
  const allLayer = () => {
    loadLayer('all', allLayer);
  };

  const chLayer = () => {
    loadLayer('ch', chLayer);
  };

  const krLayer = () => {
    loadLayer('kr', krLayer);
  };

  const brLayer = () => {
    loadLayer('br', brLayer);
  };

  const srLayer = () => {
    loadLayer('sr', srLayer);
  };

  const [selectFunction, setSelectFunction] = useState(() => allLayer);

  const lastedData = () => {
    if (selectFunction) {
      selectFunction();
    }
    setActiveScenario("lastedData");
  };

  useEffect(() => {
    setSelectFunction(() => allLayer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      lastedData();
    }, 3000);
  }, []);

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

        const distances = await routePromises;

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

        const distances = await routePromises;

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

        const distances = await routePromises;

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

              const distances = await routePromises;

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

              const distances = await routePromises;

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

              const distances = await routePromises;

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
    map.goTo({ pitch: 0, bearing: 0 });
  };

  useEffect(() => {
    const map = sphereMapRef.current;
    if (!map) return;

    const handleRotate = () => {
      const renderer = map.Renderer;
      const transform = renderer?.transform;

      const bearingAngle = transform?.bearing;
      setbearingAngle(bearingAngle);
    };

    if (typeof map.Event?.bind === "function") {
      map.Event.bind(sphere.EventName.Rotate, handleRotate);
    }

    return () => {
      if (typeof map.Event?.unbind === "function") {
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
  const [openDashboard, setopenDashboard] = useState(false);

  const toggleSidebar = () => {
    setopenSidebar((prev) => !prev);
    if (!openSidebar) setopenDashboard(false); // Close Dashboard when Sidebar opens
  };

  const toggleDashboard = () => {
    setopenDashboard((prev) => !prev);
    if (!openDashboard) setopenSidebar(false);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

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
          <Dashboard
            activeScenario={activeScenario}
            openDashboard={openDashboard}
            toggleDashboard={toggleDashboard}
          />

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
              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={allLayer}
                sx={{
                  backgroundColor:
                    activeScenario === "lastedData"
                      ? "rgba(128,128,128,0.5) !important"
                      : undefined,
                  "&:hover": {
                    backgroundColor: "#4f65b7",
                  },
                }}
              >
                พื้นที่เขต สคร.9
              </Button>

              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={chLayer}
                sx={{
                  backgroundColor:
                    activeScenario === "chLayer"
                      ? "rgba(128,128,128,0.5) !important"
                      : undefined,
                  "&:hover": {
                    backgroundColor: "#4f65b7",
                  },
                }}
              >
                ชัยภูมิ
              </Button>

              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={krLayer}
                sx={{
                  backgroundColor:
                    activeScenario === "krLayer"
                      ? "rgba(128,128,128,0.5) !important"
                      : undefined,
                  "&:hover": {
                    backgroundColor: "#4f65b7",
                  },
                }}
              >
                นครราชสีมา
              </Button>

              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={brLayer}
                sx={{
                  backgroundColor:
                    activeScenario === "brLayer"
                      ? "rgba(128,128,128,0.5) !important"
                      : undefined,
                  "&:hover": {
                    backgroundColor: "#4f65b7",
                  },
                }}
              >
                บุรีรัมย์
              </Button>

              <Button
                variant="contained"
                disableElevation
                disableRipple
                onClick={srLayer}
                sx={{
                  backgroundColor:
                    activeScenario === "srLayer"
                      ? "rgba(128,128,128,0.5) !important"
                      : undefined,
                  "&:hover": {
                    backgroundColor: "#4f65b7",
                  },
                }}
              >
                สุรินทร์
              </Button>

              <Box sx={{ display: "inline-block" }}>
                <Button
                  variant="contained"
                  onClick={handleLayersClick}
                  endIcon={
                    <KeyboardArrowDown
                      sx={{
                        transform: openLayers
                          ? "rotate(0deg)"
                          : "rotate(-90deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: "#344ca3",
                    "&:hover": {
                      backgroundColor: "#4f65b7",
                    },
                    minWidth: "140px",
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  เพิ่มเติม
                </Button>

                <Menu
                  anchorEl={anchorE2}
                  open={openLayers}
                  onClose={handleLayersClose}
                  MenuListProps={{
                    sx: {
                      py: 0,
                      border: "2px solid",
                      borderColor: "#344ca3",
                      borderRadius: 2,
                    },
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        minWidth: "240px",
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        border: "1px solid #e0e0e0",
                      },
                    },
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontWeight: 500,
                        color: "#344ca3",
                      }}
                    >
                      เลือกชั้นข้อมูลที่ต้องการแสดง
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", flex: 1 }}
                      >
                        แหล่งน้ำที่มีการจัดการความเสี่ยงปี 2567
                      </Typography>
                      <Switch
                        checked={layers.waterManage}
                        onChange={() => handleToggleWaterMng("waterManage")}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#1976d2",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#1976d2",
                            },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", flex: 1 }}
                      >
                        ตำแหน่งพบผู้เสียชีวิตจมน้ำ (อายุต่ำกว่า 15 ปี)
                      </Typography>
                      <Switch
                        checked={layers.deadLoc}
                        onChange={() => handleToggleDeadLoc("deadLoc")}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#1976d2",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#1976d2",
                            },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", flex: 1 }}
                      >
                        แหล่งน้ำขนาดเล็กจากดาวเทียม
                      </Typography>
                      <Switch
                        checked={layers.waterSrc}
                        onChange={() => handleToggleWaterSrc("waterSrc")}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#1976d2",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#1976d2",
                            },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", flex: 1 }}
                      >
                        พื้นทีให้บริการของโรงพยาบาลในระยะ 8 นาที
                      </Typography>
                      <Switch
                        checked={layers.hosp}
                        onChange={() => handleToggleHosp("hosp")}
                        size="small"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#1976d2",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#1976d2",
                            },
                        }}
                      />
                    </Box>
                  </Box>
                </Menu>
              </Box>
            </FormGroup>

            <Tooltip
              title="เข็มทิศ"
              arrow
              placement="left"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#344ca3",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#344ca3",
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
                    color: "#344ca3",
                  },
                }}
              >
                <NavigationIcon
                  sx={{
                    transform: `rotate(${-bearingAngle}deg)`,
                    transition: "transform 0.5s ease",
                  }}
                />
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
                backgroundColor: "#344ca3",
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)",
                color: "white",
                width: "40px",
                "&:hover": {
                  color: "#344ca3",
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
                      bgcolor: "#344ca3",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "#344ca3",
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
                      bgcolor: "#344ca3",
                      fontFamily: "Prompt",
                      "& .MuiTooltip-arrow": {
                        color: "#344ca3",
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
                                            bgcolor: '#344ca3',
                                            fontFamily: 'Prompt',
                                            '& .MuiTooltip-arrow': {
                                                color: '#344ca3',
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
                                            bgcolor: '#344ca3',
                                            fontFamily: 'Prompt',
                                            '& .MuiTooltip-arrow': {
                                                color: '#344ca3',
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
                    bgcolor: "#344ca3",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#344ca3",
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
                    fill: "#344ca3",
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
                    bgcolor: "#344ca3",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#344ca3",
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
                    color: "#344ca3",
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
                    bgcolor: "#344ca3",
                    fontFamily: "Prompt",
                    "& .MuiTooltip-arrow": {
                      color: "#344ca3",
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
                    color: "#344ca3",
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
                    color: "#344ca3",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            className="rcpSlide"
            sx={{
              width: "fit-content",
              height: "fit-content",
              display: "flex",
              justifyContent: "flex-end",
              ml: "auto",
            }}
          >
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                height: "fit-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: 1,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                gap: 1,
                flexWrap: "nowrap",
                width: "fit-content",
              }}
            >
              {layers.drowning && legendMap.drowning && (
                <img
                  key="drowning"
                  src={legendMap.drowning}
                  alt="Legend drowning"
                  style={{
                    height: "45px",
                    width: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}

              {Object.entries(layers)
                .filter(
                  ([key, isVisible]) =>
                    key !== "drowning" && isVisible && legendMap[key]
                )
                .map(([key]) => (
                  <img
                    key={key}
                    src={legendMap[key]}
                    alt={`Legend ${key}`}
                    style={{
                      height: "45px",
                      width: "auto",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ))}
            </Card>
          </Box>
        </>
      </div>
    </>
  );
};

export default MapLamCh;
