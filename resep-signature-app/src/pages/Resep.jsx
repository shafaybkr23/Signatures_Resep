import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import SignatureCanvas from "../components/SignaturesCanvas";
import { getPasienById } from "../service/api.service";

const Resep = () => {
  const inputRef = useRef(null);
  const signatureRef = useRef(null);
  const [idPasien, setIdPasien] = useState("");
  const [pasien, setPasien] = useState(null);
  const [formSelesai, setFormSelesai] = useState(false);

  const handleCari = async () => {
    const trimmedId = idPasien.trim();
    if (!trimmedId) {
      Swal.fire("Oops!", "ID Pasien tidak boleh kosong.", "warning");
      return;
    }

    try {
      const response = await getPasienById(trimmedId);

      if (response && response.list && response.list.length > 0) {
        const pasienData = response.list[0];
        setPasien({
          nama: pasienData.nama_lengkap,
          noRM: pasienData.no_mr || "-",
          tanggalLahir: pasienData.tgl_lahir || "-",
          resep: pasienData.resep || [], //belum ada data resep dri api
        });
        setFormSelesai(false);
      } else {
        setPasien(null);
        Swal.fire(
          "Data tidak ditemukan",
          "ID Pasien tidak ditemukan atau data kosong.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saat fetch data pasien:", error);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat mengambil data pasien.",
        "error"
      );
    }
  };

  const saveSignature = () => {
    if (!signatureRef.current?.isSigned()) {
      Swal.fire(
        "Tanda tangan kosong",
        "Silakan isi tanda tangan terlebih dahulu.",
        "warning"
      );
      return;
    }

    // Dapatkan data gambar dalam format PNG
    const dataUrl = signatureRef.current.toDataURL("image/png");

    // Membuat elemen gambar sementara untuk mengonversi ke JPG
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      // Membuat canvas untuk menggambar gambar
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Menyesuaikan ukuran canvas dengan ukuran gambar tanda tangan
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Menggambar gambar ke dalam canvas
      ctx.drawImage(img, 0, 0);
      
      // Mengonversi gambar ke format JPG
      const jpgDataUrl = canvas.toDataURL("image/jpeg", 1.0); // Menggunakan kualitas 100%

      // Membuat link untuk mendownload file JPG
      const downloadLink = document.createElement("a");
      downloadLink.href = jpgDataUrl;
      downloadLink.download = `ttd_${idPasien}.jpg`; // Mengubah ekstensi menjadi .jpg
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      Swal.fire("Berhasil!", "Tanda tangan telah disimpan!", "success");
      setFormSelesai(true);
    };
  };

  const handleKembali = () => {
    Swal.fire({
      title: "Yakin ingin menutup form?",
      text: "Form akan ditutup dan data tidak disimpan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, kembali",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setPasien(null);
        setIdPasien("");
        setFormSelesai(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container p-1 mt-4 mb-4">
        <div className="text-center mb-4 d-flex justify-content-center">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              className="form-control form-control-lg"
              placeholder="Masukkan ID"
              value={idPasien}
              onChange={(e) => setIdPasien(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCari()}
              maxLength={8}
              style={{ fontSize: "1.2rem", height: "3rem" }}
              tabIndex={1}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCari}
              style={{ fontSize: "1.1rem" }}
              tabIndex={2}
            >
              Cari
            </button>
          </div>
        </div>

        {pasien && !formSelesai && (
          <div
            className="card p-4 shadow"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div className="detail-resep mt-3 small">
                  <div className="row">
                    <div className="col-4">
                      <strong>No RM</strong>
                    </div>
                    <div className="col-1">:</div>
                    <div className="col-7">{pasien.noRM}</div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <strong>Nama</strong>
                    </div>
                    <div className="col-1">:</div>
                    <div className="col-7">{pasien.nama}</div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <strong>Tanggal Lahir</strong>
                    </div>
                    <div className="col-1">:</div>
                    <div className="col-7">{pasien.tanggalLahir}</div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <strong>No Billing</strong>
                    </div>
                    <div className="col-1">:</div>
                    <div className="col-7">{idPasien}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mt-3 mt-md-0">
                <SignatureCanvas ref={signatureRef} />
                <div className="mt-3">
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => signatureRef.current?.clearSignature()}
                    tabIndex={3}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-success me-2"
                    onClick={saveSignature}
                    tabIndex={4}
                  >
                    Simpan
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleKembali}
                    tabIndex={5}
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>

            <h5>Detail Resep</h5>
            <div
              className="mt-1"
              style={{ overflow: "auto", maxHeight: "55vh" }}
            >
              <table className="table table-bordered mt-3 mb-1">
                <thead
                  className="table-dark"
                  style={{ position: "sticky", top: 0, zIndex: 1 }}
                >
                  <tr>
                    <th>Nama Obat</th>
                    <th>Dosis</th>
                    <th>Frekuensi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amoxilin</td>
                    <td>Amoxilin</td>
                    <td>Amoxilin</td>
                  </tr>
                  {/* More rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resep;
