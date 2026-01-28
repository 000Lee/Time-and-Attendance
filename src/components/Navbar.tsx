import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useApp();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2 text-foreground">
              <Calendar className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <span className="font-sans font-medium text-h4 text-foreground">연차관리</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link to="/home">
                <Button
                  variant="ghost"
                  className={`h-11 px-4 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground ${
                    isActive('/home') ? 'border-b-[3px] border-primary rounded-none' : ''
                  }`}
                >
                  홈
                </Button>
              </Link>
              <Link to="/members">
                <Button
                  variant="ghost"
                  className={`h-11 px-4 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground ${
                    isActive('/members') ? 'border-b-[3px] border-primary rounded-none' : ''
                  }`}
                >
                  멤버관리
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
            >
              로그아웃
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-6 py-4 space-y-2">
            <Link to="/home" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-11 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground ${
                  isActive('/home') ? 'bg-secondary text-secondary-foreground' : ''
                }`}
              >
                홈
              </Button>
            </Link>
            <Link to="/members" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-11 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground ${
                  isActive('/members') ? 'bg-secondary text-secondary-foreground' : ''
                }`}
              >
                멤버관리
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start h-11 bg-transparent text-foreground font-normal hover:bg-secondary hover:text-secondary-foreground"
            >
              로그아웃
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
