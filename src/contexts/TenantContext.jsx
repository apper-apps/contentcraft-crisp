import React, { createContext, useContext, useState, useEffect } from 'react';
import { tenantService } from '@/services/api/tenantService';
import { toast } from 'react-toastify';

const TenantContext = createContext(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeTenants();
  }, []);

  const initializeTenants = async () => {
    try {
      setLoading(true);
      const tenantsData = await tenantService.getAll();
      setTenants(tenantsData);
      
      // Set default tenant or first available
      const defaultTenant = tenantsData.find(t => t.isDefault) || tenantsData[0];
      if (defaultTenant) {
        setCurrentTenant(defaultTenant);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
      toast.error('Failed to load tenant information');
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenant) => {
    setCurrentTenant(tenant);
    toast.success(`Switched to ${tenant.name}`);
  };

  const createTenant = async (tenantData) => {
    try {
      const newTenant = await tenantService.create(tenantData);
      setTenants(prev => [...prev, newTenant]);
      toast.success(`Tenant "${newTenant.name}" created successfully`);
      return newTenant;
    } catch (error) {
      toast.error('Failed to create tenant');
      throw error;
    }
  };

  const updateTenant = async (tenantId, tenantData) => {
    try {
      const updatedTenant = await tenantService.update(tenantId, tenantData);
      setTenants(prev => prev.map(t => t.Id === tenantId ? updatedTenant : t));
      
      if (currentTenant?.Id === tenantId) {
        setCurrentTenant(updatedTenant);
      }
      
      toast.success(`Tenant "${updatedTenant.name}" updated successfully`);
      return updatedTenant;
    } catch (error) {
      toast.error('Failed to update tenant');
      throw error;
    }
  };

  const deleteTenant = async (tenantId) => {
    try {
      await tenantService.delete(tenantId);
      setTenants(prev => prev.filter(t => t.Id !== tenantId));
      
      if (currentTenant?.Id === tenantId) {
        const remainingTenants = tenants.filter(t => t.Id !== tenantId);
        const defaultTenant = remainingTenants.find(t => t.isDefault) || remainingTenants[0];
        setCurrentTenant(defaultTenant);
      }
      
      toast.success('Tenant deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tenant');
      throw error;
    }
  };

  const value = {
    currentTenant,
    tenants,
    loading,
    switchTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    refreshTenants: initializeTenants
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};