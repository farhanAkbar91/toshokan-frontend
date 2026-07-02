import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/atoms/Button';

export function RegisterPage({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nomor_identitas: '',
    nama_lengkap: '',
    email: '',
    password: '',
    alamat: '',
    nomor_telepon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (
      !formData.nomor_identitas.trim() ||
      !formData.nama_lengkap.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.alamat.trim() ||
      !formData.nomor_telepon.trim()
    ) {
      setError('Harap isi semua kolom formulir pendaftaran.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setError('Gagal menghubungi peladen. Periksa koneksi jaringan Anda.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 animate-pulse">
            <Send size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Pendaftaran Dikirim!
          </h2>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-6">
            Akun mandiri Anda dengan Nomor Identitas <strong className="text-gray-900 dark:text-white">{formData.nomor_identitas}</strong> berhasil terdaftar dengan status <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">Menunggu Verifikasi</span>.
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 leading-5">
            Silakan serahkan berkas bukti identitas fisik ke meja pustakawan (admin) perpustakaan untuk mengaktifkan akun Anda.
          </p>
          <div className="mt-8">
            <Button
              onClick={onNavigateToLogin}
              className="w-full justify-center gap-2 py-2.5 rounded-xl cursor-pointer"
            >
              <ArrowLeft size={16} />
              Kembali ke Halaman Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300 py-12">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            <UserPlus size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Registrasi Anggota Baru
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Daftarkan diri Anda untuk mengakses katalog & sirkulasi buku secara daring
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-100 dark:border-rose-950/40 flex items-start gap-2.5 leading-5 animate-bounce">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Nomor Identitas (NIK/KTM/KTP)
              </label>
              <input
                type="text"
                name="nomor_identitas"
                required
                placeholder="Contoh: 187241001"
                value={formData.nomor_identitas}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_lengkap"
                required
                placeholder="Nama sesuai identitas"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Contoh: nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Nomor Telepon/WhatsApp
              </label>
              <input
                type="text"
                name="nomor_telepon"
                required
                placeholder="Contoh: 08123456789"
                value={formData.nomor_telepon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Kata Sandi Akun
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Alamat Tinggal
              </label>
              <textarea
                name="alamat"
                required
                rows={3}
                placeholder="Alamat lengkap saat ini"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col md:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onNavigateToLogin}
              className="flex-1 justify-center gap-2 py-2.5 rounded-xl cursor-pointer"
            >
              <ArrowLeft size={16} />
              Kembali
            </Button>
            <Button
              type="submit"
              className="flex-1 justify-center gap-2 py-2.5 rounded-xl cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Mengirim Data...' : 'Ajukan Akun Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
