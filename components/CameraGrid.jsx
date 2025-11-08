// components/CameraGrid.jsx
"use client";

import React from "react";
import AnimatedCamera from "./AnimatedCamera";
import { cameraFloorMaps } from "../lib/mapDefinitions";

const CameraGrid = ({ cameras = [], focusedCamera, alerts = [], onCameraClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {cameras.map(camera => {
        const floorMap = cameraFloorMaps[camera.id];
        if (!floorMap) {
          return <div key={camera.id}>No map for {camera.name}</div>;
        }

        return (
          <div
            key={camera.id}
            onClick={() => onCameraClick && onCameraClick(camera.id)}
            className={`border ${focusedCamera === camera.id ? "border-green-400" : "border-gray-700"}`}
          >
            <AnimatedCamera
              cameraId={camera.id}
              cameraName={camera.name}
              peopleCount={camera.peopleCount || 5}
              isFocused={focusedCamera === camera.id}
              hasAlert={alerts.some(a => a.camera === camera.id)}
              floorMap={floorMap}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CameraGrid;
