"use client";

import React, { useState } from "react";
import CameraGrid from "../../components/CameraGrid";
import { museumData } from "../../lib/museumData";

export default function TestCamerasPage() {
  const [focusedCamera, setFocusedCamera] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold p-4">Test Camera Grid</h1>
      <CameraGrid
        cameras={museumData.cameras}
        focusedCamera={focusedCamera}
        alerts={museumData.alerts}
        onCameraClick={id => setFocusedCamera(id)}
      />
    </div>
  );
}
