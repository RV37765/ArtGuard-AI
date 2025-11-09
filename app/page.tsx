"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VoiceInput from "@/components/VoiceInput";
import ChatLog from "@/components/ChatLog";
import AnimatedCamera from "@/components/AnimatedCamera";
import AlertPanel from "@/components/AlertPanel";
import StatsDisplay from "@/components/StatsDisplay";
import { museumData } from "@/lib/museumData";
import { getSmartResponse } from "@/lib/smartResponses";
import { speak, isSupported as ttsSupported, stop as stopTTS } from "@/lib/textToSpeech";
import { cameraFloorMaps } from "@/lib/mapDefinitions";

const HEADER_TITLE = "ArtGuard AI";
const MAX_MESSAGES = 200;

function CameraDisplay({ cameras = [], focusedCamera, alerts = [], onSuspiciousActivity, getOrInitializeDots, updateCameraDots, isLockdown, showOnlySuspicious }: { cameras?: any[]; focusedCamera: number | null; alerts?: any[]; onSuspiciousActivity: (cameraId: number, dot: any) => void; getOrInitializeDots: (cameraId: number, baseFloorMap: any) => any[]; updateCameraDots: (cameraId: number, dots: any[]) => void; isLockdown: boolean; showOnlySuspicious: boolean }) {
  // If a camera is focused, show only that camera in a larger view
  if (focusedCamera) {
    const camera = cameras.find((c) => c.id === focusedCamera);
    if (camera) {
      const originalMap = cameraFloorMaps[camera.id as keyof typeof cameraFloorMaps];
      if (!originalMap) {
        return <div className="text-gray-400">No map data for {camera.name}</div>;
      }

      // Scale up the floor map for focused view (2x larger)
      const scaleFactor = 2.4;
      const scaledMap = {
        width: originalMap.width * scaleFactor,
        height: originalMap.height * scaleFactor,
        obstacles: originalMap.obstacles.map(obs => ({
          ...obs, // Preserve all properties including label
          x: obs.x * scaleFactor,
          y: obs.y * scaleFactor,
          width: obs.width * scaleFactor,
          height: obs.height * scaleFactor
        })),
        zones: originalMap.zones.map(zone => ({
          ...zone, // Preserve all properties including label
          x: zone.x * scaleFactor,
          y: zone.y * scaleFactor,
          width: zone.width * scaleFactor,
          height: zone.height * scaleFactor
        }))
      };

      return (
        <div className="flex justify-center items-center">
          <AnimatedCamera
            cameraId={camera.id}
            cameraName={camera.name}
            room={camera.room}
            peopleCount={camera.peopleCount || 5}
            isFocused={true}
            hasAlert={alerts.some((a) => a.camera === camera.id)}
            floorMap={scaledMap}
            baseFloorMap={originalMap}
            onSuspiciousActivity={(dot: any) => onSuspiciousActivity(camera.id, dot)}
            getOrInitializeDots={getOrInitializeDots}
            updateCameraDots={updateCameraDots}
            isLockdown={isLockdown}
            showOnlySuspicious={showOnlySuspicious}
          />
        </div>
      );
    }
  }

  // Otherwise show 2x2 grid of first 4 cameras
  const displayCameras = cameras.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-3">
      {displayCameras.map((camera) => {
        const floorMap = cameraFloorMaps[camera.id as keyof typeof cameraFloorMaps];
        if (!floorMap) {
          return (
            <div key={camera.id} className="text-gray-400 flex items-center justify-center h-40">
              No map for {camera.name}
            </div>
          );
        }
        return (
          <div key={camera.id} className="flex justify-center">
            <AnimatedCamera
              cameraId={camera.id}
              cameraName={camera.name}
              room={camera.room}
              peopleCount={camera.peopleCount || 5}
              isFocused={false}
              hasAlert={alerts.some((a) => a.camera === camera.id)}
              floorMap={floorMap}
              baseFloorMap={floorMap}
              onSuspiciousActivity={(dot: any) => onSuspiciousActivity(camera.id, dot)}
              getOrInitializeDots={getOrInitializeDots}
              updateCameraDots={updateCameraDots}
              isLockdown={isLockdown}
              showOnlySuspicious={showOnlySuspicious}
            />
          </div>
        );
      })}
    </div>
  );
}


