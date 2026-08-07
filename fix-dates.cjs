const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const parseDateRegex = /new Date\(String\(([^)]+)\)\.replace\(' ', 'T'\) \+ \(String\([^)]+\)\.includes\(' '\) && !String\([^)]+\)\.includes\('Z'\) \? 'Z' : ''\)\)/g;
const parseDateRegex2 = /new Date\(([^)]+)\.replace\(' ', 'T'\) \+ \([^)]+\.includes\(' '\) && ![^\.]+\.includes\('Z'\) \? 'Z' : ''\)\)/g;
const parseDateRegex3 = /new Date\(String\(([^)]+)\)\.replace\(' ', 'T'\) \+ \(String\([^)]+\)\.includes\(' '\) && !String\([^)]+\)\.includes\('Z'\) \? 'Z' : ''\)\)/g;

// A generic regex to catch most of these verbose patterns
const complexDateRegex = /new Date\(\s*(?:String\()?([^).]+(?:\.[^)]+)*)(?:\))?\.replace\(' ', 'T'\).*?'Z' : ''\)\)/g;

let count = 0;

walkDir('./src/routes', (filePath) => {
    if (filePath.endsWith('.svelte') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace complex verbose date parsing
        content = content.replace(complexDateRegex, 'parseDate($1)');

        // Replace basic `new Date(exam.start_time)` if there's no parseDate
        // Actually, we must make sure `parseDate` is imported!
        
        if (content !== originalContent) {
            if (!content.includes('import { parseDate }')) {
                // Determine relative path to $lib/utils/date
                // Since this is SvelteKit, we can just use $lib/utils/date
                const importStmt = "import { parseDate } from '$lib/utils/date';\n";
                // Inject after <script>
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

console.log(`Updated ${count} files with verbose new Date patterns.`);
