import React, { useState } from 'react';
import { ArrowRightLeft, FileText, CheckCircle2, AlertCircle, HelpCircle, BookOpen, RefreshCcw, DollarSign, Calendar, Info, CornerDownLeft } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

export const Circulation = ({ loans, onOpenLoan, onReturnBook }) => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [selectedLoanForReturn, setSelectedLoanForReturn] = useState(null);

  // Filter loans
  const activeLoans = loans.filter(l => l.status_transaksi === 'Berjalan');
  const historyLoans = loans.filter(l => l.status_transaksi === 'Selesai');

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

  // Estimate fine (Denda) on Frontend for display
  const estimateFine = (batasKembali) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(batasKembali);
    limit.setHours(0, 0, 0, 0);
    
    const timeDiff = today.getTime() - limit.getTime();
    const lateDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (lateDays > 0) {
      return { days: lateDays, amount: lateDays * 2000 };
    }
    return { days: 0, amount: 0 };
  };

  const handleReturnClick = (loan) => {
    const fineInfo = estimateFine(loan.batas_kembali);
    setSelectedLoanForReturn({
      ...loan,
      estimatedFine: fineInfo.amount,
      lateDays: fineInfo.days
    });
  };

  const handleConfirmReturn = () => {
    if (selectedLoanForReturn) {
      onReturnBook({
        id_transaksi: selectedLoanForReturn.id_transaksi,
        id_buku: selectedLoanForReturn.id_buku
      });
      setSelectedLoanForReturn(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-txt-base tracking-tight m-0">Sirkulasi & Transaksi</h2>
          <p className="text-sm text-txt-muted">Lakukan peminjaman baru atau kelola pengembalian buku beserta denda keterlambatan.</p>
        </div>
        <Button onClick={onOpenLoan} variant="accent" className="shrink-0">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transaksi Peminjaman</span>
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border-base gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'border-brand-primary text-brand-primary dark:text-[#3B82F6]'
              : 'border-transparent text-txt-muted hover:text-txt-base'
          }`}
        >
          Peminjaman Berjalan ({activeLoans.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'border-brand-primary text-brand-primary dark:text-[#3B82F6]'
              : 'border-transparent text-txt-muted hover:text-txt-base'
          }`}
        >
          Riwayat Pengembalian ({historyLoans.length})
        </button>
      </div>

      {/* Main Table Content */}
      {activeTab === 'active' ? (
        activeLoans.length === 0 ? (
          <div className="bg-bg-surface border border-border-base rounded-2xl p-12 flex flex-col items-center justify-center text-txt-muted gap-3 shadow-sm">
            <RefreshCcw className="w-16 h-16 stroke-[1.2] text-txt-muted/70 animate-spin-slow" />
            <div className="flex flex-col gap-1 text-center">
              <span className="text-base font-bold text-txt-base">Tidak Ada Peminjaman Berjalan</span>
              <span className="text-xs text-txt-muted">Semua buku saat ini berada di rak perpustakaan.</span>
            </div>
          </div>
        ) : (
          <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-base bg-bg-base/30 text-txt-muted font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">ID Transaksi</th>
                    <th className="py-4 px-6">Anggota Peminjam</th>
                    <th className="py-4 px-6">Buku yang Dipinjam</th>
                    <th className="py-4 px-6">Batas Tanggal</th>
                    <th className="py-4 px-6">Estimasi Denda</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base/40">
                  {activeLoans.map((loan) => {
                    const fine = estimateFine(loan.batas_kembali);
                    const isOverdue = fine.amount > 0;
                    return (
                      <tr key={loan.id_detail} className="hover:bg-bg-base/20 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-txt-muted font-bold">
                          #{loan.id_transaksi}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-txt-base leading-snug">{loan.nama_lengkap}</div>
                          <div className="text-[10px] text-txt-muted">{loan.nomor_identitas}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-txt-base max-w-xs truncate">
                          {loan.judul_buku}
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold">
                          <div className="flex flex-col">
                            <span className="text-txt-muted">Pinjam: {formatDate(loan.tanggal_pinjam)}</span>
                            <span className={isOverdue ? 'text-error font-bold' : 'text-brand-accent'}>
                              Batas: {formatDate(loan.batas_kembali)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {isOverdue ? (
                            <Badge variant="error" className="font-mono text-xs">
                              {formatIDR(fine.amount)} ({fine.days} hari)
                            </Badge>
                          ) : (
                            <span className="text-xs text-success font-bold">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button 
                            onClick={() => handleReturnClick(loan)} 
                            variant={isOverdue ? 'danger' : 'primary'}
                            className="text-xs py-1.5 px-3 font-bold"
                          >
                            <CornerDownLeft className="w-3.5 h-3.5" />
                            <span>Kembalikan</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        historyLoans.length === 0 ? (
          <div className="bg-bg-surface border border-border-base rounded-2xl p-12 flex flex-col items-center justify-center text-txt-muted gap-3 shadow-sm">
            <FileText className="w-16 h-16 stroke-[1.2] text-txt-muted/70" />
            <div className="flex flex-col gap-1 text-center">
              <span className="text-base font-bold text-txt-base">Riwayat Kosong</span>
              <span className="text-xs text-txt-muted">Belum ada pengembalian buku yang diselesaikan.</span>
            </div>
          </div>
        ) : (
          <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-base bg-bg-base/30 text-txt-muted font-bold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">ID Transaksi</th>
                    <th className="py-4 px-6">Anggota Peminjam</th>
                    <th className="py-4 px-6">Buku yang Dipinjam</th>
                    <th className="py-4 px-6">Tgl Pinjam</th>
                    <th className="py-4 px-6">Tgl Kembali</th>
                    <th className="py-4 px-6 text-right">Denda Terbayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base/40">
                  {historyLoans.map((loan) => {
                    const fineAmount = parseFloat(loan.jumlah_denda) || 0;
                    return (
                      <tr key={loan.id_detail} className="hover:bg-bg-base/20 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-txt-muted font-bold">
                          #{loan.id_transaksi}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-txt-base leading-snug">{loan.nama_lengkap}</div>
                          <div className="text-[10px] text-txt-muted">{loan.nomor_identitas}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-txt-base max-w-xs truncate">
                          {loan.judul_buku}
                        </td>
                        <td className="py-4 px-6 text-txt-muted text-xs">
                          {formatDate(loan.tanggal_pinjam)}
                        </td>
                        <td className="py-4 px-6 text-success text-xs font-semibold">
                          {formatDate(loan.tanggal_kembali)}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-semibold">
                          {fineAmount > 0 ? (
                            <Badge variant="error">{formatIDR(fineAmount)}</Badge>
                          ) : (
                            <span className="text-txt-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Return Confirmation Dialog Modal */}
      {selectedLoanForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="w-full max-w-md bg-bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden animate-slide-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-base/40">
              <div className="flex items-center gap-2 text-txt-base">
                <CornerDownLeft className="w-5 h-5 text-brand-primary" />
                <h2 className="text-base font-bold m-0">Konfirmasi Pengembalian</h2>
              </div>
              <button 
                onClick={() => setSelectedLoanForReturn(null)}
                className="p-1 rounded-lg hover:bg-bg-base text-txt-muted hover:text-txt-base transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-txt-muted uppercase tracking-wider">Judul Buku</span>
                <p className="text-sm font-bold text-txt-base bg-bg-base/50 border border-border-base/55 p-3 rounded-lg flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>{selectedLoanForReturn.judul_buku}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-txt-muted uppercase tracking-wider">Anggota</span>
                  <span className="text-xs font-semibold text-txt-base">{selectedLoanForReturn.nama_lengkap}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-txt-muted uppercase tracking-wider">Tanggal Pinjam</span>
                  <span className="text-xs text-txt-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(selectedLoanForReturn.tanggal_pinjam)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-border-base/50 pt-3">
                <span className="text-xs font-bold text-txt-muted uppercase tracking-wider">Tanggal Batas</span>
                <span className="text-xs font-semibold text-brand-accent flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(selectedLoanForReturn.batas_kembali)}
                </span>
              </div>

              {/* Overdue/Fine Warning */}
              {selectedLoanForReturn.estimatedFine > 0 ? (
                <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex gap-3 items-start mt-2">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-error uppercase tracking-wider">Keterlambatan Terdeteksi!</h4>
                    <p className="text-xs text-txt-base leading-relaxed">
                      Pengembalian terlambat selama <strong>{selectedLoanForReturn.lateDays} hari</strong>. Anggota diwajibkan membayar denda keterlambatan sebesar:
                    </p>
                    <span className="text-base font-extrabold text-error font-mono flex items-center gap-1 mt-1">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      {formatIDR(selectedLoanForReturn.estimatedFine)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex gap-3 items-start mt-2">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-xs font-bold text-success uppercase tracking-wider">Tepat Waktu</h4>
                    <p className="text-xs text-txt-muted leading-relaxed">
                      Buku dikembalikan sebelum batas tanggal kembali. Tidak dikenakan denda denda keterlambatan (<strong>Bebas Denda</strong>).
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-4 border-t border-border-base pt-4">
                <Button variant="secondary" onClick={() => setSelectedLoanForReturn(null)}>Batal</Button>
                <Button 
                  onClick={handleConfirmReturn} 
                  variant={selectedLoanForReturn.estimatedFine > 0 ? 'danger' : 'primary'}
                >
                  Confirm Pengembalian
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
