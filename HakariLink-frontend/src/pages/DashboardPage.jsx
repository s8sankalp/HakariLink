import React, { useState, useEffect } from "react";
import { Copy, TrendingUp, Link as LinkIcon, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import Loader from "../components/ui/Loader";

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: "Total Links", value: "0", icon: <LinkIcon size={18} className="text-primary" /> },
    { title: "Total Clicks", value: "0", icon: <Eye size={18} className="text-primary" /> },
    { title: "Active Links", value: "0", icon: <TrendingUp size={18} className="text-primary" /> },
  ]);

  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/urls/myurls");
        const links = response.data;
        
        const totalLinks = links.length;
        const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
        
        setStats([
          { title: "Total Links", value: totalLinks.toString(), icon: <LinkIcon size={18} className="text-primary" /> },
          { title: "Total Clicks", value: totalClicks.toString(), icon: <Eye size={18} className="text-primary" /> },
          { title: "Active Links", value: totalLinks.toString(), icon: <TrendingUp size={18} className="text-primary" /> },
        ]);

        const formattedRecent = links
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 5)
          .map(item => ({
            id: item.id,
            original: item.originalUrl,
            short: item.shortUrl,
            clicks: item.clickCount,
            date: new Date(item.createdDate).toLocaleDateString()
          }));
          
        setRecentLinks(formattedRecent);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Fetching your dashboard..." emoji="🚀" fullScreen />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Links Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">Recent Links</h3>
          <Button variant="ghost" size="sm" className="text-primary">View all</Button>
        </div>
        
        <Card>
          <div className="divide-y divide-border">
            {recentLinks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No recent links found.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.dispatchEvent(new CustomEvent('open-shorten-modal'))}>
                  Create your first link
                </Button>
              </div>
            ) : (
              recentLinks.map(link => (
                <div key={link.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <div className="space-y-1 overflow-hidden pr-4">
                    <a href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${link.short}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary truncate block hover:underline">
                      zurl.co/{link.short}
                    </a>
                    <p className="text-sm text-muted-foreground truncate">{link.original}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-sm font-medium hidden sm:block">
                      {link.clicks} <span className="text-muted-foreground font-normal">clicks</span>
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block w-24 text-right">
                      {link.date}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${link.short}`)}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
