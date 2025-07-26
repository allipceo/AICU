// AICU 학습앱 - 그래프 모듈
// 사용법: <script src="graph-module.js"></script>

class GraphModule {
    constructor() {
        this.scoreChart = null;
        this.isInitialized = false;
    }

    // 모듈 초기화
    init() {
        if (this.isInitialized) return;
        
        // 초기 빈 데이터로 시작
        const initialData = [
            { subject: '06재산보험', score: 0, pass: false },
            { subject: '07특종보험', score: 0, pass: false },
            { subject: '08배상책임보험', score: 0, pass: false },
            { subject: '09해상보험', score: 0, pass: false }
        ];
        this.updateScores(initialData);
        this.isInitialized = true;
    }

    // 테스트 데이터 생성
    generateTestData() {
        const testData = [
            { subject: '06재산보험', score: 55, pass: true },
            { subject: '07특종보험', score: 65, pass: true },
            { subject: '08배상책임보험', score: 67, pass: true },
            { subject: '09해상보험', score: 30, pass: false }
        ];
        
        this.updateScores(testData);
    }

    // 점수 업데이트 (메인 함수)
    updateScores(subjectScores) {
        const scores = subjectScores.map(s => s.score);
        const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const lowestScore = Math.min(...scores);
        const isPass = overallScore >= 60 && lowestScore >= 40;
        
        // 헤더 통계 업데이트
        this.updateHeaderStats();
        
        // 요약 테이블 업데이트
        this.updateSummaryTable(subjectScores, overallScore, isPass);
        
        // 차트 업데이트
        this.updateChart(subjectScores, overallScore);
    }

    // 헤더 통계 업데이트
    updateHeaderStats() {
        const key = 'aciu_learning_history';
        let data = [];
        try { 
            data = JSON.parse(localStorage.getItem(key)) || []; 
        } catch (e) {
            console.error('데이터 파싱 오류:', e);
            data = [];
        }
        
        const totalQuestions = 1379; // 전체 문제 수
        const solvedQcodes = new Set(data.map(d => d.qcode));
        const overallRate = totalQuestions > 0 ? Math.round((solvedQcodes.size / totalQuestions) * 100) : 0;
        
        // 일일 진도율
        const today = new Date().toISOString().slice(0, 10);
        const todayData = data.filter(d => d.timestamp.slice(0, 10) === today);
        const todaySolved = todayData.length;
        const todayCorrect = todayData.filter(d => d.isCorrect).length;
        const dailyRate = todaySolved > 0 ? Math.round((todayCorrect / todaySolved) * 100) : 0;
        
        // UI 업데이트
        const totalQuestionsEl = document.getElementById('total-questions');
        const completedQuestionsEl = document.getElementById('completed-questions');
        const overallProgressRateEl = document.getElementById('overall-progress-rate');
        const dailyProgressRateEl = document.getElementById('daily-progress-rate');
        
        if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions.toLocaleString();
        if (completedQuestionsEl) completedQuestionsEl.textContent = solvedQcodes.size.toLocaleString();
        if (overallProgressRateEl) overallProgressRateEl.textContent = `${overallRate}%`;
        if (dailyProgressRateEl) dailyProgressRateEl.textContent = `${dailyRate}%`;
    }

