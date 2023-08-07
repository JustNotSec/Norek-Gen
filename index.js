const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateUniqueNumber(existingNumbers) {
  let randomNumber;
  do {
    // Membuat nomor rekening dengan format "EX" diikuti 7 angka acak
    randomNumber = 'EX' + Math.floor(1000000 + Math.random() * 9000000).toString();
  } while (existingNumbers.includes(randomNumber)); // Memastikan nomor rekening unik

  return randomNumber;
}

function saveToJSONFile(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function readFromJSONFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function printRed(text) {
  console.log('\x1b[31m%s\x1b[0m', text); // Kode escape untuk warna merah
}

function printGreen(text) {
  console.log('\x1b[32m%s\x1b[0m', text); // Kode escape untuk warna hijau
}

readline.question('Masukkan nama pemilik rekening: ', (ownerName) => {
  const existingData = readFromJSONFile('norek.json');

  // Memeriksa apakah nama pemilik sudah ada sebelumnya
  if (existingData.some(item => item.ownerName === ownerName)) {
    printRed(`Nama pemilik "${ownerName}" sudah ada, rekening tidak bisa dibuat.`);
    readline.close();
    return;
  }

  const newRekeningNumber = generateUniqueNumber(existingData.map(item => item.rekeningNumber));

  const newRecord = {
    ownerName: ownerName,
    rekeningNumber: newRekeningNumber
  };

  existingData.push(newRecord);
  saveToJSONFile(existingData, 'norek.json');
  printGreen(`Hallo ${ownerName} Ini Dia`);
  printGreen(`Nomor rekening baru untuk ${ownerName}: ${newRekeningNumber}`);
  readline.close();
});
