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

// Track next available ID for new users
let nextUserId = Math.max(...mockUsers.map(u => u.Id)) + 1;

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

  async signup(name, email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user
    const newUser = {
      Id: nextUserId++,
      email: email.toLowerCase(),
      password: password,
      name: name.trim(),
      role: 'user',
      avatar: null
    };

    // Add to mock users array
    mockUsers.push(newUser);

    // Return user data without password
    const { password: _, ...userData } = newUser;
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