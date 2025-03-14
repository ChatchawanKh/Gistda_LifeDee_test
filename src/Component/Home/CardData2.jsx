import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./CardData2.css";

// Rain Icons
import Rain1 from "/src/Icon/0_no_rain.svg";
import Rain2 from "/src/Icon/1_light_rain.svg";
import Rain3 from "/src/Icon/2_moderate_rain.svg";
import Rain4 from "/src/Icon/3_heavy_rain.svg";
import Rain5 from "/src/Icon/4_very_heavy.svg";

//hid level
import HID1 from "/src/Icon/hid_level_1.png";
import HID2 from "/src/Icon/hid_level_2.png";
import HID3 from "/src/Icon/hid_level_3.png";
import HID4 from "/src/Icon/hid_level_4.png";

//MUI
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ThunderstormRoundedIcon from "@mui/icons-material/ThunderstormRounded";
import CircularProgress from "@mui/material/CircularProgress";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import Button from "@mui/material/Button";

//Logo
import gistda_logo from "/src/Icon/Gistda_LOGO.png";
import MeteoLogo from "/src/Icon/meteo.png";
import moph_logo from "/src/Icon/moph_logo.png";
import PcLogo from "/src/Icon/pc.png";
import Sunset from "/src/Icon/sunset_4229285.png";
import pm_card_bg from "/src/Icon/pm25_card_bg.png";
import MHESI from "/src/Icon/MHESI.png";

// Format Date and Time
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import FetchHeatIndexData from "./FetchHeatIndexData";
import { Padding } from "@mui/icons-material";

