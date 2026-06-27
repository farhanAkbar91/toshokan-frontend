import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const MemberFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nomor_identitas: '',
    nama_lengkap: '',
    alamat: '',
    nomor_telepon: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nomor_identitas: '',
        nama_lengkap: '',
        alamat: '',
        nomor_telepon: ''
      });
      setErrors({});
    }
  }, [isOpen]);

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
    if (!formData.nomor_identitas.trim()) newErrors.nomor_identitas = 'Nomor identitas wajib diisi';
    if (!formData.nama_lengkap.trim()) newErrors.nama_lengkap = 'Nama lengkap wajib diisi';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.nomor_telepon.trim()) newErrors.nomor_telepon = 'Nomor telepon wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-md bg-bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-base/40">
          <div className="flex items-center gap-2 text-txt-base">
            <UserPlus className="w-5 h-5 text-brand-primary" />
            <h2 className="text-base font-bold m-0">Registrasi Anggota Baru</h2>
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
          <FormField label="Nomor Identitas (NIK/KTP/NIM)" error={errors.nomor_identitas} required>
            <Input 
              name="nomor_identitas" 
              value={formData.nomor_identitas} 
              onChange={handleChange} 
              placeholder="Contoh: 3171012345670001" 
            />
          </FormField>

          <FormField label="Nama Lengkap" error={errors.nama_lengkap} required>
            <Input 
              name="nama_lengkap" 
              value={formData.nama_lengkap} 
              onChange={handleChange} 
              placeholder="Masukkan nama lengkap anggota..." 
            />
          </FormField>

          <FormField label="Nomor Telepon" error={errors.nomor_telepon} required>
            <Input 
              name="nomor_telepon" 
              type="tel"
              value={formData.nomor_telepon} 
              onChange={handleChange} 
              placeholder="Contoh: 08123456789" 
            />
          </FormField>

          <FormField label="Alamat Tinggal" error={errors.alamat} required>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap tinggal..."
              rows="3"
              className="w-full px-3 py-2.5 rounded-lg bg-bg-base border border-border-base text-txt-base placeholder:text-txt-muted/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200 text-sm"
            />
          </FormField>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-4 border-t border-border-base pt-4">
            <Button variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary">
              <Save className="w-4 h-4" />
              <span>Daftarkan Anggota</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