    // 요약 카드 업데이트 (컴팩트 디자인)
    updateSummaryTable(subjectScores, overallScore, isPass) {
        // 과목별 카드 업데이트
        const subjectCards = document.getElementById('subject-cards');
        if (subjectCards) {
            subjectCards.innerHTML = '';
            
            subjectScores.forEach(subject => {
                const isSubjectPass = subject.score >= 40;
                const card = document.createElement('div');
                card.className = 'flex justify-between items-center p-2 bg-white rounded border';
                card.innerHTML = `
                    <div class="flex-1">
                        <div class="font-medium text-sm">${subject.subject}</div>
                        <div class="text-xs text-gray-500">기준: 40점</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold ${isSubjectPass ? 'text-green-600' : 'text-red-600'}">${subject.score}점</div>
                        <div class="text-xs ${isSubjectPass ? 'text-green-600' : 'text-red-600'}">${isSubjectPass ? '합격' : '불합격'}</div>
                    </div>
                `;
                subjectCards.appendChild(card);
            });
        }
        
        // 전체 요약 카드 업데이트
        const summaryCards = document.getElementById('summary-cards');
        if (summaryCards) {
            summaryCards.innerHTML = '';
            
            // 평균 점수 카드
            const isAvgPass = overallScore >= 60;
            const avgCard = document.createElement('div');
            avgCard.className = 'flex justify-between items-center p-3 bg-white rounded border';
            avgCard.innerHTML = `
                <div class="flex-1">
                    <div class="font-semibold">평균점수</div>
                    <div class="text-xs text-gray-500">기준: 60점</div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold ${isAvgPass ? 'text-green-600' : 'text-red-600'}">${overallScore}점</div>
                    <div class="text-xs ${isAvgPass ? 'text-green-600' : 'text-red-600'}">${isAvgPass ? '합격' : '불합격'}</div>
                </div>
            `;
            summaryCards.appendChild(avgCard);
            
            // 최종 합격 여부 카드
            const finalCard = document.createElement('div');
            finalCard.className = `flex justify-between items-center p-3 rounded border ${isPass ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`;
            finalCard.innerHTML = `
                <div class="flex-1">
                    <div class="font-bold">최종합격여부</div>
                    <div class="text-xs text-gray-500">모든 조건 만족</div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold ${isPass ? 'text-green-600' : 'text-red-600'}">${isPass ? '합격' : '불합격'}</div>
                    <div class="text-xs ${isPass ? 'text-green-600' : 'text-red-600'}">${isPass ? '🎉' : '⚠️'}</div>
                </div>
            `;
            summaryCards.appendChild(finalCard);
        }
    }

    // 차트 업데이트 (과목별 + 평균)
    updateChart(subjectScores, overallScore) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.scoreChart) {
            this.scoreChart.destroy();
        }
        
        const subjects = subjectScores.map(s => s.subject);
        const scores = subjectScores.map(s => s.score);
        
        // 평균 점수를 마지막에 추가
        const allLabels = [...subjects, '평균'];
        const allScores = [...scores, overallScore];
        
        this.scoreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allLabels,
                datasets: [
                    {
                        label: '현재 점수',
                        data: allScores,
                        backgroundColor: allScores.map((score, index) => {
                            if (index === allScores.length - 1) {
                                // 평균 점수는 파란색
                                return score >= 60 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)';
                            } else {
                                // 과목별 점수는 초록/빨강
                                return score >= 40 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
                            }
                        }),
                        borderColor: allScores.map((score, index) => {
                            if (index === allScores.length - 1) {
                                return score >= 60 ? 'rgba(59, 130, 246, 1)' : 'rgba(239, 68, 68, 1)';
                            } else {
                                return score >= 40 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
                            }
                        }),
                        borderWidth: 1
                    },
                    {
                        label: '합격 기준',
                        data: allScores.map((score, index) => {
                            return index === allScores.length - 1 ? 60 : 40; // 평균은 60점, 과목별은 40점
                        }),
                        type: 'line',
                        borderColor: 'rgba(156, 163, 175, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: '점수'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: '과목별 점수 및 평균 vs 합격 기준'
                    }
                }
            }
        });
    }

    // 외부에서 호출할 수 있는 공개 메서드들
    showGraph() {
        this.init();
    }

    hideGraph() {
        if (this.scoreChart) {
            this.scoreChart.destroy();
            this.scoreChart = null;
        }
    }

    // 실제 학습 데이터로 업데이트
    updateWithRealData(learningHistory) {
        // 학습 이력을 점수로 변환하는 로직
        const subjectScores = this.calculateScoresFromHistory(learningHistory);
        this.updateScores(subjectScores);
    }

    // 학습 이력에서 점수 계산
    calculateScoresFromHistory(history) {
        // 실제 구현에서는 학습 이력을 분석하여 점수 계산
        // 예시: 과목별 정답률을 점수로 변환
        const subjects = ['06재산보험', '07특종보험', '08배상책임보험', '09해상보험'];
        const scores = subjects.map(subject => {
            const subjectHistory = history.filter(h => h.layer1 === subject);
            if (subjectHistory.length === 0) return 0;
            
            const correctCount = subjectHistory.filter(h => h.isCorrect).length;
            const totalCount = subjectHistory.length;
            return Math.round((correctCount / totalCount) * 100);
        });

        return subjects.map((subject, index) => ({
            subject: subject,
            score: scores[index],
            pass: scores[index] >= 40
        }));
    }
}

// 전역 인스턴스 생성
window.graphModule = new GraphModule();

// 전역 함수들 (기존 코드와의 호환성)
window.generateTestData = function() {
    window.graphModule.generateTestData();
};

window.updateScores = function(subjectScores) {
    window.graphModule.updateScores(subjectScores);
}; 