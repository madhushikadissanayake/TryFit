import React, { useRef, useState, useEffect } from 'react';
import Navi from '../../Navi';
import Foot from '../../footer';
import './measurement.css';
import sizeImage from '../../images/sizes.png';

const BodyMeasurement = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [measurements, setMeasurements] = useState({ shoulders: 0, waist: 0, chest: 0, shoulderToWaist: 0, height: 0 });
  const [clothingSize, setClothingSize] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');
  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);

  // Load MediaPipe scripts on component mount
  useEffect(() => {
    const loadMediaPipeScripts = async () => {
      try {
        // Load required scripts in order
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

        setMediaPipeLoaded(true);
      } catch (err) {
        console.error('Failed to load MediaPipe scripts:', err);
        setError('Failed to load required libraries. Please refresh the page and try again.');
      }
    };

    loadMediaPipeScripts();

    return () => {
      // Clean up scripts on unmount
      const scripts = document.querySelectorAll('script[data-mediapipe]');
      scripts.forEach(script => document.body.removeChild(script));
    };
  }, []);

  // Set up pose detection when camera is activated and scripts are loaded
  useEffect(() => {
    if (!cameraActive || !mediaPipeLoaded) return;

    let poseInstance = null;
    let cameraInstance = null;

    const setupPoseDetection = async () => {
      try {
        // Access global objects provided by the MediaPipe scripts
        const { Pose, POSE_CONNECTIONS } = window;
        const { drawConnectors, drawLandmarks } = window;
        const { Camera } = window;

        if (!Pose || !POSE_CONNECTIONS || !drawConnectors || !drawLandmarks || !Camera) {
          throw new Error('MediaPipe libraries not loaded correctly');
        }

        // Create pose instance
        poseInstance = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        poseInstance.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        poseInstance.onResults((results) => {
          const canvasElement = canvasRef.current;
          if (!canvasElement) return;

          const canvasCtx = canvasElement.getContext('2d');
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          if (results.image) {
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
          }

          if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

            const calculatedMeasurements = calculateMeasurements(results.poseLandmarks);
            setMeasurements(calculatedMeasurements);
            suggestClothingSize(calculatedMeasurements);
          }

          canvasCtx.restore();
        });

        // Start camera
        if (videoRef.current) {
          cameraInstance = new Camera(videoRef.current, {
            onFrame: async () => {
              if (poseInstance && videoRef.current) {
                try {
                  await poseInstance.send({ image: videoRef.current });
                } catch (err) {
                  console.error('Error processing video frame:', err);
                }
              }
            },
            width: 640,
            height: 480,
          });

          await cameraInstance.start();
        }

      } catch (err) {
        console.error('Error setting up pose detection:', err);
        setError('Failed to initialize body measurement system. Please try again later.');
        setCameraActive(false);
      }
    };

    setupPoseDetection();

    // Cleanup function
    return () => {
      if (cameraInstance) {
        cameraInstance.stop();
      }
      if (poseInstance) {
        poseInstance.close();
      }
    };
  }, [cameraActive, mediaPipeLoaded]);

  // Helper function to load scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.setAttribute('data-mediapipe', 'true');
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const calculateMeasurements = (landmarks) => {
    const shouldersDistance = calculateDistance(landmarks[11], landmarks[12]); // Between shoulders
    const waistDistance = calculateDistance(landmarks[23], landmarks[24]); // Between hips
    const chestDistance = calculateDistance(landmarks[11], landmarks[23]); // Chest measurement (shoulder to hip)
    const shoulderToWaistDistance = calculateDistance(landmarks[11], landmarks[23]); // Shoulder to waist measurement

    const heightValue = parseFloat(height);
    if (isNaN(heightValue) || heightValue <= 0) {
      return { shoulders: 0, waist: 0, chest: 0, shoulderToWaist: 0, height: 0 };
    }

    const heightDistance = heightValue / 100; // Convert height from cm to meters for calculation

    return {
      shoulders: (shouldersDistance * heightDistance * 100).toFixed(2), // Scale by height
      waist: (waistDistance * heightDistance * 100 * 3).toFixed(2), // Scale by height
      chest: (chestDistance * heightDistance * 100).toFixed(2), // Scale by height
      shoulderToWaist: ((shoulderToWaistDistance * heightDistance * 100) / 2).toFixed(2), // Scale by height
      height: (heightDistance * 100).toFixed(2), // Keep height in cm
    };
  };

  const calculateDistance = (point1, point2) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  const suggestClothingSize = (measurements) => {
    const { chest } = measurements;

    if (chest > 117) {
      setClothingSize('3XL');
    } else if (chest > 112) {
      setClothingSize('2XL');
    } else if (chest > 107) {
      setClothingSize('XL');
    } else if (chest > 102) {
      setClothingSize('L');
    } else if (chest > 97) {
      setClothingSize('M');
    } else if (chest > 92) {
      setClothingSize('S');
    } else if (chest > 89) {
      setClothingSize('XS');
    } else if (chest > 81) {
      setClothingSize('S2(2XS)');
    } else {
      setClothingSize('S4(3XS)');
    }
  };

  const startCamera = () => {
    if (!height || height.trim() === '') {
      setError('Please enter your height for more accurate result.');
      return;
    }

    if (!mediaPipeLoaded) {
      setError('Please wait while the necessary libraries are loading...');
      return;
    }

    setCameraActive(true);
    setError(''); // Clear any previous errors
  };

  const reset = () => {
    setCameraActive(false);
    setMeasurements({ shoulders: 0, waist: 0, chest: 0, shoulderToWaist: 0, height: 0 });
    setClothingSize('');
    setHeight('');
    setError('');
  };

  return (
    <div>
      <Navi />
      <div className="shopping-cart">
        <h2 className="cart-title">Body Measurement</h2>
        <div className="actions">
          <p>Discover your perfect fit using your webcam in seconds</p>
          {!cameraActive && (
            <>
              <input
                type="number"
                placeholder="Enter your height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="height-input"
                disabled={cameraActive}
              />
              <button
                onClick={startCamera}
                className="start-button"
                disabled={cameraActive || !mediaPipeLoaded}
              >
                {mediaPipeLoaded ? 'Start Camera' : 'Loading...'}
              </button>
            </>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}

        {cameraActive && (
          <div className="camera-section">
            <div className="video-canvas-container">
              <video ref={videoRef} style={{ display: 'none' }}></video>
              <canvas ref={canvasRef} width="640" height="480" className="canvas-view"></canvas>
            </div>

            {/* Notice and Image Section */}
            <div className="notice-section">
              <div className="notice-text">
                <h6>Notice:</h6>
                <li>Ensure you're standing straight.</li>
                <li>Stand few feet away from your webcam. Upper part of the body should be visible to camera.</li>
                <li>Wear tight-fitting clothes for better accuracy.</li>
              </div>
              <h6>Size chart</h6>
              <img src={sizeImage} alt="Clothing size chart" className="notice-image" />
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="measurement-info">
            <h3>Measurements:</h3>
            <p>Shoulders: {measurements.shoulders} cm</p>
            <p>Waist: {measurements.waist} cm</p>
            <p>Chest: {measurements.chest} cm</p>
            <p>Shoulder to Waist: {measurements.shoulderToWaist} cm</p>
            <p>Height: {measurements.height} cm</p>
            <h3>Suggested Clothing Size: {clothingSize}</h3>
            <button onClick={reset} className="reset-button">
              Reset
            </button>
          </div>
        )}
      </div>
      <Foot />
    </div>
  );
};

export default BodyMeasurement;