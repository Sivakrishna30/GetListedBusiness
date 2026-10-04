import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Modal } from './Modal.tsx';
import { Mail, Lock, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, user, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

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

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={user ? 'User Account & Session' : isRegisterMode ? 'Register New Business Owner' : 'Sign In to GetListed'}
    >
      {user ? (
        <div className="space-y-5 text-sm">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-base shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-stone-900 truncate">{user.name}</h4>
                <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-stone-600 truncate">{user.email}</p>
              <p className="text-2xs text-stone-400 font-mono mt-1">User ID: {user.id}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-stone-800">Decoupled Identity Model (ADR-007):</div>
            <p>
              Your user credentials provide secure system authentication. Specific business capabilities and access are granted through contextual Business Memberships (Owner, Manager, Staff).
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => {
                logout();
                closeAuthModal();
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Sign Out
            </button>

            <button
              type="button"
              onClick={closeAuthModal}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-700">
              <KeyRound className="w-3.5 h-3.5 text-teal-700" />
              <span>Quick Demo Accounts (Email & Password):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('sivakrishna.era@gmail.com', 'password123')}
                className="px-2.5 py-1 rounded bg-white hover:bg-stone-100 border border-stone-300 text-2xs font-semibold text-stone-800 transition-colors shadow-2xs"
              >
                Owner: <span className="text-teal-700 font-mono">sivakrishna.era@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@greenparksports.example.com', 'password123')}
                className="px-2.5 py-1 rounded bg-white hover:bg-stone-100 border border-stone-300 text-2xs font-semibold text-stone-800 transition-colors shadow-2xs"
              >
                Staff: <span className="text-teal-700 font-mono">staff@greenparksports.example.com</span>
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sivakrishna Era"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg(null);
              }}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold hover:underline"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : 'New to GetListed? Register Owner'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-2xs"
            >
              <span>{submitting ? 'Authenticating...' : isRegisterMode ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
