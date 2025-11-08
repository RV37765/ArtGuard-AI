// lib/mapRenderer.js

/**
 * Draw obstacles on canvas
 */
export function drawObstacles(ctx, obstacles) {
  ctx.fillStyle = "#333";
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
}

/**
 * Draw zones on canvas
 */
export function drawZones(ctx, zones) {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  zones.forEach(zone => ctx.strokeRect(zone.x, zone.y, zone.width, zone.height));
}

/**
 * Draw timestamp on canvas
 */
export function drawTimestamp(ctx, canvas) {
  ctx.fillStyle = "red";
  ctx.font = "14px monospace";
  ctx.fillText(new Date().toLocaleTimeString(), 10, 20);
}

/**
 * Draw camera label
 */
export function drawCameraLabel(ctx, cameraName, dotCount, canvas) {
  ctx.fillStyle = "white";
  ctx.font = "12px monospace";
  ctx.fillText(`${cameraName} | ${dotCount} DETECTED`, 10, canvas.height - 10);
}