export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "System online. Say 'status report' or try 'help' to see commands." },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedCamera, setFocusedCamera] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [dynamicAlerts, setDynamicAlerts] = useState<any[]>([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string | number>>(new Set());
  const [isLockdown, setIsLockdown] = useState(false);
  const [showOnlySuspicious, setShowOnlySuspicious] = useState(false);
  const alertCooldownRef = useRef<{ [cameraId: number]: number }>({});
  const cameraDotsRef = useRef<{ [cameraId: number]: any[] }>({});

  const context = useMemo(() => {
    // Merge static alerts with dynamic alerts and filter out dismissed ones
    const allAlerts = [...museumData.alerts, ...dynamicAlerts]
      .filter(alert => !dismissedAlertIds.has(alert.id));
    return { ...museumData, alerts: allAlerts };
  }, [dynamicAlerts, dismissedAlertIds]);

  const addMessage = useCallback((role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }].slice(-MAX_MESSAGES));
  }, []);

  const applyEffects = useCallback((effects: any) => {
    if (!effects) return;
    if (typeof effects.focusCameraId !== "undefined") {
      setFocusedCamera(effects.focusCameraId);
      console.log("📹 [UI] focusCameraId:", effects.focusCameraId);
    }
    if (effects.showAllCameras) {
      setFocusedCamera(null);
      console.log("📹 [UI] showAllCameras");
    }
    if (typeof effects.lockdown !== "undefined") {
      setIsLockdown(effects.lockdown);
      if (effects.lockdown) {
        // Clear all alerts on lockdown
        setDynamicAlerts([]);
        setDismissedAlertIds(new Set());
        // Reset all dots to fresh state (will be hidden by lockdown mode)
        cameraDotsRef.current = {};
        console.log("🔒 [UI] Lockdown initiated");
      } else {
        // On release, reset dots (they'll reinitialize fresh and green)
        cameraDotsRef.current = {};
        console.log("🔓 [UI] Lockdown released");
      }
    }
    if (typeof effects.showOnlySuspicious !== "undefined") {
      setShowOnlySuspicious(effects.showOnlySuspicious);
      console.log("👁️ [UI] Show only suspicious:", effects.showOnlySuspicious);
    }
    if (effects.emergency) {
      console.warn("🚨 [EMERGENCY]:", effects.emergency);
    }
  }, []);

  const getOrInitializeDots = useCallback((cameraId: number, baseFloorMap: any) => {
    if (!cameraDotsRef.current[cameraId]) {
      const minDots = 10;
      const maxDots = 35;
      const obstacles = baseFloorMap.obstacles || [];

      // Helper function to check if a position overlaps with any obstacle
      const isInsideObstacle = (x: number, y: number, radius: number) => {
        return obstacles.some((obs: any) => {
          // Skip stairs - allow spawning on stairs
          if (obs.label && obs.label.toLowerCase().includes('stairs')) {
            return false;
          }
          // Add a margin (2x radius) to ensure dots don't spawn too close to edges
          const margin = radius * 2;
          return (
            x + margin > obs.x &&
            x - margin < obs.x + obs.width &&
            y + margin > obs.y &&
            y - margin < obs.y + obs.height
          );
        });
      };

      // Helper function to generate a valid position
      const getValidPosition = () => {
        let attempts = 0;
        let x, y;
        const radius = 5;
        const margin = 10; // Keep dots away from walls
        do {
          x = margin + Math.random() * (baseFloorMap.width - margin * 2);
          y = margin + Math.random() * (baseFloorMap.height - margin * 2);
          attempts++;
        } while (isInsideObstacle(x, y, radius) && attempts < 100);
        return { x, y };
      };

      const initialDots = Array.from(
        { length: Math.floor(Math.random() * (maxDots - minDots + 1) + minDots) },
        () => {
          const { x, y } = getValidPosition();
          return {
            x,
            y,
            radius: 5,
            speedX: Math.random() * 0.2 - 0.1,
            speedY: Math.random() * 0.2 - 0.1,
            color: "green",
            lastMovedTime: Date.now()
          };
        }
      );
      cameraDotsRef.current[cameraId] = initialDots;
    }
    return cameraDotsRef.current[cameraId];
  }, []);

  const updateCameraDots = useCallback((cameraId: number, dots: any[]) => {
    cameraDotsRef.current[cameraId] = dots;
  }, []);

  const handleDismissAlert = useCallback((alertId: string | number) => {
    setDismissedAlertIds(prev => new Set(prev).add(alertId));
    console.log('🗑️ Alert dismissed:', alertId);
  }, []);

  const handleAlertClick = useCallback((alert: any) => {
    if (alert.camera) {
      setFocusedCamera(alert.camera);
      const camera = museumData.cameras.find(c => c.id === alert.camera);
      if (camera) {
        addMessage("assistant", `Focusing on ${camera.name} for investigation.`);
      }
    }
  }, [addMessage]);

  const handleSuspiciousActivity = useCallback((cameraId: number, dot: any) => {
    const camera = museumData.cameras.find(c => c.id === cameraId);
    if (!camera) return;

    const now = Date.now();
    const lastAlertTime = alertCooldownRef.current[cameraId] || 0;
    const cooldownPeriod = 45000; // 45 seconds between alerts per camera

    // Check cooldown - don't spam alerts
    if (now - lastAlertTime < cooldownPeriod) {
      return;
    }

    // Update cooldown timestamp
    alertCooldownRef.current[cameraId] = now;

    const newAlert = {
      id: `alert-${now}-${cameraId}`,
      severity: "high",
      type: "suspicious-activity",
      message: `Suspicious loitering detected - ${camera.room}`,
      location: camera.room,
      camera: cameraId,
      timestamp: "Just now",
      status: "active",
      autoGenerated: true,
      createdAt: now
    };

    setDynamicAlerts(prev => [newAlert, ...prev]);
    addMessage("assistant", `⚠️ Alert: ${newAlert.message}`);

    // Speak the alert if TTS is supported
    if (ttsSupported()) {
      speak(`Alert: Suspicious loitering detected at ${camera.room}`);
    }

    console.log('🚨 New alert generated:', newAlert);
  }, [addMessage]);

  const handleCommand = useCallback(
    async (commandText: string) => {
      if (!commandText?.trim()) return;
      addMessage("user", commandText);
      setIsProcessing(true);
      try {
        const result = getSmartResponse(commandText, context);
        console.log("🤖 [Smart] Result:", result);
        addMessage("assistant", result.text);
        applyEffects(result.effects);
        if (ttsSupported()) await speak(result.text);
      } catch (e) {
        console.error("🤖 [Smart] Exception:", e);
        addMessage("assistant", "I hit an error processing that command.");
      } finally {
        setIsProcessing(false);
      }
    },
    [addMessage, applyEffects, context]
  );

  useEffect(() => () => stopTTS(), []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{HEADER_TITLE}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
            <span className="text-gray-300">Online</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <VoiceInput onTranscript={handleCommand} isProcessing={isProcessing} />
          {/* @ts-expect-error - ChatLog is a JSX component */}
          <ChatLog messages={messages} isProcessing={isProcessing} />
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder='Type a command (e.g., "show camera 2")'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = input.trim();
                  if (v) { setInput(""); handleCommand(v); }
                }
              }}
            />
            <button
              className="px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              onClick={() => { const v = input.trim(); if (v) { setInput(""); handleCommand(v); } }}
            >
              Send
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-100 font-medium">Camera Feeds</div>
              <div className="text-xs text-gray-400">{focusedCamera ? `Focused: ${focusedCamera}` : "All feeds"}</div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <CameraDisplay cameras={context.cameras} focusedCamera={focusedCamera} alerts={context.alerts} onSuspiciousActivity={handleSuspiciousActivity} getOrInitializeDots={getOrInitializeDots} updateCameraDots={updateCameraDots} isLockdown={isLockdown} showOnlySuspicious={showOnlySuspicious} />
            </div>
          </div>

          {/* @ts-ignore - AlertPanel is a JSX component */}
          <AlertPanel alerts={context.alerts} onAlertClick={handleAlertClick} onDismiss={handleDismissAlert} />

          {/* @ts-ignore - StatsDisplay is a JSX component */}
          <StatsDisplay museumData={context} />
        </div>
      </div>
    </main>
  );
}
