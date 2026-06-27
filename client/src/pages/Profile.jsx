import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useUserAuth();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFirstName(user.firstName || '');
      setEmail(user.email || '');
    }
  }, [user, navigate]);

  if (!user) return null;

  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const result = await updateProfile(firstName, email);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="pt-20 min-h-[85vh] px-4 max-w-4xl mx-auto pb-16">
      {/* Header and Back Link */}
      <div className="mb-10">
        <Link 
          to="/" 
          className="text-gray-400 hover:text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors mb-2 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
          My <span className="text-primary">Profile</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your luxury account details and dining settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Card: Account Card Overview */}
        <div className="glass-panel p-8 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-xl flex flex-col items-center text-center relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#eab308] to-[#ca8a04] text-black font-black text-4xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] border-4 border-white/5 mb-6">
            {firstName ? firstName[0].toUpperCase() : 'U'}
          </div>

          <h2 className="text-xl font-bold text-white mb-1">{user.firstName}</h2>
          <p className="text-xs text-gray-500 font-bold break-all mb-6">{user.email}</p>

          <div className="w-full h-px bg-white/5 my-4"></div>

          <div className="text-left w-full space-y-4 pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
              <span className="text-primary">🌟</span> Leafora Elite Diner
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
              <span className="text-primary">📅</span> Member since 2026
            </div>
          </div>
        </div>

        {/* Right Card: Profile Edit Form */}
        <div className="md:col-span-2 glass-panel p-8 md:p-10 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={16} className="text-primary animate-pulse" />
            Personal Details
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="Ashokumar"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm" 
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            {/* Email Address Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="ashokumar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm" 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto py-4.5 px-8 text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:shadow-glow-strong disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
