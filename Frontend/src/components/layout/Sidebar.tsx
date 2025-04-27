
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  Gauge, 
  History, 
  Settings, 
  Zap,
  Codesandbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: <Gauge className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Websites', icon: <Activity className="h-5 w-5" />, path: '/websites' },
    { name: 'Performance', icon: <Zap className="h-5 w-5" />, path: '/performance' },
    { name: 'Alerts', icon: <Bell className="h-5 w-5" />, path: '/alerts' },
    { name: 'History', icon: <History className="h-5 w-5" />, path: '/history' },
    { name: 'Database', icon: <Database className="h-5 w-5" />, path: '/database' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen relative transition-all duration-300 border-r border-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center">
            <Codesandbox className="h-6 w-6 text-monitor-purple mr-2" />
            <span className="text-xl font-bold">DATADOCK</span>
          </div>
        )}
        {collapsed && <Codesandbox className="h-6 w-6 text-monitor-purple mx-auto" />}
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("absolute -right-3 top-7 h-6 w-6 rounded-full border p-0", 
            collapsed && "rotate-180"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center py-2 px-3 rounded-md text-sidebar-foreground transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70",
              collapsed && "justify-center"
            )}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
