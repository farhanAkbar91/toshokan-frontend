import React, { useState } from 'react';
import { LogIn, ShieldAlert, KeyRound, UserRound, ArrowRight } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';

export function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Harap isi semua kolom kredensial.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const result = await response.json();
      if (response.ok) {
        onLoginSuccess(result.user, result.role);
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Gagal menghubungi peladen. Silakan periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 animate-bounce">
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Toshokan
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sistem Informasi Perpustakaan Digital
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 dark:bg-slate-700/50 p-1 rounded-xl">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              !isAdmin
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => {
              setIsAdmin(false);
              setError('');
            }}
          >
            <UserRound size={16} />
            Anggota
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              isAdmin
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => {
              setIsAdmin(true);
              setError('');
            }}
          >
            <ShieldAlert size={16} />
            Pustakawan (Admin)
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-100 dark:border-rose-950/40 flex items-start gap-2.5 leading-5 animate-pulse">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {isAdmin ? 'Username atau Email Admin' : 'Email / Nomor Identitas'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 dark:text-gray-500">
                  <UserRound size={18} />
                </span>
                <input
                  type="text"
                  required
                  placeholder={isAdmin ? 'Contoh: admin' : 'Contoh: anggota@email.com'}
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 dark:text-gray-500">
                  <KeyRound size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold shadow-md cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Menghubungkan...' : 'Masuk ke Sistem'}
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        {/* Footer actions */}
        {!isAdmin && (
          <div className="text-center pt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Belum terdaftar sebagai anggota?{' '}
            </span>
            <button
              onClick={onNavigateToRegister}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Ajukan Akun Mandiri
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
