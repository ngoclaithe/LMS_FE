import axios from 'axios';
import CryptoJS from 'crypto-js';

const uploadImage = async (file) => {
  const timestamp = Math.round(Date.now() / 1000);
  const cloudName = 'drnk9w4lu'; 
  const apiKey = '431925655642169';
  const apiSecret = 'SdQ1f4wnSaKp7vMDxE0izQvdG7Y';

  const stringToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = CryptoJS.SHA1(stringToSign).toString();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw error;
  }
};

export default uploadImage;
