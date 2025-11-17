import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { LogOut, LayoutDashboard, Users, Menu, X as CloseIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    auth.removeToken();
    navigate('/login');
  };

  const NavItem = ({
    to,
    icon: Icon,
    children,
    adminOnly = false,
  }: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    adminOnly?: boolean;
  }) => {
    if (adminOnly && user?.role !== 'admin') return null;

    return (
      <NavLink
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
            isActive ? 'text-white bg-blue-600/10' : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <Icon className="w-5 h-5 mr-3" />
        {children}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out transform translate-x-0">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="text-lg font-semibold text-gray-900">Menu</div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItem>
            <NavItem to="/users" icon={Users} adminOnly>
              Users
            </NavItem>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <header
        className={`bg-white bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 shadow-sm sticky top-0 z-30 transition-all duration-300 border-b border-gray-300 ${scrolled ? 'py-2' : 'py-3'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 mr-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Enquiry Management
              </h1>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </NavLink>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-xl shadow-sm p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
