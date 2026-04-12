import React, { useState, useEffect } from "react";
import { Copy, MoreHorizontal, Search, Trash } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import Loader from "../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { BarChart2 } from "lucide-react";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleCopy = (shortUrl) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    navigator.clipboard.writeText(`${baseUrl}/${shortUrl}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/urls/${id}`);
      setLinks(links => links.filter(link => link.id !== id));
    } catch (err) {
      console.error("Failed to delete link", err);
      alert("Failed to delete link");
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get("/api/urls/myurls");
        const formattedLinks = response.data.map(item => ({
          id: item.id,
          original: item.originalUrl,
          short: item.shortUrl,
          clicks: item.clickCount,
          date: new Date(item.createdDate).toLocaleDateString()
        }));
        setLinks(formattedLinks);
      } catch (err) {
        console.error("Failed to fetch links", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const filteredLinks = links.filter(
    (link) =>
      link.original.includes(search) || link.short.includes(search)
  );

  if (loading) {
    return <Loader message="Fetching your links..." emoji="🔗" fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search links..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border text-sm rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="px-6 py-4 font-medium text-muted-foreground w-1/3">Short URL</th>
                <th className="px-6 py-4 font-medium text-muted-foreground w-1/3 text-ellipsis">Original URL</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Clicks</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <a href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${link.short}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {(import.meta.env.VITE_API_URL || "http://localhost:8080")}/{link.short}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]" title={link.original}>
                    {link.original}
                  </td>
                  <td className="px-6 py-4 font-medium">{link.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{link.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleCopy(link.short)} title="Copy URL">
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => navigate(`/dashboard/analytics/${link.short}`)} title="View Analytics">
                        <BarChart2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDelete(link.id)} title="Delete URL">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                    {search ? `No links found matching '${search}'.` : "No links have been created yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
