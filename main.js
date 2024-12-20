const adfgvxTable = {
    'A': ['0', '5', 'D', 'E', '1', 'F'],
    'D': ['C', 'K', '9', '6', 'G', 'L'],
    'F': ['8', 'O', 'R', '2', 'M', 'Q'],
    'G': ['T', '3', 'X', 'U', 'W', 'S'],
    'V': ['Y', 'Z', '7', '4', 'B', 'A'],
    'X': ['N', 'P', 'H', 'V', 'J', 'I']
};

//Получение координат по таблице adfgvx
function getAdfgvxCoordinates(symbol) {
    for (const [rowKey, rowValues] of Object.entries(adfgvxTable)) {
        const index = rowValues.indexOf(symbol.toUpperCase());
        if (index !== -1) {
            return [rowKey, Object.keys(adfgvxTable)[index]];
        }
    }
    //throw new Error(`Символ '${symbol}' в таблице не найден.`);
}

//Нахождение символа по таблице adfgvx
function getSymbolFromCoordinates(row, col) {
    const rowValues = adfgvxTable[row];
    const colIndex = Object.keys(adfgvxTable).indexOf(col);
    return rowValues[colIndex];
}

//Шифрование
function adfgvxEncrypt(text, key) {
    let two = [];
    for (const symbol of text) {
        if (/[A-Za-z0-9]/.test(symbol)) {
            const [row, col] = getAdfgvxCoordinates(symbol);
            two.push(row + col);
        }
    }
    
    let intermediateText = two.join('');
    while (intermediateText.length % key.length !== 0) {
        intermediateText += '0';
    }
    const sortedKey = key.split('').sort().join('');
    let columns = {};
    for (const k of sortedKey) {
        columns[k] = [];
    }
    for (let i = 0; i < intermediateText.length; i++) {
        columns[key[i % key.length]].push(intermediateText[i]);
    }
    let encryptedText = '';
    for (const k of sortedKey) {
        encryptedText += columns[k].join('').replace(/0/g, '');
    }
    return encryptedText;
}

//Дешифрования
function adfgvxDecrypt(encryptedText, key) {
    const sortedKey = key.split('').sort().join('');
    const colLengths = new Array(key.length).fill(Math.floor(encryptedText.length / key.length));
   
    for (let i = 0; i < encryptedText.length % key.length; i++) {
        colLengths[i] += 1;
    }

    let columns = {};
    let index = 0;
    for (let i = 0; i < sortedKey.length; i++) {
        const k = sortedKey[i];
        const length = colLengths[i];
        columns[k] = encryptedText.slice(index, index + length);
        index += length;
    }

    let orderedColumns = [];
    for (const k of key) {
        orderedColumns.push(columns[k]);
    }
    let intermediateText = '';
    const maxColumnLength = Math.max(...colLengths);
    for (let i = 0; i < maxColumnLength; i++) {
        for (const col of orderedColumns) {
            if (i < col.length) {
                intermediateText += col[i];
            }
        }
    }

    let decryptedText = [];
    for (let i = 0; i < intermediateText.length; i += 2) {
        try {
            const row = intermediateText[i];
            const col = intermediateText[i + 1];
            decryptedText.push(getSymbolFromCoordinates(row, col));
        } catch (e) {
            break;
        }
    }
    return decryptedText.join('').replace(/0/g, '');
}

document.getElementById('encryptButton').addEventListener('click', () => {
    const text = document.getElementById('text').value;
    const key = document.getElementById('key').value;
    const result = adfgvxEncrypt(text, key);
    document.getElementById('result').value = result;
});

document.getElementById('decryptButton').addEventListener('click', () => {
    const text = document.getElementById('text').value;
    const key = document.getElementById('key').value;
    const result = adfgvxDecrypt(text, key);
    document.getElementById('result').value = result;
});