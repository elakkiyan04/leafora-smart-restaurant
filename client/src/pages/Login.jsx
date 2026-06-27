import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, user } = useUserAuth();
  const { addToCart } = useCart();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields State
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Handle Navbar navigation state triggers (Sign up vs Login)
  useEffect(() => {
    if (location.state && typeof location.state.isLogin !== 'undefined') {
      setIsLogin(location.state.isLogin);
      // Clear fields and errors on switch
      setFirstName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setValidationError('');
    }
  }, [location.state]);

  // If user is already logged in, redirect them to home or from path
  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Email validation helper
  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Common validations
    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (isLogin) {
      // Login Flow
      const result = await login(email, password);
      if (result.success) {
        const pendingItem = localStorage.getItem('pendingAddToCart');
        if (pendingItem) {
          try {
            const item = JSON.parse(pendingItem);
            addToCart(item);
            toast.success(`${item.name} added to cart!`, {
              icon: '🛒',
              style: {
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(234, 179, 8, 0.2)'
              },
            });
            localStorage.removeItem('pendingAddToCart');
          } catch (e) {
            console.error(e);
          }
        }
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } else {
        setValidationError(result.error);
      }
    } else {
      // Signup Flow
      if (!firstName || !confirmPassword) {
        setValidationError('All fields are required.');
        return;
      }

      if (password !== confirmPassword) {
        setValidationError('Password and Confirm Password must match.');
        return;
      }

      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }

      const result = await register(firstName, email, password);
      if (result.success) {
        const pendingItem = localStorage.getItem('pendingAddToCart');
        if (pendingItem) {
          try {
            const item = JSON.parse(pendingItem);
            addToCart(item);
            toast.success(`${item.name} added to cart!`, {
              icon: '🛒',
              style: {
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(234, 179, 8, 0.2)'
              },
            });
            localStorage.removeItem('pendingAddToCart');
          } catch (e) {
            console.error(e);
          }
        }
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } else {
        setValidationError(result.error);
      }
    }
  };

  const handleSocialClick = () => {
    toast.error('Social provider authentication is disabled. Please use the form.', {
      style: {
        borderRadius: '16px',
        background: '#111',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }
    });
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
    setFirstName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setValidationError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-10">
      <div className="glass-panel w-full max-w-md p-8 rounded-[2.5rem] relative overflow-hidden bg-[#111] border border-white/5 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-black mb-2 text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? 'Enter your credentials to access your Leafora account' 
                : 'Join Leafora for a premium and luxury dining experience'}
            </p>
          </div>

          {/* Validation/API error message */}
          {validationError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Signup Only field: First Name */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder-gray-600"
                    placeholder="Ashokumar"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder-gray-600"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder-gray-600"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Signup Only field: Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder-gray-600"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => toast.success('Password reset link has been sent to your email (simulated).')}
                  className="text-xs text-primary hover:underline font-bold tracking-wide"
                >
                  Forgot password?
                </button>
              </div>
            )}

                        <button 
              type="submit" 
              disabled={loading}
              className="w-full h-[60px] bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-[0_0_35px_rgba(234,179,8,0.55)] transform active:scale-98 flex items-center justify-center gap-3.5 uppercase tracking-widest text-[17px] disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleSocialClick}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <Globe size={14} className="text-gray-400" /> Google
              </button>
              <button 
                onClick={handleSocialClick}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-gray-300 uppercase tracking-wider"
              >
                <User size={14} className="text-gray-400" /> Github
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleFormType}
              className="text-primary font-bold hover:underline hover:text-white transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
