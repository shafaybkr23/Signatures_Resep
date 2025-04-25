// src/services/api.service.ts

export interface Resep {
  nama: string;
  dosis: string;
  frekuensi: string;
}

export interface PasienResponse {
  nama: string;
  no_rm: string;
  tanggal_lahir: string;
  no_blling: string;
  resep: Resep[];
}

export const getPasienById = async (id: string): Promise<PasienResponse | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // timeout 7 detik

    const response = await fetch('http://20.20.20.6/api.mersi-hospital/dev/ply/public/kep_laporan/view_pasien_igd', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ no_mr: id }) // GANTI KE no_mr sesuai spesifikasi
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data pasien: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};