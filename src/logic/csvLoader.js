// CSV 파일을 읽어 텍스트로 반환하는 함수
async function loadCSV(filePath) {
    // fetch 기반 (GitHub Pages/웹 환경)
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('CSV 파일 로드 실패: ' + filePath);
    return await response.text();
}

export { loadCSV }; 