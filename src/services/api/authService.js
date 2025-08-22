// Mock authentication service
const mockUsers = [
  {
    Id: 1,
    email: 'admin@contentcraft.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: null
  },
  {
    Id: 2,
    email: 'creator@contentcraft.com',
    password: 'creator123',
    name: 'Content Creator',
    role: 'creator',
    avatar: null
  },
  {
    Id: 3,
    email: 'demo@contentcraft.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    avatar: null
  }
];

const authService = {
  async login(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return user data without password
    const { password: _, ...userData } = user;
    return userData;
  },

  async logout() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  async getCurrentUser() {
    const savedUser = localStorage.getItem('contentcraft_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  }
};

export { authService };