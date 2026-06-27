import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';

export const LoanFormModal = ({ isOpen, onClose, onSubmit, books = [], members = [], preselectedBookId = '' }) => {
  const [formData, setFormData] = useState({
    id_anggota: '',
    id_buku: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id_anggota: '',
        id_buku: preselectedBookId || ''
      });
      setErrors({});
    }
  }, [isOpen, preselectedBookId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.id_anggota) newErrors.id_anggota = 'Anggota wajib dipilih';
    if (!formData.id_buku) newErrors.id_buku = 'Buku wajib dipilih';

    // Cek apakah buku yang dipilih memiliki stok
    const selectedBook = books.find(b => b.id_buku.toString() === formData.id_buku.toString());
    if (selectedBook && selectedBook.stok <= 0) {
      newErrors.id_buku = 'Stok buku ini sedang kosong, tidak dapat dipinjam';
    }

    // Cek apakah anggota yang dipilih aktif
    const selectedMember = members.find(m => m.id_anggota.toString() === formData.id_anggota.toString());
    if (selectedMember && selectedMember.status_akun !== 'Aktif') {
      newErrors.id_anggota = 'Status akun anggota ini tidak aktif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const bookOptions = books
    .map(b => ({
      value: b.id_buku,
      label: `${b.judul_buku} (Stok: ${b.stok})`
    }));

  const memberOptions = members.map(m => ({
    value: m.id_anggota,
    label: `${m.nama_lengkap} (${m.nomor_identitas}) - Status: ${m.status_akun}`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-md bg-bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-base/40">
          <div className="flex items-center gap-2 text-txt-base">
            <ArrowRight className="w-5 h-5 text-brand-primary" />
            <h2 className="text-base font-bold m-0">Proses Peminjaman Buku</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bg-base text-txt-muted hover:text-txt-base transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <FormField label="Pilih Anggota Perpustakaan" error={errors.id_anggota} required>
            <Select 
              name="id_anggota" 
              value={formData.id_anggota} 
              onChange={handleChange} 
              options={memberOptions} 
              placeholder="Pilih Anggota Peminjam"
            />
          </FormField>

          <FormField label="Pilih Buku yang Dipinjam" error={errors.id_buku} required>
            <Select 
              name="id_buku" 
              value={formData.id_buku} 
              onChange={handleChange} 
              options={bookOptions} 
              placeholder="Pilih Buku"
              disabled={!!preselectedBookId}
            />
          </FormField>

          <div className="bg-bg-base/60 border border-border-base/50 p-4 rounded-xl flex flex-col gap-1.5 mt-2">
            <span className="text-xs font-bold text-txt-muted uppercase tracking-wider">Ketentuan Sirkulasi</span>
            <ul className="text-xs text-txt-muted list-disc list-inside flex flex-col gap-1">
              <li>Durasi peminjaman standar adalah <strong>7 hari</strong>.</li>
              <li>Denda keterlambatan pengembalian buku adalah <strong>Rp 2.000 per hari</strong>.</li>
              <li>Pastikan kondisi fisik buku diperiksa sebelum diberikan ke anggota.</li>
            </ul>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-4 border-t border-border-base pt-4">
            <Button variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary">
              <Check className="w-4 h-4" />
              <span>Proses Peminjaman</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
