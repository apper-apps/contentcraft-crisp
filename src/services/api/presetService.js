const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PresetService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'preset_c';
  }

  async getAll(tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "prompt_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_custom_c" } },
          { field: { Name: "suggested_c" } }
        ]
      };

      // Get all presets (system presets don't have tenant restrictions)
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching presets:", error?.response?.data?.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "prompt_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_custom_c" } },
          { field: { Name: "suggested_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error(`Preset with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching preset with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(presetData) {
    try {
      const params = {
        records: [
          {
            Name: presetData.Name,
            Tags: presetData.Tags || "",
            description_c: presetData.description_c,
            prompt_c: presetData.prompt_c,
            category_c: presetData.category_c,
            is_custom_c: true,
            suggested_c: presetData.suggested_c || false
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
          console.error(`Failed to create preset ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create preset");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating preset:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, presetData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: presetData.Name,
            Tags: presetData.Tags,
            description_c: presetData.description_c,
            prompt_c: presetData.prompt_c,
            category_c: presetData.category_c,
            is_custom_c: presetData.is_custom_c,
            suggested_c: presetData.suggested_c
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
          console.error(`Failed to update preset ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update preset");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating preset:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      // First check if the preset is custom before attempting delete
      const preset = await this.getById(id);
      if (!preset.is_custom_c) {
        throw new Error("Cannot delete system presets");
      }

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
        console.error("Error deleting preset:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getByCategory(category, tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "prompt_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_custom_c" } },
          { field: { Name: "suggested_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
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
        console.error("Error fetching presets by category:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getSuggested(tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "prompt_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "is_custom_c" } },
          { field: { Name: "suggested_c" } }
        ],
        where: [
          {
            FieldName: "suggested_c",
            Operator: "EqualTo",
            Values: [true]
          }
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
        console.error("Error fetching suggested presets:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getByTenant(tenantId) {
    // Return all presets since system presets are available to all tenants
    return this.getAll(tenantId);
  }
}

export const presetService = new PresetService();