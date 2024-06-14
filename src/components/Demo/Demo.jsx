import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SwitchCameraIcon from "@mui/icons-material/SwitchCamera";
import RefreshIcon from "@mui/icons-material/Refresh";

const Demo = () => {
  const [screenshot, setScreenshot] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          // Automatically set the first video device if available
          if (videoDevices.length > 0) {
            setDeviceId(videoDevices[0].deviceId);
          }
        })
        .catch((err) => {
          alert("Error accessing media devices:", err);
        });
    } else {
      alert("enumerateDevices() not supported.");
    }
  }, []);

  const captureScreenshot = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setScreenshot(screenshot);
  };

  const handleClick = () => {
    if (screenshot) {
      window.open(screenshot);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const resetWebcam = () => {
    setScreenshot(null);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="position-relative">
        {screenshot ? (
          <img
            src={screenshot}
            alt="Screenshot"
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
            onClick={handleClick}
          />
        ) : (
          <Webcam
            audio={false}
            height={480}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={480}
            videoConstraints={{ facingMode: facingMode }}
          />
        )}
      </div>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={captureScreenshot}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CameraAltIcon />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSwitchCamera}
          sx={{
            ml: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SwitchCameraIcon />
        </Button>
      </Box>
      {screenshot && (
        <Button
          variant="contained"
          color="primary"
          onClick={resetWebcam}
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RefreshIcon />
        </Button>
      )}
    </div>
  );
};

export default Demo;
