import React, { useEffect, useRef, useState } from "react";
import './LiveVideo.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

const CaptureFrame = ({ imageRef, capturedImage, setCapturedImage, wsUrl, label }) => {
  const wsRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      const base64Image = event.data;
      imageRef.current.src = `data:image/jpeg;base64,${base64Image}`;
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      wsRef.current.close();
    };
  }, [imageRef, wsUrl]);

  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const base64Image = canvas.toDataURL("image/jpeg");
    const blob = await fetch(base64Image).then((res) => res.blob());

    setCapturedImage(base64Image);
    
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");
    console.log({base64Image, blob, formData});

    // Optional: Post formData to your server if needed.
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        containerRef.current.classList.add("fullscreen");
      } else {
        containerRef.current.classList.remove("fullscreen");
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="video-container-cam">
      <div className="video-header-cam">
        <span>{label}</span>
      </div>
      <div className="video-content-cam">
        <img
          ref={imageRef}
          alt="Live Stream"
          className="rounded"
          style={{ width: "auto", height: "150px" }}
        />
        <button onClick={toggleFullScreen} className="full-screen-button">
          {isFullScreen ? "Exit Full Screen" : <FontAwesomeIcon icon={faExpand} />}
        </button>
        <div className="overlay-cam">
          <button onClick={capturePhoto} className="btn btn-sm btn-outline-primary fw-bold my-2">
            Capture Photo
          </button>
        </div>
      </div>
      {capturedImage && (
        <div className="captured-image">
          <img
            src={capturedImage}
            alt="Captured"
            className="rounded"
            style={{ width: "170px", height: "auto", margin: "10px 0px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CaptureFrame;
