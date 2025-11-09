// lib/mapDefinitions.js
// Louvre Museum Floor Plans - Uniform dimensions for consistent display

export const cameraFloorMaps = {
  // Camera 1: Denon Wing - Salle des États (Room 711) - Mona Lisa Gallery
  1: {
    width: 350,
    height: 220,
    obstacles: [
      // Central protective case for Mona Lisa
      { x: 150, y: 85, width: 50, height: 60, label: "Mona Lisa" },
      // Visitor benches
      { x: 25, y: 35, width: 40, height: 18, label: "Bench" },
      { x: 285, y: 35, width: 40, height: 18, label: "Bench" },
      { x: 25, y: 167, width: 40, height: 18, label: "Bench" },
      { x: 285, y: 167, width: 40, height: 18, label: "Bench" }
    ],
    zones: [
      { x: 0, y: 0, width: 350, height: 220 }
    ]
  },

  // Camera 2: Denon Wing - Daru Staircase - Winged Victory of Samothrace
  2: {
    width: 350,
    height: 220,
    obstacles: [
      // Winged Victory pedestal at top of stairs
      { x: 140, y: 35, width: 70, height: 70, label: "Winged Victory" },
      // Grand staircase steps
      { x: 115, y: 125, width: 120, height: 22, label: "Stairs" },
      { x: 125, y: 147, width: 100, height: 22, label: "Stairs" },
      { x: 135, y: 169, width: 80, height: 22, label: "Stairs" }
    ],
    zones: [
      { x: 0, y: 0, width: 350, height: 220 }
    ]
  },

  // Camera 3: Sully Wing - Egyptian Antiquities (Ground Floor)
  3: {
    width: 350,
    height: 220,
    obstacles: [
      // Sphinx statues (left and right)
      { x: 45, y: 80, width: 48, height: 70, label: "Sphinx" },
      { x: 257, y: 80, width: 48, height: 70, label: "Sphinx" },
      // Sarcophagus displays
      { x: 125, y: 35, width: 100, height: 35, label: "Sarcophagus" },
      { x: 125, y: 150, width: 100, height: 35, label: "Sarcophagus" }
    ],
    zones: [
      { x: 0, y: 0, width: 350, height: 220 }
    ]
  },

  // Camera 4: Richelieu Wing - Cour Marly (Room 105) - Marly Horses
  4: {
    width: 350,
    height: 220,
    obstacles: [
      // Marly Horses sculptures
      { x: 70, y: 65, width: 60, height: 90, label: "Marly Horse" },
      { x: 220, y: 65, width: 60, height: 90, label: "Marly Horse" },
      // Other sculptures
      { x: 150, y: 20, width: 50, height: 35, label: "Sculpture" },
      { x: 150, y: 165, width: 50, height: 35, label: "Sculpture" }
    ],
    zones: [
      { x: 0, y: 0, width: 350, height: 220 }
    ]
  }
};
