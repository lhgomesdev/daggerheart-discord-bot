// database.js

const fs = require('node:fs');
const path = require('node:path');

const dbPath = path.join(__dirname, 'db.json');

// Função para ler os dados do db.json
function readData() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
        return {};
    }
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler o arquivo db.json:", error);
        return {};
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Erro ao escrever no arquivo db.json:", error);
    }
}

module.exports = { readData, writeData };