const JSZip = require('jszip');
const mammoth = require('mammoth');
const fs = require('fs');

async function test() {
    // Let's create a minimal docx in memory with jszip to test if mammoth extracts it!
    const zip = new JSZip();
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    
    // We put m:oMath inside a paragraph, but replace its internal m:r and m:t with w:r and w:t
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
        <w:body>
            <w:p>
                <w:r><w:t>Hasil dari </w:t></w:r>
                <m:oMath>
                    <w:r>
                        <w:t>−134</w:t>
                    </w:r>
                </m:oMath>
                <w:r><w:t> adalah...</w:t></w:r>
            </w:p>
        </w:body>
    </w:document>`;
    
    zip.file("word/document.xml", documentXml);
    
    const arrayBuffer = await zip.generateAsync({type:"arraybuffer"});
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await mammoth.convertToHtml({ buffer: buffer });
    console.log("HTML Output:", result.value);
}
test().catch(console.error);
