import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { logout as logoutApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, MessageSquare, User, ArrowLeft } from "lucide-react";

/** Top navigation bar for the application */
export function Navbar(): React.ReactElement {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  async function handleLogout(): Promise<void> {
    try {
      await logoutApi();
    } finally {
      logout();
      navigate("/login");
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center h-8 w-8 rounded-full border border-border bg-background text-foreground transition-colors hover:bg-black hover:border-black mr-1"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 transition-colors group-hover:text-white" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <MessageSquare className="h-5 w-5" />
            <span>LinkBotAI</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/dashboard" />}>
                Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/login" />}>
                Login
              </Button>
              <Button size="sm" nativeButton={false} render={<Link to="/register" />}>
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
