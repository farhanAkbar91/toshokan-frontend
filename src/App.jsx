import React, { useState, useEffect } from 'react';
import { Layout } from './components/templates/Layout';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { Members } from './pages/Members';
import { Circulation } from './pages/Circulation';
import { BookFormModal } from './components/organisms/BookFormModal';
import { MemberFormModal } from './components/organisms/MemberFormModal';
import { LoanFormModal } from './components/organisms/LoanFormModal';
import { Toast } from './components/molecules/Toast';

function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Navigation state
  const [activePage, setActivePage] = useState('dashboard');

  // Backend Data state
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preselectedBookId, setPreselectedBookId] = useState('');

  // Toast state
  const [toast, setToast] = useState(null);

  // Apply dark class to html tag
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchBooks();
    fetchMembers();
    fetchLoans();
  }, []);

  // Show toast utility
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- API Fetches ---
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategori');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Gagal mengambil data kategori');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async (keyword = '') => {
    try {
      const url = keyword ? `/api/buku?keyword=${encodeURIComponent(keyword)}` : '/api/buku';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        showToast('Gagal memuat daftar buku dari server', 'error');
      }
    } catch (err) {
      showToast('Tidak dapat terhubung ke server backend', 'error');
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/anggota');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        showToast('Gagal memuat daftar anggota', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/sirkulasi/peminjaman');
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
      } else {
        showToast('Gagal memuat riwayat sirkulasi', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Operations ---
  const handleAddOrEditBook = async (formData) => {
    try {
      const isEdit = !!editingBook;
      const url = isEdit ? `/api/buku/${editingBook.id_buku}` : '/api/buku';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        showToast(result.message || (isEdit ? 'Buku berhasil diperbarui' : 'Buku baru berhasil ditambahkan'), 'success');
        setIsBookModalOpen(false);
        setEditingBook(null);
        fetchBooks();
      } else {
        showToast(result.message || 'Gagal menyimpan data buku', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat menyimpan buku', 'error');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini dari katalog?')) return;
    try {
      const res = await fetch(`/api/buku/${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok) {
        showToast(result.message || 'Buku berhasil dihapus', 'success');
        fetchBooks();
        fetchLoans(); // Refresh loans to see updated details if any
      } else {
        showToast(result.message || 'Gagal menghapus buku', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat menghapus buku', 'error');
    }
  };

  const handleRegisterMember = async (formData) => {
    try {
      const res = await fetch('/api/anggota/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        showToast(result.message || 'Anggota baru berhasil didaftarkan & diaktifkan!', 'success');
        setIsMemberModalOpen(false);
        fetchMembers();
      } else {
        showToast(result.message || 'Gagal meregistrasi anggota', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat mendaftarkan anggota', 'error');
    }
  };

  const handleCreateLoan = async (formData) => {
    try {
      const res = await fetch('/api/sirkulasi/pinjam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        showToast(result.message || 'Peminjaman berhasil diproses!', 'success');
        setIsLoanModalOpen(false);
        setPreselectedBookId('');
        fetchLoans();
        fetchBooks(); // Refresh stock
      } else {
        showToast(result.message || 'Gagal memproses peminjaman', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memproses peminjaman', 'error');
    }
  };

  const handleReturnBook = async (formData) => {
    try {
      const res = await fetch('/api/sirkulasi/kembali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        const fineText = result.data.jumlah_denda > 0 
          ? ` beserta denda ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.data.jumlah_denda)}`
          : '';
        showToast(`Buku berhasil dikembalikan${fineText}!`, 'success');
        fetchLoans();
        fetchBooks(); // Restore stock
      } else {
        showToast(result.message || 'Gagal memproses pengembalian buku', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memproses pengembalian', 'error');
    }
  };

  // Open modals helper
  const openEditBook = (book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const openAddBook = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const openLoanForBook = (bookId) => {
    setPreselectedBookId(bookId.toString());
    setIsLoanModalOpen(true);
  };

  // Render appropriate view based on active tab
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard books={books} members={members} loans={loans} />;
      case 'books':
        return (
          <Books
            books={books}
            categories={categories}
            onAdd={openAddBook}
            onEdit={openEditBook}
            onDelete={handleDeleteBook}
            onOpenBorrow={openLoanForBook}
            onSearch={fetchBooks}
          />
        );
      case 'members':
        return <Members members={members} onAdd={() => setIsMemberModalOpen(true)} />;
      case 'circulation':
        return (
          <Circulation
            loans={loans}
            onOpenLoan={() => setIsLoanModalOpen(true)}
            onReturnBook={handleReturnBook}
          />
        );
      default:
        return <Dashboard books={books} members={members} loans={loans} />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      isDark={isDark}
      toggleTheme={() => setIsDark(!isDark)}
    >
      {renderPageContent()}

      {/* Book Add/Edit Modal */}
      <BookFormModal
        isOpen={isBookModalOpen}
        onClose={() => { setIsBookModalOpen(false); setEditingBook(null); }}
        onSubmit={handleAddOrEditBook}
        book={editingBook}
        categories={categories}
      />

      {/* Member Registration Modal */}
      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSubmit={handleRegisterMember}
      />

      {/* Peminjaman Checkout Modal */}
      <LoanFormModal
        isOpen={isLoanModalOpen}
        onClose={() => { setIsLoanModalOpen(false); setPreselectedBookId(''); }}
        onSubmit={handleCreateLoan}
        books={books}
        members={members}
        preselectedBookId={preselectedBookId}
      />

      {/* Floating notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}

export default App;
