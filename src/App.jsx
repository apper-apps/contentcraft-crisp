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
import { toast } from "react-toastify";

function App() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandManager, setShowBrandManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load brands
      const brandsData = await brandService.getAll();
      setBrands(brandsData);
      
      // Set default brand
      const defaultBrand = brandsData.find(b => b.isDefault) || brandsData[0];
      setSelectedBrand(defaultBrand);
      
      toast.success("ContentCraft Pro loaded successfully!");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading message="Loading ContentCraft Pro..." />
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
          onSave={handleBrandsSave}
          onClose={() => setShowBrandManager(false)}
        />
      )}
    </div>
  );
}

export default App;