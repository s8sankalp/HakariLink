import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, LogOut, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "My URLs", icon: <LinkIcon size={20} />, path: "/dashboard/links" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/dashboard/analytics" },
  ];

  return (
    <div className="flexh-screen w-full bg-secondary/30 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white flex flex-col fixed inset-y-0 left-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">Z</div>
            Zurl
          </Link>
        </div>
        
        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-primary" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">
            {location.pathname.split("/").pop() === "dashboard" ? "Overview" : location.pathname.split("/").pop()}
          </h2>
          <Button size="sm" className="gap-2" onClick={() => window.dispatchEvent(new CustomEvent('open-shorten-modal'))}>
            <Plus size={16} />
            Shorten Link
          </Button>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
