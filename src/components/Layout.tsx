import React from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  Tag,
  Package,
  Database,
  Gavel,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Clients", id: "clients", icon: Users },
    { name: "Categories", id: "categories", icon: Tag },
    { name: "Products", id: "products", icon: Package },
    { name: "Repos", id: "repos", icon: Database },
    { name: "Auctions", id: "auctions", icon: Gavel },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center">
            <Gavel className="h-10 w-10 text-blue-400" />
            <span className="ml-3 text-2xl font-bold text-white">
              AuctionTracker
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center px-6 py-6 border-b border-gray-200 bg-slate-50">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-base font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="text-sm text-slate-600">@{user?.username}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-3">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center px-6 py-4 text-lg font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border-l-4 border-indigo-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-lg border border-gray-200"
                )}
              >
                <item.icon
                  className={cn(
                    "h-7 w-7 mr-4",
                    isActive ? "text-white" : "text-gray-600"
                  )}
                />
                <span className={cn(isActive ? "text-white" : "text-gray-600")}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start h-12 text-base border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Page content */}
        <main className="flex-1 p-8 w-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
