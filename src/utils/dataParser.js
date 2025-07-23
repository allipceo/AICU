// CSV 텍스트를 문제 객체 배열로 파싱하는 함수
function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const row = [];
        let current = '';
        let inQuotes = false;
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        row.push(current);
        if (row.length === headers.length) {
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = row[idx];
            });
            data.push(obj);
        }
    }
    return data;
}

export { parseCSV }; 