const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BrandService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'brand_c';
  }

  async getAll(tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "color_c" } },
          { field: { Name: "emoji_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "tenant_id_c" } }
        ]
      };

      if (tenantId) {
        params.where = [
          {
            FieldName: "tenant_id_c",
            Operator: "EqualTo",
            Values: [parseInt(tenantId)]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching brands:", error?.response?.data?.message);
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
          { field: { Name: "color_c" } },
          { field: { Name: "emoji_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "tenant_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error(`Brand with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching brand with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(brandData) {
    try {
      const params = {
        records: [
          {
            Name: brandData.Name,
            Tags: brandData.Tags || "",
            color_c: brandData.color_c,
            emoji_c: brandData.emoji_c,
            tenant_id_c: parseInt(brandData.tenant_id_c),
            is_default_c: brandData.is_default_c || false,
            created_at_c: new Date().toISOString()
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
          console.error(`Failed to create brand ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create brand");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating brand:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, brandData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: brandData.Name,
            Tags: brandData.Tags,
            color_c: brandData.color_c,
            emoji_c: brandData.emoji_c,
            tenant_id_c: parseInt(brandData.tenant_id_c),
            is_default_c: brandData.is_default_c
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
          console.error(`Failed to update brand ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update brand");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating brand:", error?.response?.data?.message);
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
        console.error("Error deleting brand:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getDefault(tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "color_c" } },
          { field: { Name: "emoji_c" } },
          { field: { Name: "is_default_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "tenant_id_c" } }
        ],
        where: [
          {
            FieldName: "is_default_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      if (tenantId) {
        params.where.push({
          FieldName: "tenant_id_c",
          Operator: "EqualTo",
          Values: [parseInt(tenantId)]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        // Fall back to getting first brand for tenant
        return (await this.getAll(tenantId))[0];
      }

      return response.data?.[0] || (await this.getAll(tenantId))[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching default brand:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      // Fall back to getting first brand for tenant
      return (await this.getAll(tenantId))[0];
    }
  }

  async getByTenant(tenantId) {
    return this.getAll(tenantId);
  }
}

export const brandService = new BrandService();