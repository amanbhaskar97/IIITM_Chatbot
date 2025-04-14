// ---- File: /src/utils/dataLoader.js ----
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const readTextFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const readPdfFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdf = await pdfParse(dataBuffer);
  return pdf.text;
};

const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  return sheetNames.map(sheetName => xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName])).join('\n');
};

const readSqlFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const readSqliteDb = async (filePath) => {
  const db = await open({ filename: filePath, driver: sqlite3.Database });
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
  let result = '';
  for (const table of tables) {
    const rows = await db.all(`SELECT * FROM ${table.name} LIMIT 20`);
    result += `\nTable: ${table.name}\n${JSON.stringify(rows, null, 2)}`;
  }
  return result;
};

const loadFilesFromFolder = async (folderPath) => {
  const files = fs.readdirSync(folderPath);
  let combinedContent = '';

  for (const file of files) {
    const ext = path.extname(file);
    const fullPath = path.join(folderPath, file);

    if (!fs.statSync(fullPath).isFile()) continue;

    if (ext === '.txt') {
      combinedContent += `\n${readTextFile(fullPath)}`;
    } else if (ext === '.pdf') {
      combinedContent += `\n${await readPdfFile(fullPath)}`;
    } else if (ext === '.xlsx' || ext === '.xls') {
      combinedContent += `\n${readExcelFile(fullPath)}`;
    } else if (ext === '.sql') {
      combinedContent += `\n${readSqlFile(fullPath)}`;
    } else if (ext === '.db') {
      combinedContent += `\n${await readSqliteDb(fullPath)}`;
    }
  }

  return combinedContent;
};

const getChatContext = async (email) => {
  const publicPath = path.join(__dirname, '../../data/public');
  const privatePath = path.join(__dirname, '../../data/private');

  let context = await loadFilesFromFolder(publicPath);
  if (email.endsWith('@iiitmanipur.ac.in')) {
    context += await loadFilesFromFolder(privatePath);
  }
  return context;
};

module.exports = { getChatContext };