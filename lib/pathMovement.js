// lib/pathMovement.js

/**
 * Update dot position safely
 * - dot: {x, y, speedX, speedY, radius}
 * - floorMap: {width, height, obstacles: []}
 */
export function moveDot(dot, floorMap) {
  let nextX = dot.x + dot.speedX;
  let nextY = dot.y + dot.speedY;

  // Bounce off walls
  if (nextX - dot.radius <= 0 || nextX + dot.radius >= floorMap.width) dot.speedX *= -1;
  if (nextY - dot.radius <= 0 || nextY + dot.radius >= floorMap.height) dot.speedY *= -1;

  // Bounce off obstacles
  for (const obs of floorMap.obstacles) {
    if (
      nextX + dot.radius > obs.x &&
      nextX - dot.radius < obs.x + obs.width &&
      nextY + dot.radius > obs.y &&
      nextY - dot.radius < obs.y + obs.height
    ) {
      dot.speedX *= -1;
      dot.speedY *= -1;
    }
  }

  dot.x += dot.speedX;
  dot.y += dot.speedY;

  return dot;
}
