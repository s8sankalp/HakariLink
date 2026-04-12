import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowRight, BarChart3, Link as LinkIcon, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">Z</div>
          Zurl
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-6">
          Shorten. Track. Control.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
          The minimal, powerful URL shortener that gives you full control over your links and audience. Designed for modern teams.
        </p>

        {/* Quick Shorten UI Component */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-sm border border-border">
          <Input 
            placeholder="Paste your long link here..." 
            className="border-0 h-14 text-base focus-visible:ring-0 px-4 bg-transparent shadow-none"
          />
          <Button size="lg" className="h-14 sm:w-48 rounded-xl shrink-0 text-base font-semibold">
            Shorten URL
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Features */}
      <section className="bg-secondary/50 py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6" />}
            title="Analytics tracking"
            description="Get detailed insights into your audience and track your link clicks in real-time."
          />
          <FeatureCard 
            icon={<LinkIcon className="w-6 h-6" />}
            title="Custom short links"
            description="Create branded, memorable links that build trust and increase click-through rates."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Fast redirects"
            description="Lightning-fast routing ensures your users reach their destination with zero delay."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Zurl. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-border/50 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
