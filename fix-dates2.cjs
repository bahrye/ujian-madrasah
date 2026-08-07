const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const varsToReplace = [
    'exam.start_time',
    'exam.end_time',
    'dateString',
    'startStr',
    'endStr',
    'submitStr',
    'token.expires_at',
    'token.released_at',
    'student.start_time',
    'a.paused_at',
    'log.time',
    'str'
];

let count = 0;

walkDir('./src/routes', (filePath) => {
    if (filePath.endsWith('.svelte') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        for (const v of varsToReplace) {
            // Find `new Date(VAR)` or `new Date(String(VAR))` or `new Date(VAR + 'Z')`
            // and replace with `parseDate(VAR)`
            
            // basic `new Date(var)`
            const regex1 = new RegExp(`new Date\\(${v.replace('.', '\\.')}\\)`, 'g');
            content = content.replace(regex1, `parseDate(${v})`);

            // `new Date(String(var))`
            const regex2 = new RegExp(`new Date\\(String\\(${v.replace('.', '\\.')}\\)\\)`, 'g');
            content = content.replace(regex2, `parseDate(${v})`);

            // `new Date(var + 'Z')`
            const regex3 = new RegExp(`new Date\\(${v.replace('.', '\\.')} \\+ 'Z'\\)`, 'g');
            content = content.replace(regex3, `parseDate(${v})`);
        }

        if (content !== originalContent) {
            if (!content.includes('import { parseDate }')) {
                const importStmt = "import { parseDate } from '$lib/utils/date';\n";
                if (content.includes('<script lang="ts">')) {
                    content = content.replace('<script lang="ts">', '<script lang="ts">\n\t' + importStmt);
                } else if (content.includes('<script>')) {
                    content = content.replace('<script>', '<script>\n\t' + importStmt);
                } else if (filePath.endsWith('.ts')) {
                    content = importStmt + content;
                }
            }
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
            count++;
        }
    }
});

console.log(`Updated ${count} files with remaining new Date patterns.`);
