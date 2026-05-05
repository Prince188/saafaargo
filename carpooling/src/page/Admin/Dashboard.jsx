import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const Dashboard = () => {
    const [today, setToday] = useState(0);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/visitor/today`)
            .then(res => res.json())
            .then(data => setToday(data.todayVisitors));

        fetch(`${process.env.REACT_APP_API_URL}/api/visitor/total`)
            .then(res => res.json())
            .then(data => setTotal(data.totalVisitors));

        fetch(`${process.env.REACT_APP_API_URL}/api/visitor/stats`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(item => ({
                    date: item._id,
                    visitors: item.count
                }));
                setStats(formatted);
            });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-gray-500">Today's Visitors</h2>
                    <p className="text-3xl font-bold">{today}</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <h2 className="text-gray-500">Total Visitors</h2>
                    <p className="text-3xl font-bold">{total}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white shadow p-4 rounded">
                <h2 className="mb-4 font-semibold">Visitor Trends</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="visitors" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;