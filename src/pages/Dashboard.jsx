import React from 'react';
import { BookOpen, Users, Clock, DollarSign, ArrowRightLeft, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/molecules/StatCard';
import { Badge } from '../components/atoms/Badge';

export const Dashboard = ({ books, members, loans }) => {
  // Compute analytics
  const totalBooks = books.reduce((acc, curr) => acc + (parseInt(curr.stok, 10) || 0), 0);
  const uniqueTitles = books.length;
  const totalMembers = members.length;
  
  const activeLoans = loans.filter(l => l.status_transaksi === 'Berjalan');
  const finishedLoans = loans.filter(l => l.status_transaksi === 'Selesai');
  
  const totalFines = loans.reduce((acc, curr) => {
    return acc + (parseFloat(curr.jumlah_denda) || 0);
  }, 0);

  // Format IDR Currency
  const formatIDR = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format Date ISO to human-readable
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <div className="flex flex-col gap-1 items-start">
        <h2 className="text-2xl font-black text-txt-base tracking-tight m-0">Ringkasan Dashboard</h2>
        <p className="text-sm text-txt-muted">Statistik perpustakaan Toshokan hari ini.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Judul Unik Buku"
          value={uniqueTitles}
          icon={BookOpen}
          description={`Total fisik buku: ${totalBooks} eksemplar`}
        />
        <StatCard
          title="Total Anggota"
          value={totalMembers}
          icon={Users}
          description="Terdaftar & teraktivasi otomatis"
        />
        <StatCard
          title="Peminjaman Aktif"
          value={activeLoans.length}
          icon={Clock}
          description="Buku sedang dipinjam anggota"
        />
        <StatCard
          title="Denda Terkumpul"
          value={formatIDR(totalFines)}
          icon={DollarSign}
          description="Keterlambatan pengembalian"
        />
      </div>

      {/* Main layout divided into Recent Transactions and Quick info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Left Side: Recent Activity (2/3 width) */}
        <div className="lg:col-span-2 bg-bg-surface border border-border-base rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border-base/60">
            <h3 className="text-base font-bold text-txt-base flex items-center gap-2 m-0">
              <ArrowRightLeft className="w-5 h-5 text-brand-primary" />
              <span>Aktivitas Sirkulasi Terkini</span>
            </h3>
            <span className="text-xs text-txt-muted font-semibold">Tabel Transaksi</span>
          </div>

          <div className="overflow-x-auto">
            {loans.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-txt-muted gap-2">
                <FileText className="w-12 h-12 stroke-[1.5]" />
                <span className="text-sm font-semibold">Belum ada transaksi peminjaman tercatat</span>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-base text-txt-muted font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4">Peminjam</th>
                    <th className="pb-3 px-4">Judul Buku</th>
                    <th className="pb-3 px-4">Tgl Pinjam</th>
                    <th className="pb-3 px-4">Tgl Kembali</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base/40">
                  {loans.slice(0, 5).map((loan) => (
                    <tr key={loan.id_detail} className="hover:bg-bg-base/20 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-txt-base">{loan.nama_lengkap}</div>
                        <div className="text-[10px] text-txt-muted">{loan.nomor_identitas}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-txt-base max-w-[200px] truncate">
                        {loan.judul_buku}
                      </td>
                      <td className="py-3.5 px-4 text-txt-muted text-xs">
                        {formatDate(loan.tanggal_pinjam)}
                      </td>
                      <td className="py-3.5 px-4 text-txt-muted text-xs">
                        {loan.status_buku === 'Dikembalikan' ? (
                          <span>{formatDate(loan.tanggal_kembali)}</span>
                        ) : (
                          <span className="text-brand-accent font-semibold">Batas: {formatDate(loan.batas_kembali)}</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <Badge variant={loan.status_transaksi === 'Selesai' ? 'success' : 'accent'}>
                          {loan.status_transaksi}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Quick info / Info panel (1/3 width) */}
        <div className="bg-bg-surface border border-border-base rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-base font-bold text-txt-base m-0 pb-3 border-b border-border-base/60">Panduan Operasional</h3>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-txt-base">Registrasi Anggota</h4>
                  <p className="text-xs text-txt-muted leading-relaxed">Daftarkan anggota baru di tab <strong>Data Anggota</strong>. Akun anggota akan otomatis aktif dan siap melakukan transaksi.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-txt-base">Sirkulasi & Pengembalian</h4>
                  <p className="text-xs text-txt-muted leading-relaxed">Kelola sirkulasi buku pada tab <strong>Sirkulasi</strong>. Klik buku yang sedang dipinjam untuk melakukan proses pengembalian dan menghitung denda otomatis jika terlambat.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-error/10 text-error shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-txt-base">Ketentuan Denda</h4>
                  <p className="text-xs text-txt-muted leading-relaxed">Keterlambatan pengembalian buku melewati batas tanggal kembali akan dikenakan denda akumulatif sebesar <strong>Rp 2.000 / hari</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
