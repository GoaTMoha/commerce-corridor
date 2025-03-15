
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Package,
  ShoppingBag,
  Truck,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/products", label: "Products", icon: Package },
  { path: "/inventory", label: "Inventory", icon: BarChart2 },
  { path: "/sales", label: "Sales", icon: ShoppingBag },
  { path: "/purchases", label: "Purchases", icon: Truck },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const NavLink = ({ path, label, icon: Icon }: { path: string; label: string; icon: any }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link
        to={path}
        className={cn(
          "flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-primary"
        )}
      >
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="font-bold">Store Manager</span>
          </Link>
          <nav className="flex items-center space-x-1 ml-6">
            {navItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex md:hidden items-center">
              <Link to="/" className="flex items-center mr-2">
                <ShoppingBag className="h-6 w-6 mr-2" />
                <span className="font-bold">Store Manager</span>
              </Link>
              
              <div className="flex-1"></div>
              
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <div className="px-2 py-6">
                    <div className="flex items-center mb-6">
                      <ShoppingBag className="h-6 w-6 mr-2" />
                      <span className="font-bold text-lg">Store Manager</span>
                    </div>
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <NavLink key={item.path} {...item} />
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
