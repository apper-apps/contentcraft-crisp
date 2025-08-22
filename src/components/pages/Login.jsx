import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const demoCredentials = [
    { email: 'admin@contentcraft.com', password: 'admin123', role: 'Admin' },
    { email: 'creator@contentcraft.com', password: 'creator123', role: 'Creator' },
    { email: 'demo@contentcraft.com', password: 'demo123', role: 'User' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl mb-4">
            <ApperIcon name="Zap" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ContentCraft Pro</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <ApperIcon name="Mail" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <ApperIcon name="Lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    <ApperIcon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3 text-center">Demo Accounts:</p>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => setFormData({ email: cred.email, password: cred.password })}
                    className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{cred.email}</span>
                      <span className="text-gray-500">{cred.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Need help?{' '}
                <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 ContentCraft Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;