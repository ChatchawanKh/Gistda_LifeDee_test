import React, { useEffect, useState } from 'react';
import "./LifeDeeBanner.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import pic1 from "/assets/Icon/mobile-banner2.png";

function LifeDeeBanner() {
  const navigate = useNavigate(); 
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // ตั้งค่าช่วง scroll ที่ต้องการให้มีผล เช่น 0 ถึง 1000px
      const startScroll = 0;
      const endScroll = 300;

      // คำนวณอัตราส่วนของ scroll ที่เกิดขึ้นในช่วงที่กำหนด
      const scrollProgress = Math.min(Math.max((scrollY - startScroll) / (endScroll - startScroll), 0), 1);

      // ตั้งค่า scale ที่ต้องการให้ลดลง เช่น จาก 1 → 0.6
      const minScale = 0.78;
      const maxScale = 1;
      const newScale = maxScale - (maxScale - minScale) * scrollProgress;

      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="banner-lifed">
      <div className="banner-lifedee-container">
        <div className="banner-text-head">
          <h1 className="header-lifedee">Life Dee</h1>
          <h2>สุขภาพดี เริ่มต้นที่ไลฟ์ดี ✨</h2>
          <p>
            แพลตฟอร์มที่ช่วยส่งเสริมสุขภาพของประชาชนชาวไทย
            เพื่อสนับสนุนการเข้าถึงบริการสุขภาพได้อย่างมีประสิทธิภาพ
          </p>
        </div>
        <div className="fancy">
          <Button
            variant="contained"
            sx={{
              color: "#ffffff",
              backgroundColor: "rgb(98, 161, 255)",
              fontSize: "16px",
              fontFamily: "Prompt",
              borderRadius: "30px",
              padding: "5px 24px",
              fontWeight: "normal",
              margin: "0px 0px",
              textTransform: "none",
              boxShadow: "none",
              zIndex: "1",
              width: "220px",
              height: "43px",
              "&:hover": {
                boxShadow: "none",
              },
            }}
            onClick={() => navigate("/pm")} 
          >
            แผนที่บริการด้านสุขภาพ
          </Button>
        </div>
        <div className="banner-mobile-1">
          <img src={pic1} alt="" style={{ transform: `scale(${scale})` }} />
        </div>
      </div>
    </div>
  );
}

export default LifeDeeBanner;
