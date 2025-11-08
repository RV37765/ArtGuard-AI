// components/AlertPanel.jsx
'use client';

import { AlertTriangle, AlertCircle, Info, X, Clock } from 'lucide-react';

export default function AlertPanel({ alerts = [], onDismiss, onAlertClick }) {
    // Sort alerts by severity (critical first)
    const sortedAlerts = [...alerts].sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-900/30',
                    border: 'border-red-500',
                    text: 'text-red-400',
                    icon: 'text-red-500',
                    glow: 'shadow-red-500/50'
                };
            case 'high':
                return {
                    bg: 'bg-red-900/20',
                    border: 'border-red-600',
                    text: 'text-red-300',
                    icon: 'text-red-400',
                    glow: 'shadow-red-600/30'
                };
            case 'medium':
                return {
                    bg: 'bg-yellow-900/20',
                    border: 'border-yellow-600',
                    text: 'text-yellow-300',
                    icon: 'text-yellow-500',
                    glow: 'shadow-yellow-600/30'
                };
            case 'low':
                return {
                    bg: 'bg-blue-900/20',
                    border: 'border-blue-600',
                    text: 'text-blue-300',
                    icon: 'text-blue-500',
                    glow: 'shadow-blue-600/30'
                };
            default:
                return {
                    bg: 'bg-gray-900/20',
                    border: 'border-gray-600',
                    text: 'text-gray-300',
                    icon: 'text-gray-500',
                    glow: 'shadow-gray-600/30'
                };
        }
    };

    const getIcon = (severity) => {
        switch (severity) {
            case 'critical':
            case 'high':
                return AlertTriangle;
            case 'medium':
                return AlertCircle;
            case 'low':
            default:
                return Info;
        }
    };

    if (alerts.length === 0) {
        return (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Active Alerts
                </h2>
                <div className="text-center py-8">
                    <div className="text-green-500 text-5xl mb-2">✓</div>
                    <p className="text-gray-400">No active alerts</p>
                    <p className="text-sm text-gray-500 mt-1">All systems operational</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Active Alerts
                <span className="ml-auto text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    {alerts.length}
                </span>
            </h2>

            <div className="space-y-3">
                {sortedAlerts.map((alert) => {
                    const styles = getSeverityStyles(alert.severity);
                    const Icon = getIcon(alert.severity);
                    const isPulsing = alert.severity === 'critical' || alert.severity === 'high';

                    return (
                        <div
                            key={alert.id}
                            onClick={() => onAlertClick?.(alert)}
                            className={`
                ${styles.bg} ${styles.border} ${styles.glow}
                border rounded-lg p-4
                transition-all duration-300
                ${isPulsing ? 'animate-pulse' : ''}
                hover:scale-[1.02]
                ${onAlertClick ? 'cursor-pointer' : ''}
              `}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className={`font-medium ${styles.text}`}>
                                            {alert.message}
                                        </p>
                                        {onDismiss && (
                                            <button
                                                onClick={() => onDismiss(alert.id)}
                                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                                aria-label="Dismiss alert"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {alert.timestamp}
                                        </span>
                                        {alert.location && (
                                            <>
                                                <span>•</span>
                                                <span>{alert.location}</span>
                                            </>
                                        )}
                                        {alert.status && (
                                            <>
                                                <span>•</span>
                                                <span className="uppercase font-medium">
                                                    {alert.status}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}