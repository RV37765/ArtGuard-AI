// components/AnimatedCamera.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * AnimatedCamera Component
 * Props:
 * - cameraId: number
 * - cameraName: string
 * - room: string - room location/wing
 * - peopleCount: number
 * - isFocused: boolean
 * - hasAlert: boolean
 * - floorMap: { width, height, obstacles: [{x, y, width, height}], zones: [...] }
 * - baseFloorMap: { width, height, ... } - unscaled floor map for initialization
 * - onSuspiciousActivity: function(dot) => void
 * - getOrInitializeDots: function(cameraId, baseFloorMap) => dots[]
 * - updateCameraDots: function(cameraId, dots) => void
 * - isLockdown: boolean - if true, hide all dots (empty room)
 * - showOnlySuspicious: boolean - if true, show only red dots
 */
const AnimatedCamera = ({
  cameraId,
  cameraName,
  room,
  peopleCount,
  isFocused,
  hasAlert,
  floorMap,
  baseFloorMap,
  onSuspiciousActivity,
  getOrInitializeDots,
  updateCameraDots,
  isLockdown,
  showOnlySuspicious
}) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const [dots, setDots] = useState([]);

  // Configuration
  const minDots = 10;
  const maxDots = 35;
  const speedThreshold = 0.025; // below this considered slow - very low to catch only truly stationary dots
  const suspiciousTime = 8000; // ms to turn red (12 seconds - people naturally pause to view art)

  // Initialize dots once per camera
  useEffect(() => {
    const baseDots = getOrInitializeDots(cameraId, baseFloorMap);

    // Scale dots if floorMap size differs from baseFloorMap
    const scaleX = floorMap.width / baseFloorMap.width;
    const scaleY = floorMap.height / baseFloorMap.height;

    const scaledDots = baseDots.map(dot => ({
      ...dot,
      x: dot.x * scaleX,
      y: dot.y * scaleY
    }));

    setDots(scaledDots);
    dotsRef.current = scaledDots;
  }, [cameraId, floorMap.width, floorMap.height, baseFloorMap.width, baseFloorMap.height, getOrInitializeDots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawObstacles() {
      // Calculate scale factor for fonts based on canvas size
      const scaleFactor = floorMap.width / baseFloorMap.width;
      const baseFontSize = 9;
      const fontSize = Math.round(baseFontSize * scaleFactor);
      const baseLineHeight = 10;
      const lineHeight = baseLineHeight * scaleFactor;

      floorMap.obstacles.forEach(obs => {
        // Draw obstacle rectangle
        ctx.fillStyle = "#444";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Draw border
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1 * scaleFactor;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

        // Draw label if it exists
        if (obs.label) {
          ctx.fillStyle = "#fff";
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Multi-line text support for longer labels
          const words = obs.label.split(' ');
          const maxWidth = obs.width - (4 * scaleFactor);
          let lines = [];
          let currentLine = '';

          words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) lines.push(currentLine);

          // Draw each line centered
          const totalHeight = lines.length * lineHeight;
          const startY = obs.y + obs.height / 2 - totalHeight / 2 + lineHeight / 2;

          lines.forEach((line, i) => {
            ctx.fillText(line, obs.x + obs.width / 2, startY + i * lineHeight);
          });
        }
      });
    }

    function drawZones() {
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1;
      floorMap.zones.forEach(zone => {
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawZones();
      drawObstacles();

      // Update dots
      const updatedDots = dotsRef.current.map(dot => {
        let newSpeedX = dot.speedX;
        let newSpeedY = dot.speedY;
        let nextX = dot.x + newSpeedX;
        let nextY = dot.y + newSpeedY;

        // Bounce walls
        if (nextX + dot.radius >= floorMap.width || nextX - dot.radius <= 0) {
          newSpeedX *= -1;
          nextX = dot.x + newSpeedX; // Recalculate with new speed
        }
        if (nextY + dot.radius >= floorMap.height || nextY - dot.radius <= 0) {
          newSpeedY *= -1;
          nextY = dot.y + newSpeedY; // Recalculate with new speed
        }

        // Bounce obstacles
        floorMap.obstacles.forEach(obs => {
          // Allow movement through stairs
          const isStairs = obs.label && obs.label.toLowerCase().includes('stairs');

          if (!isStairs) {
            // Check if next position would collide
            const willCollide =
              nextX + dot.radius > obs.x &&
              nextX - dot.radius < obs.x + obs.width &&
              nextY + dot.radius > obs.y &&
              nextY - dot.radius < obs.y + obs.height;

            // Check if currently inside obstacle
            const isCurrentlyInside =
              dot.x + dot.radius > obs.x &&
              dot.x - dot.radius < obs.x + obs.width &&
              dot.y + dot.radius > obs.y &&
              dot.y - dot.radius < obs.y + obs.height;

            if (willCollide || isCurrentlyInside) {
              // Only reverse direction, don't teleport
              // Determine which direction to bounce based on collision side
              const fromLeft = dot.x < obs.x;
              const fromRight = dot.x > obs.x + obs.width;
              const fromTop = dot.y < obs.y;
              const fromBottom = dot.y > obs.y + obs.height;

              // Bounce horizontally if hitting left/right sides
              if (fromLeft || fromRight) {
                newSpeedX *= -1;
              }
              // Bounce vertically if hitting top/bottom sides
              if (fromTop || fromBottom) {
                newSpeedY *= -1;
              }

              // Recalculate next position
              nextX = dot.x + newSpeedX;
              nextY = dot.y + newSpeedY;
            }
          }
        });

        // Update position with calculated speed
        dot.x += newSpeedX;
        dot.y += newSpeedY;
        dot.speedX = newSpeedX;
        dot.speedY = newSpeedY;

        // Suspicious detection
        const now = Date.now();
        const movedDistance = Math.sqrt(dot.speedX ** 2 + dot.speedY ** 2);

        if (movedDistance < speedThreshold) {
          // stationary for long enough → red
          if (now - dot.lastMovedTime > suspiciousTime) {
            dot.color = "red";
            if (onSuspiciousActivity) onSuspiciousActivity(dot);
          }
        } else {
          // moving again → green
          dot.color = "green";
          dot.lastMovedTime = now;
        }

        // Draw dot (conditionally based on lockdown and filter modes)
        // Skip rendering if in lockdown mode
        if (!isLockdown) {
          // Skip green dots if showing only suspicious
          if (!showOnlySuspicious || dot.color === "red") {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = dot.color;
            ctx.fill();
          }
        }

        return dot;
      });

      dotsRef.current = updatedDots;

      // Save dots back to parent in base (unscaled) coordinates
      const scaleX = baseFloorMap.width / floorMap.width;
      const scaleY = baseFloorMap.height / floorMap.height;
      const unscaledDots = updatedDots.map(dot => ({
        ...dot,
        x: dot.x * scaleX,
        y: dot.y * scaleY
      }));
      updateCameraDots(cameraId, unscaledDots);

      // Helper function to truncate text if too long
      const truncateText = (text, maxWidth) => {
        let truncated = text;
        while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1);
        }
        if (truncated.length < text.length) {
          truncated = truncated.slice(0, -3) + '...';
        }
        return truncated;
      };

      // Calculate scale factor for header sizing
      const scaleFactor = floorMap.width / baseFloorMap.width;
      const headerHeight = 50 * scaleFactor;
      const baseFontLarge = 11;
      const baseFontSmall = 9;
      const fontLarge = Math.round(baseFontLarge * scaleFactor);
      const fontSmall = Math.round(baseFontSmall * scaleFactor);

      // Draw header at BOTTOM so it appears on top of everything
      // Header bar background
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, canvas.height - headerHeight, canvas.width, headerHeight);

      // Camera name (top line, centered)
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${fontLarge}px monospace`;
      ctx.textAlign = "center";
      const nameText = truncateText(cameraName, canvas.width - 20);
      ctx.fillText(nameText, canvas.width / 2, canvas.height - headerHeight + (fontLarge + 4));

      // Room/Wing location (second line, centered)
      if (room) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = `${fontSmall}px monospace`;
        ctx.textAlign = "center";
        const roomText = truncateText(room, canvas.width - 20);
        ctx.fillText(roomText, canvas.width / 2, canvas.height - headerHeight + (fontLarge + fontSmall + 8));
      }

      // Add extra padding for focused view to prevent cutoff
      const edgePadding = isFocused ? 30 : 10;

      // Timestamp (bottom left)
      ctx.fillStyle = "#ff4444";
      ctx.font = `${fontSmall}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(new Date().toLocaleTimeString(), edgePadding, canvas.height - 8);

      // People count (bottom right)
      ctx.fillStyle = "#4ade80";
      ctx.font = `bold ${fontSmall}px monospace`;
      ctx.textAlign = "right";

      // Calculate visible count based on mode
      let visibleCount = 0;
      if (isLockdown) {
        visibleCount = 0; // No visitors during lockdown
      } else if (showOnlySuspicious) {
        visibleCount = dotsRef.current.filter(d => d.color === "red").length;
      } else {
        visibleCount = dotsRef.current.length;
      }

      const countText = isLockdown ? "LOCKDOWN" :
                        showOnlySuspicious ? `${visibleCount} SUSPICIOUS` :
                        `${visibleCount} VISITORS`;
      ctx.fillText(countText, canvas.width - edgePadding, canvas.height - 8);

      requestAnimationFrame(animate);
    }

    animate();
  }, [cameraName, room, floorMap, baseFloorMap, onSuspiciousActivity, updateCameraDots, cameraId, isLockdown, showOnlySuspicious]);

  return (
    <canvas
      ref={canvasRef}
      width={floorMap.width}
      height={floorMap.height}
      className={`border ${isFocused ? "border-green-400" : "border-gray-700"} ${
        hasAlert ? "shadow-lg shadow-red-500/50" : ""
      }`}
    />
  );
};

export default AnimatedCamera;

