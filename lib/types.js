// lib/types.js
// DATA CONTRACTS - Everyone agrees on these shapes

/**
 * Museum Data Structure
 * This is what lib/museumData.js will export
 */
export const museumDataShape = {
  cameras: [
    // Example: { id: 1, name: "Camera 1 - Main Entrance", status: "active", room: "Lobby" }
  ],
  guards: [
    // Example: { id: 1, name: "Guard Martinez", location: "Gallery 3", status: "on-duty" }
  ],
  alerts: [
    // Example: { id: 1, severity: "medium", message: "Motion detected", time: "2 min ago" }
  ],
  rooms: [
    // Example: { id: 1, name: "Gallery 3", visitors: 12, threatLevel: "low" }
  ]
};

/**
 * Component Props - What each component expects
 */
export const componentProps = {
  // Person 1's components
  VoiceInput: {
    onTranscript: "function(transcript: string) => void",
    isProcessing: "boolean"
  },
  ChatLog: {
    messages: "array of {role: 'user'|'assistant', content: string, timestamp?: string}",
    isProcessing: "boolean"
  },
  
  // Person 2's components
  CameraGrid: {
    focusedCamera: "number | null",
    cameras: "array from museumData.cameras",
    onCameraClick: "function(cameraId: number) => void"
  },
  AnimatedCamera: {
    cameraId: "number",
    cameraName: "string",
    peopleCount: "number",
    isFocused: "boolean",
    hasAlert: "boolean"
  },
  
  // Person 3's components
  AlertPanel: {
    alerts: "array from museumData.alerts"
  },
  StatsDisplay: {
    camerasOnline: "number",
    totalCameras: "number",
    guardsOnDuty: "number",
    activeAlerts: "number"
  },
  ScenarioButtons: {
    onRunScenario: "function(scenarioId: number) => void",
    isRunning: "boolean"
  }
};

/**
 * App State (lives in app/page.jsx)
 * Person 1 owns this
 */
export const appStateShape = {
  messages: [], // Chat history
  focusedCamera: null, // Which camera is highlighted
  isProcessing: false, // Is voice command being processed
  activeScenario: null // Which scenario is running (1, 2, 3, or null)
};