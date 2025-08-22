import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";
import BrandManager from "@/components/organisms/BrandManager";
import HomePage from "@/components/pages/HomePage";
import Dashboard from "@/components/pages/Dashboard";
import ContentLibrary from "@/components/pages/ContentLibrary";
import Analytics from "@/components/pages/Analytics";
import Profile from "@/components/pages/Profile";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { brandService } from "@/services/api/brandService";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "react-toastify";

function App() {
  const { currentTenant, loading: tenantLoading } = useTenant();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandManager, setShowBrandManager] = useState(false);
  const [showTenantManager, setShowTenantManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentTenant && !tenantLoading) {
      initializeApp();
    }
  }, [currentTenant, tenantLoading]);

const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load tenant-specific brands
      const brandsData = await brandService.getAll(currentTenant?.Id);
      setBrands(brandsData);
      
      // Set default brand for this tenant
      const defaultBrand = brandsData.find(b => b.isDefault) || brandsData[0];
      setSelectedBrand(defaultBrand);
      
      toast.success(`Welcome to ${currentTenant?.name || 'ContentCraft Pro'}!`);
    } catch (err) {
      setError("Failed to initialize application");
      toast.error("Failed to load application data");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    toast.info(`Switched to ${brand.name}`);
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
          // If selected brand was deleted, switch to default
          const defaultBrand = updatedBrands.find(b => b.isDefault) || updatedBrands[0];
          setSelectedBrand(defaultBrand);
        }
      }
    } catch (err) {
      toast.error("Failed to save brand changes");
    }
  };

if (tenantLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading message={tenantLoading ? "Loading tenant information..." : "Loading ContentCraft Pro..."} />
      </div>
    );
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

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TopNavigation
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandChange={handleBrandChange}
        onManageBrands={() => setShowBrandManager(true)}
        onManageTenants={() => setShowTenantManager(true)}
      />
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage selectedBrand={selectedBrand} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard selectedBrand={selectedBrand} />} 
          />
          <Route 
            path="/library" 
            element={<ContentLibrary selectedBrand={selectedBrand} />} 
          />
          <Route 
            path="/analytics" 
            element={<Analytics selectedBrand={selectedBrand} />} 
          />
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
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
                Current Tenant: <strong>{currentTenant?.name}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;