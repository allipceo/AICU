// 문제 표시 및 답안 선택 UI 렌더링 함수
function renderQuiz(questions, mountId) {
    // mountId: 렌더링할 DOM 컨테이너 id
    // questions: 문제 객체 배열
    // (구현 예시, 실제 앱에서는 React/Vue 등 프레임워크에 맞게 확장)
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = '<div>문제 표시 영역 (구현 예정)</div>';
}

export { renderQuiz }; 