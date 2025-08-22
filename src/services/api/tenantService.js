import tenantsData from "@/services/mockData/tenants.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TenantService {
  constructor() {
    this.tenants = [...tenantsData];
  }

  async getAll() {
    await delay(200);
    return [...this.tenants];
  }

  async getById(id) {
    await delay(150);
    const tenant = this.tenants.find(t => t.Id === parseInt(id));
    if (!tenant) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    return { ...tenant };
  }

  async create(tenantData) {
    await delay(300);
    const newTenant = {
      Id: Math.max(...this.tenants.map(t => t.Id), 0) + 1,
      name: tenantData.name,
      domain: tenantData.domain || `${tenantData.name.toLowerCase().replace(/\s+/g, '-')}.contentcraft.com`,
      logo: tenantData.logo || null,
      primaryColor: tenantData.primaryColor || "#3B82F6",
      isDefault: this.tenants.length === 0, // First tenant becomes default
      settings: {
        allowBrandCreation: true,
        maxBrands: 10,
        maxUsers: 5,
        aiProviders: ['openai', 'claude', 'gemini'],
        features: ['content-generation', 'analytics', 'collaboration']
      },
      subscription: {
        plan: 'starter',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If this is the first tenant, make it default
    if (this.tenants.length === 0) {
      newTenant.isDefault = true;
    }

    this.tenants.push(newTenant);
    return { ...newTenant };
  }

  async update(id, tenantData) {
    await delay(250);
    const index = this.tenants.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    
    this.tenants[index] = {
      ...this.tenants[index],
      ...tenantData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tenants[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.tenants.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Tenant with ID ${id} not found`);
    }
    
    const tenant = this.tenants[index];
    if (tenant.isDefault && this.tenants.length > 1) {
      throw new Error("Cannot delete the default tenant when other tenants exist");
    }
    
    this.tenants.splice(index, 1);
    return { success: true };
  }

  async getDefault() {
    await delay(100);
    return this.tenants.find(t => t.isDefault) || this.tenants[0];
  }

  async getTenantByDomain(domain) {
    await delay(150);
    return this.tenants.find(t => t.domain === domain);
  }

  async updateSubscription(tenantId, subscriptionData) {
    await delay(200);
    const tenant = await this.getById(tenantId);
    tenant.subscription = { ...tenant.subscription, ...subscriptionData };
    return this.update(tenantId, tenant);
  }
}

export const tenantService = new TenantService();