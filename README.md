# refui — 위시켓 #154913 사전 분석 레퍼런스 사이트 (단순화 v2)

> 한 페이지에 5분 안에 다 읽힙니다. 이전 1,496행 IT/비IT 2벌은 `_archive_v1/`에 보존.

## 단순화 원칙 (v2)

| 항목 | v1 (구) | v2 (현재) |
|---|---|---|
| 페이지 수 | 3개 (랜딩 + IT + 비IT) | **1개** (index.html) |
| 섹션 수 | 11개 (it.html) / 6개 (nonit.html) | **5개** (HERO·INSIGHTS·SCENARIOS·WHY-US·CTA) |
| 총 행 수 | 2,394행 | **579행** (1/4로 압축) |
| 차트 | Chart.js KPI·도넛·Gantt 5개+ | Chart.js 1개 (시나리오 비교 막대) |
| 인터랙션 | ⌘K, ROI Calculator, CountUp | smooth scroll + native `<details>` 토글만 |
| 의존성 | Tailwind, Pretendard, Chart.js, Lucide | Tailwind, Pretendard, Chart.js (Lucide 제거) |

## 5섹션 구조

1. **HERO** — 가치 제안 1줄 + 사전 분석 KPI 5개 (47 EPM · 7 RSM · 15 UC · 8 화면 · 22년) + CTA 2개 (proto / demo)
2. **INSIGHTS** — "발주자가 미팅 전 알아야 할 3가지" (R0 격상: 60일/8M/풀패키지 모순)
3. **SCENARIOS** — 시나리오 A/B/C 비교 + Chart.js 막대 + No-Go 박스
4. **WHY-US** — 차별화 5가지 (사전 분석 규모 · 22년+AI · 결제 안정성 · AI 옵션 · 보안)
5. **CTA** — 미팅 30분 합의 항목 + 자료 4개 (proto · demo · 제안서 IT/비IT)

## 핵심 메시지 우선순위

1. **R0 (60일/8M/풀패키지 모순)** — INSIGHTS 카드 1번 (rose, 가장 큼, 기본 펼침)
2. **시나리오 B 권장** — SCENARIOS 카드에 RECOMMENDED 뱃지
3. **사전 분석 47+7+8** — HERO KPI 5개로 즉시 시그널

## 점진적 공개 (Progressive Disclosure)

INSIGHTS 카드 3개는 `<details>` 요소로 작성되어 있어, 클릭 시 깊이 있는 정보(비교표·해석 3가지·기술 분기 등)가 펼쳐집니다.

## 로컬 실행

```bash
cd refui
python3 -m http.server 8814
# http://127.0.0.1:8814/
```

## 파일 구성

```
refui/
  index.html        ← 단일 페이지 (5섹션, 390행)
  styles.css        ← 단순화된 글래스 + KPI + Aurora (109행)
  client.js         ← Chart.js 1개 + 다크 톤 (80행)
  data.json         ← 보존 (재생성 시 입력 데이터)
  README.md         ← 이 파일
  _archive_v1/      ← 구 IT/비IT 2벌 + 랜딩 + 구 styles/client (보존)
    it.html nonit.html index.html styles.css client.js
```

## 재배포

기존 deploy.sh 그대로 사용 가능. 단 `_archive_v1/` 디렉토리는 배포 시 제외 권장 (별도 작업).

## v2 → v3 향후 옵션

- Chart.js 완전 제거 → 자체 SVG로 (의존성 더 줄이고 싶으면)
- IT 깊이 정보 별도 페이지 분리 (`details.html`) — 현재는 토글로 충분
- Cal.com 미팅 예약 위젯 임베드
- `_archive_v1/it.html` 를 footer 링크가 아닌 별도 페이지로 정식 노출

## 산출물 출처

- `1_요구사항검토서.md` §10 — R0 60일/8M/풀패키지 모순
- `1_요구사항검토서.md` §11 — Top 3 확인사항 (V1, DB+PG)
- `3_실행계획.md` §7 — 시나리오 A/B/C 비교
- `5_제안서_IT.md` 차별화 포인트 — WHY-US 5가지
- `domain/__init__.py` `DOMAIN_INFO` — KPI (47 EPM, 7 RSM, 15 UC, ...)
