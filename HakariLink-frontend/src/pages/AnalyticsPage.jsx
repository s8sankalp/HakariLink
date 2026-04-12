import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../lib/api";
import Loader from "../components/ui/Loader";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        // Format YYYY-MM-DD
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        const response = await api.get(`/api/urls/totalClicks?startDate=${startStr}&endDate=${endStr}`);
        
        // Map object { "YYYY-MM-DD": count } to recharts
        const chartData = Object.entries(response.data)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([date, count]) => {
            // Shorten date to visual readable e.g., "Apr 11"
            const d = new Date(date);
            return {
              name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              clicks: count
            }
          });
          
        setData(chartData);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader message="Loading analytics..." emoji="📊" fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          {data.length === 0 ? (
            <p className="text-muted-foreground">Not enough data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#1A1A1A" fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
