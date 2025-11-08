// lib/scenarios.js
// @ts-nocheck


/**
 * Pre-scripted scenarios for ArtGuard AI demos
 * Each scenario is an array of timed events that play out automatically
 */

export const scenarios = {
    // SCENARIO 1: Normal Patrol (30 seconds - peaceful)
    normalPatrol: {
        id: 1,
        name: "Normal Patrol",
        description: "Routine security check - all systems operational",
        duration: 30,
        icon: "shield-check",
        events: [
            {
                time: 0,
                type: "message",
                role: "assistant",
                content: "Initiating normal patrol sequence. All systems operational."
            },
            {
                time: 2,
                type: "camera_switch",
                cameraId: 1
            },
            {
                time: 3,
                type: "message",
                role: "assistant",
                content: "Camera 1 - Main Entrance: 24 visitors detected. Normal activity patterns."
            },
            {
                time: 8,
                type: "camera_switch",
                cameraId: 2
            },
            {
                time: 9,
                type: "message",
                role: "assistant",
                content: "Camera 2 - Mona Lisa Gallery: 18 visitors. Guard Chen on station. All clear."
            },
            {
                time: 15,
                type: "camera_switch",
                cameraId: 3
            },
            {
                time: 16,
                type: "message",
                role: "assistant",
                content: "Camera 3 - Egyptian Wing: 12 visitors. No suspicious activity detected."
            },
            {
                time: 22,
                type: "message",
                role: "assistant",
                content: "Patrol complete. Museum security status: OPERATIONAL. All guards accounted for."
            },
            {
                time: 28,
                type: "clear_focus"
            }
        ]
    },

    // SCENARIO 2: Suspicious Activity (45 seconds - medium tension)
    suspiciousActivity: {
        id: 2,
        name: "Suspicious Activity",
        description: "Motion detected after hours - investigation required",
        duration: 45,
        icon: "alert-triangle",
        events: [
            {
                time: 0,
                type: "message",
                role: "assistant",
                content: "Alert received: Unusual motion pattern detected in Gallery 3."
            },
            {
                time: 1,
                type: "alert",
                alert: {
                    id: 101,
                    severity: "medium",
                    type: "motion",
                    message: "Unusual motion pattern - Gallery 3",
                    location: "Gallery 3 - Mona Lisa",
                    timestamp: "Just now",
                    status: "investigating"
                }
            },
            {
                time: 3,
                type: "camera_switch",
                cameraId: 2
            },
            {
                time: 5,
                type: "message",
                role: "assistant",
                content: "Switching to Camera 2. Analyzing motion patterns..."
            },
            {
                time: 10,
                type: "message",
                role: "assistant",
                content: "Subject identified: Visitor lingering near artwork for extended period."
            },
            {
                time: 15,
                type: "message",
                role: "assistant",
                content: "Dispatching Guard Chen to Gallery 3 for visual confirmation."
            },
            {
                time: 20,
                type: "message",
                role: "user",
                content: "Guard Chen, please investigate Gallery 3 suspicious activity."
            },
            {
                time: 25,
                type: "message",
                role: "assistant",
                content: "Guard Chen en route. ETA: 30 seconds."
            },
            {
                time: 32,
                type: "message",
                role: "assistant",
                content: "Guard Chen reporting: Subject is a tourist taking photographs. No threat detected."
            },
            {
                time: 38,
                type: "alert_resolve",
                alertId: 101
            },
            {
                time: 39,
                type: "message",
                role: "assistant",
                content: "Alert resolved. False alarm. Returning to normal operations."
            },
            {
                time: 43,
                type: "clear_focus"
            }
        ]
    },

    // SCENARIO 3: Active Heist (60 seconds - DRAMATIC!)
    activeHeist: {
        id: 3,
        name: "Active Heist",
        description: "CRITICAL: Crown jewels theft in progress - lockdown initiated",
        duration: 60,
        icon: "alert-octagon",
        events: [
            {
                time: 0,
                type: "message",
                role: "assistant",
                content: "🚨 CRITICAL ALERT: Glass break detected in Crown Jewels Vault!"
            },
            {
                time: 0.5,
                type: "alert",
                alert: {
                    id: 201,
                    severity: "critical",
                    type: "glass_break",
                    message: "GLASS BREAK DETECTED - Crown Jewels Vault",
                    location: "High Security Vault",
                    timestamp: "Just now",
                    status: "active"
                }
            },
            {
                time: 2,
                type: "camera_switch",
                cameraId: 6
            },
            {
                time: 3,
                type: "message",
                role: "assistant",
                content: "Switching to Camera 6 - Crown Jewels Vault. Multiple intruders detected!"
            },
            {
                time: 5,
                type: "alert",
                alert: {
                    id: 202,
                    severity: "critical",
                    type: "theft",
                    message: "ARTWORK REMOVED - Regent Diamond",
                    location: "High Security Vault",
                    timestamp: "Just now",
                    status: "active"
                }
            },
            {
                time: 7,
                type: "message",
                role: "assistant",
                content: "⚠️ CONFIRMED: Regent Diamond has been removed from display case!"
            },
            {
                time: 10,
                type: "message",
                role: "assistant",
                content: "Suspects moving toward service exit. Dispatching all available guards."
            },
            {
                time: 12,
                type: "alert",
                alert: {
                    id: 203,
                    severity: "critical",
                    type: "unauthorized_exit",
                    message: "UNAUTHORIZED EXIT ATTEMPT - Loading Dock",
                    location: "Service Area",
                    timestamp: "Just now",
                    status: "active"
                }
            },
            {
                time: 15,
                type: "camera_switch",
                cameraId: 4
            },
            {
                time: 16,
                type: "message",
                role: "assistant",
                content: "Suspects at Loading Dock. Camera 4 is offline - manual intervention required!"
            },
            {
                time: 20,
                type: "message",
                role: "user",
                content: "Initiate emergency lockdown protocol NOW!"
            },
            {
                time: 22,
                type: "lockdown",
                active: true
            },
            {
                time: 23,
                type: "message",
                role: "assistant",
                content: "🔒 LOCKDOWN INITIATED. All exits sealed. Emergency services contacted."
            },
            {
                time: 28,
                type: "message",
                role: "assistant",
                content: "Police dispatch confirmed. Units en route. ETA: 3 minutes."
            },
            {
                time: 35,
                type: "message",
                role: "assistant",
                content: "Suspects contained at Loading Dock. Guard Martinez and Guard Dubois on scene."
            },
            {
                time: 42,
                type: "message",
                role: "assistant",
                content: "Police have arrived. Suspects in custody. Regent Diamond recovered."
            },
            {
                time: 50,
                type: "alert_resolve",
                alertId: 201
            },
            {
                time: 50.5,
                type: "alert_resolve",
                alertId: 202
            },
            {
                time: 51,
                type: "alert_resolve",
                alertId: 203
            },
            {
                time: 52,
                type: "lockdown",
                active: false
            },
            {
                time: 53,
                type: "message",
                role: "assistant",
                content: "Lockdown lifted. All threats neutralized. Beginning incident report..."
            },
            {
                time: 58,
                type: "clear_focus"
            }
        ]
    }
};

// Helper to get scenario by ID
export const getScenarioById = (id) => {
    return Object.values(scenarios).find(scenario => scenario.id === id);
};

// Helper to get all scenario names for buttons
export const getScenarioList = () => {
    return Object.values(scenarios).map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        duration: scenario.duration,
        icon: scenario.icon
    }));
};

export default scenarios;