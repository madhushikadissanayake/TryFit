import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import ColorThief from "colorthief";

const SkinColorDetection = ({ onSubmit }) => {
  const [hexColor, setHexColor] = useState("");
  const webcamRef = useRef(null);
  const colorThief = new ColorThief();

  // Convert RGB to Hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Capture image from webcam and detect skin color
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    detectColorFromImage(imageSrc);
  };

  // Detect dominant color from the captured image
  const detectColorFromImage = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "Anonymous"; // Required for color detection
    img.onload = () => {
      // Create a canvas to process the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Define the face region - adjust these values based on your specific camera and image size
      const faceWidth = img.width / 3; // Face takes about 1/3 of the image width
      const faceHeight = img.height / 3; // Face takes about 1/3 of the image height
      const faceX = (img.width - faceWidth) / 2; // Center the face horizontally
      const faceY = (img.height - faceHeight) / 3; // Slightly above the center vertically

      // Extract the face area from the image
      const faceImageData = ctx.getImageData(faceX, faceY, faceWidth, faceHeight);

      // Create a new canvas for the cropped face image
      const faceCanvas = document.createElement("canvas");
      faceCanvas.width = faceWidth;
      faceCanvas.height = faceHeight;
      const faceCtx = faceCanvas.getContext("2d");

      // Draw the cropped face area
      faceCtx.putImageData(faceImageData, 0, 0);

      // Create a new image from the face canvas
      const croppedFaceImage = new Image();
      croppedFaceImage.src = faceCanvas.toDataURL("image/png");

      // Detect the dominant color from the cropped face image
      croppedFaceImage.onload = () => {
        const dominantColor = colorThief.getColor(croppedFaceImage);
        const hex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
        setHexColor(hex);
        onSubmit(hex); // Call the submit handler with the detected color
      };
    };
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button 
        onClick={capture} 
        style={{
          backgroundColor: '#4a90e2', // Green background color
          color: 'white', // White text color
          border: 'none', // Remove border
          borderRadius: '5px', // Rounded corners
          padding: '10px 20px', // Padding for the button
          cursor: 'pointer', // Change cursor to pointer on hover
          fontSize: '16px', // Font size
          transition: 'background-color 0.3s', // Smooth transition for background color
          margin: '10px'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0a3c78')} // Darker green on hover
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')} // Reset to original on mouse out
      >
        Capture Image
      </button>

      <p>Make sure your face is clearly visible and at an appropriate distance.</p>
    </div>
  );
};





export default SkinColorDetection;