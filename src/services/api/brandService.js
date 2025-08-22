import brandsData from "@/services/mockData/brands.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BrandService {
  constructor() {
    this.brands = [...brandsData];
  }

  // Filter brands by tenant
  filterByTenant(brands, tenantId) {
    if (!tenantId) return brands;
    return brands.filter(brand => brand.tenantId === tenantId);
  }

  async getAll(tenantId = null) {
    await delay(200);
    const allBrands = [...this.brands];
    return tenantId ? this.filterByTenant(allBrands, tenantId) : allBrands;
  }


  async getById(id) {
    await delay(150);
    const brand = this.brands.find(b => b.Id === parseInt(id));
    if (!brand) {
      throw new Error(`Brand with ID ${id} not found`);
    }
    return { ...brand };
  }

async create(brandData) {
    await delay(300);
    const newBrand = {
      Id: Math.max(...this.brands.map(b => b.Id)) + 1,
      name: brandData.name,
      color: brandData.color,
      emoji: brandData.emoji,
      tenantId: brandData.tenantId,
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    this.brands.push(newBrand);
    return { ...newBrand };
  }

  async update(id, brandData) {
    await delay(250);
    const index = this.brands.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Brand with ID ${id} not found`);
    }
    
    this.brands[index] = {
      ...this.brands[index],
      ...brandData,
      Id: parseInt(id)
    };
    return { ...this.brands[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.brands.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Brand with ID ${id} not found`);
    }
    
    const brand = this.brands[index];
    if (brand.isDefault) {
      throw new Error("Cannot delete the default brand");
    }
    
    this.brands.splice(index, 1);
    return { success: true };
  }

async getDefault(tenantId = null) {
    await delay(100);
    const brands = tenantId ? this.filterByTenant(this.brands, tenantId) : this.brands;
    return brands.find(b => b.isDefault) || brands[0];
  }

  async getByTenant(tenantId) {
    await delay(150);
    return this.filterByTenant(this.brands, tenantId);
  }
}

export const brandService = new BrandService();