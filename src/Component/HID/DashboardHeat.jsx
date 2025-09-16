import React, { useState, useEffect } from "react";
import axios from "axios";

import { formatInTimeZone } from "date-fns-tz";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Stack,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { th } from "date-fns/locale";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";

import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import Card_dash_bg from "/assets/Icon/Dashboard_card_HID_bg.png";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { motion } from "framer-motion";

import "./DashboardHeat.css";

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

  //จัดเก็บข้อมูลคุณภาพอากาศ
  const [fetchingData, setFetchingData] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [pm25Avg24hr, setPm25Avg24hr] = useState(null);
  const [pm25perhr, setPm25perhr] = useState(null);
  const [pm25BGColor, setPm25BGColor] = useState(null);

  //จัดเก็บวันที่
  const [pm25DateUpdate, setpm25DateUpdate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  //จัดเก็บตำแหน่ง
  const [location, setLocation] = useState("");

  //จัดเก็บตำแหน่งที่แปลงจาก lat,lon to address
  const [locationData, setLocationData] = useState({
    province: "",
    district: "",
    subdistrict: "",
    provinceId: null,
    districtId: null,
    subdistrictId: null,
  });

  const getLoc = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation(`${latitude}, ${longitude}`);
    });
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

  const fetchAll = async () => {
    if (
      locationData.provinceId &&
      locationData.districtId &&
      locationData.subdistrictId
    ) {
      try {
        setLoadingDataCard(true);
        fetchPm25(); // ไม่ต้อง await

        const unixTime = getAdjustedUnixTime();
        await fetchHIDValues(unixTime);
        await fetchHIDGISTDAValues(unixTime);
        await fetchHIDGraph();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
  };

  useEffect(() => {
    fetchAll();
  }, [locationData]);

  // ดึงจังหวัดมาเป็นตัวเลือก
  useEffect(() => {
    axios
      .get("https://pm25.gistda.or.th/rest/getPm25byProvince")
      .then((response) => {
        const sortedProvinces = response.data.data
          .map((p) => ({ id: p.pv_idn, name_th: p.pv_tn }))
          .sort((a, b) => a.name_th.localeCompare(b.name_th, "th"));
        setProvinces(sortedProvinces);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoading(false);
      });
  }, []);

  // ดึงอำเภอ เมื่อเลือกจังหวัดแล้ว
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `https://pm25.gistda.or.th/rest/getPm25byAmphoe?pv_idn=${selectedProvince.id}`
        )
        .then((response) => {
          const sortedDistricts = response.data.data
            .map((d) => ({ id: d.ap_idn, name_th: d.ap_tn }))
            .sort((a, b) => a.name_th.localeCompare(b.name_th, "th"));
          setDistricts(sortedDistricts);

          // Only reset selected district if it's no longer in the new list
          if (
            selectedDistrict &&
            !sortedDistricts.some((d) => d.id === selectedDistrict.id)
          ) {
            setSelectedDistrict(null);
            setSubdistricts([]);
            setSelectedSubdistrict(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
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
      axios
        .get(
          `https://pm25.gistda.or.th/rest/getPm25byTambon?ap_idn=${selectedDistrict.id}`
        )
        .then((response) => {
          const sortedSubdistricts = response.data.data
            .map((s) => ({ id: s.tb_idn, name_th: s.tb_tn }))
            .sort((a, b) => a.name_th.localeCompare(b.name_th, "th"));
          setSubdistricts(sortedSubdistricts);

          // Only reset selected subdistrict if it's no longer in the new list
          if (
            selectedSubdistrict &&
            !sortedSubdistricts.some((s) => s.id === selectedSubdistrict.id)
          ) {
            setSelectedSubdistrict(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching subdistricts:", error);
          setSubdistricts([]);
        });
    } else {
      setSubdistricts([]);
      setSelectedSubdistrict(null);
    }
  }, [selectedDistrict]);

  // Get Address from lat,lon handleInput
  const handleLocationInput = (loc = location) => {
    const [lat, long] = loc.split(",").map((val) => val.trim());
    if (lat && long) {
      axios
        .get(
          `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${long}`
        )
        .then((response) => {
          const data = response.data.data.loc;
          setLocationData({
            province: data.pv_tn,
            district: data.ap_tn,
            subdistrict: data.tb_tn,
            provinceId: data.pv_idn,
            districtId: data.ap_idn,
            subdistrictId: data.tb_idn,
          });

          // Update selected values for autocomplete
          setSelectedProvince({ id: data.pv_idn, name_th: data.pv_tn });
          setSelectedDistrict({ id: data.ap_idn, name_th: data.ap_tn });
          setSelectedSubdistrict({ id: data.tb_idn, name_th: data.tb_tn });
          setLoadingDataCard(true);
        })

        .catch((error) => {
          console.error("Error fetching location data:", error);
          setLocationData({
            province: "",
            district: "",
            subdistrict: "",
            provinceId: null,
            districtId: null,
            subdistrictId: null,
          });
        });
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLocationInput();
      setLoadingDataCard(true);
    }
  };

  // format date and time
  const formatDate = (date) => {
    const zonedDate = formatInTimeZone(date, "UTC", "yyyy-MM-dd");
    const time = formatInTimeZone(date, "UTC", "HH:mm");
    const [year, month, day] = zonedDate.split(/[-]/);

    // แปลงเป็นวันที่ในภาษาไทย
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

  // Varibles for HID //
  const [HIDValue, setHIDValue] = useState(null);
  const [HIDDateUpdate, setHIDDateUpdate] = useState(null);
  const HIDDes = getHeatIndexLevel(HIDValue);
  const [adjustedUnixMs, setAdjustedUnixMs] = useState(null);
  const [adjustedHour, setAdjustedHour] = useState(null);
  const [HIDGISTDAValue, setHIDGISTDAValue] = useState(null);
  const [HIDGISTDADateUpdate, setHIDGISTDADateUpdate] = useState(null);

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
      const response = await axios.get(url);
      const data = response.data;
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

  const getCoordinates = async () => {
    try {
      const parts = [
        selectedSubdistrict?.name_th,
        selectedDistrict?.name_th,
        selectedProvince?.name_th,
      ];
      const address = parts.filter((part) => part).join(" ");

      if (!address) {
        throw new Error("Address is required to perform the search");
      }

      const sphereSearch = `https://api.sphere.gistda.or.th/services/search/search?keyword=${encodeURIComponent(
        address
      )}&limit=1&showdistance=true&key=F1673C4668AB4472B0313944EC343B4A`;
      const response = await axios.get(sphereSearch);

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const locationGeo = response.data.data[0];
        return {
          lat: parseFloat(locationGeo.lat),
          lon: parseFloat(locationGeo.lon),
        };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      setErrorMessage("ไม่สามารถดึงค่าละติจูดและลองจิจูดได้");
      console.error(error);
      throw error;
    }
  };

  const fetchHIDValues = async (adjustedUnixMs) => {
    try {
      const { lat, lon } = await getCoordinates();

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

          const formattedDate = formatUnixtoThaiDate(HIDdate);
          setHIDDateUpdate(formattedDate);
          setLoadingDataCard(false);
        },
        (error) => {
          setError(error);
        }
      );
    } catch (geoError) {
      console.error("Geolocation error:", geoError);
      setError(geoError);
    } finally {
      setLoading(false);
    }
  };

  const fetchHIDGISTDAValues = async () => {
    try {
      const { lat, lon } = await getCoordinates();

      await fetchHID(
        `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/HI_THAILAND/ImageServer/identify?geometry={"spatialReference":{"latestWkid":4326,"wkid":102100},"x":${lon},"y":${lat}}&f=json&geometryType=esriGeometryPoint&returnPixelValues=false`,
        (data) => {
          const HIDGISTDAValueRaw = data.value;
          const HIDGISTDADateRaw =
            data.catalogItems?.features?.[0]?.attributes?.Date;
          const numericValue = parseFloat(HIDGISTDAValueRaw);

          if (!isNaN(numericValue)) {
            const HIDGISTDAValue = parseFloat(numericValue.toFixed(1));
            setHIDGISTDAValue(HIDGISTDAValue);
          } else {
            console.warn("Invalid HIDGISTDAValue:", HIDGISTDAValueRaw);
            setHIDGISTDAValue(null);
          }

          if (HIDGISTDADateRaw) {
            const adjustedDate = HIDGISTDADateRaw - 7 * 60 * 60 * 1000;
            const formattedDate = formatUnixtoThaiDate(adjustedDate);
            setHIDGISTDADateUpdate(formattedDate);
          } else {
            console.warn("No HIDGISTDA date found in response");
            setHIDGISTDADateUpdate(null);
          }
        },
        (error) => {
          setError(error);
        }
      );
    } catch (geoError) {
      console.error("Geolocation error:", geoError);
      setError(geoError);
    } finally {
      setLoading(false);
    }
  };

  const [heatIndexList, setHeatIndexList] = useState({});
  const [HIDdateLoading, setHIDdateLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dateKeys = Object.keys(heatIndexList);
  const currentDate = dateKeys[currentIndex] || null;

  const fetchHIDGraph = async () => {
    try {
      setHeatIndexList({});
      setHIDdateLoading(true);
      const { lat, lon } = await getCoordinates();

      await fetchHID(
        `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/heatindex_image_data/ImageServer/query?where=1=1&geometry={"spatialReference":{"latestWkid":4326,"wkid":102100},"x":${lon},"y":${lat}}&geometryType=esriGeometryPoint&outFields=Date&returnGeometry=false&returnIdsOnly=false&returnCountOnly=false&f=pjson`,
        async (data) => {
          const dateList = data.features?.map((f) => f.attributes.Date) || [];

          if (!dateList.length) return;

          const startDate = Math.min(...dateList);
          const endDate = Math.max(...dateList);

          const identifyUrl = `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/heatindex_image_data/ImageServer/identify?geometry={"x":${lon},"y":${lat}}&geometryType=esriGeometryPoint&returnGeometry=false&returnCatalogItems=true&returnPixelValues=true&f=json&time=${startDate},${endDate}`;
          const identifyRes = await axios.get(identifyUrl);
          const identifyData = identifyRes.data;
          const values = identifyData.properties?.Values || [];

          const groupedData = dateList.reduce((acc, timestamp, index) => {
            const dateStr = new Date(timestamp).toLocaleDateString("th-TH", {
              timeZone: "Asia/Bangkok",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push([timestamp, values[index]]);
            return acc;
          }, {});

          for (const date in groupedData) {
            groupedData[date].sort((a, b) => a[0] - b[0]);
            groupedData[date] = groupedData[date].map(([timestamp, value]) => [
              formatUnixtoThaiDate(timestamp),
              value,
            ]);
          }

          setHeatIndexList(groupedData);
          setHIDdateLoading(false);
        },
        (error) => {
          console.error("API error:", error);
        }
      );
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const goToNext = () => {
    if (currentIndex < dateKeys.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const options = {
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Prompt, sans-serif",
      },
    },
    title: {
      text: `กราฟพยากรณ์ดัชนีความร้อนจาก กรมอุตุนิยมวิทยา - วันที่ ${currentDate}`,
    },
    xAxis: {
      categories: heatIndexList[currentDate]?.map(([time]) => time),
      title: { text: "วันที่เวลา" },
    },
    yAxis: {
      title: { text: "ดัชนีความร้อน °C" },
    },
    series: [
      {
        name: "ดัชนีความร้อน °C",
        data: heatIndexList[currentDate]?.map(([, value]) => parseFloat(value)),
        color: "#FFA500", // สีส้ม (Orange)
      },
    ],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  // const currentDate = dateKeys[selectedDateIndex];
  // const currentData = heatIndexList[currentDate] || [];

  // const chartOptions = {
  //   chart: {
  //     type: "line",
  //     backgroundColor: "transparent",
  //     zoomType: "x",
  //   },
  //   title: {
  //     text: "กราฟพยากรณ์ดัชนีความร้อน: กรมอุตุนิยมวิทยา",
  //     style: { fontSize: "18px", fontFamily: "Prompt, sans-serif" },
  //   },
  //   xAxis: {
  //     categories: currentData.map((entry) => entry[0]),
  //     scrollbar: { enabled: true },
  //     labels: { style: { fontSize: "10px" } },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "ค่าดัชนีความร้อน °C",
  //       style: { fontSize: "12px" },
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Heat Index",
  //       data: currentData.map((entry) => entry[1]),
  //       color: "#E74141",
  //     },
  //   ],
  //   credits: { enabled: false },
  //   plotOptions: {
  //     line: {
  //       dataLabels: {
  //         enabled: true,
  //         style: { fontSize: "10px", fontFamily: "Prompt, sans-serif" },
  //       },
  //       enableMouseTracking: true,
  //       marker: {
  //         enabled: false,
  //         fillColor: "#E74141",
  //         lineWidth: 1,
  //         lineColor: "#E74141",
  //       },
  //     },
  //   },
  //   legend: { enabled: false },
  // };

  function getHeatIndexLevel(hiValue) {
    if (hiValue >= 27 && hiValue <= 32) {
      return {
        level: "ระดับเฝ้าระวัง",
        effect:
          "ระดับเฝ้าระวัง อาจเกิดอาการอ่อนเพลีย เวียนศีรษะ คลื่นไส้ อาเจียน ปวดศีรษะ ปวดเมื่อยตามตัวจากการสัมผัสความร้อน หรือออกกำลังกาย/ทำงานท่ามกลางอากาศร้อน",
        color: "#689f38",
      };
    } else if (hiValue > 32 && hiValue <= 41) {
      return {
        level: "ระดับเตือนภัย",
        effect:
          "ระดับเตือนภัย อาจเกิดอาการตะคริวจากความร้อน และอาจเกิดอาการเพลียแดด (Heat Exhaustion) หากสัมผัสความร้อนเป็นเวลานาน",
        color: "#f9a825",
      };
    } else if (hiValue > 41 && hiValue <= 54) {
      return {
        level: "ระดับอันตราย",
        effect:
          "ระดับอันตราย อาจมีอาการตะคริวที่น่อง ต้นขา หน้าท้อง หรือไหล่ ทำให้ปวดเกร็ง มีอาการเพลียแดด และอาจเกิดภาวะลมแดด (Heat Stroke) ได้ หากสัมผัสความร้อนเป็นเวลานาน",
        color: "#ef6c00",
      };
    } else if (hiValue > 54) {
      return {
        level: "ระดับอันตรายมาก",
        effect:
          "ระดับอันตรายมาก อาจเกิดภาวะลมแดด (Heat Stroke) โดยมีอาการตัวร้อน เวียนศีรษะ หน้ามืด ช็อก ระบบอวัยวะต่าง ๆ ล้มเหลว และทำให้เสียชีวิตได้ หากสัมผัสความร้อนติดต่อกันหลายวัน",
        color: "#F34B2D",
      };
    } else {
      return {
        level: "ไม่มีข้อมูล",
        effect: "ไม่มีผลกระทบที่รุนแรงจากความร้อน",
        color: "#757575",
      };
    }
  }

  const getHeatIndexBackgroundColor = (hiValue) => {
    if (hiValue >= 27 && hiValue <= 32) {
      return "#C9E7A7"; // เขียวอ่อน คล้ายอากาศดี
    } else if (hiValue > 32 && hiValue <= 41) {
      return "#FFE38D"; // เหลืองอ่อน คล้ายคุณภาพกลาง
    } else if (hiValue > 41 && hiValue <= 54) {
      return "#FFD2A6"; // ส้มอ่อน
    } else if (hiValue > 54) {
      return "#FF9D9D"; // แดงอ่อน คล้ายคุณภาพแย่
    } else {
      return "#AEAEAE"; // เทาอ่อน สำหรับไม่มีข้อมูล
    }
  };

  const fetchGraphData = () => {
    setFetchingData(true);
    let url = "";

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

    axios
      .get(url)
      .then((response) => {
        const data = response.data.graphHistory24hrs.map((d) => {
          const date = d[1];
          return {
            date: formatDate(date),
            pm25: d[0].toFixed(2),
          };
        });

        setGraphData({
          categories: data.map((d) => `${d.date}`),
          series: [
            {
              name: "PM2.5",
              data: data.map((d) => ({
                y: parseFloat(d.pm25),
                color: getPm25Color(parseFloat(d.pm25)), // Assign color based on PM2.5 value
              })),
            },
          ],
        });
        setTimeout(() => {
          setFetchingData(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
        setGraphData(null);
        setFetchingData(false);
      });
  };

  const fetchPm25 = () => {
    if (selectedSubdistrict) {
      axios
        .get(
          `https://pm25.gistda.or.th/rest/getPm25byTambon?ap_idn=${selectedDistrict.id}`
        )
        .then((response) => {
          const data = response.data.data;
          const subdistrictData = data.find(
            (item) => item.tb_idn === selectedSubdistrict.id
          );
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

        .catch((error) => {
          console.error("Error fetching PM2.5 average data:", error);
          setPm25Avg24hr(null);
        });
    } else if (selectedDistrict) {
      axios
        .get(
          `https://pm25.gistda.or.th/rest/getPm25byAmphoe?pv_idn=${selectedProvince.id}`
        )
        .then((response) => {
          const data = response.data.data;
          const districtData = data.find(
            (item) => item.ap_idn === selectedDistrict.id
          );
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
        .catch((error) => {
          console.error("Error fetching PM2.5 average data:", error);
          setPm25Avg24hr(null);
        });
    } else if (selectedProvince) {
      axios
        .get(`https://pm25.gistda.or.th/rest/getPm25byProvince`)
        .then((response) => {
          const data = response.data.data;
          const provinceData = data.find(
            (item) => item.pv_idn === selectedProvince.id
          );
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
        .catch((error) => {
          console.error("Error fetching PM2.5 average data:", error);
          setPm25Avg24hr(null);
        });
    } else {
      setPm25Avg24hr(null);
      return;
    }
  };

  const HIDcolor = HIDValue !== null ? getHeatIndexLevel(HIDValue) : "#757575";
  const HIDDescript =
    HIDValue !== null ? getHeatIndexLevel(HIDValue) : "ไม่มีข้อมูล";
  const HIDBGcolor =
    HIDValue !== null ? getHeatIndexBackgroundColor(HIDValue) : "#757575";

  const HIDGISTDAcolor =
    HIDGISTDAValue !== null ? getHeatIndexLevel(HIDGISTDAValue) : "#757575";
  const HIDGISTDABGcolor =
    HIDGISTDAValue !== null
      ? getHeatIndexBackgroundColor(HIDGISTDAValue)
      : "#757575";

  const variants = {
    hidden: {
      x: "-100vw",
      transition: { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    visible: {
      x: 0,
      transition: { type: "tween", duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const [openModalHID, setModalHIDOpen] = React.useState(false);
  const handleOpenModalHID = () => setModalHIDOpen(true);
  const handleCloseModalHID = () => setModalHIDOpen(false);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className="open-dashboard-btn">
        <Tooltip
          title="Dashboard"
          placement="right"
          arrow
          classes={{ tooltip: "open-dashboard-HID-tooltip" }}
        >
          <IconButton
            className="OpenDashboard-HID"
            onClick={toggleDashboard}
            sx={{
              boxShadow: "0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)",
              width: "60px",
              height: "60px",
              "&:hover": {
                "& .MuiSvgIcon-root": {
                  transform: "scale(1.2)",
                },
              },
            }}
          >
            <SpaceDashboardIcon className="openDashboard-HID" />
          </IconButton>
        </Tooltip>
      </div>

      <Modal
        open={openModalHID}
        onClose={handleCloseModalHID}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              textAlign: "center",
              fontFamily: "Prompt, Arial",
            }}
          >
            ดัชนีความร้อน
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              textAlign: "left",
              fontFamily: "Prompt",
              fontSize: "14px",
            }}
          >
            ดัชนีความร้อน คือ อุณหภูมิที่คนเรารู้สึกได้ในขณะนั้น (Apparent
            Temperature) ว่าอากาศร้อนเป็นอย่างไร
            หรืออุณหภูมิที่ปรากฏในขณะนั้นเป็นเช่นไร (Steadman, 1979a)
            โดยค่าดัชนีความร้อนนั้นสามารถนำมา
            ประยุกต์ใช้เพื่อระบุความเสี่ยงที่ร่างกายจะได้รับผลกระทบจากความร้อนได้
          </Typography>
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
          <motion.div
            className="Dashboard-card-data"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              style={{
                fontFamily: "Prompt",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "18px",
                color: HIDcolor.color,
                zIndex: 1,
                margin: 0,
                padding: "20px",
                textAlign: "center",
              }}
            >
              {HIDDescript.effect}
            </motion.div>
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
                  <div
                    className="HID-1day-card"
                    style={{ backgroundColor: HIDBGcolor || "#8b8b8b" }}
                  >
                    <div className="HID-1day-card-data">
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <>
                            <Skeleton
                              animation="wave"
                              width={200}
                              height={20}
                            />
                            <Skeleton
                              animation="wave"
                              width={180}
                              height={20}
                            />
                          </>
                        ) : (
                          <>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.8,
                                delay: 0.5,
                                ease: [0, 0.71, 0.2, 1.01],
                              }}
                              style={{
                                fontFamily: "Prompt",
                                fontStyle: "normal",
                                fontWeight: 500,
                                fontSize: "16px",
                                lineHeight: "20px",
                                color: "#303c46",
                                zIndex: 1,
                                margin: 0,
                                padding: 0,
                                textAlign: "left",
                              }}
                            >
                              {`${tb_name_th || ""} ${ap_name_th || ""} ${
                                pv_name_th || ""
                              }`}
                              <br />
                              Urban Heat Index : กรมอุตุนิยมวิทยา
                            </motion.div>
                          </>
                        )}
                      </div>
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <Skeleton animation="wave" width={100} height={60} />
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 1.0,
                              ease: [0, 0.71, 0.2, 1.01],
                            }}
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              marginTop: "10px",
                            }}
                          >
                            <h1
                              style={{
                                color: HIDcolor.color,
                                padding: "0",
                                marginTop: "15",
                                lineHeight: "100%",
                                textAlign: "left",
                                fontSize: "54px",
                              }}
                            >
                              {HIDValue || "ไม่มีข้อมูล"}
                            </h1>
                            {HIDValue === null ? (
                              ""
                            ) : (
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  marginLeft: "10px",
                                  color: "303c46",
                                  padding: "0",
                                  marginBottom: "10px",
                                  alignItems: "bottom",
                                }}
                              >
                                °C
                              </span>
                            )}
                          </motion.div>
                        )}
                      </div>
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <Skeleton animation="wave" width={80} />
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 1.5,
                              ease: [0, 0.71, 0.2, 1.01],
                            }}
                            style={{
                              fontFamily: "Prompt",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "11px",
                              color: "#303c46",
                              zIndex: 1,
                              margin: 0,
                              padding: 5,
                              textAlign: "center",
                            }}
                          >
                            {HIDValue !== null
                              ? `อัปเดตเมื่อ ${HIDDateUpdate}`
                              : "อัปเดตเมื่อ ไม่มีข้อมูล"}
                          </motion.div>
                        )}
                      </div>
                      <img src={Card_dash_bg} alt="BG_card" />
                      <InfoIcon
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#2196F3",
                          zIndex: "50",
                        }}
                        onClick={handleOpenModalHID}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    className="HID-1hr-card"
                    style={{ backgroundColor: HIDGISTDABGcolor }}
                  >
                    <div className="HID-1hr-card-data">
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <>
                            <Skeleton
                              animation="wave"
                              width={200}
                              height={20}
                            />
                            <Skeleton
                              animation="wave"
                              width={180}
                              height={20}
                            />
                          </>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.5,
                              ease: [0, 0.71, 0.2, 1.01],
                            }}
                            style={{
                              fontFamily: "Prompt",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "20px",
                              color: "#303c46",
                              zIndex: 1,
                              margin: 0,
                              padding: 0,
                              textAlign: "left",
                            }}
                          >
                            {`${tb_name_th || ""} ${ap_name_th || ""} ${
                              pv_name_th || ""
                            }`}
                            <br />
                            Urban Heat Index : GISTDA
                          </motion.div>
                        )}
                      </div>
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <Skeleton animation="wave" width={100} height={60} />
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 1.0,
                              ease: [0, 0.71, 0.2, 1.01],
                            }}
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              marginTop: "10px",
                            }}
                          >
                            <h1
                              style={{
                                color: HIDGISTDAcolor.color,
                                padding: "0",
                                marginTop: "15",
                                lineHeight: "100%",
                                textAlign: "left",
                                fontSize: "54px",
                              }}
                            >
                              {HIDGISTDAValue || "ไม่มีข้อมูล"}
                            </h1>
                            {HIDGISTDAValue === null ? (
                              ""
                            ) : (
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "400",
                                  marginLeft: "10px",
                                  color: "303c46",
                                  padding: "0",
                                  marginBottom: "10px",
                                  alignItems: "bottom",
                                }}
                              >
                                °C
                              </span>
                            )}
                          </motion.div>
                        )}
                      </div>
                      <div style={{ zIndex: 1 }}>
                        {loadingDataCard ? (
                          <Skeleton animation="wave" width={80} />
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.8,
                              delay: 1.5,
                              ease: [0, 0.71, 0.2, 1.01],
                            }}
                            style={{
                              fontFamily: "Prompt",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "11px",
                              color: "#303c46",
                              zIndex: 1,
                              margin: 0,
                              padding: 5,
                              textAlign: "center",
                            }}
                          >
                            {`อัปเดตเมื่อ ${HIDGISTDADateUpdate}`}
                          </motion.div>
                        )}
                      </div>
                      <img src={Card_dash_bg} alt="BG_card" />
                      <InfoIcon
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "#2196F3",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </motion.div>

          <motion.div
            className="Dashboard-sortbylocation-date"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.8,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="Dashboard-sortbylocation-date-head">
              <h1>
                ข้อมูลดัชนีความร้อน <br />
                ย้อนหลัง
              </h1>
            </div>

            <div className="Dashboard-sortby">
              <div className="Dashboard-sortbylocation">
                <Box sx={{ maxWidth: 600, mx: "auto" }}>
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
                          onFocus={() => setIsFocused(true)} // Set focus state
                          onBlur={() => setIsFocused(false)} // Remove focus state
                          onKeyDown={handleKeyDown} // Added event handler
                          sx={{ width: "259px", mb: 1 }}
                          InputProps={{
                            style: {
                              fontFamily: "Prompt",
                              color: isFocused
                                ? "black"
                                : location
                                ? "#9e9e9e"
                                : "black",
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip
                                  title="ล้างข้อมูล"
                                  arrow
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
                                    onClick={() => setLocation("")}
                                    edge="end"
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  title="ค้นหาพิกัดของฉัน"
                                  arrow
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
                                  <IconButton onClick={getLoc} edge="end">
                                    <PlaceIcon />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            style: { fontFamily: "Prompt" },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleLocationInput(location)}
                          className="searchButton-HID"
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
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="จังหวัด"
                              sx={{ width: "259px", mb: 2 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontFamily: "Prompt" }, // Style for the input text
                              }}
                              InputLabelProps={{
                                style: { fontFamily: "Prompt" }, // Style for the label text
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
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="อำเภอ"
                              sx={{ width: "259px", mb: 2 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontFamily: "Prompt" }, // Style for the input text
                              }}
                              InputLabelProps={{
                                style: { fontFamily: "Prompt" }, // Style for the label text
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
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="ตำบล"
                              sx={{ width: "259px", mb: 2 }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontFamily: "Prompt" }, // Style for the input text
                              }}
                              InputLabelProps={{
                                style: { fontFamily: "Prompt" }, // Style for the label text
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

            <Button
              className="searchButton-HID"
              variant="contained"
              onClick={fetchAll}
              disabled={fetchingData || !selectedProvince}
            >
              แสดงกราฟ
            </Button>
          </motion.div>

          <motion.div
            className="Dashboard-graph"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 2.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            {HIDdateLoading ? (
              <div className="onLoadingGraph">
                <CircularProgress /> <p>กำลังค้นหาข้อมูล...</p>
              </div>
            ) : heatIndexList ? (
              <>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mb: 2 }}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="contained"
                    onClick={goToPrev}
                    startIcon={<ArrowBackIcon />}
                    disabled={currentIndex === 0}
                    sx={{
                      backgroundColor: "#FFA500",
                      fontFamily: "Prompt, sans-serif",
                      borderRadius: "20px",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#FF8C00",
                        borderRadius: "20px",
                        boxShadow: "none",
                      },
                    }}
                  >
                    ก่อนหน้า
                  </Button>

                  <Button
                    variant="contained"
                    onClick={goToNext}
                    endIcon={<ArrowForwardIcon />}
                    disabled={currentIndex === dateKeys.length - 1}
                    sx={{
                      backgroundColor: "#FFA500",
                      fontFamily: "Prompt, sans-serif",
                      borderRadius: "20px",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#FF8C00",
                        borderRadius: "20px",
                        boxShadow: "none",
                      },
                    }}
                  >
                    ถัดไป
                  </Button>
                </Stack>
                <HighchartsReact highcharts={Highcharts} options={options} />
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
