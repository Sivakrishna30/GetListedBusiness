import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Modal } from './Modal.tsx';
import { Mail, Lock, User, AlertCircle, KeyRound, LogOut, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, user, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email and password are required.');
      return;
    }

    if (isRegisterMode && !name.trim()) {
      setErrorMsg('Full name is required to register.');
      return;
    }

    try {
      setSubmitting(true);
      if (isRegisterMode) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setIsRegisterMode(false);
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMsg(null);
  };

  const handleSignOut = () => {
    logout();
    setEmail('');
    setPassword('');
    setName('');
    setErrorMsg(null);
    setSuccessMsg('Successfully signed out.');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={user ? 'User Account & Identity' : isRegisterMode ? 'Register Business Owner' : 'Sign In to GetListed'}
    >
      {user ? (
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#0F766E]/30 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-stone-900 truncate">{user.name}</h4>
                <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-[#CCFBF1] text-[#0F766E] border border-[#0F766E]/20">
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-stone-600 truncate">{user.email}</p>
              <p className="text-2xs text-stone-400 font-mono mt-0.5">User ID: {user.id}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-stone-800">Decoupled Identity Model (ADR-007):</div>
            <p className="leading-relaxed">
              Your user credentials provide secure system authentication. Specific business capabilities and access are granted through contextual Business Memberships (Owner, Manager, Staff).
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEF2F2]/80 border border-[#DC2626]/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={closeAuthModal}
              className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors shadow-2xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {successMsg && (
            <div className="p-3 bg-[#F0FDF4] border border-[#16A34A]/30 rounded-lg text-xs text-[#16A34A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 rounded-lg text-xs text-[#DC2626] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-700">
              <KeyRound className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span>Quick Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('sivakrishna.era@gmail.com', 'password123')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-2xs font-semibold text-stone-800 transition-colors shadow-2xs cursor-pointer"
              >
                <div>Owner (All Access):</div>
                <div className="text-[#0F766E] font-mono truncate">sivakrishna.era@gmail.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@greenparksports.example.com', 'password123')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-2xs font-semibold text-stone-800 transition-colors shadow-2xs cursor-pointer"
              >
                <div>Staff (Operations):</div>
                <div className="text-[#0F766E] font-mono truncate">staff@greenparksports...</div>
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@business.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              {submitting ? 'Authenticating...' : isRegisterMode ? 'Register Account' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-center text-[#0F766E] hover:text-[#115E59] font-semibold cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register here"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
