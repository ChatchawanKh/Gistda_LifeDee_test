import React from "react";
import ResponsiveAppBar from "../NavigationBar/navbar_contact";
import Footer from "/src/Component/Home/Footer.jsx";
import MophLogo from "/src/Icon/moph_logo.svg";
import PcLogo from "/src/Icon/pc.png";
import MeteoLogo from "/src/Icon/meteo.png";
import Gistda from "/src/Icon/Gistda_LOGO.png";

import "./ContactUs.css";

function ContactUs() {
  return (
    <>
      <ResponsiveAppBar />
      <div className="contact-container">
        <div className="contact-section">
          <div className="contact-content">
            <div className="contact-header">
              <h1>ติดต่อเรา</h1>
            </div>
            <div className="contact-columns">
              <div className="contact-column">
                <h2>ปัญหาสุขภาพ</h2>
                <div className="contact-info">
                  <h3>กรมอนามัย กระทรวงสาธารณสุข</h3>
                  <p>88/22 ม.4 ถ.ติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000</p>
                  <p>
                    โทรศัพท์ 0-2590-4361-2
                    <br />
                    โทรสาร 0-2590-4356
                  </p>
                  <p>E-mail: anamaipm25@gmail.com</p>
                </div>

                <h2>ปัญหาการใช้งานเว็บแอปพลิเคชัน</h2>
                <div className="contact-info">
                  <h3>
                    สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)
                  </h3>
                  <p>ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550</p>
                  <p>
                    เลขที่ 120 อาคารรวมหน่วยราชการ
                    <br />
                    ชั้น 6 และ ชั้น 7 ถนนแจ้งวัฒนะ
                    <br />
                    แขวงทุ่งสองห้อง เขตหลักสี่
                    <br />
                    กรุงเทพฯ 10210
                  </p>
                  <p>
                    โทรศัพท์ Call Center 0-2141-4444, 0-2141-4674
                    <br />
                    โทรศัพท์ งานสารบรรณ 0-2141-4466, 0-2141-4468
                    <br />
                    โทรสาร 0-2143-9586
                  </p>
                  <p>E-mail: info@gistda.or.th</p>
                </div>
              </div>

              <div className="contact-column">
                
                <h2>ปัญหาการใช้งานแอปพลิเคชัน</h2>
                <div className="contact-info">
                  <h3>
                    สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)
                  </h3>
                  <p>ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550</p>
                  <p>
                    เลขที่ 120 อาคารรวมหน่วยราชการ
                    <br />
                    ชั้น 6 และ ชั้น 7 ถนนแจ้งวัฒนะ
                    <br />
                    แขวงทุ่งสองห้อง เขตหลักสี่
                    <br />
                    กรุงเทพฯ 10210
                  </p>
                  <p>
                    โทรศัพท์ Call Center 0-2141-4444, 0-2141-4674
                    <br />
                    โทรศัพท์ งานสารบรรณ 0-2141-4466, 0-2141-4468
                    <br />
                    โทรสาร 0-2143-9586
                  </p>
                  <p>E-mail: info@gistda.or.th</p>
                </div>

                <h2>ปัญหาสุขภาพ</h2>
                <div className="contact-info">
                  <h3>กรมอนามัย กระทรวงสาธารณสุข</h3>
                  <p>88/22 ม.4 ถ.ติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000</p>
                  <p>
                    โทรศัพท์ 0-2590-4361-2
                    <br />
                    โทรสาร 0-2590-4356
                  </p>
                  <p>E-mail: anamaipm25@gmail.com</p>
                </div>
              </div>
            </div>

            <h4>สนับสนุนข้อมูลโดย</h4>
            <div className="contact-supporters">
              <img
                src={MophLogo}
                alt="กรมอนามัย"
                className="logo-moph"
                style={{ width: "35px", verticalAlign: "middle" }}
              />
              <img
                src={Gistda}
                alt="GISTDA"
                className="logo-gistda"
                style={{ width: "60px", verticalAlign: "middle" }}
              />
              <img
                src={PcLogo}
                alt="Pollution Control"
                className="logo-pc"
                style={{ width: "42px", verticalAlign: "middle" }}
              />
              <img
                src={MeteoLogo}
                alt="Meteorological Department"
                className="logo-meteo"
                style={{ width: "42px", verticalAlign: "middle" }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs;
