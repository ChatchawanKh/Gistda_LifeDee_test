import React, { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // ตรวจสอบการเลื่อนหน้าจอ
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ฟังก์ชันเลื่อนขึ้นไปด้านบน
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fab
      onClick={scrollToTop}
      sx={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 1000,
        backgroundColor: "#8DBAFF",
        color: "white",
        width: "56px",
        height: "56px",
        transition:
          "opacity 0.5s ease, visibility 0.5s ease, box-shadow 0.3s ease",
        opacity: showButton ? 1 : 0,
        visibility: showButton ? "visible" : "hidden",
        boxShadow: "rgb(141, 186, 255) 0px 5px 15px",
        "&:hover": {
          boxShadow:
            "rgb(108,166,255, 0.3) 0px 4px 16px, rgb(108,166,255,0.2) 0px 8px 32px",
          backgroundColor: "#8DBAFF",
        },
      }}
    >
      <KeyboardArrowUpIcon
        sx={{
          fontSize: "2rem",
        }}
      />
    </Fab>
  );
};

export default ScrollToTopButton;
