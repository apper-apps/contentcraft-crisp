const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TenantService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'tenant_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "domain_c" } },
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "subscription_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tenants:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "domain_c" } },
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "subscription_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error(`Tenant with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching tenant with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(tenantData) {
    try {
      const params = {
        records: [
          {
            Name: tenantData.Name,
            Tags: tenantData.Tags || "",
            domain_c: tenantData.domain_c || `${tenantData.Name.toLowerCase().replace(/\s+/g, '-')}.contentcraft.com`,
            logo_c: tenantData.logo_c || "",
            primary_color_c: tenantData.primary_color_c || "#3B82F6",
            is_default_c: tenantData.is_default_c || false,
            settings_c: JSON.stringify(tenantData.settings_c || {
              allowBrandCreation: true,
              maxBrands: 10,
              maxUsers: 5,
              aiProviders: ['openai', 'claude', 'gemini'],
              features: ['content-generation', 'analytics', 'collaboration']
            }),
            subscription_c: JSON.stringify(tenantData.subscription_c || {
              plan: 'starter',
              status: 'active',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }),
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tenant ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create tenant");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating tenant:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, tenantData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: tenantData.Name,
            Tags: tenantData.Tags,
            domain_c: tenantData.domain_c,
            logo_c: tenantData.logo_c,
            primary_color_c: tenantData.primary_color_c,
            is_default_c: tenantData.is_default_c,
            settings_c: typeof tenantData.settings_c === 'string' ? tenantData.settings_c : JSON.stringify(tenantData.settings_c),
            subscription_c: typeof tenantData.subscription_c === 'string' ? tenantData.subscription_c : JSON.stringify(tenantData.subscription_c),
            updated_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update tenant ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update tenant");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating tenant:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tenant:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getDefault() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "domain_c" } },
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "subscription_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "is_default_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        // Fall back to getting first tenant
        return (await this.getAll())[0];
      }

      return response.data?.[0] || (await this.getAll())[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching default tenant:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      // Fall back to getting first tenant
      return (await this.getAll())[0];
    }
  }

  async getTenantByDomain(domain) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "domain_c" } },
          { field: { Name: "logo_c" } },
          { field: { Name: "primary_color_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "settings_c" } },
          { field: { Name: "subscription_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "domain_c",
            Operator: "EqualTo",
            Values: [domain]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tenant by domain:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export const tenantService = new TenantService();