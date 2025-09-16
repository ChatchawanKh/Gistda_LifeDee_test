import React, { useState, useEffect } from 'react';
import './Footer.css';
import moph_logo from '/assets/Icon/moph_logo.png';
import gistda_logo from '/assets/Icon/Gistda_LOGO.png';
import facebook_logo from '/assets/Icon/Facebook.png';
import twitter_logo from '/assets/Icon/TwitterX.png';
import ig_logo from '/assets/Icon/Instagram.png';
import youtube_logo from '/assets/Icon/YouTube.png';
import PcLogo from '/assets/Icon/pc.png'
import MHESI from '/assets/Icon/MHESI.png'
import MeteoLogo from '/assets/Icon/meteo.png'
import Iframe from 'react-iframe';
import dropdown_icon from '/assets/Icon/keyboard_arrow_down_24dp_303C46_FILL0_wght400_GRAD0_opsz24.png';
import up_icon from '/assets/Icon/keyboard_arrow_up_24dp_303C46_FILL0_wght400_GRAD0_opsz24.png';

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
                  อีเมล: lifedee.gistda@gmail.com
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6344.522332828534!2d100.5618300768033!3d13.881869986523661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2832ff601e93b%3A0x4adcb46a8124f677!2zR0lTVERBICjguKrguLPguJnguLHguIHguIfguLLguJnguYPguKvguI3guYgpIOC4quC4s-C4meC4seC4geC4h-C4suC4meC4nuC4seC4kuC4meC4suC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4teC4reC4p-C4geC4suC4qOC5geC4peC4sOC4oOC4ueC4oeC4tOC4quC4suC4o-C4quC4meC5gOC4l-C4qCAo4Lit4LiH4LiE4LmM4LiB4Liy4Lij4Lih4Lir4Liy4LiK4LiZKQ!5e1!3m2!1sth!2sth!4v1747709287909!5m2!1sth!2sth"
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6344.522332828534!2d100.5618300768033!3d13.881869986523661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2832ff601e93b%3A0x4adcb46a8124f677!2zR0lTVERBICjguKrguLPguJnguLHguIHguIfguLLguJnguYPguKvguI3guYgpIOC4quC4s-C4meC4seC4geC4h-C4suC4meC4nuC4seC4kuC4meC4suC5gOC4l-C4hOC5guC4meC5guC4peC4ouC4teC4reC4p-C4geC4suC4qOC5geC4peC4sOC4oOC4ueC4oeC4tOC4quC4suC4o-C4quC4meC5gOC4l-C4qCAo4Lit4LiH4LiE4LmM4LiB4Liy4Lij4Lih4Lir4Liy4LiK4LiZKQ!5e1!3m2!1sth!2sth!4v1747709287909!5m2!1sth!2sth"
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
