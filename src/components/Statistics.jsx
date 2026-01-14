import React, { useState } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp, Calendar } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';

export default function Statistics({ subjects, sessions }) {
    const [chartType, setChartType] = useState('bar');

    // Aggregate data by subject
    const subjectTotals = {};
    subjects.forEach(s => { subjectTotals[s.id] = 0; });

    sessions.forEach(session => {
        if (session.data) {
            Object.entries(session.data).forEach(([subjectId, minutes]) => {
                if (subjectTotals[subjectId] !== undefined) {
                    subjectTotals[subjectId] += minutes;
                }
            });
        }
    });

    const totalMinutes = Object.values(subjectTotals).reduce((a, b) => a + b, 0);

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m}분`;
        return `${h}시간 ${m}분`;
    };

    // Prepare chart data
    const chartData = subjects.map(subject => ({
        name: subject.name.replace('(', '\n('),
        shortName: subject.name.split('(')[0],
        minutes: subjectTotals[subject.id] || 0,
        hours: ((subjectTotals[subject.id] || 0) / 60).toFixed(1),
        color: subject.color
    }));

    // Daily trend data (last 7 days)
    const dailyData = [];
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
        const daySession = sessions.find(s => s.date === date);
        const total = daySession?.data ? Object.values(daySession.data).reduce((a, b) => a + b, 0) : 0;
        dailyData.push({
            date: date.slice(5), // MM-DD format
            minutes: total,
            hours: (total / 60).toFixed(1)
        });
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-2 text-xs">
                    <p className="font-bold">{payload[0].payload.name || payload[0].payload.date}</p>
                    <p>{formatTime(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-in">
            {/* Summary Card */}
            <div className="glass-panel p-6 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-accent-primary" size={20} />
                    <h2>총 공부 시간</h2>
                </div>
                <div className="text-4xl font-bold gradient-text">
                    {formatTime(totalMinutes)}
                </div>
                <p className="text-text-muted text-sm mt-1">
                    {sessions.length}일 기록됨
                </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setChartType('bar')}
                    className={`btn flex-1 ${chartType === 'bar' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    <BarChart3 size={16} className="inline mr-1" />
                    막대
                </button>
                <button
                    onClick={() => setChartType('pie')}
                    className={`btn flex-1 ${chartType === 'pie' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    <PieIcon size={16} className="inline mr-1" />
                    원형
                </button>
                <button
                    onClick={() => setChartType('line')}
                    className={`btn flex-1 ${chartType === 'line' ? 'btn-primary' : 'btn-ghost'}`}
                >
                    <Calendar size={16} className="inline mr-1" />
                    추이
                </button>
            </div>

            {/* Charts */}
            <div className="glass-panel p-4">
                {totalMinutes === 0 ? (
                    <p className="text-center text-text-muted py-12">
                        아직 기록된 데이터가 없습니다.<br />
                        "기록" 탭에서 공부 시간을 입력해주세요.
                    </p>
                ) : (
                    <>
                        {chartType === 'bar' && (
                            <div>
                                <h3 className="text-sm font-semibold mb-4 text-text-secondary">과목별 공부 시간</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis
                                            type="category"
                                            dataKey="shortName"
                                            width={60}
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {chartType === 'pie' && (
                            <div>
                                <h3 className="text-sm font-semibold mb-4 text-text-secondary">과목별 비율</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.filter(d => d.minutes > 0)}
                                            dataKey="minutes"
                                            nameKey="shortName"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ shortName, percent }) => `${shortName} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {chartType === 'line' && (
                            <div>
                                <h3 className="text-sm font-semibold mb-4 text-text-secondary">최근 7일 추이</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dailyData}>
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            width={40}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="minutes"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Subject List */}
            <div className="glass-panel p-4 mt-4">
                <h3 className="text-sm font-semibold mb-3 text-text-secondary">과목별 상세</h3>
                <div className="space-y-2">
                    {subjects.map(subject => {
                        const minutes = subjectTotals[subject.id] || 0;
                        const percentage = totalMinutes > 0 ? (minutes / totalMinutes * 100).toFixed(1) : 0;

                        return (
                            <div
                                key={subject.id}
                                className="flex items-center justify-between p-2 rounded-lg"
                                style={{ background: `${subject.color}10` }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: subject.color }}
                                    />
                                    <span className="text-sm font-medium">{subject.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold">{formatTime(minutes)}</span>
                                    <span className="text-xs text-text-muted ml-2">({percentage}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
