-- CreateTable
CREATE TABLE "Mahasiswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nim" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "prodi" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");
