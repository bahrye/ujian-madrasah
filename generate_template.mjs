import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

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
                text: "1. Gunakan penomoran angka (1., 2., 3., dst) untuk teks soal.",
            }),
            new Paragraph({
                text: "2. Gunakan penomoran huruf (A., B., C., D., E.) untuk opsi jawaban.",
            }),
            new Paragraph({
                text: "3. Tulis KUNCI: diikuti huruf jawaban benar di akhir setiap soal.",
            }),
            new Paragraph({
                text: "4. Anda bebas menyisipkan gambar atau tabel di dalam soal.",
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "=================================================" }),
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
            new Paragraph({ text: "A. Kucing" }),
            new Paragraph({ text: "B. Anjing" }),
            new Paragraph({ text: "C. Gajah" }),
            new Paragraph({ text: "D. Jerapah" }),
            new Paragraph({ text: "KUNCI: C" }),
            new Paragraph({ text: "" }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('static/template_soal_ujian.docx', buffer);
    console.log("Template generated at static/template_soal_ujian.docx");
});
