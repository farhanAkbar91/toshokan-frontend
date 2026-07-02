import React, { useState, useEffect } from 'react';
import { Layout } from './components/templates/Layout';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { Members } from './pages/Members';
import { Circulation } from './pages/Circulation';
import { Reports } from './pages/Reports';
import { MyLoans } from './pages/MyLoans';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
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

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || '';
  });
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Navigation state
  const [activePage, setActivePage] = useState(() => {
    const savedRole = localStorage.getItem('role');
    return savedRole === 'admin' ? 'dashboard' : 'books';
  });

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

  // Load initial data on login
  useEffect(() => {
    if (currentUser) {
      fetchCategories();
      fetchBooks();
      if (role === 'admin') {
        fetchMembers();
      }
      fetchLoans();
    }
  }, [currentUser, role]);

  // Show toast utility
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- Login / Logout Handlers ---
  const handleLoginSuccess = (user, userRole) => {
    setCurrentUser(user);
    setRole(userRole);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', userRole);
    setActivePage(userRole === 'admin' ? 'dashboard' : 'books');
    showToast(`Selamat datang kembali, ${user.nama}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole('');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuthView('login');
    showToast('Anda berhasil keluar dari sistem.', 'success');
  };

  // --- API Fetches ---
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategori');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
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
      const url = role === 'admin' ? '/api/sirkulasi/peminjaman' : `/api/sirkulasi/peminjaman?id_anggota=${currentUser.id}`;
      const res = await fetch(url);
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
        fetchLoans();
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

  const handleToggleMemberStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/anggota/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_akun: newStatus })
      });
      const result = await res.json();
      if (res.ok) {
        showToast(result.message || 'Status anggota berhasil diperbarui', 'success');
        fetchMembers();
      } else {
        showToast(result.message || 'Gagal memperbarui status anggota', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memperbarui status anggota', 'error');
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
        fetchBooks();
      } else {
        showToast(result.message || 'Gagal memproses peminjaman', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memproses peminjaman', 'error');
    }
  };

  const handleApproveLoan = async (id) => {
    try {
      const res = await fetch(`/api/sirkulasi/${id}/setujui`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      if (res.ok) {
        showToast(result.message || 'Peminjaman disetujui pustakawan!', 'success');
        fetchLoans();
        fetchBooks();
      } else {
        showToast(result.message || 'Gagal menyetujui peminjaman', 'error');
      }
    } catch (error) {
      showToast('Kesalahan koneksi saat menyetujui peminjaman', 'error');
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
        fetchBooks();
      } else {
        showToast(result.message || 'Gagal memproses pengembalian buku', 'error');
      }
    } catch (err) {
      showToast('Kesalahan koneksi saat memproses pengembalian', 'error');
    }
  };

  const handlePayFine = async (id) => {
    try {
      const res = await fetch(`/api/sirkulasi/denda/${id}/bayar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      if (res.ok) {
        showToast(result.message || 'Denda berhasil dilunasi!', 'success');
        fetchLoans();
      } else {
        showToast(result.message || 'Gagal melunasi denda', 'error');
      }
    } catch (error) {
      showToast('Kesalahan koneksi saat melunasi denda', 'error');
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
    if (role === 'anggota') {
      const selectedBook = books.find(b => b.id_buku.toString() === bookId.toString());
      if (!selectedBook) return;

      const confirmCheckout = window.confirm(`Apakah Anda yakin ingin mengajukan peminjaman mandiri untuk buku "${selectedBook.judul_buku}"?`);
      if (confirmCheckout) {
        handleCreateLoan({
          id_anggota: currentUser.id,
          id_buku: bookId,
          status: 'Pengajuan'
        });
      }
    } else {
      setPreselectedBookId(bookId.toString());
      setIsLoanModalOpen(true);
    }
  };

  // Render appropriate view based on active tab & user role
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return role === 'admin' ? (
          <Dashboard books={books} members={members} loans={loans} />
        ) : (
          <Books
            books={books}
            categories={categories}
            role={role}
            onOpenBorrow={openLoanForBook}
            onSearch={fetchBooks}
          />
        );
      case 'books':
        return (
          <Books
            books={books}
            categories={categories}
            role={role}
            onAdd={openAddBook}
            onEdit={openEditBook}
            onDelete={handleDeleteBook}
            onOpenBorrow={openLoanForBook}
            onSearch={fetchBooks}
          />
        );
      case 'members':
        return role === 'admin' ? (
          <Members members={members} onAdd={() => setIsMemberModalOpen(true)} onToggleStatus={handleToggleMemberStatus} />
        ) : null;
      case 'circulation':
        return role === 'admin' ? (
          <Circulation
            loans={loans}
            onOpenLoan={() => setIsLoanModalOpen(true)}
            onReturnBook={handleReturnBook}
            onApproveLoan={handleApproveLoan}
            onPayFine={handlePayFine}
          />
        ) : null;
      case 'reports':
        return role === 'admin' ? <Reports /> : null;
      case 'myloans':
        return role === 'anggota' ? <MyLoans currentUser={currentUser} /> : null;
      default:
        return role === 'admin' ? (
          <Dashboard books={books} members={members} loans={loans} />
        ) : (
          <Books
            books={books}
            categories={categories}
            role={role}
            onOpenBorrow={openLoanForBook}
            onSearch={fetchBooks}
          />
        );
    }
  };

  // --- Auth Render Guard ---
  if (!currentUser) {
    if (authView === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      isDark={isDark}
      toggleTheme={() => setIsDark(!isDark)}
      currentUser={currentUser}
      role={role}
      onLogout={handleLogout}
    >
      {renderPageContent()}

      {/* Book Add/Edit Modal (Admin Only) */}
      {role === 'admin' && (
        <BookFormModal
          isOpen={isBookModalOpen}
          onClose={() => { setIsBookModalOpen(false); setEditingBook(null); }}
          onSubmit={handleAddOrEditBook}
          book={editingBook}
          categories={categories}
        />
      )}

      {/* Member Registration Modal (Admin Only) */}
      {role === 'admin' && (
        <MemberFormModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          onSubmit={handleRegisterMember}
        />
      )}

      {/* Peminjaman Checkout Modal (Admin Only) */}
      {role === 'admin' && (
        <LoanFormModal
          isOpen={isLoanModalOpen}
          onClose={() => { setIsLoanModalOpen(false); setPreselectedBookId(''); }}
          onSubmit={handleCreateLoan}
          books={books}
          members={members}
          preselectedBookId={preselectedBookId}
        />
      )}

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
