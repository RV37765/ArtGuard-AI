// components/ScenarioButtons.jsx
'use client';

import { Play, Shield, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';

export default function ScenarioButtons({ onRunScenario, activeScenario, disabled }) {
    const scenarios = [
        {
            id: 1,
            name: 'Normal Patrol',
            description: 'Routine security check',
            duration: '30s',
            icon: Shield,
            color: '#2563eb',
            colorDark: '#1e40af'
        },
        {
            id: 2,
            name: 'Suspicious Activity',
            description: 'Investigation required',
            duration: '45s',
            icon: AlertTriangle,
            color: '#ca8a04',
            colorDark: '#92400e'
        },
        {
            id: 3,
            name: 'Active Heist',
            description: 'CRITICAL: Theft in progress',
            duration: '60s',
            icon: AlertOctagon,
            color: '#dc2626',
            colorDark: '#991b1b'
        }
    ];

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-500" />
                Demo Scenarios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => {
                    const Icon = scenario.icon;
                    const isActive = activeScenario === scenario.id;
                    const isDisabled = disabled && !isActive;

                    return (
                        <button
                            key={scenario.id}
                            onClick={() => !isDisabled && onRunScenario(scenario.id)}
                            disabled={isDisabled}
                            style={{
                                background: `linear-gradient(to bottom right, ${scenario.color}, ${scenario.colorDark})`,
                            }}
                            className={`
                relative overflow-hidden transition-all duration-300 
                ${!isDisabled && 'hover:scale-105 active:scale-95'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                p-6 rounded-lg text-left
              `}
                        >
                            {/* Background glow effect */}
                            <div
                                className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity"
                                style={{
                                    background: `linear-gradient(to bottom right, ${scenario.color}, ${scenario.colorDark})`,
                                }}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <Icon className="w-8 h-8 text-white" />
                                    {isActive && (
                                        <div className="flex items-center gap-1 text-xs text-white bg-white/20 px-2 py-1 rounded">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            Running
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">
                                    {scenario.name}
                                </h3>

                                <p className="text-sm text-white/80 mb-3">
                                    {scenario.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <Clock className="w-3 h-3" />
                                    <span>{scenario.duration}</span>
                                    {!isActive && !isDisabled && (
                                        <>
                                            <span>•</span>
                                            <span>Click to run</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`
                absolute bottom-0 left-0 right-0 h-1 bg-white
                ${isActive ? 'opacity-100' : 'opacity-0'}
                transition-opacity
              `} />
                        </button>
                    );
                })}
            </div>

            {activeScenario && (
                <p className="text-sm text-gray-400 mt-4 text-center">
                    Scenario in progress... Watch the chat log and cameras!
                </p>
            )}
        </div>
    );
}