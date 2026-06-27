import React from 'react';
import { UserPlus, Users, Phone, MapPin, ShieldCheck, Mail, ClipboardList } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';

export const Members = ({ members, onAdd }) => {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-txt-base tracking-tight m-0">Daftar Anggota</h2>
          <p className="text-sm text-txt-muted">Registrasi anggota baru atau pantau keaktifan akun anggota perpustakaan.</p>
        </div>
        <Button onClick={onAdd} variant="primary" className="shrink-0">
          <UserPlus className="w-4 h-4" />
          <span>Registrasi Baru</span>
        </Button>
      </div>

      {/* Members Board */}
      {members.length === 0 ? (
        <div className="bg-bg-surface border border-border-base rounded-2xl p-12 flex flex-col items-center justify-center text-txt-muted gap-3 shadow-sm">
          <Users className="w-16 h-16 stroke-[1.2] text-txt-muted/70" />
          <div className="flex flex-col gap-1 text-center">
            <span className="text-base font-bold text-txt-base">Belum Ada Anggota</span>
            <span className="text-xs text-txt-muted">Belum ada anggota perpustakaan yang terdaftar. Registrasikan sekarang.</span>
          </div>
          <Button onClick={onAdd} variant="accent" className="mt-2 text-xs">
            Daftarkan Anggota Pertama
          </Button>
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-base bg-bg-base/30 text-txt-muted font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">ID / Nomor Identitas</th>
                  <th className="py-4 px-6">Nama Lengkap</th>
                  <th className="py-4 px-6">Kontak</th>
                  <th className="py-4 px-6">Alamat</th>
                  <th className="py-4 px-6 text-right">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base/40">
                {members.map((member) => (
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
                      <div className="flex items-center gap-1.5 text-txt-base text-xs font-semibold">
                        <Phone className="w-3.5 h-3.5 text-txt-muted" />
                        <span>{member.nomor_telepon}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-txt-muted text-xs max-w-xs truncate" title={member.alamat}>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-txt-muted shrink-0" />
                        <span className="truncate">{member.alamat}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Badge variant={member.status_akun === 'Aktif' ? 'success' : 'error'}>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{member.status_akun}</span>
                        </div>
                      </Badge>
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
            <span>Semua akun anggota diaktivasi otomatis saat registrasi</span>
          </div>
        </div>
      )}
    </div>
  );
};
