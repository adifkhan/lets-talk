import axios from "axios";

const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_PRESET;

const imageUploader = async (file) => {
  //   const fileInput = e.target.files;
  //   if (fileInput?.length > 0) {
  //     const file = fileInput[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    const imageUrl = response?.data?.url;
    return imageUrl;
  } catch (error) {
    console.log(error);
    const imageUrl = "";
    return imageUrl;
  }
};

export default imageUploader;
