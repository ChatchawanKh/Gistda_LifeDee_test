import React, { useState, useEffect } from 'react';
import axios from 'axios';  // import axios

// Helper function to convert Unix time to Thai Date format
const convertToThaiDate = (unixTime) => {
  const date = new Date(unixTime); // Convert Unix time to milliseconds
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const thaiYear = date.getFullYear() + 543; // Convert Gregorian year to Thai year
  const thaiMonth = thaiMonths[date.getMonth()];
  
  // ใช้ padStart เพื่อเพิ่มศูนย์หน้าหากนาทีเป็นหลักเดียว
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const thaiDate = `${date.getDate()} ${thaiMonth} ${thaiYear} เวลา ${date.getHours()}:${minutes} น.`;

  return thaiDate;
};

const FetchHeatIndexData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchHIDData = async () => {
      const lat = 14; // Example latitude
      const lon = 100; // Example longitude
      const unixTime = Date.now(); // Use current time from Date.now() (in milliseconds)

      const url = `https://gistdaportal.gistda.or.th/imagedata/rest/services/GISTDA_LifeD/heatindex_image_data/ImageServer/identify?geometry={x:${lon},y:${lat}}&geometryType=esriGeometryPoint&time=${unixTime}&returnGeometry=false&returnCatalogItems=true&f=json`;

      try {
        const response = await axios.get(url); // Using axios to make the GET request

        const result = response.data;  // axios response data

        // Safely check if catalogItems and features exist
        const value = result?.value || 'No data';
        const updateUnixTime = result?.catalogItems?.features?.[0]?.attributes?.UpdateDate; // Default to request time if not available
        // console.log(updateUnixTime + ' unixTime');
        const formattedUpdateTime = convertToThaiDate(updateUnixTime);

        setData({ value, updateTime: formattedUpdateTime });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchHIDData();
  }, []);

  return (
    <div>
      {data ? (
        <div>
          <p>Heat Index Value: {data.value}</p>
          <p>Update Time: {data.updateTime}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchHeatIndexData;
