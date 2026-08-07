const JSZip = require('jszip');
const mammoth = require('mammoth');

async function test() {
    const zip = new JSZip();
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    
    let documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
    
    // Completely remove <m:...> wrapper tags, keeping only their contents!
    // But since we already replaced m:t and m:r with w:t and w:r, they are safe!
    // We can just remove any remaining <m:...> tags (like <m:oMath>)
    documentXml = documentXml.replace(/<m:[^>]+>/g, '').replace(/<\/m:[^>]+>/g, '');
    
    zip.file("word/document.xml", documentXml);
    
    const arrayBuffer = await zip.generateAsync({type:"arraybuffer"});
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await mammoth.convertToHtml({ buffer: buffer });
    console.log("HTML Output:", result.value);
}
test().catch(console.error);
