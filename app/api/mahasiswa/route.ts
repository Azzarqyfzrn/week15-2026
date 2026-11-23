
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Menampilkan semua mahasiswa
export async function GET() {
    try {
        const mahasiswa = await prisma.mahasiswa.findMany();

        return NextResponse.json(mahasiswa);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Gagal mengambil data mahasiswa" },
            { status: 500 }
        );
    }
}

// POST: Menambahkan mahasiswa
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { nim, nama, email, prodi } = body;

        if (!nim || !nama || !email || !prodi) {
            return NextResponse.json(
                { message: "Semua field wajib diisi" },
                { status: 400 }
            );
        }

        const mahasiswa = await prisma.mahasiswa.create({
            data: {
                nim,
                nama,
                email,
                prodi,
            },
        });

        return NextResponse.json(mahasiswa, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Gagal menambahkan mahasiswa. Pastikan NIM belum digunakan." },
            { status: 500 }
        );
    }
}


// PUT: Mengubah data mahasiswa
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const { id, nim, nama, email, prodi } = body;

        if (!id || !nim || !nama || !email || !prodi) {
            return NextResponse.json(
                { message: "Semua field wajib diisi" },
                { status: 400 }
            );
        }

        const mahasiswa = await prisma.mahasiswa.update({
            where: {
                id: Number(id),
            },
            data: {
                nim,
                nama,
                email,
                prodi,
            },
        });

        return NextResponse.json(mahasiswa);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Gagal mengubah data mahasiswa" },
            { status: 500 }
        );
    }
}


 // DELETE: Menghapus data mahasiswa
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID mahasiswa tidak valid" },
        { status: 400 }
      );
    }

    // Periksa apakah mahasiswa tersedia
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (!existingMahasiswa) {
      return NextResponse.json(
        { message: "Mahasiswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus data mahasiswa
    await prisma.mahasiswa.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Data mahasiswa berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menghapus data mahasiswa" },
      { status: 500 }
    );
  }
}
