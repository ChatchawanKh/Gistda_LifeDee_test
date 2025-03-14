import React, { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "80%",
  maxWidth: 850,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function TransitionsModal({ open, handleClose }) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // const SquareColorBox = ({ color, children }) => {
  //   return (
  //     <div style={{ display: "flex", alignItems: "center" }}>
  //       <div
  //         style={{
  //           width: 20,
  //           height: 20,
  //           backgroundColor: color,
  //           marginRight: 8,
  //           borderRadius: 4,
  //         }}
  //       ></div>
  //       <div>{children}</div>{" "}
  //       {/* this will render the <strong>{row.level}</strong> */}
  //     </div>
  //   );
  // };

  // Data for tables
  
  const detail = [
    {
      impact: `ภาวะฉุกเฉินทางสุขภาพที่เกิดขึ้นจากการที่
                ร่างกายได้รับความร้อนมากเกินไปและไม่สามารถ
                ควบคุมอุณหภูมิของร่างกายได้อย่างเหมาะสม
                ทำให้อุณหภูมิในร่างกายสูงขึ้นเกิน 40 องศา
                เซลเซียส ซึ่งอาจนำไปสู่ภาวะอันตรายถึงชีวิตได้
                หากไม่ได้รับการรักษาอย่างทันท่วงที่ กลุ่มผู้ป่วย
                ส่วนใหญ่จะมีอาการ 4 อย่าง คือ 1) ไข้สูง
                (มากกว่า 40.5 องศาเซลเซียส) 2) ผิวหนังแดง
                และแห้ง 3) ไม่มีเหงื่อออก 4) ระบบประสาทส่วน
                กลางทำงานผิดปกติ เช่น สับสน กระวนกระวาย
                พูดไม่รู้เรื่อง พฤติกรรม เปลี่ยนแปลง ก้าวร้าว
                ประสาทหลอน ซึมลง หมดสติ และเสียชีวิตได้
                ภายในไม่กี่ชั่วโมง`,
    },
  ];

  const symptom = [
    {
      impact: `อุณหภูมิร่างกายสูงกว่า 40 องศาเซลเซียส,
                ไม่มีเหงื่อ (แม้จะอยู่ในอากาศร้อน), หายใจเร็ว
                ชีพจรเต้นแรง, สับสน เวียนศีรษะ หรือหมดสติ,
                ปวดศีรษะ คลื่นไส้ หรืออาเจี่ยน, ผิวหนังร้อน
                แดง แห้ง หรือชื้น, ผู้ป่วยที่เป็นโรคลมแดดจะมี
                อุณหภูมิร่างกาย (Core Body
                Temperature)40 องศาเซลเซี่ยส หรือมากกว่า
                ร่วมกับภาวะความรู้สติเปลี่ยนแปลง โดยอาจมี
                อาการสับสน กระวนกระวาย เพ้อ และชักหรือ
                หมดสติได้ ร่วมกับภาวะหัวใจเต้นเร็ว อัตราการ
                หายใจเพิ่มขึ้นผู้ป่วยบางรายจะมีอาการปวดศีรษะ
                คลื่นไส้ อาเจียน ผิวหนังแดงและร้อนแต่แห้ง
                ยกเว้นผู้ป่วย Exertional Heatstroke มีบาง
                ราย ที่ผิวหนังจะชื้นเล็กน้อยได้`,
    },
  ];

  const protect = [
    {
      impact1: `• ดื่มน้ำอย่างเพียงพอ เพื่อรักษาความสมดุลของร่างกาย`,
      impact2: `• หลีกเลี่ยงการอยู่กลางแดดจัด โดยเฉพาะในช่วงเวลา 10.00 - 16.00 น.`,
      impact3: `• สวมเสื้อผ้าที่ระบายความร้อนได้ดี เช่น เสื้อผ้าสีอ่อนและไม่รัดรูป`,
      impact4: `• พักผ่อนให้เพียงพอ โดยเฉพาะหลังการออกกำลังกายหรือทำงานหนัก`,
      impact5: `• ระวังกลุ่มเสี่ยง เช่น เด็กเล็ก ผู้สูงอายุ และผู้ที่มีโรคประจำตัว ควรได้รับการดูแลเป็นพิเศษ`,
      impact6: `กองประเมินผลกระทบต่อสุขภาพ กรมอนามัย`
    },
  ];
  


  const renderTable = (data) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <strong>{row.general}</strong>
                <br></br>
                {row.impact}
                {row.impact1} <br></br>
                {row.impact2} <br></br>
                {row.impact3} <br></br>
                {row.impact4} <br></br>
                {row.impact5} <br></br><br></br>
                <Typography sx={{ color: "#666"}}>{row.impact6}</Typography>
                <br></br>
                <strong>{row.risk}</strong>
                <br></br>
                {row.risk_impact}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="รายละเอียด" />
            <Tab label="อาการของโรค" />
            <Tab label="การป้องกัน" />
          </Tabs>

          {/* <Typography
            className="pm_attr"
            id="transition-modal-title"
            sx={{ mt: 2 }}
          >
            {tabIndex === 0 &&
              `ฝุ่นละอองขนาดไม่เกิน 2.5 ไมครอน (PM25) เป็นฝุ่นที่มีเส้นผ่านศูนย์กลางไม่เกิน 2.5 ไมครอน เกิดจาก
            การเผาไหม้ทั้งจากยานพาหนะการเผาวัสดุการเกษตร ไฟบ้า และกระบวนการอุตสาหกรรม สามารถเข้าไปถึง
            ถุงลมในปอดได้ เป็นผลทำให้เกิดโรคในระบบทางเดินหายใจ และโรคปอดต่างๆ
            หากได้รับในปริมาณมากหรือเป็นเวลานานจะสะสมในเนื้อเยื่อปอดทำให้การทำงานของปอดเสื่อบ
            ประสิทธิภาพลง ทำให้หลอดลมอักเสบ มีอาการหอบหืด
            (อ้างอิงข้อมูลจากกรมควบคุมมลพิษ)`}

            {tabIndex === 1 &&
              `ฝุ่นละอองขนาดไม่เกิน 10 ไมครอน (PM10) เป็นฝุ่นที่มีขนาดศูนย์กลางไม่เกิน 10 ไมครอน 
            เกิดจากการเผาไหม้เชื้อเพลิง การเผาในที่โล่ง กระบวนการอุตสาหกรรม การบด การโม่ 
            หรือการทำให้เป็นผงจากการก่อสร้าง ส่งผลกระทบต่อสุขภาพเนื่องจากเมื่อหายใจเข้าไป
            สามารถเข้าไปสะสมในรระบบทางเดินหายใจ (อ้างอิงกรมควบคุมมลพิษ)`}

            {tabIndex === 2 &&
              `ดัชนีคุณภาพอากาศ (Air Quality Index :
            AQI) เป็นคำที่ใช้แทนค่าความเข้มข้นของสาร
            มลพิษทางอากาศทั้ง 6 ชนิด ได้แก่ ฝุ่นละออง
            ขนาดไม่เกิน 2.5 ไมครอน (PM2.5), ฝุ่นละออง
            ไม่เกิน 10 ไมครอน (PM10), ก๊าช
            คาร์บอนมอนอกไซด์ (CO) ก๊าซโอโซน (03),
            ก๊าซไนโตรเจนไดออกไซด์ (NO2) และก๊าซ
            ซัลเฟอร์ไดออกไซด์ (SO2) (อ้างอิงกรมมลพิษ)`}
          </Typography> */}

          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <strong>{tabIndex === 0 && 'รู้จักโรคลมแดด'}</strong>
            <strong>{tabIndex === 1 && ''}</strong>
            <strong>{tabIndex === 2 && 'โรคลมแดดสามารถป้องกันได้ ดังนี้'}</strong>
          </Typography>
          
          {tabIndex === 0 && renderTable(detail)}
          {tabIndex === 1 && renderTable(symptom)}
          {tabIndex === 2 && renderTable(protect)}
        </Box>
      </Fade>
    </Modal>
  );
}
