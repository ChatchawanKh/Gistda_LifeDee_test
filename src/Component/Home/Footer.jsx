import React, { useState, useEffect } from 'react';
import './Footer.css';
import moph_logo from '/src/Icon/moph_logo.png';
import gistda_logo from '/src/Icon/Gistda_LOGO.png';
import facebook_logo from '/src/Icon/Facebook.png';
import twitter_logo from '/src/Icon/TwitterX.png';
import ig_logo from '/src/Icon/Instagram.png';
import youtube_logo from '/src/Icon/YouTube.png';
import PcLogo from '/src/Icon/pc.png'
import MHESI from '/src/Icon/MHESI.png'
import MeteoLogo from '/src/Icon/meteo.png'
import Iframe from 'react-iframe';
import dropdown_icon from '/src/Icon/keyboard_arrow_down_24dp_303C46_FILL0_wght400_GRAD0_opsz24.png';
import up_icon from '/src/Icon/keyboard_arrow_up_24dp_303C46_FILL0_wght400_GRAD0_opsz24.png';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAddress, setShowAddress] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="footer-container">
      <div className="footer">
        <div className="footer-address">
          {isMobile ? (
            <>
              <div className="dropdown-toggle" onClick={() => setShowAddress(!showAddress)}>
                <h1>ที่อยู่</h1>
                <img src={showAddress ? up_icon : dropdown_icon} alt="Icon" />
              </div>
              <div className={`dropdown ${showAddress ? 'show' : ''}`}>
                <div className="address-logo">
                  
                  <img src={MHESI} alt="MH" />
                  <img src={gistda_logo} alt="GISTDA logo" />
                  <img src={moph_logo} alt="MOPH logo" />
                  <img src={MeteoLogo} alt="Metro" />
                  {/* <img src={PcLogo} alt="pc" /> */}
                </div>
                <div className="address-text">
                  <p>
                    ที่อยู่: สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)
                    สำนักงานใหญ่ (ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550)
                    เลขที่ 120 อาคารรวมหน่วยราชการ (อาคารรัฐประศาสนภักดี) ชั้น 6 และ 7
                    ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="address-logo">
                
                <img src={MHESI} alt="MH" />
                <img src={gistda_logo} alt="GISTDA logo" />
                <img src={moph_logo} alt="MOPH logo" />
                <img src={MeteoLogo} alt="Metro" />
                {/* <img src={PcLogo} alt="pc" /> */}
              </div>
              <div className="address-text">
                <p>
                  ที่อยู่: สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)
                  สำนักงานใหญ่ (ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550)
                  เลขที่ 120 อาคารรวมหน่วยราชการ (อาคารรัฐประศาสนภักดี) ชั้น 6 และ 7
                  ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210
                </p>
              </div>
            </>
          )}
        </div>
        <div className="footer-contact">
          {isMobile ? (
            <>
              <div className="dropdown-toggle" onClick={() => setShowContact(!showContact)}>
                <h1>ช่องทางการติดต่อ</h1>
                <img src={showContact ? up_icon : dropdown_icon} alt="Icon" />
              </div>
              <div className={`dropdown ${showContact ? 'show' : ''}`}>
                <div className="contact-logo">
                  <h1>Follow Us</h1>
                  <img src={facebook_logo} alt="fb-logo" />
                  <img src={twitter_logo} alt="tw-logo" />
                  <img src={ig_logo} alt="ig-logo" />
                  <img src={youtube_logo} alt="yt-logo" />
                </div>
                <div className="contact-text">
                  <h1>Contact Us</h1>
                  <p>
                    เบอร์ติดต่อ: 0-2141-4444, 0-2141-4468, 0-2141-4505
                    <br />
                    อีเมล: CHANIKA@GISTDA.OR.TH
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="contact-logo">
                <h1>ติดตามข้อมูลข่าวสารได้ที่</h1>
                <img src={facebook_logo} alt="fb-logo" />
                <img src={twitter_logo} alt="tw-logo" />
                <img src={ig_logo} alt="ig-logo" />
                <img src={youtube_logo} alt="yt-logo" />
              </div>
              <div className="contact-text">
                <h1>ติดต่อเรา</h1>
                <p>
                  เบอร์ติดต่อ: 0-2141-4444, 0-2141-4468, 0-2141-4505
                  <br />
                  อีเมล: CHANIKA@GISTDA.OR.TH
                </p>
              </div>
            </>
          )}
        </div>
        <div className="footer-map">
          {isMobile ? (
            <>
              <div className="dropdown-toggle" onClick={() => setShowMap(!showMap)}>
                <h1>แผนที่</h1>
                <img src={showMap ? up_icon : dropdown_icon} alt="Icon" />
              </div>
              <div className={`dropdown ${showMap ? 'show' : ''}`}>
                <span>
                  <Iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d830.2184689595492!2d100.57808863707783!3d13.845274944633791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d321511392b%3A0xf17722d6e2159e59!2zR0lTVERBICjguJrguLLguIfguYDguILguJkp!5e0!3m2!1sth!2sth!4v1720145100044!5m2!1sth!2sth"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></Iframe>
                </span>
              </div>
            </>
          ) : (
            <>
              <h1>แผนที่</h1>
              <Iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d830.2184689595492!2d100.57808863707783!3d13.845274944633791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d321511392b%3A0xf17722d6e2159e59!2zR0lTVERBICjguJrguLLguIfguYDguILguJkp!5e0!3m2!1sth!2sth!4v1720145100044!5m2!1sth!2sth"
                width="100%"
                height="110"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></Iframe>
            </>
          )}
        </div>
      </div>
      <div className="footer-copyright">
        <p>© Geo-Informatics and Space Technology Development Agency (Public Organization). สงวนสิทธิ์ทุกประการ</p>
      </div>
    </section>
  );
};

export default Footer;
