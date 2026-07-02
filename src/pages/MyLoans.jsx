import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, Calendar, RefreshCcw, CheckCircle2, CircleDollarSign } from 'lucide-react';
import { Badge } from '../components/atoms/Badge';

export function MyLoans({ currentUser }) {
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchMyLoans();
    }
  }, [currentUser]);

  const fetchMyLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sirkulasi/peminjaman?id_anggota=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyLoans(data);
      }
    } catch (error) {
      console.error('Error fetching member loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (val) => {
    if (!val) return '-';
    return new Date(val).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculations
  const activeLoans = myLoans.filter(l => l.status_transaksi === 'Berjalan');
  const pendingRequests = myLoans.filter(l => l.status_transaksi === 'Pengajuan');
  const unpaidFines = myLoans.filter(l => Number(l.jumlah_denda) > 0 && l.status_denda === 'Belum Lunas');
  const totalUnpaidFineAmount = unpaidFines.reduce((acc, curr) => acc + Number(curr.jumlah_denda), 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Loan Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Pinjaman Aktif</span>
            <span className="block text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{activeLoans.length} Buku</span>
          </div>
        </div>

        {/* Pending Approval Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <RefreshCcw size={24} className={pendingRequests.length > 0 ? 'animate-spin' : ''} />
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Menunggu Persetujuan</span>
            <span className="block text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{pendingRequests.length} Pengajuan</span>
          </div>
        </div>

        {/* Unpaid Fines Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Tunggakan Denda</span>
            <span className={`block text-2xl font-bold mt-0.5 ${totalUnpaidFineAmount > 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
              {formatCurrency(totalUnpaidFineAmount)}
            </span>
          </div>
        </div>
      </div>

      {totalUnpaidFineAmount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs rounded-xl border border-amber-100 dark:border-amber-900/40 flex items-start gap-2.5 leading-5">
          <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <span className="font-bold block">Pemberitahuan Tunggakan Denda</span>
            Anda memiliki denda keterlambatan pengembalian buku yang belum diselesaikan. Harap segera melakukan pembayaran tunai di konter pustakawan agar hak peminjaman Anda kembali normal.
          </div>
        </div>
      )}

      {/* Loans logs */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Riwayat Sirkulasi Buku Anda</h3>

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-500">Memuat riwayat peminjaman...</div>
        ) : myLoans.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">Anda belum memiliki riwayat sirkulasi di perpustakaan ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700/80 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-2">Buku</th>
                  <th className="pb-3 px-2">Tanggal Pinjam</th>
                  <th className="pb-3 px-2">Tenggat Waktu</th>
                  <th className="pb-3 px-2">Tanggal Kembali</th>
                  <th className="pb-3 px-2">Denda</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/40">
                {myLoans.map((loan) => (
                  <tr key={loan.id_detail} className="text-gray-700 dark:text-gray-300">
                    <td className="py-4 px-2 font-medium text-gray-900 dark:text-white">
                      {loan.judul_buku}
                    </td>
                    <td className="py-4 px-2 text-xs">
                      {formatDate(loan.tanggal_pinjam)}
                    </td>
                    <td className="py-4 px-2 text-xs">
                      {formatDate(loan.batas_kembali)}
                    </td>
                    <td className="py-4 px-2 text-xs">
                      {loan.status_transaksi === 'Selesai' ? formatDate(loan.tanggal_kembali) : (
                        <span className="text-gray-400 italic">Belum dikembalikan</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-xs font-mono">
                      {Number(loan.jumlah_denda) > 0 ? (
                        <div className="flex flex-col">
                          <span className={`font-semibold ${loan.status_denda === 'Belum Lunas' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {formatCurrency(loan.jumlah_denda)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-sans">({loan.status_denda})</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-2">
                      <Badge
                        type={
                          loan.status_transaksi === 'Selesai' ? 'success' :
                          loan.status_transaksi === 'Berjalan' ? 'primary' : 'warning'
                        }
                      >
                        {loan.status_transaksi === 'Pengajuan' ? 'Menunggu Approval' : loan.status_transaksi}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
