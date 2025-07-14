// database.js

const fs = require('node:fs');
const path = require('node:path');

const dbPath = path.join(__dirname, 'db.json');

// Função para ler os dados do db.json
function readData() {
    // Se o arquivo não existir, cria um objeto vazio
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

// Função para escrever dados no db.json
function writeData(data) {
    try {
        // O 'null, 2' formata o JSON para que ele fique legível
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Erro ao escrever no arquivo db.json:", error);
    }
}

module.exports = { readData, writeData };