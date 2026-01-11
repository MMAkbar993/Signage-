import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

// Simple hash function for password storage
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
};

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('adminSession');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (adminSession && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
      }
    }

    // Initialize default admin password if not set
    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) {
      // Default password: "admin123" (should be changed on first login)
      const defaultPassword = hashPassword('admin123');
      localStorage.setItem('adminPassword', defaultPassword);
      localStorage.setItem('isDefaultPassword', 'true');
    }

    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedPasswordHash = localStorage.getItem('adminPassword');
    const enteredPasswordHash = hashPassword(password);

    if (storedPasswordHash === enteredPasswordHash) {
      // Set session (expires in 24 hours)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('adminSession', 'active');
      localStorage.setItem('adminSessionExpiry', expiryTime.toString());
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Expose logout function globally so AdminPanel can use it
  useEffect(() => {
    if (isAuthenticated) {
      (window as any).adminLogout = handleLogout;
    }
    return () => {
      delete (window as any).adminLogout;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isDefaultPassword = localStorage.getItem('isDefaultPassword') === 'true';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="w-full max-w-md">
          {/* Lock Icon with Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full shadow-2xl mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-white text-3xl mb-2">Admin Access</h1>
            <p className="text-blue-200">Authorized Personnel Only</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-slate-700 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {isDefaultPassword && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-sm">
                      <strong>Default Password Active:</strong> Please use the default password "admin123" and change it immediately after login.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-5 h-5" />
                Login to Admin Panel
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                <p>
                  This admin panel controls the entire signage system including company branding, 
                  data management, and system settings. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-blue-200 text-sm">
            <p>Universal Smart Signage Generator System</p>
            <p className="text-blue-300 text-xs mt-1">Protected Admin Area</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Export logout function that can be called from anywhere
export const logoutAdmin = () => {
  if ((window as any).adminLogout) {
    (window as any).adminLogout();
  }
};

// Export function to check if using default password
export const isUsingDefaultPassword = (): boolean => {
  return localStorage.getItem('isDefaultPassword') === 'true';
};

// Export function to change password
export const changeAdminPassword = (currentPassword: string, newPassword: string): boolean => {
  const storedPasswordHash = localStorage.getItem('adminPassword');
  const currentPasswordHash = hashPassword(currentPassword);

  if (storedPasswordHash !== currentPasswordHash) {
    return false; // Current password is incorrect
  }

  // Update password
  const newPasswordHash = hashPassword(newPassword);
  localStorage.setItem('adminPassword', newPasswordHash);
  localStorage.setItem('isDefaultPassword', 'false');
  
  return true;
};