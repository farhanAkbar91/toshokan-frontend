import React, { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2, BookOpen, User, Building, Calendar, Archive, Bookmark, Send } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Badge } from '../components/atoms/Badge';

export const Books = ({ books, categories, onAdd, onEdit, onDelete, onOpenBorrow, onSearch, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id_kategori.toString() === id.toString());
    return cat ? cat.nama_kategori : 'Umum';
  };

  const isAdmin = role === 'admin';

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-txt-base tracking-tight m-0">
            {isAdmin ? 'Manajemen Koleksi Buku' : 'Katalog Perpustakaan'}
          </h2>
          <p className="text-sm text-txt-muted">
            {isAdmin 
              ? 'Kelola koleksi buku, tambah stok, edit info, atau proses peminjaman langsung.'
              : 'Telusuri koleksi buku yang tersedia dan ajukan peminjaman secara mandiri.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => onAdd()} variant="accent" className="shrink-0 cursor-pointer">
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Buku</span>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex bg-bg-surface border border-border-base rounded-2xl p-4 shadow-sm items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari buku berdasarkan judul, pengarang, penerbit, atau kategori..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="bg-bg-surface border border-border-base rounded-2xl p-12 flex flex-col items-center justify-center text-txt-muted gap-3 shadow-sm">
          <BookOpen className="w-16 h-16 stroke-[1.2] text-txt-muted/70" />
          <div className="flex flex-col gap-1 text-center">
            <span className="text-base font-bold text-txt-base">Koleksi Buku Kosong</span>
            <span className="text-xs text-txt-muted">Belum ada buku yang terdaftar atau keyword pencarian tidak cocok.</span>
          </div>
          {searchTerm && (
            <Button variant="secondary" onClick={() => { setSearchTerm(''); onSearch(''); }} className="mt-2 text-xs cursor-pointer">
              Reset Pencarian
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const hasStock = book.stok > 0;
            return (
              <div 
                key={book.id_buku} 
                className="bg-bg-surface border border-border-base rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary/10 group-hover:bg-brand-primary/40 transition-colors" />

                {/* Card Content */}
                <div className="flex flex-col gap-4">
                  {/* Category Badge & Stock */}
                  <div className="flex justify-between items-center">
                    <Badge variant="info" className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
                      <Bookmark className="w-3 h-3" />
                      {book.nama_kategori || getCategoryName(book.id_kategori)}
                    </Badge>
                    <Badge variant={hasStock ? 'success' : 'error'}>
                      {hasStock ? `${book.stok} Tersedia` : 'Stok Habis'}
                    </Badge>
                  </div>

                  {/* Title & Author */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-extrabold text-txt-base line-clamp-2 m-0 group-hover:text-brand-primary transition-colors leading-snug">
                      {book.judul_buku}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-txt-muted mt-1 font-semibold">
                      <User className="w-3.5 h-3.5" />
                      <span>{book.pengarang}</span>
                    </div>
                  </div>

                  {/* Publisher & Year details */}
                  <div className="flex flex-col gap-1 border-t border-border-base/50 pt-3 text-xs text-txt-muted">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Penerbit: {book.penerbit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Tahun Terbit: {book.tahun_terbit}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex items-center justify-between border-t border-border-base/50 pt-4 mt-auto">
                  {isAdmin ? (
                    <>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit(book)}
                          className="p-2 rounded-lg bg-bg-base border border-border-base/60 text-txt-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all cursor-pointer"
                          title="Edit Buku"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(book.id_buku)}
                          className="p-2 rounded-lg bg-bg-base border border-border-base/60 text-txt-muted hover:text-error hover:border-error/30 transition-all cursor-pointer"
                          title="Hapus Buku"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Button
                        onClick={() => onOpenBorrow(book.id_buku)}
                        variant={hasStock ? 'primary' : 'secondary'}
                        disabled={!hasStock}
                        className="text-xs py-1.5 px-3 font-bold cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Pinjamkan</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => onOpenBorrow(book.id_buku)}
                      variant={hasStock ? 'primary' : 'secondary'}
                      disabled={!hasStock}
                      className="text-xs py-2 px-4 font-bold w-full justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{hasStock ? 'Ajukan Peminjaman Mandiri' : 'Stok Habis'}</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
