import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MousePointerClick, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import Loader from "../components/ui/Loader";

export default function UrlAnalyticsPage() {
  const { shortUrl } = useParams();
  const navigate = useNavigate();
  const [urlData, setUrlData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      try {
        const urlResponse = await api.get(`/api/urls/${shortUrl}`);
        setUrlData(urlResponse.data);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const startStr = startDate.toISOString().split('T')[0] + 'T00:00:00';
        const endStr = endDate.toISOString().split('T')[0] + 'T23:59:59';

        const chartResponse = await api.get(`/api/urls/analytics/${shortUrl}?startDate=${startStr}&endDate=${endStr}`);
        
        const formattedChart = chartResponse.data
          .sort((a, b) => new Date(a.clickDate) - new Date(b.clickDate))
          .map(item => {
            const d = new Date(item.clickDate);
            return {
              name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              clicks: item.count
            };
          });

        setChartData(formattedChart);
      } catch (err) {
        console.error("Failed to fetch detailed analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedAnalytics();
  }, [shortUrl]);

  if (loading) {
    return <Loader message={`Loading analytics for ${shortUrl}...`} emoji="📈" fullScreen />;
  }

  if (!urlData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">URL Not Found</h2>
        <Button onClick={() => navigate('/dashboard/links')}>Back to Links</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/links')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="overflow-hidden">
          <h1 className="text-2xl font-bold tracking-tight">Analytics for {(import.meta.env.VITE_API_URL || "http://localhost:8080")}/{shortUrl}</h1>
          <a href={urlData.originalUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline text-sm block max-w-full truncate">
            {urlData.originalUrl}
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <MousePointerClick size={18} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urlData.clickCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Created On</CardTitle>
            <CalendarDays size={18} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Date(urlData.createdDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          {chartData.length === 0 ? (
            <p className="text-muted-foreground">Not enough data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicksDetails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#1A1A1A" fillOpacity={1} fill="url(#colorClicksDetails)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
