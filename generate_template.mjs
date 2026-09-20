import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell } from 'docx';

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "Template Soal Ujian Madrasah",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                children: [
                    new TextRun("Petunjuk:"),
                ],
            }),
            new Paragraph({
                text: "- Gunakan penomoran angka (1., 2., 3., dst) untuk teks soal.",
            }),
            new Paragraph({ text: "- Gunakan penomoran huruf (A., B., C., D., E.) untuk opsi jawaban (Pilihan Ganda)." }),
            new Paragraph({ text: "- Tulis KUNCI: diikuti huruf jawaban benar di akhir setiap soal." }),
            new Paragraph({ text: "- Anda bebas menyisipkan gambar atau tabel di dalam soal, opsi, maupun kolom menjodohkan." }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Cara Menulis Berbagai Tipe Soal:", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: "- Pilihan Ganda: Tulis opsi A, B, C, D dan satu kunci (KUNCI: A)" }),
            new Paragraph({ text: "- Pilihan Ganda Kompleks: Tulis opsi dan lebih dari satu kunci (KUNCI: A, C)" }),
            new Paragraph({ text: "- Benar Salah: Jangan tulis opsi, langsung tulis (KUNCI: Benar atau KUNCI: Salah)" }),
            new Paragraph({ text: "- Isian Singkat: Jangan tulis opsi, langsung tulis jawaban (KUNCI: Jawaban Anda)" }),
            new Paragraph({ text: "- Esai: Jangan tulis opsi, langsung tulis (KUNCI: ESSAY)" }),
            new Paragraph({ text: "- Menjodohkan (Format Tabel): Buat Tabel 2 Kolom, kolom kiri isi Pernyataan/gambar, kolom kanan isi Pilihan/gambar. Tulis kunci: KUNCI: 1-C, 2-A, 3-B. Gambar boleh disisipkan di sel mana saja." }),
            new Paragraph({ text: "- Menjodohkan (Format [KIRI]/[KANAN]): Tulis [KIRI] lalu daftar pernyataan, kemudian [KANAN] lalu daftar pilihan jawaban. Akhiri dengan KUNCI: 1-C, 2-A, 3-B." }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "=================================================" }),
            new Paragraph({ text: "" }),
            new Paragraph({
                children: [
                    new TextRun({ text: "[MULAI SOAL]", color: "FF0000", bold: true }),
                ],
            }),
            new Paragraph({ text: "" }),
            
            // Soal 1
            new Paragraph({ text: "1. Siapa presiden pertama Republik Indonesia?" }),
            new Paragraph({ text: "A. B.J. Habibie" }),
            new Paragraph({ text: "B. Soekarno" }),
            new Paragraph({ text: "C. Soeharto" }),
            new Paragraph({ text: "D. Megawati Soekarnoputri" }),
            new Paragraph({ text: "KUNCI: B" }),
            new Paragraph({ text: "" }),
            
            // Soal 2
            new Paragraph({ text: "2. Apa ibukota dari provinsi Jawa Barat?" }),
            new Paragraph({ text: "A. Jakarta" }),
            new Paragraph({ text: "B. Surabaya" }),
            new Paragraph({ text: "C. Bandung" }),
            new Paragraph({ text: "D. Semarang" }),
            new Paragraph({ text: "KUNCI: C" }),
            new Paragraph({ text: "" }),
            
            // Soal 3
            new Paragraph({ text: "3. Perhatikan gambar hewan di bawah ini!" }),
            new Paragraph({ text: "[ Sisipkan Gambar di sini ]" }),
            new Paragraph({ text: "Apa nama hewan tersebut?" }),
            new Paragraph({ text: "KUNCI: Gajah" }),
            new Paragraph({ text: "" }),
            
            // Soal 4
            new Paragraph({ text: "4. Apakah Matahari terbit dari timur?" }),
            new Paragraph({ text: "KUNCI: Benar" }),
            new Paragraph({ text: "" }),
            
            // Soal 5
            new Paragraph({ text: "5. Sebutkan dan jelaskan proses terjadinya hujan!" }),
            new Paragraph({ text: "KUNCI: ESSAY" }),
            new Paragraph({ text: "" }),

            // Soal 6 (Menjodohkan - Format Tabel)
            new Paragraph({ text: "6. Jodohkan nama negara berikut dengan ibukotanya yang tepat:" }),
            new Table({
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Pernyataan (Kiri)" })] }),
                            new TableCell({ children: [new Paragraph({ text: "Pilihan Jawaban (Kanan)" })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "1. Indonesia" })] }),
                            new TableCell({ children: [new Paragraph({ text: "A. Tokyo" })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "2. Jepang" })] }),
                            new TableCell({ children: [new Paragraph({ text: "B. Paris" })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "3. Perancis" })] }),
                            new TableCell({ children: [new Paragraph({ text: "C. Jakarta" })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "" })] }),
                            new TableCell({ children: [new Paragraph({ text: "D. London (Pengecoh)" })] }),
                        ],
                    }),
                ],
            }),
            new Paragraph({ text: "KUNCI: 1-C, 2-A, 3-B" }),
            new Paragraph({ text: "" }),

            // Soal 7 (Menjodohkan - Format [KIRI]/[KANAN])
            new Paragraph({ text: "7. Jodohkan nama pahlawan Indonesia dengan asal daerahnya:" }),
            new Paragraph({ text: "[KIRI]" }),
            new Paragraph({ text: "1. Cut Nyak Dien" }),
            new Paragraph({ text: "2. Pattimura" }),
            new Paragraph({ text: "3. Pangeran Diponegoro" }),
            new Paragraph({ text: "[KANAN]" }),
            new Paragraph({ text: "A. Maluku" }),
            new Paragraph({ text: "B. Jawa Tengah" }),
            new Paragraph({ text: "C. Aceh" }),
            new Paragraph({ text: "KUNCI: 1-C, 2-A, 3-B" }),
            new Paragraph({ text: "" }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('static/template_soal_ujian.docx', buffer);
    console.log("Template generated at static/template_soal_ujian.docx");
});
