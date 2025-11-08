"use client";
import React, { useState, useEffect } from "react";
import CameraGrid from "../../components/CameraGrid";
import { museumData } from "../../lib/museumData";

export default function TestCamerasPage() {
  const [focusedCamera, setFocusedCamera] = useState(null);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    // Initialize cameras from museumData
    setCameras(museumData.cameras);

    // Optional: Change number of dots randomly every 2 minutes
    const interval = setInterval(() => {
      setCameras(prev =>
        prev.map(cam => ({
          ...cam,
          peopleCount: Math.floor(Math.random() * 25) + 1
        }))
      );
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const handleCameraClick = id => {
    setFocusedCamera(id);
  };

  return (
    <div>
      <h1 className="text-xl font-bold p-4">Test All Cameras</h1>
      <CameraGrid
        cameras={cameras}
        focusedCamera={focusedCamera}
        onCameraClick={handleCameraClick}
        alerts={museumData.alerts}
      />
    </div>
  );
}