const CardData = () => {
  // State for location, PM25, weather, and rain data //
  const [location, setLocation] = useState({ tb: "", ap: "", pv: "" });
  const [pm25, setPm25] = useState(null);
  const [updatepmTime, setUpdatepmTime] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDateTime, setWeatherDateTime] = useState(null);
  const [rainData, setRainData] = useState(null);
  const [rainArea, setRainArea] = useState(null);
  const [windSpeed, setwindSpeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(null);

  const [loadingPM, setLoadingPM] = useState(true);
  const [loadingAQI, setLoadingAQI] = useState(true);
  const [loadingDNG, setLoadingDNG] = useState(true);
  const [loadingHID, setLoadingHID] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
            setLoadingPM(false);
          }, 1500);

          // Fetch Data (Weather, AQI, Heat Index, Dengue)

          fetchWeatherData(pv);
          fetchRainData(pv);
          AQIValues(latitude, longitude);
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
      `https://172.27.173.43:4000/3Hour?FilterText=${pv}&Culture=th-TH`,
      (data) => {
        const temp = data.weather3Hour.dryBlubTemperature.toFixed(0);
        const rainfall = data.weather3Hour.rainfall;
        console.log("rainfall", rainfall);
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
      `https://172.27.173.43:4000/7Day?FilterText=${pv}&Culture=th-TH`,
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

      const response = await axios.get("https://172.27.173.43:4000/getAQI");
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
            setLoadingAQI(false);
          }, 1500);
        } else {
          setErrorMessage("ไม่พบข้อมูล");
          setAQI("ไม่มีข้อมูล");
          setStation("ไม่มีข้อมูล");
          setLoadingAQI(false);
        }
      } else {
        setErrorMessage("ไม่มีสถานีที่อยู่ใกล้เคียง");
        setAQI("-");
        setStation("ไม่มีสถานีที่อยู่ใกล้เคียง");
        setLoadingAQI(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("ไม่สามารถดึงข้อมูลAQI ได้");
      setAQI("-");
      setStation("-");
      setLoadingAQI(false);
    }
  };

  const formatDate = (date) => {
    const zonedDate = formatInTimeZone(date, "UTC", "yyyy-MM-dd");
    const time = formatInTimeZone(date, "UTC", "HH:mm");
    const [year, month, day] = zonedDate.split(/[-]/);
    const thaiDate = `${day}/${month}/${parseInt(year) + 543} ${time} น.`;

    return thaiDate;
  };

  const getPm25Color = (pm25) => {
    if (pm25 < 15) return "#2AB9C6";
    if (pm25 <= 25) return "#06D001";
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
    if (AQI < 26)
      return "คุณภาพอากาศดีมาก เหมาะสำหรับกิจกรรมกลางแจ้งและการท่องเที่ยว";
    if (AQI <= 50) return "คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ";
    if (AQI <= 100)
      return "คุณภาพอากาศปานกลาง ลดระยะเวลาการทำกิจกรรมหรือการออกกำลังกายกลางแจ้งที่ใช้แรงมาก";
    if (AQI <= 200)
      return "เริ่มมีผลกระทบต่อสุขภาพ ใช้อุปกรณ์ป้องกันตนเองหากมีความจำเป็น";
    if (AQI >= 201)
      return "มีผลกระทบต่อสุขภาพ ประชาชนทุกคนควรงดกิจกรรมกลางแจ้ง";
    return "ไม่มีข้อมูลให้บริการในขณะนี้ ขออภัยในความไม่สะดวก";
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 25) return "#00B2C2"; // ดีมาก
    if (aqi <= 50) return "#92D050"; // ดี
    if (aqi <= 100) return "#F4E022"; // ปานกลาง
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
        color: pmColor || "#32CD32", // Default to green if pmColor is null
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, pmColor || "#32CD32"], // Default to green
            [1, `${pmColor || "#32CD32"}00`], // Transparent
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
        <div className="card-data-head">
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
        </div>

        <div className="grid-card-data-container">
          <div className="item1-card-data">
            {loading ? (
              <>
                <CircularProgress sx={{ color: "#ffffff" }} />
                <p style={{ color: "white", textAlign: "center" }}>
                  กำลังโหลดข้อมูล
                </p>
              </>
            ) : Error ? (
              <>
                <SentimentDissatisfiedRoundedIcon
                  sx={{ color: "white", width: "50px", height: "50px" }}
                />
                <p style={{ color: "white", textAlign: "center" }}>
                  ไม่สามารถโหลดข้อมูลพยากรณ์อากาศได้ <br />
                  โปรดลองอีกครั้ง
                </p>
              </>
            ) : (
              <>
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
                  <ThunderstormRoundedIcon
                    sx={{ color: "#ffffff", paddingRight: "10px" }}
                  />
                  <p>โอกาสเกิดฝน {rainArea}% ของพื้นที่</p>
                </div>
                <div className="rain-detail">
                  <AirRoundedIcon
                    sx={{ color: "#ffffff", paddingRight: "10px" }}
                  />
                  <p>ความเร็วลม {windSpeed} กม./ชม.</p>
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
              </>
            )}
          </div>

          <div className="item2-card-data" onClick={() => navigate("/pm")}>
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>
                ปริมาณฝุ่น PM2.5 (เฉลี่ย 24 ชั่วโมง)
              </h1>
              <p>GISTDA</p>
              {/* <span>{updatepmTime}</span> */}
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
          </div>
          <div className="item3-card-data" onClick={() => navigate("/hid")}>
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>ดัชนีความร้อน</h1>
              <p>กรมอุตุนิยมวิทยา</p>
              {/* <span>{updatepmTime}</span> */}
              <div style={{display: 'flex', gap:'20px', alignItems:'center', marginTop:'20px'}}>
                <img src={HID2} alt="sun" style={{maxWidth:'80px'}} />
                <h1
                  
                  style={{
                    fontSize: "36px",
                    lineHeight: "100%",
                    textAlign: "Right",
                    color:"#FFA200"
                  }}
                >
                  39°C
                </h1>
              </div>
              {/* <span>เมื่อสัมผัสความร้อนอาจทำให้ร่างกายอ่อนเพลีย</span> */}
            </div>
          </div>
          <div className="item4-card-data" onClick={() => navigate("/dng")}>
            <div className="card-text-data">
              <h1 style={{ color: "#ffffff" }}>งานวิจัย</h1>
              <span style={{ color: "#ffffff" }}>เช่น แบบจำลองโรคไข้เลือดออก แบบจำลองดัชนีความร้อน ฯลฯ</span>
              {/* <h1
                className="header-dengue"
                style={{
                  fontSize: "56px",
                  lineHeight: "100%",
                  textAlign: "left",
                  marginTop: "10px",
                }}
              >
                4 ราย
              </h1> */}
            </div>
          </div>
          <div className="item5-card-data" onClick={() => navigate("/pm")}>
            <div className="card-text-data">
              <h1 style={{ color: "#303c46" }}>AQI (รายชั่วโมง)</h1>
              <p>กรมควบคุมมลพิษ</p>
              {/* <span>อัพเดทล่าสุด: {AQIDateUpdate}</span> */}
              <h1
                style={{
                  fontSize: "60px",
                  lineHeight: "100%",
                  color: AQIColor,
                  padding: "10px 0px",
                }}
              >
                {aqi === "-1" ? "-" : aqi}
              </h1>
              <span style={{ textAlign: "center" }}>{AQIDes}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardData;
