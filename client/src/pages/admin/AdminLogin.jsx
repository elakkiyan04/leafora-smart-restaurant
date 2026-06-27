import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../constants/admin';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Username or Password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl relative overflow-hidden bg-[#111] border border-white/10">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2 text-white">Admin Portal</h2>
          <p className="text-gray-400 mb-8">Frontend-only System</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-darkBg/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="Elakky"
                />
                <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-darkBg/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="••••"
                />
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              </div>
            </div>

            <button
              className="w-full btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-primary font-semibold tracking-wider flex items-center justify-center gap-2 select-none">
            <span>🔒</span> Access Only For Admin
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

