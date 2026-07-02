import React, { useState } from 'react';
import { Calendar, Printer, FileText, Download, Info } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

export function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/sirkulasi/peminjaman?startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
        setHasGenerated(true);
      } else {
        alert('Gagal menghasilkan laporan.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const totalLoans = reportData.length;
  const activeLoans = reportData.filter(d => d.status_transaksi === 'Berjalan').length;
  const returnedLoans = reportData.filter(d => d.status_transaksi === 'Selesai').length;
  const pendingRequests = reportData.filter(d => d.status_transaksi === 'Pengajuan').length;
  
  const totalDenda = reportData.reduce((acc, curr) => acc + Number(curr.jumlah_denda || 0), 0);
  const totalDendaLunas = reportData
    .filter(d => d.status_denda === 'Lunas')
    .reduce((acc, curr) => acc + Number(curr.jumlah_denda || 0), 0);
  const totalDendaBelumLunas = totalDenda - totalDendaLunas;

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

  return (
    <div className="space-y-6">
      
      {/* Search Header - Non-Printable */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm print:hidden">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <FileText className="text-blue-600 dark:text-blue-400" size={22} />
          Kompilasi Laporan Sirkulasi
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Tarik data rekapitulasi transaksi peminjaman, pengembalian, dan denda berdasarkan rentang waktu tertentu.
        </p>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Tanggal Awal
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Tanggal Akhir
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 justify-center py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Menyusun...' : 'Buat Laporan'}
            </Button>

            {hasGenerated && reportData.length > 0 && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold flex items-center gap-2 border border-gray-200/50 dark:border-slate-600 transition-all cursor-pointer"
              >
                <Printer size={16} />
                Cetak
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Report Container */}
      {hasGenerated ? (
        reportData.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center">
            <Info className="text-amber-500 mb-2" size={32} />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Data Laporan Kosong</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Tidak ditemukan rekam jejak aktivitas sirkulasi pada rentang {formatDate(startDate)} s/d {formatDate(endDate)}.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
            
            {/* Report Document Header */}
            <div className="border-b border-gray-200 dark:border-slate-700/80 pb-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LAPORAN REKAPITULASI SIRKULASI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono uppercase">
                  Perpustakaan Digital Toshokan
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 font-semibold">
                  Periode Laporan: {formatDate(startDate)} s/d {formatDate(endDate)}
                </p>
              </div>
              <div className="text-right text-xs text-gray-400 font-mono">
                Dicetak pada: {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}
              </div>
            </div>

            {/* Aggregated KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Transaksi</span>
                <span className="block text-xl font-bold text-gray-900 dark:text-white mt-1">{totalLoans}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Selesai / Kembali</span>
                <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{returnedLoans}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Sedang Berjalan</span>
                <span className="block text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{activeLoans}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Denda Terbayar</span>
                <span className="block text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {formatCurrency(totalDendaLunas)}
                </span>
              </div>
            </div>

            {/* Table data */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">No. Transaksi</th>
                    <th className="py-3 px-4">Anggota</th>
                    <th className="py-3 px-4">Buku</th>
                    <th className="py-3 px-4">Tgl. Pinjam</th>
                    <th className="py-3 px-4">Tgl. Kembali</th>
                    <th className="py-3 px-4">Denda</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 dark:divide-slate-700/60">
                  {reportData.map((row) => (
                    <tr key={row.id_detail} className="text-gray-700 dark:text-gray-300">
                      <td className="py-3.5 px-4 font-mono text-xs">TRX#{row.id_transaksi}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{row.nama_lengkap}</div>
                        <div className="text-xs text-gray-400">{row.nomor_identitas}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium max-w-xs truncate">{row.judul_buku}</td>
                      <td className="py-3.5 px-4 text-xs">{formatDate(row.tanggal_pinjam)}</td>
                      <td className="py-3.5 px-4 text-xs">
                        {row.status_transaksi === 'Selesai' ? formatDate(row.tanggal_kembali) : (
                          <span className="text-gray-400 italic">Belum kembali</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono">
                        {Number(row.jumlah_denda) > 0 ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-rose-500">{formatCurrency(row.jumlah_denda)}</span>
                            <span className="text-[10px] text-gray-400 font-sans">({row.status_denda})</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge 
                          type={
                            row.status_transaksi === 'Selesai' ? 'success' : 
                            row.status_transaksi === 'Berjalan' ? 'primary' : 'warning'
                          }
                        >
                          {row.status_transaksi}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Sign-off for Printable Document */}
            <div className="hidden print:block pt-16 grid grid-cols-2 text-center text-sm">
              <div></div>
              <div className="ml-auto w-64 border-t border-gray-400 pt-2 text-gray-600">
                Pustakawan Perpustakaan
              </div>
            </div>

          </div>
        )
      ) : (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center">
          <FileText className="text-blue-200 dark:text-slate-700 mb-3 animate-pulse" size={48} />
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Laporan Belum Dibuat</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Silakan tentukan batas tanggal awal dan akhir di atas lalu klik tombol <strong>Buat Laporan</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
