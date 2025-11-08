// components/StatsDisplay.jsx
'use client';

import { Camera, Users, AlertCircle, Shield } from 'lucide-react';

export default function StatsDisplay({ museumData }) {
    const activeCameras = museumData.cameras.filter(c => c.status === 'active').length;
    const totalCameras = museumData.cameras.length;
    const onDutyGuards = museumData.guards.filter(g => g.status === 'on-duty').length;
    const totalGuards = museumData.guards.length;
    const activeAlerts = museumData.alerts.length;
    const criticalAlerts = museumData.alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

    const systemStatus = criticalAlerts > 0 ? 'ALERT' : activeAlerts > 0 ? 'MONITORING' : 'OPERATIONAL';

    const stats = [
        {
            label: 'Cameras',
            value: `${activeCameras}/${totalCameras}`,
            icon: Camera,
            status: activeCameras === totalCameras ? 'good' : 'warning',
            subtext: activeCameras === totalCameras ? 'All online' : `${totalCameras - activeCameras} offline`
        },
        {
            label: 'Guards',
            value: `${onDutyGuards}/${totalGuards}`,
            icon: Users,
            status: onDutyGuards >= totalGuards * 0.75 ? 'good' : 'warning',
            subtext: `${onDutyGuards} on duty`
        },
        {
            label: 'Alerts',
            value: activeAlerts,
            icon: AlertCircle,
            status: criticalAlerts > 0 ? 'critical' : activeAlerts > 0 ? 'warning' : 'good',
            subtext: criticalAlerts > 0 ? `${criticalAlerts} critical` : activeAlerts > 0 ? 'Active' : 'None'
        },
        {
            label: 'System',
            value: systemStatus,
            icon: Shield,
            status: criticalAlerts > 0 ? 'critical' : activeAlerts > 0 ? 'warning' : 'good',
            subtext: museumData.system?.uptime || '99.8%'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'good':
            default:
                return 'text-green-500';
        }
    };

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const statusColor = getStatusColor(stat.status);

                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all"
                        >
                            <div className={`${statusColor}`}>
                                <Icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
                                <p className={`text-lg font-bold ${statusColor} leading-none`}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{stat.subtext}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}