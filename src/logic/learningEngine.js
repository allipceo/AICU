// 학습 엔진: 문제 배열을 받아 순차적으로 제공 (Phase 1: 단순 로딩)
function getNextQuestion(questions, currentIdx) {
    if (currentIdx < questions.length - 1) {
        return questions[currentIdx + 1];
    }
    return null;
}

export { getNextQuestion }; 