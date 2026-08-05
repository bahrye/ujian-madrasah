const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.svelte-kit')) { 
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.svelte') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern 1: (String(VAR).includes('Z') ? '' : 'Z')
    const pattern1 = /\(\s*String\(([a-zA-Z0-9_.]+)\)\.includes\('Z'\)\s*\?\s*''\s*:\s*'Z'\s*\)/g;
    if (pattern1.test(content)) {
        content = content.replace(pattern1, "(String($1).includes(' ') && !String($1).includes('Z') ? 'Z' : '')");
        changed = true;
    }

    // Pattern 2: (VAR.includes('Z') ? '' : 'Z')
    // Make sure it doesn't match if VAR starts with String( (already handled by pattern 1)
    const pattern2 = /\(\s*((?!String\()[a-zA-Z0-9_.]+)\.includes\('Z'\)\s*\?\s*''\s*:\s*'Z'\s*\)/g;
    if (pattern2.test(content)) {
        content = content.replace(pattern2, "($1.includes(' ') && !$1.includes('Z') ? 'Z' : '')");
        changed = true;
    }

    if (changed) {
        console.log('Fixed', file);
        fs.writeFileSync(file, content, 'utf8');
    }
});
