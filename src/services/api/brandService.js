import brandsData from "@/services/mockData/brands.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BrandService {
  constructor() {
    this.brands = [...brandsData];
  }

  async getAll() {
    await delay(200);
    return [...this.brands];
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

  async getDefault() {
    await delay(100);
    return this.brands.find(b => b.isDefault) || this.brands[0];
  }
}

export const brandService = new BrandService();