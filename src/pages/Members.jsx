import React, { useState } from 'react';
import { UserPlus, Users, Phone, MapPin, ShieldCheck, Mail, ClipboardList, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

export const Members = ({ members, onAdd, onToggleStatus }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'

  // Filter members
  const pendingMembers = members.filter(m => m.status_akun === 'Tidak Aktif');
  const activeMembers = members.filter(m => m.status_akun === 'Aktif');

  const displayedMembers = activeTab === 'pending' ? pendingMembers : members;

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-txt-base tracking-tight m-0">Daftar Anggota</h2>
          <p className="text-sm text-txt-muted">Registrasi anggota baru atau verifikasi pendaftaran akun mandiri.</p>
        </div>
        <Button onClick={onAdd} variant="primary" className="shrink-0 cursor-pointer">
          <UserPlus className="w-4 h-4" />
          <span>Registrasi Baru</span>
        </Button>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-border-base gap-6 text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-txt-muted hover:text-txt-base'
          }`}
        >
          Semua Anggota ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 font-semibold border-b-2 transition-all cursor-pointer relative ${
            activeTab === 'pending'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-txt-muted hover:text-txt-base'
          }`}
        >
          Menunggu Verifikasi ({pendingMembers.length})
          {pendingMembers.length > 0 && (
            <span className="absolute -top-1 -right-4 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* Members Board */}
      {displayedMembers.length === 0 ? (
        <div className="bg-bg-surface border border-border-base rounded-2xl p-12 flex flex-col items-center justify-center text-txt-muted gap-3 shadow-sm">
          <Users className="w-16 h-16 stroke-[1.2] text-txt-muted/70" />
          <div className="flex flex-col gap-1 text-center">
            <span className="text-base font-bold text-txt-base">
              {activeTab === 'pending' ? 'Tidak Ada Antrean Verifikasi' : 'Belum Ada Anggota'}
            </span>
            <span className="text-xs text-txt-muted">
              {activeTab === 'pending' 
                ? 'Semua akun pendaftar mandiri telah diverifikasi & diaktifkan.' 
                : 'Belum ada anggota perpustakaan yang terdaftar. Registrasikan sekarang.'}
            </span>
          </div>
          {activeTab === 'all' && (
            <Button onClick={onAdd} variant="accent" className="mt-2 text-xs cursor-pointer">
              Daftarkan Anggota Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-base bg-bg-base/30 text-txt-muted font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">ID / Identitas</th>
                  <th className="py-4 px-6">Nama Lengkap</th>
                  <th className="py-4 px-6">Kontak & Email</th>
                  <th className="py-4 px-6">Alamat</th>
                  <th className="py-4 px-6">Status Akun</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base/40">
                {displayedMembers.map((member) => (
                  <tr key={member.id_anggota} className="hover:bg-bg-base/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-brand-primary font-bold">
                      <div className="flex flex-col">
                        <span>#{member.id_anggota}</span>
                        <span className="text-txt-muted font-medium text-[10px]">{member.nomor_identitas}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-txt-base">
                      {member.nama_lengkap}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 text-txt-base font-semibold">
                          <Phone className="w-3.5 h-3.5 text-txt-muted" />
                          <span>{member.nomor_telepon}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-txt-muted">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="lowercase">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-txt-muted text-xs max-w-xs truncate" title={member.alamat}>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-txt-muted shrink-0" />
                        <span className="truncate">{member.alamat}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={member.status_akun === 'Aktif' ? 'success' : 'error'}>
                        <div className="flex items-center gap-1">
                          {member.status_akun === 'Aktif' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <ShieldAlert className="w-3 h-3" />
                          )}
                          <span>{member.status_akun}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {member.status_akun === 'Tidak Aktif' ? (
                        <button
                          onClick={() => onToggleStatus(member.id_anggota, 'Aktif')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm transition-all"
                        >
                          <CheckCircle size={14} />
                          <span>Aktifkan (Verifikasi)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus(member.id_anggota, 'Tidak Aktif')}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer border border-rose-100 dark:border-rose-950/30 transition-all"
                        >
                          <XCircle size={14} />
                          <span>Tangguhkan</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-bg-base/20 border-t border-border-base/60 px-6 py-4 flex items-center justify-between text-xs text-txt-muted">
            <span className="font-semibold flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              <span>Total Terdaftar: {members.length} Anggota</span>
            </span>
            <span>
              {activeTab === 'pending' 
                ? `${pendingMembers.length} Akun pendaftaran mandiri memerlukan tindakan persetujuan.`
                : 'Akun mandiri dari tombol register online memerlukan verifikasi pustakawan.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
