import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import TopNavigation from "@/components/organisms/TopNavigation";
import BrandManager from "@/components/organisms/BrandManager";
import HomePage from "@/components/pages/HomePage";
import Dashboard from "@/components/pages/Dashboard";
import ContentLibrary from "@/components/pages/ContentLibrary";
import Analytics from "@/components/pages/Analytics";
import Profile from "@/components/pages/Profile";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { brandService } from "@/services/api/brandService";
import { tenantService } from "@/services/api/tenantService";
import { toast } from "react-toastify";

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandManager, setShowBrandManager] = useState(false);
  const [showTenantManager, setShowTenantManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const user = userState?.user;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  // Initialize application data when authenticated
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      initializeApp();
    }
  }, [isAuthenticated, isInitialized]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load default tenant
      const defaultTenant = await tenantService.getDefault();
      setCurrentTenant(defaultTenant);
      
      // Load tenant-specific brands
      const brandsData = await brandService.getAll(defaultTenant?.Id);
      setBrands(brandsData);
      
      // Set default brand with null safety
      const defaultBrand = brandsData?.find(b => b.is_default_c) || brandsData?.[0];
      if (defaultBrand) {
        setSelectedBrand(defaultBrand);
      }
      
      toast.success(`Welcome to ${defaultTenant?.Name || 'ContentCraft Pro'}!`);
    } catch (err) {
      setError("Failed to initialize application");
      toast.error("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    toast.info(`Switched to ${brand.Name}`);
  };

  const handleBrandsSave = async (updatedBrands) => {
    try {
      setBrands(updatedBrands);
      
      // Update selected brand if it was modified
      if (selectedBrand) {
        const updatedSelectedBrand = updatedBrands.find(b => b.Id === selectedBrand.Id);
        if (updatedSelectedBrand) {
          setSelectedBrand(updatedSelectedBrand);
        } else {
          // Update selected brand if it was affected
          const defaultBrand = updatedBrands?.find(b => b.is_default_c) || updatedBrands?.[0];
          if (defaultBrand) {
            setSelectedBrand(defaultBrand);
          }
        }
      }
    } catch (err) {
      toast.error("Failed to save brand changes");
    }
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  if (isAuthenticated && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading message="Loading ContentCraft Pro..." />
      </div>
    );
  }

  // ProtectedRoute component for authenticated routes
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Login />;
    }

    if (!currentTenant) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Error 
            title="No Tenant Available"
            message="Please contact your administrator to set up tenant access." 
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Error 
            title="Application Error"
            message={error} 
            onRetry={initializeApp}
          />
        </div>
      );
    }

    return children;
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {isAuthenticated && (
          <TopNavigation
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
            onManageBrands={() => setShowBrandManager(true)}
            onManageTenants={() => setShowTenantManager(true)}
            currentUser={user}
          />
        )}

        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage selectedBrand={selectedBrand} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard selectedBrand={selectedBrand} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                  <ContentLibrary selectedBrand={selectedBrand} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics selectedBrand={selectedBrand} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
            <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          </Routes>
        </main>

        {showBrandManager && (
          <BrandManager
            brands={brands}
            currentTenant={currentTenant}
            onSave={handleBrandsSave}
            onClose={() => setShowBrandManager(false)}
          />
        )}

        {showTenantManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
                <button
                  onClick={() => setShowTenantManager(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Tenant management is available for system administrators.
                </p>
                <p className="text-sm text-gray-500">
                  Current Tenant: <strong>{currentTenant?.Name}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;