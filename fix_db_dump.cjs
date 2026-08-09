const fs = require('fs');
let content = fs.readFileSync('db.sql');
let text = '';
if (content[0] === 0xff && content[1] === 0xfe) {
    text = content.toString('utf16le');
} else {
    text = content.toString('utf8');
}

const lines = text.split('\n');

const pragmas = [];
const tables = [];
const inserts = [];
const others = [];

let currentStmt = '';
let inTable = false;

for (let line of lines) {
    line = line.replace(/\r$/, '');
    if (line.startsWith('PRAGMA')) {
        pragmas.push(line);
    } else if (line.startsWith('CREATE TABLE')) {
        inTable = true;
        currentStmt = line + '\n';
    } else if (inTable) {
        currentStmt += line + '\n';
        if (line.endsWith(');')) {
            inTable = false;
            tables.push(currentStmt.trim());
            currentStmt = '';
        }
    } else if (line.startsWith('INSERT INTO')) {
        inserts.push(line);
    } else if (line.trim().length > 0) {
        others.push(line);
    }
}

const newContent = [
    ...pragmas,
    ...tables,
    ...inserts,
    ...others
].join('\n');

fs.writeFileSync('db_fixed.sql', newContent, 'utf8');
console.log('Fixed dump saved to db_fixed.sql with size: ' + newContent.length);
