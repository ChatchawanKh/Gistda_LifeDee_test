import React, { useState, useEffect } from "react";
import axios from "axios";

import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { startOfYear, endOfYear } from "date-fns";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// import { BarChart } from '@mui/x-charts';
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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { th } from "date-fns/locale";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";

// import MyLocationIcon from '@mui/icons-material/MyLocation';
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import Card_dash_bg from "/assets/Icon/Dashboard_card_Deng_bg.png";
import ModalPM25 from "/assets/Icon/Modal_pm25.png";
import Sexual from "/assets/Icon/sexual_icon.png";
import PM25levelChart from "/assets/Icon/PM25Level.png";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PlaceIcon from "@mui/icons-material/Place";

import { easeOut, motion } from "framer-motion";

import "./DashboardDrowning.css";

export default function Dashboard({
  openDashboard,
  toggleDashboard,
  activeScenario,
}) {
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

  //เปิดปิด information//
  const [openModalHID, setModalHIDOpen] = React.useState(false);
  const handleCloseModalHID = () => setModalHIDOpen(false);

  const dataByProvince = [
    {
      province: "เขตสคร.9",
      data: [
        { name: "ดำเนินการแล้ว", y: 16.97, color: "#4CAF50" },
        { name: "ยังไม่ดำเนินการ", y: 83.03, color: "#F48FB1" },
      ],
    },
    {
      province: "ชัยภูมิ",
      data: [
        { name: "ดำเนินการแล้ว", y: 41.56, color: "#4CAF50" },
        { name: "ยังไม่ดำเนินการ", y: 58.44, color: "#F48FB1" },
      ],
    },
    {
      province: "นครราชสีมา",
      data: [
        { name: "ดำเนินการแล้ว", y: 7.82, color: "#4CAF50" },
        { name: "ยังไม่ดำเนินการ", y: 92.18, color: "#F48FB1" },
      ],
    },
    {
      province: "บุรีรัมย์",
      data: [
        { name: "ดำเนินการแล้ว", y: 19.76, color: "#4CAF50" },
        { name: "ยังไม่ดำเนินการ", y: 80.24, color: "#F48FB1" },
      ],
    },
    {
      province: "สุรินทร์",
      data: [
        { name: "ดำเนินการแล้ว", y: 13.33, color: "#4CAF50" },
        { name: "ยังไม่ดำเนินการ", y: 86.67, color: "#F48FB1" },
      ],
    },
  ];

  const scenarioToProvinceMap = {
    lastedData: "เขตสคร.9",
    chLayer: "ชัยภูมิ",
    krLayer: "นครราชสีมา",
    brLayer: "บุรีรัมย์",
    srLayer: "สุรินทร์",
  };

  const selectedProvince = scenarioToProvinceMap[activeScenario];

  const selectedItem = dataByProvince.find(
    (item) => item.province === selectedProvince
  );

  return (
    <>
      <div className="open-dashboard-btn">
        <Tooltip
          title="Dashboard"
          placement="right"
          arrow
          classes={{ tooltip: "open-dashboard-Deng-tooltip" }}
        >
          <IconButton
            className="OpenDashboard-Drowning"
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
            <SpaceDashboardIcon className="OpenDashboard-Drowning" />
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
            PM2.5
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
            ฝุ่นละอองขนาดไม่เกิน 2.5 ไมครอน (PM2.5)
            เป็นฝุ่นที่มีเส้นผ่านศูนย์กลางไม่เกิน 2.5 ไมครอน
            เกิดจากการเผาไหม้ทั้งจากยานพาหนะ กาเรผาวัสดุการเกษตร ไฟป่า
            แลกระบวนการอุตสาหกรรม สามารถเข้าไปถึงถุงลมในปอดได้
            เป็นผลทำให้เกิดโรคในระบบทางเดินหายใจและโรคปอดต่าง ๆ
            หากได้รับในปริมาณมากหรือเป็นเวลานานจะสะสมในเนื้อเยื่อปอด
            ทำให้การทำงานของปอดเสื่อมประสิทธิภาพลง ทำให้หลอดลมอักเสบ
            มีอาการหอบหืด (อ้างอิง: กรมควบคุมมลพิษ)
            <img src={ModalPM25} alt="ModalPM25" />
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
            className="Dashboard-Deng-Rank"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="Dashboard-Deng-Statistics-head">
              <h1>
                สถิติแหล่งน้ำที่มีการจัดการความเสี่ยงปี 2567
              </h1>
            </div>

            <div className="Dengue-filterby-region">
              {selectedItem ? (
                <div style={{ flex: "0 0 auto" }}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      chart: {
                        type: "pie",
                        backgroundColor: "transparent",
                        borderRadius: "15px",
                        height: 300,
                      },
                      title: {
                        text: `สัดส่วนการดำเนินการ - ${selectedItem.province}`,
                        align: "center",
                        style: {
                          fontSize: "16px",
                          color: "#303C46",
                        },
                      },
                      tooltip: {
                        pointFormat:
                          "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y}%)",
                      },
                      accessibility: {
                        point: {
                          valueSuffix: "%",
                        },
                      },
                      legend: {
                        enabled: true,
                        align: "center",
                        verticalAlign: "bottom",
                        itemStyle: {
                          fontSize: "12px",
                          color: "#303C46",
                        },
                      },
                      plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: "pointer",
                          borderWidth: 0,
                          showInLegend: true,
                          dataLabels: {
                            enabled: true,
                            format: "<b>{point.name}</b>: {point.y}%",
                            style: {
                              fontSize: "12px",
                            },
                          },
                        },
                      },
                      credits: {
                        enabled: false,
                      },
                      series: [
                        {
                          name: "สถานะ",
                          colorByPoint: false,
                          data: selectedItem.data,
                        },
                      ],
                    }}
                  />
                </div>
              ) : (
                <p>ไม่พบข้อมูลสำหรับสถานการณ์นี้</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
