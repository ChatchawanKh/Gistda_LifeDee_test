import React, { useEffect, useRef, useState } from "react";
import "./Banner2.css";
import Phone from "/src/Icon/banner_mobile_mockup.png";
import appStore from "/src/Icon/appStore.png";
import GooglePlay from "/src/Icon/GooglePlay.png";
import VideoPromote from "/src/Icon/iphone_promote.mp4";

const Banner2 = () => {
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (isIntersecting && videoElement) {
      videoElement.muted = true;
      videoElement
        .play()
        .catch((error) => console.log("Autoplay blocked:", error));
    } else if (videoElement) {
      videoElement.pause();
    }
  }, [isIntersecting]);

  const handleVideoEnd = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = videoElement.duration;
    }
  };

  return (
    <section className="Banner2-container">
      <div className="banner2-container-a">
        <div className="banner2-text">
          <div className="banner2-text-ad">
            <h2 className="header-lifedee-ani">LifeDee (ไลฟ์ดี)</h2>
            <h1>สุขภาพดีเริ่มต้นที่</h1>
            <h1>แอปไลฟ์ดี</h1>
            <p>ดาวน์โหลดแอป LifeDee ได้แล้ววันนี้!</p>
          </div>
          <div className="banner2-text-ad-pic-app">
            <a
              href="https://apps.apple.com/th/app/lifedee/id6453761183?l=th"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={appStore} alt="App Store" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=th.or.gistda.lifedee&hl=th&gl=US"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GooglePlay} alt="Google Play" />
            </a>
          </div>
        </div>
        <div className="Banner2-vdo">
          <video
            ref={videoRef}
            width="600"
            height="600"
            onEnded={handleVideoEnd}
            playsInline
            muted
            style={{
              display: "block",
              margin: "0 auto",
            }}
          >
            <source
              src={VideoPromote}
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
};

export default Banner2;
