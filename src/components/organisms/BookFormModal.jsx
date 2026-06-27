import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, PlusCircle } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';

export const BookFormModal = ({ isOpen, onClose, onSubmit, book, categories }) => {
  const [formData, setFormData] = useState({
    judul_buku: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: '',
    stok: '',
    id_kategori: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        judul_buku: book.judul_buku || '',
        pengarang: book.pengarang || '',
        penerbit: book.penerbit || '',
        tahun_terbit: book.tahun_terbit || '',
        stok: book.stok !== undefined ? book.stok : '',
        id_kategori: book.id_kategori || ''
      });
    } else {
      setFormData({
        judul_buku: '',
        pengarang: '',
        penerbit: '',
        tahun_terbit: new Date().getFullYear(),
        stok: '1',
        id_kategori: ''
      });
    }
    setErrors({});
  }, [book, isOpen]);

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
    if (!formData.judul_buku.trim()) newErrors.judul_buku = 'Judul buku wajib diisi';
    if (!formData.pengarang.trim()) newErrors.pengarang = 'Pengarang wajib diisi';
    if (!formData.penerbit.trim()) newErrors.penerbit = 'Penerbit wajib diisi';
    if (!formData.id_kategori) newErrors.id_kategori = 'Kategori wajib dipilih';
    
    const year = parseInt(formData.tahun_terbit, 10);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      newErrors.tahun_terbit = 'Tahun terbit tidak valid';
    }

    const stock = parseInt(formData.stok, 10);
    if (isNaN(stock) || stock < 0) {
      newErrors.stok = 'Stok tidak boleh negatif';
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

  const categoryOptions = categories.map(cat => ({
    value: cat.id_kategori,
    label: cat.nama_kategori
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-base/40">
          <div className="flex items-center gap-2 text-txt-base">
            {book ? <Edit3 className="w-5 h-5 text-brand-primary" /> : <PlusCircle className="w-5 h-5 text-brand-accent" />}
            <h2 className="text-base font-bold m-0">{book ? 'Edit Informasi Buku' : 'Tambah Koleksi Buku Baru'}</h2>
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
          <FormField label="Judul Buku" error={errors.judul_buku} required>
            <Input 
              name="judul_buku" 
              value={formData.judul_buku} 
              onChange={handleChange} 
              placeholder="Masukkan judul buku..." 
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pengarang" error={errors.pengarang} required>
              <Input 
                name="pengarang" 
                value={formData.pengarang} 
                onChange={handleChange} 
                placeholder="Nama pengarang..." 
              />
            </FormField>

            <FormField label="Penerbit" error={errors.penerbit} required>
              <Input 
                name="penerbit" 
                value={formData.penerbit} 
                onChange={handleChange} 
                placeholder="Nama penerbit..." 
              />
            </FormField>
          </div>

          <FormField label="Kategori" error={errors.id_kategori} required>
            <Select 
              name="id_kategori" 
              value={formData.id_kategori} 
              onChange={handleChange} 
              options={categoryOptions} 
              placeholder="Pilih Kategori Buku"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tahun Terbit" error={errors.tahun_terbit} required>
              <Input 
                name="tahun_terbit" 
                type="number"
                value={formData.tahun_terbit} 
                onChange={handleChange} 
                placeholder="Contoh: 2024" 
              />
            </FormField>

            <FormField label="Jumlah Stok" error={errors.stok} required>
              <Input 
                name="stok" 
                type="number"
                value={formData.stok} 
                onChange={handleChange} 
                placeholder="Contoh: 5" 
              />
            </FormField>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-4 border-t border-border-base pt-4">
            <Button variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit" variant={book ? 'primary' : 'accent'}>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
