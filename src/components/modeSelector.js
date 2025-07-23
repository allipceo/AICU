// 모드 선택 UI 렌더링 함수
function renderModeSelector(mountId, onSelect) {
    // mountId: 렌더링할 DOM 컨테이너 id
    // onSelect: 모드 선택 시 콜백
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = `
        <button id="mode-learn">학습 모드</button>
        <button id="mode-test">테스트 모드</button>
    `;
    document.getElementById('mode-learn').onclick = () => onSelect('learn');
    document.getElementById('mode-test').onclick = () => onSelect('test');
}

export { renderModeSelector }; 