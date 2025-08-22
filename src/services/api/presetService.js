import presetsData from "@/services/mockData/presets.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PresetService {
  constructor() {
    this.presets = [...presetsData];
  }

  // Filter presets by tenant
  filterByTenant(presets, tenantId) {
    if (!tenantId) return presets;
    return presets.filter(preset => !preset.tenantId || preset.tenantId === tenantId);
  }

  async getAll(tenantId = null) {
    await delay(200);
    const allPresets = [...this.presets];
    return tenantId ? this.filterByTenant(allPresets, tenantId) : allPresets;
  }

  async getById(id) {
    await delay(150);
    const preset = this.presets.find(p => p.Id === parseInt(id));
    if (!preset) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    return { ...preset };
  }

  async create(presetData) {
    await delay(300);
    const newPreset = {
      Id: Math.max(...this.presets.map(p => p.Id)) + 1,
      name: presetData.name,
      description: presetData.description,
      prompt: presetData.prompt,
      category: presetData.category,
      tenantId: presetData.tenantId,
      isCustom: true,
      suggested: false,
      createdAt: new Date().toISOString()
    };
    this.presets.push(newPreset);
    return { ...newPreset };
  }

  async update(id, presetData) {
    await delay(250);
    const index = this.presets.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    
    this.presets[index] = {
      ...this.presets[index],
      ...presetData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...this.presets[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.presets.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    
    const preset = this.presets[index];
    if (!preset.isCustom) {
      throw new Error("Cannot delete system presets");
    }
    
    this.presets.splice(index, 1);
    return { success: true };
  }

  async getByCategory(category, tenantId = null) {
    await delay(150);
    const allPresets = tenantId ? this.filterByTenant(this.presets, tenantId) : this.presets;
    return allPresets.filter(p => p.category === category);
  }

  async getSuggested(tenantId = null) {
    await delay(150);
    const allPresets = tenantId ? this.filterByTenant(this.presets, tenantId) : this.presets;
    return allPresets.filter(p => p.suggested);
  }

  async getByTenant(tenantId) {
    await delay(150);
    return this.filterByTenant(this.presets, tenantId);
  }
}

export const presetService = new PresetService();
import presetsData from "@/services/mockData/presets.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PresetService {
  constructor() {
    this.presets = [...presetsData];
  }

  async getAll() {
    await delay(250);
    return [...this.presets];
  }

  async getById(id) {
    await delay(150);
    const preset = this.presets.find(p => p.Id === parseInt(id));
    if (!preset) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    return { ...preset };
  }

  async create(presetData) {
    await delay(300);
    const newPreset = {
      Id: Math.max(...this.presets.map(p => p.Id)) + 1,
      name: presetData.name,
      description: presetData.description,
      prompt: presetData.prompt,
      category: presetData.category || "custom",
      isCustom: true
    };
    this.presets.push(newPreset);
    return { ...newPreset };
  }

  async update(id, presetData) {
    await delay(250);
    const index = this.presets.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    
    this.presets[index] = {
      ...this.presets[index],
      ...presetData,
      Id: parseInt(id)
    };
    return { ...this.presets[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.presets.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Preset with ID ${id} not found`);
    }
    
    const preset = this.presets[index];
    if (!preset.isCustom) {
      throw new Error("Cannot delete built-in presets");
    }
    
    this.presets.splice(index, 1);
    return { success: true };
  }

  async getSuggested() {
    await delay(200);
    return this.presets.filter(p => p.suggested);
  }

  async getByCategory(category) {
    await delay(180);
    return this.presets.filter(p => p.category === category);
  }
}

export const presetService = new PresetService();