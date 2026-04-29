/* refui/client.js — 단순화 v2 (~80행)
   책임: (1) Chart.js 시나리오 비교 막대 1개  (2) details 토글은 native HTML
*/

(function() {
  'use strict';

  // ── Chart.js 시나리오 비교 (Section 3) ────────────────────────
  const ctx = document.getElementById('scenarioChart');
  if (!ctx || typeof Chart === 'undefined') return;

  // 다크 톤 일관 — slate 팔레트
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(148,163,184,0.1)';
  Chart.defaults.font.family = '"Pretendard Variable", Pretendard, system-ui, sans-serif';

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['시나리오 A\n60일 MVP', '시나리오 B\n풀패키지 (권장)', '시나리오 C\n단계 분할'],
      datasets: [
        {
          label: '일정 (주)',
          data: [8.5, 26, 8.5],
          backgroundColor: ['rgba(34,211,238,0.7)', 'rgba(16,185,129,0.7)', 'rgba(168,85,247,0.7)'],
          borderColor:     ['rgba(34,211,238,1)',   'rgba(16,185,129,1)',   'rgba(168,85,247,1)'],
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.55,
        },
        {
          label: '예산 (백만원)',
          data: [8, 22, 8],
          backgroundColor: ['rgba(34,211,238,0.35)', 'rgba(16,185,129,0.35)', 'rgba(168,85,247,0.35)'],
          borderColor:     ['rgba(34,211,238,0.6)',  'rgba(16,185,129,0.6)',  'rgba(168,85,247,0.6)'],
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.55,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { padding: 14, boxWidth: 12, boxHeight: 12, font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.95)',
          borderColor: 'rgba(148,163,184,0.3)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (item) => {
              const unit = item.dataset.label.includes('주') ? '주' : '백만원';
              return `${item.dataset.label}: ${item.parsed.y}${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, autoSkip: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148,163,184,0.08)' },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
})();
