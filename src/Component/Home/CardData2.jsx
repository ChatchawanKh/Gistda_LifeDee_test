import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./CardData2.css";
import AnimatedSection from "./AnimatedSection";

// Rain Icons
import Rain1 from "/assets/Icon/0_no_rain.svg";
import Rain2 from "/assets/Icon/1_light_rain.svg";
import Rain3 from "/assets/Icon/2_moderate_rain.svg";
import Rain4 from "/assets/Icon/3_heavy_rain.svg";
import Rain5 from "/assets/Icon/4_very_heavy.svg";

//MUI
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ThunderstormRoundedIcon from "@mui/icons-material/ThunderstormRounded";
import CircularProgress from "@mui/material/CircularProgress";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Button from "@mui/material/Button";

//Logo
import gistda_logo from "/assets/Icon/Gistda_LOGO.png";
import MeteoLogo from "/assets/Icon/meteo.png";
import moph_logo from "/assets/Icon/moph_logo.png";
import MHESI from "/assets/Icon/MHESI.png";

// Format Date and Time
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const CardData = () => {
  // State for location, PM25, weather, and rain data //
  const [location, setLocation] = useState({ tb: "", ap: "", pv: "" });
  const [latlon, setLatlon] = useState({ lat: "", lon: "" });
  const [pm25, setPm25] = useState(null);
  const [updatepmTime, setUpdatepmTime] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDateTime, setWeatherDateTime] = useState(null);
  const [rainData, setRainData] = useState(null);
  const [rainArea, setRainArea] = useState(null);
  const [windSpeed, setwindSpeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(null);

  const [adjustedUnixMs, setAdjustedUnixMs] = useState(null);
  const [adjustedHour, setAdjustedHour] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatlon({ lat: latitude, lon: longitude });

        try {
          const pm25Response = await axios.get(
            `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`
          );

          const pm25Data = pm25Response.data.data;
          const graph = pm25Data.graphHistory24hrs;
          const tb = pm25Data.loc.tb_tn;
          const ap = pm25Data.loc.ap_tn;
          const pv = pm25Data.loc.pv_tn;
          const pm25Value = Math.round(pm25Data.pm25Avg24hrs);
          const date = pm25Data.datetimeThai.dateThai;
          const time = pm25Data.datetimeThai.timeThai;

          // Format time for display in graph
          const times = graph.map((entry) => {
            const date = new Date(entry[1]);

            // convertTime To Thai time zone
            date.setHours(date.getHours() - 7);

            return date.toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok", // กำหนดเวลาเป็นเขตเวลาไทย
              year: "numeric", // แสดงปี
              month: "2-digit", // แสดงเดือน
              day: "2-digit", // แสดงวัน
              hour: "2-digit", // แสดงชั่วโมง
              minute: "2-digit", // แสดงนาที
              hour12: false, // ใช้เวลาในรูปแบบ 24 ชั่วโมง
            });
          });

          //convert PM2.5 Value
          const values = graph.map((entry) =>
            parseFloat(parseFloat(entry[0]).toFixed(1))
          );

          // Update the graph
          setChartOptions((prevOptions) => ({
            ...prevOptions,
            xAxis: {
              ...prevOptions.xAxis,
              categories: times,
            },
            series: [
              {
                ...prevOptions.series[0],
                data: values,
              },
            ],
          }));

          setLocation({ tb, ap, pv });
          setPm25(pm25Value);
          setUpdatepmTime(`อัพเดทล่าสุด: ${date} ${time}`);

          setTimeout(() => {
            // setLoadingPM(false);
          }, 1500);

          // Fetch Data (Weather, AQI, Heat Index, Dengue)

          fetchWeatherData(pv);
          fetchRainData(pv);
          AQIValues(latitude, longitude);
          const unixTime = getAdjustedUnixTime(); // เรียกใช้และเก็บค่า
          fetchHIDValues(unixTime); // ใช้ค่าทันที
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const fetchData = async (url, setData, errorHandler) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
      errorHandler(error);
    }
  };

  const fetchWeatherData = async (pv) => {
    setLoading(true);
    await fetchData(
      `https://life-dee-proxy-552507355198.asia-southeast1.run.app/3Hour?FilterText=${pv}&Culture=th-TH`,
      (data) => {
        const temp = data.weather3Hour.dryBlubTemperature.toFixed(0);
        const rainfall = data.weather3Hour.rainfall;
        // console.log("rainfall", rainfall);
        const updateTimeWeather = data.weather3Hour.recordTime;
        setWeatherData(temp);
        setRainData(rainfall);
        setWeatherDateTime(updateTimeWeather);
      },
      (error) => {
        setWeatherData(null);
        setRainData(null);
        setWeatherDateTime(null);
        setError(error);
      }
    );
    setLoading(false);
  };

  const fetchRainData = async (pv) => {
    setLoading(true);
    await fetchData(
      `https://life-dee-proxy-552507355198.asia-southeast1.run.app/7Day?FilterText=${pv}&Culture=th-TH`,
      (data) => {
        const rainArea = data[0].weatherForecast7Day.rainArea;
        const windSpeed = data[0].weatherForecast7Day.windSpeed;
        setRainArea(rainArea);
        setwindSpeed(windSpeed);
      },
      (error) => {
        setRainArea(null);
        setwindSpeed(null);
        setError(error);
      }
    );
    setLoading(false);
  };

  // Varibles for AQI //
  const [stationName, setStation] = useState(null);
  const [aqi, setAQI] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [AQIDateUpdate, setAQIDateUpdate] = useState(null);

  const getDistance = (pointA, pointB) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (pointB.latitude - pointA.latitude) * (Math.PI / 180);
    const dLon = (pointB.longitude - pointA.longitude) * (Math.PI / 180);
    const lat1 = pointA.latitude * (Math.PI / 180);
    const lat2 = pointB.latitude * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const AQIValues = async (lat, lon) => {
    try {
      setErrorMessage("");
      setAQI(null);
      setStation(null);

      const response = await axios.get("https://life-dee-proxy-552507355198.asia-southeast1.run.app/getAQI");
      const stations = response.data.stations;

      let nearestStation = null;
      let nearestDistance = Infinity;

      // Calculate distance between stations and User's Location (Max 50 km)//
      stations.forEach((station) => {
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
        if (
          nearestStation.AQILast &&
          nearestStation.AQILast.PM10 &&
          nearestStation.AQILast.AQI
        ) {
          const aqiValue = nearestStation.AQILast.AQI.aqi;
          const date = nearestStation.AQILast.date;
          const time = nearestStation.AQILast.time;
          const formattedDate = `${date} ${time}`;
          const formattedDateTime = formatDate(formattedDate);

          setAQI(aqiValue);
          setAQIDateUpdate(formattedDateTime);
          setStation(nearestStation.nameTH);
          setTimeout(() => {
            // setLoadingAQI(false);
          }, 1500);
        } else {
          setErrorMessage("ไม่พบข้อมูล");
          setAQI("ไม่มีข้อมูล");
          setStation("ไม่มีข้อมูล");
          // setLoadingAQI(false);
        }
      } else {
        setErrorMessage("ไม่มีสถานีที่อยู่ใกล้เคียง");
        setAQI("-");
        setStation("ไม่มีสถานีที่อยู่ใกล้เคียง");
        // setLoadingAQI(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("ไม่สามารถดึงข้อมูลAQI ได้");
      setAQI("-");
      setStation("-");
      // setLoadingAQI(false);
    }
  };

  // Varibles for HID //
  const [HIDValue, setHIDValue] = useState(null);
  const [HIDDateUpdate, setHIDDateUpdate] = useState(null);
  const HIDDes = getHeatIndexLevel(HIDValue);

  const getAdjustedUnixTime = () => {
    const now = new Date();
    const localDate = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const hour = localDate.getUTCHours();
    const baseHour = 1;
    const interval = 3;

    let adjustedHour;
    if (hour < baseHour) {
      adjustedHour = baseHour;
    } else {
      adjustedHour =
        baseHour + Math.floor((hour - baseHour) / interval) * interval;
    }

    const adjustedDate = new Date(
      Date.UTC(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        adjustedHour - 7,
        0,
        0,
        0
      )
    );

    const ms = adjustedDate.getTime();
    setAdjustedUnixMs(ms);
    setAdjustedHour(adjustedHour);

    return ms; // ✅ return ค่านี้ด้วย
  };

  const fetchHID = async (url, onSuccess, onError) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      onSuccess(data);
    } catch (error) {
      onError(error);
    }
  };
  const formatUnixtoThaiDate = (unixMs) => {
    const date = new Date(unixMs);

    const days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const dayName = days[date.getDay()];
    const dateNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${dateNum}/${monthName}/${year} ${hour}:${minute} น.`;
  };

  const fetchHIDValues = async (adjustedUnixMs) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        await fetchHID(
          `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/heatindex_image_data/ImageServer/identify?geometry={x:${lon},y:${lat}}&time=${adjustedUnixMs}&geometryType=esriGeometryPoint&returnGeometry=false&returnCatalogItems=true&returnPixelValues=false&f=json`,
          (data) => {
            const HIDvalue = data.value;
            const HIDdate = data.catalogItems.features[0].attributes.Date;
            const numericValue = parseFloat(HIDvalue);

            if (!isNaN(numericValue)) {
              const HIDvalueFormat = parseFloat(numericValue.toFixed(1));
              setHIDValue(HIDvalueFormat);
            } else {
              console.warn("Invalid HIDvalue:", HIDvalue);
              setHIDValue(null);
            }

            // แปลงวันที่ภาษาไทย
            const formattedDate = formatUnixtoThaiDate(HIDdate);
            setHIDDateUpdate(formattedDate);

            // console.log(HIDvalue);
            // console.log(HIDdate);
            // console.log(adjustedUnixMs);
          },
          (error) => {
            setError(error);
          }
        );

        setLoading(false);
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError(geoError);
        setLoading(false);
      }
    );
  };

  function getHeatIndexLevel(hiValue) {
    if (hiValue >= 27 && hiValue <= 32) {
      return {
        level: "ระดับเฝ้าระวัง",
        effect:
          "อ่อนเพลีย เวียนศีรษะ คลื่นไส้ อาเจียน ปวดศีรษะ ปวดเมื่อยตามตัวจากการสัมผัสความร้อน หรือออกกำลังกาย/ทำงานท่ามกลางอากาศร้อน",
        color: "#92D050",
      };
    } else if (hiValue > 32 && hiValue <= 41) {
      return {
        level: "ระดับเตือนภัย",
        effect:
          "เกิดอาการตะคริวจากความร้อน และอาจเกิดอาการเพลียแดด (Heat Exhaustion) หากสัมผัสความร้อนเป็นเวลานาน",
        color: "#FCC314",
      };
    } else if (hiValue > 41 && hiValue <= 54) {
      return {
        level: "ระดับอันตราย",
        effect:
          "มีอาการตะคริวที่น่อง ต้นขา หน้าท้อง หรือไหล่ ทำให้ปวดเกร็ง มีอาการเพลียแดด และอาจเกิดภาวะลมแดด (Heat Stroke) ได้ หากสัมผัสความร้อนเป็นเวลานาน",
        color: "#F69021",
      };
    } else if (hiValue > 54) {
      return {
        level: "ระดับอันตรายมาก",
        effect:
          "เกิดภาวะลมแดด (Heat Stroke) โดยมีอาการตัวร้อน เวียนศีรษะ หน้ามืด ช็อก ระบบอวัยวะต่าง ๆ ล้มเหลว และทำให้เสียชีวิตได้ หากสัมผัสความร้อนติดต่อกันหลายวัน",
        color: "#F34B2D",
      };
    } else {
      return {
        level: "ต่ำกว่าเกณฑ์",
        effect: "ไม่มีผลกระทบที่รุนแรงจากความร้อน",
      };
    }
  }

  const formatDate = (date) => {
    const zonedDate = formatInTimeZone(date, "UTC", "yyyy-MM-dd");
    const time = formatInTimeZone(date, "UTC", "HH:mm");
    const [year, month, day] = zonedDate.split(/[-]/);
    const thaiDate = `${day}/${month}/${parseInt(year) + 543} ${time} น.`;

    return thaiDate;
  };

  const getPm25Color = (pm25) => {
    if (pm25 < 15) return "#2AB9C6";
    if (pm25 <= 25) return "#92D050";
    if (pm25 <= 37.5) return "#FCC314";
    if (pm25 <= 75) return "#F69021";
    return "#F34B2D";
  };

  const getPm25Level = (pm25) => {
    if (pm25 < 15) return "คุณภาพอากาศดีมาก";
    if (pm25 <= 25) return "คุณภาพอากาศดี";
    if (pm25 <= 37.5) return "คุณภาพอากาศปานกลาง";
    if (pm25 <= 75) return "เริ่มมีผลต่อสุขภาพ";
    return "มีผลต่อสุขภาพ";
  };

  const getPm25LevelDescription = (pmvalue) => {
    if (pmvalue < 15) return "เหมาะสำหรับกิจกรรมกลางแจ้ง และการท่องเที่ยว";
    if (pmvalue <= 25) return "เหมาะสำหรับกิจกรรมกลางแจ้ง และการท่องเที่ยว";
    if (pmvalue <= 37.5)
      return "ลดระยะเวลาการทำกิจกรรมหรือการออกกำลังกายกลางแจ้งที่ใช้แรงมาก ";
    if (pmvalue <= 75) return "ควรสวมหน้ากากอนามัยทุกครั้งที่ออกนอกอาคาร";
    if (pmvalue > 75) return "ประชาชนทุกคนควรงดกิจกรรมกลางแจ้ง";
    return "ไม่มีข้อมูลให้บริการในขณะนี้ ขออภัยในความไม่สะดวก";
  };

  const getAQILevelDescription = (AQI) => {
    if (AQI < 0) return "ไม่มีข้อมูลให้บริการในขณะนี้ ขออภัยในความไม่สะดวก";
    if (AQI < 26)
      return "คุณภาพอากาศดีมาก เหมาะสำหรับกิจกรรมกลางแจ้งและการท่องเที่ยว";
    if (AQI <= 50) return "คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ";
    if (AQI <= 100)
      return "คุณภาพอากาศปานกลาง ลดระยะเวลาการทำกิจกรรมหรือการออกกำลังกายกลางแจ้งที่ใช้แรงมาก";
    if (AQI <= 200)
      return "เริ่มมีผลกระทบต่อสุขภาพ ใช้อุปกรณ์ป้องกันตนเองหากมีความจำเป็น";
    if (AQI >= 201)
      return "มีผลกระทบต่อสุขภาพ ประชาชนทุกคนควรงดกิจกรรมกลางแจ้ง";
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 25) return "#00B2C2"; // ดีมาก
    if (aqi <= 50) return "#92D050"; // ดี
    if (aqi <= 100) return "#FECD30"; // ปานกลาง
    if (aqi <= 200) return "#FFA200"; // เริ่มมีผลกระทบต่อสุขภาพ
    return "#FF3B3B"; // มีผลกระทบต่อสุขภาพ
  };

  const getRainLevel = (rainData) => {
    if (rainData === 0) return "ไม่มีฝนตก";
    if (rainData <= 10.0) return "ฝนตกเล็กน้อย";
    if (rainData <= 35.0) return "ฝนตกปานกลาง";
    if (rainData <= 90.0) return "ฝนตกหนัก";
    return "ฝนหนักมาก";
  };

  const getRainbg = (rainData) => {
    if (rainData <= 0) return "/src/Icon/no_rain.mp4";
    if (rainData <= 10.0) return "/src/Icon/light_rain.mp4";
    if (rainData <= 35.0) return "/src/Icon/med_rain.mp4";
    if (rainData <= 90.0) return "/src/Icon/heavy_rain.mp4";
    return "/src/Icon/very_heavy_rain.mp4";
  };

  const getRainIcon = (rainAmount) => {
    if (rainAmount === 0) return Rain1;
    if (rainAmount <= 10.0) return Rain2;
    if (rainAmount <= 35.0) return Rain3;
    if (rainAmount <= 90.0) return Rain4;
    return Rain5;
  };

  // const HIDIcon = getHIDLevel(30);
  // const getHIDLevel = (HIDvalue) => {
  //   if (HIDvalue <= 32.9) return HID1;
  //   if (HIDvalue <= 41.9) return HID2;
  //   if (HIDvalue <= 51.9) return HID3;

  //   return HID4;
  // };

  const formatThaiDate = (isoDateString) => {
    const monthsThai = [
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
    const date = new Date(isoDateString);
    const day = date.getDate();
    const month = monthsThai[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours() + 7;
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `อัพเดตเมื่อ ${day} ${month} ${year} ${hours}:${minutes} น.`;
  };

  const pm25Formatted = pm25 !== null ? pm25.toFixed(1) : null;
  const pmColor = pm25Formatted !== null ? getPm25Color(pm25) : null;
  const pmLevel = pm25Formatted !== null ? getPm25Level(pm25) : null;
  const pmDes = pm25Formatted !== null ? getPm25LevelDescription(pm25) : null;
  const AQIDes = aqi !== null ? getAQILevelDescription(aqi) : null;
  const AQIColor = aqi !== null ? getAqiColor(aqi) : null;

  const rainLevelDescription =
    rainData !== null ? getRainLevel(rainData) : null;
  const rainIcon = rainData !== null ? getRainIcon(rainData) : null;
  const rainBG =
    rainData !== null ? getRainbg(rainData) : "/src/Icon/no_rain.mp4";
  const rainDateTime =
    weatherDateTime !== null ? formatThaiDate(weatherDateTime) : null;

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "areaspline",
      height: 150,
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [], // Updated dynamically
      title: {
        text: "วันที่และเวลา",
        style: {
          fontFamily: "Prompt, sans-serif",
        },
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: "ปริมาณ PM2.5 (µg/m³)",
        style: {
          fontFamily: "Prompt, sans-serif",
        },
      },
      labels: {
        enabled: true,
      },
      gridLineWidth: 0,
    },
    plotOptions: {
      areaspline: {
        color: pmColor || "#F5F5F5", // Default to green if pmColor is null
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, pmColor || "#F5F5F5"], // Default to green
            [1, `${pmColor || "#F5F5F5"}00`], // Transparent
          ],
        },
        threshold: null,
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "PM2.5 (µg/m³)",
        data: [], // Updated dynamically
      },
    ],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  });

  // Example of dynamically updating chart options
  useEffect(() => {
    if (pmColor !== null) {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        plotOptions: {
          ...prevOptions.plotOptions,
          areaspline: {
            ...prevOptions.plotOptions.areaspline,
            color: pmColor, // Dynamically set the color
            fillColor: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, pmColor],
                [1, `${pmColor}00`],
              ],
            },
          },
        },
      }));
    }
  }, [pmColor]);

  return (
    <section className="card-data-container">
      <div className="card-data-box">
        <AnimatedSection className="card-data-head" delay="delay-1">
          <div className="card-data-header">
            <h1>บริการข้อมูลด้านสุขภาพ</h1>
            <div className="card-data-head-logo">
              <img src={MHESI} alt="MH" />
              <img src={gistda_logo} alt="GISTDA logo" />
              <img src={moph_logo} alt="MOPH logo" />
              {/* <img src={PcLogo} alt="pc" /> */}
              <img src={MeteoLogo} alt="meteo" />
            </div>
          </div>
        </AnimatedSection>

        <div className="grid-card-data-container">
          <AnimatedSection className="item1-card-data" delay="delay-2">
            {loading ? (
              <>
                <CircularProgress sx={{ color: "#ffffff" }} />
                <p style={{ color: "white", textAlign: "center" }}>
                  กำลังโหลดข้อมูลพยากรณ์อากาศ
                </p>
              </>
            ) : Error ? (
              <>
                <SentimentDissatisfiedRoundedIcon
                  sx={{ color: "white", width: "50px", height: "50px" }}
                />
                <p style={{ color: "white", textAlign: "center" }}>
                  ไม่สามารถโหลดข้อมูลพยากรณ์อากาศได้ โปรดลองอีกครั้ง
                </p>
              </>
            ) : (
              <div className="weather-content-flex">
                <div className="card-data-location">
                  <PlaceRoundedIcon sx={{ color: "#ffffff" }} />
                  <p>
                    {location.tb} {location.ap} {location.pv}
                  </p>
                </div>
                <div className="card-data-weather">
                  <img src={rainIcon} alt="rain" />
                  <h1>{weatherData}°C</h1>
                  <h2>{rainLevelDescription}</h2>
                  <span>{rainDateTime}</span>
                </div>
                <div className="rain-detail">
                  <div className="rainvalue">
                    <ThunderstormRoundedIcon
                      sx={{ color: "#ffffff", paddingRight: "10px" }}
                    />
                    <p>โอกาสเกิดฝน {rainArea}% ของพื้นที่</p>
                  </div>
                  <div className="rainvalue">
                    <AirRoundedIcon
                      sx={{ color: "#ffffff", paddingRight: "10px" }}
                    />
                    <p>ความเร็วลม {windSpeed} กม./ชม.</p>
                  </div>
                </div>

                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="background-video-weather fade-in"
                >
                  <source src={rainBG} type="video/mp4" />
                </video>
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection
            className="item2-card-data"
            delay="delay-3"
            onClick={() => navigate("/pm")}
          >
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>
                ปริมาณฝุ่น PM2.5 (เฉลี่ย 24 ชั่วโมง)
              </h1>
              <p>GISTDA</p>
              <span>{updatepmTime}</span>
              <div className="card-data-pm-data">
                <div className="pm-chart" style={{ width: "70%" }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                  />
                </div>
                <div
                  className="card-data-pm-description"
                  style={{ width: "30%" }}
                >
                  <h1
                    // className="header-pm"
                    style={{
                      fontSize: "60px",
                      lineHeight: "100%",
                      textAlign: "center",
                      color: pmColor,
                    }}
                  >
                    {pm25}
                  </h1>
                  <p style={{ textAlign: "center" }}>µg/m³</p>
                  <h1
                    // className="header-pm"
                    style={{
                      fontSize: "20px",
                      lineHeight: "100%",
                      textAlign: "center",
                      color: pmColor,
                    }}
                  >
                    {pmLevel}
                  </h1>
                  <span style={{ textAlign: "center" }}>{pmDes}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection
            className="item3-card-data"
            delay="delay-4"
            onClick={() => navigate("/hid")}
          >
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>ดัชนีความร้อน</h1>
              <p>กรมอุตุนิยมวิทยา</p>
              <span>อัพเดทล่าสุด: {HIDDateUpdate}</span>
              <h1
                style={{
                  fontSize: "45px",
                  lineHeight: "100%",
                  color: HIDDes.color,
                  padding: "10px 0px",
                }}
              >
                {HIDValue}°C
              </h1>
              <span style={{ textAlign: "center" }}>{HIDDes.level}</span>
            </div>
          </AnimatedSection>
          <AnimatedSection
            className="item4-card-data"
            delay="delay-5"
            onClick={() => navigate("/rcp")}
          >
            <div className="card-text-data">
              <h1 style={{ color: "#ffffff" }}>งานวิจัย</h1>
              <span style={{ color: "#ffffff" }}>
                เช่น แบบจำลองโรคไข้เลือดออก แบบจำลองดัชนีความร้อน ฯลฯ
              </span>

              <div>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#ffffff",
                    fontWeight: "normal",
                    fontFamily: "Prompt",
                    fontSize: "16px",
                    borderRadius: "10px",
                    border: "1px solid #ffffff",
                    marginTop: "20px",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      border: "1px solid #8DBAFF",
                      color: "#000000",
                    },
                  }}
                >
                  ดูเพิ่มเติม
                </Button>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection
            className="item5-card-data"
            delay="delay-5"
            onClick={() => navigate("/pm")}
          >
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>AQI (รายชั่วโมง)</h1>
              <p>กรมควบคุมมลพิษ</p>
              <span>อัพเดทล่าสุด: {AQIDateUpdate}</span>
              <h1
                style={{
                  fontSize: "45px",
                  lineHeight: "100%",
                  color: AQIColor,
                  padding: "10px 0px",
                }}
              >
                {aqi === "-1" ? "-" : aqi}
              </h1>
              <span style={{ textAlign: "center" }}>{AQIDes}</span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CardData;
