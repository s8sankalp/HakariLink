import React, { useState, useEffect } from "react";
import { X, ArrowRight, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api } from "../lib/api";

export default function ShortenModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setResult(null);
      setLongUrl("");
    };
    window.addEventListener("open-shorten-modal", handleOpen);
    return () => window.removeEventListener("open-shorten-modal", handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/urls/shorten", {
        originalUrl: longUrl
      });
      setResult({
        original: response.data.originalUrl,
        short: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${response.data.shortUrl}`
      });
    } catch (err) {
      console.error(err);
      alert("Failed to shorten url.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Shorten new link</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination URL</label>
                <Input 
                  placeholder="https://example.com/very/long/url" 
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Generating..." : "Generate Short Link"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Your link is ready!</h3>
                <p className="text-sm text-muted-foreground">You can now share this short link anywhere.</p>
              </div>
              
              <div className="flex items-center gap-2 bg-secondary p-2 rounded-lg border border-border">
                <Input value={result.short} readOnly className="bg-transparent border-0 focus-visible:ring-0" />
                <Button variant="primary" size="icon" className="shrink-0" onClick={() => navigator.clipboard.writeText(result.short)}>
                  <Copy size={16} />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
