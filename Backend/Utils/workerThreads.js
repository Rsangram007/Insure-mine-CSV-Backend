const { isMainThread, parentPort } = require('worker_threads');
const XLSX = require('xlsx');
const fs = require('fs');

// Function to parse XLSX file
function parseXLSX(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}

// Function to read CSV file
function parseCSV(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const obj = {};
        line.split(',').forEach((value, i) => {
            obj[headers[i]] = value.trim();
        });
        return obj;
    });
}

if (!isMainThread) {
    parentPort.on('message', async (data) => {
        const parsed = data.endsWith('.xlsx') ? parseXLSX(data) : parseCSV(data);
        parentPort.postMessage(parsed);
    });
}
