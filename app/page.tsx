
"use client";

import { useEffect, useState } from "react";

type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  email: string;
  prodi: string;
};

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [prodi, setProdi] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Mengambil data mahasiswa
  async function fetchMahasiswa() {
    try {
      const response = await fetch("/api/mahasiswa");
      if (!response.ok) throw new Error("Gagal mengambil data");

      const data = await response.json();
      setMahasiswa(data);
    } catch {
      setMessage("Gagal mengambil data mahasiswa");
    }
  }

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  // Reset form
  function resetForm() {
    setNim("");
    setNama("");
    setEmail("");
    setProdi("");
    setEditId(null);
  }

  // Tambah dan edit mahasiswa
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const body = { nim, nama, email, prodi };

    try {
      const response = await fetch("/api/mahasiswa", {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editId ? { id: editId, ...body } : body
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operasi gagal");
      }

      setMessage(
        editId
          ? "Data berhasil diperbarui!"
          : "Mahasiswa berhasil ditambahkan!"
      );

      resetForm();
      await fetchMahasiswa();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  // Mengisi form untuk edit
  function handleEdit(item: Mahasiswa) {
    setEditId(item.id);
    setNim(item.nim);
    setNama(item.nama);
    setEmail(item.email);
    setProdi(item.prodi);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Menghapus mahasiswa
  async function handleDelete(id: number) {
    if (!window.confirm("Yakin ingin menghapus mahasiswa ini?")) {
      return;
    }

    try {
      const response = await fetch("/api/mahasiswa", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus data");
      }

      setMessage("Data berhasil dihapus!");
      await fetchMahasiswa();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
    }
  }

  return (
    <main style={{
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#222"
    }}>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
        Student Management
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Aplikasi pengelolaan data mahasiswa menggunakan Next.js,
        Prisma, dan SQLite.
      </p>

      <div style={{
        background: "#f1f5f9",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px"
      }}>
        <h2>Data Mahasiswa</h2>
        <p>Total mahasiswa: <b>{mahasiswa.length}</b></p>
      </div>

      <section style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "30px"
      }}>
        <h2>{editId ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginTop: "20px"
          }}>
            <input
              placeholder="NIM"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
            />

            <input
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Program Studi"
              value={prodi}
              onChange={(e) => setProdi(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading
                ? "Menyimpan..."
                : editId
                  ? "Simpan Perubahan"
                  : "Tambah Mahasiswa"}
            </button>

            {editId && (
              <button type="button" onClick={resetForm}>
                Batal
              </button>
            )}
          </div>
        </form>

        {message && (
          <p style={{ marginTop: "15px" }}>{message}</p>
        )}
      </section>

      <section>
        <h2>Daftar Mahasiswa</h2>

        <div style={{ overflowX: "auto", marginTop: "15px" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left"
          }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: "12px" }}>NIM</th>
                <th style={{ padding: "12px" }}>Nama</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Prodi</th>
                <th style={{ padding: "12px" }}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {mahasiswa.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.nim}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.nama}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.email}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {item.prodi}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    <button onClick={() => handleEdit(item)}>
                      Edit
                    </button>{" "}
                    <button onClick={() => handleDelete(item.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {mahasiswa.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "20px", textAlign: "center" }}>
                    Belum ada data mahasiswa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
