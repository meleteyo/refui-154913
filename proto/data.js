// data.js — 운영자 콘솔 Mock 데이터
// 오늘 기준: 2026-04-28
// 가공 데이터만 포함. 실명·실금액 0건. .example.kr 이메일 사용.

// ── TWEAK_DEFAULTS ────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandColor": "#7c3aed",
  "brandName": "입찰인사이트",
  "policyMode": "PRIORITY",
  "density": "regular"
}/*EDITMODE-END*/;

// ── MOCK_MEMBERS (12개) ───────────────────────────────────────────────────────
// PRO 6개, BASIC 4개, ENTERPRISE 2개
// ACTIVE 10개, CANCELED 1개, EXPIRED 1개
const MOCK_MEMBERS = [
  {
    companyId: "CO-00142",
    name: "주식회사 가나다",
    bizRegNo: "123-45-67890",
    bizRegVerified: true,
    plan: "PRO",
    status: "ACTIVE",
    mrr: 290000,
    contactEmail: "manager@gana.example.kr",
    contactPerson: "김담당",
    joinedAt: "2026-02-14",
    nextBillingAt: "2026-05-14",
    failureCount: 0,
  },
  {
    companyId: "CO-00143",
    name: "라마바주식회사",
    bizRegNo: "234-56-78901",
    bizRegVerified: true,
    plan: "PRO",
    status: "ACTIVE",
    mrr: 290000,
    contactEmail: "contact@lamba.example.kr",
    contactPerson: "이운영",
    joinedAt: "2026-01-20",
    nextBillingAt: "2026-05-20",
    failureCount: 0,
  },
  {
    companyId: "CO-00144",
    name: "사아자유한회사",
    bizRegNo: "345-67-89012",
    bizRegVerified: true,
    plan: "ENTERPRISE",
    status: "ACTIVE",
    mrr: 800000,
    contactEmail: "admin@saaja.example.kr",
    contactPerson: "박관리",
    joinedAt: "2025-11-05",
    nextBillingAt: "2026-05-05",
    failureCount: 0,
  },
  {
    companyId: "CO-00145",
    name: "차카타합자회사",
    bizRegNo: "456-78-90123",
    bizRegVerified: true,
    plan: "ENTERPRISE",
    status: "ACTIVE",
    mrr: 800000,
    contactEmail: "ops@chakata.example.kr",
    contactPerson: "최차장",
    joinedAt: "2025-12-01",
    nextBillingAt: "2026-05-01",
    failureCount: 1,
  },
  {
    companyId: "CO-00146",
    name: "파하주식회사",
    bizRegNo: "567-89-01234",
    bizRegVerified: true,
    plan: "PRO",
    status: "ACTIVE",
    mrr: 290000,
    contactEmail: "team@paha.example.kr",
    contactPerson: "정팀장",
    joinedAt: "2026-02-01",
    nextBillingAt: "2026-05-01",
    failureCount: 0,
  },
  {
    companyId: "CO-00147",
    name: "하나공공서비스",
    bizRegNo: "678-90-12345",
    bizRegVerified: true,
    plan: "BASIC",
    status: "ACTIVE",
    mrr: 88000,
    contactEmail: "info@hana-pub.example.kr",
    contactPerson: "한담당",
    joinedAt: "2026-03-10",
    nextBillingAt: "2026-05-10",
    failureCount: 0,
  },
  {
    companyId: "CO-00148",
    name: "두리입찰연구소",
    bizRegNo: "789-01-23456",
    bizRegVerified: false,
    plan: "BASIC",
    status: "ACTIVE",
    mrr: 88000,
    contactEmail: "research@duri.example.kr",
    contactPerson: "두연구",
    joinedAt: "2026-03-15",
    nextBillingAt: "2026-05-15",
    failureCount: 0,
  },
  {
    companyId: "CO-00149",
    name: "한도윤유한회사",
    bizRegNo: "890-12-34567",
    bizRegVerified: true,
    plan: "BASIC",
    status: "ACTIVE",
    mrr: 88000,
    contactEmail: "manager@handoyun.example.kr",
    contactPerson: "한도윤",
    joinedAt: "2026-01-28",
    nextBillingAt: "2026-05-28",
    failureCount: 2,
  },
  {
    companyId: "CO-00150",
    name: "세모컨설팅",
    bizRegNo: "901-23-45678",
    bizRegVerified: true,
    plan: "PRO",
    status: "ACTIVE",
    mrr: 290000,
    contactEmail: "consulting@semo.example.kr",
    contactPerson: "세컨설",
    joinedAt: "2026-02-22",
    nextBillingAt: "2026-05-22",
    failureCount: 0,
  },
  {
    companyId: "CO-00151",
    name: "네모정보기술",
    bizRegNo: "012-34-56789",
    bizRegVerified: true,
    plan: "PRO",
    status: "ACTIVE",
    mrr: 290000,
    contactEmail: "it@nemo-info.example.kr",
    contactPerson: "네정보",
    joinedAt: "2026-03-01",
    nextBillingAt: "2026-06-01",
    failureCount: 0,
  },
  {
    companyId: "CO-00152",
    name: "오각테크",
    bizRegNo: "111-22-33344",
    bizRegVerified: true,
    plan: "BASIC",
    status: "CANCELED",
    mrr: 0,
    contactEmail: "tech@ogak.example.kr",
    contactPerson: "오기술",
    joinedAt: "2025-10-10",
    nextBillingAt: null,
    failureCount: 3,
  },
  {
    companyId: "CO-00153",
    name: "육각솔루션",
    bizRegNo: "222-33-44455",
    bizRegVerified: true,
    plan: "PRO",
    status: "EXPIRED",
    mrr: 0,
    contactEmail: "solution@yukgak.example.kr",
    contactPerson: "육솔루",
    joinedAt: "2025-09-05",
    nextBillingAt: null,
    failureCount: 4,
  },
];

// ── MOCK_PAYMENTS (12건) ──────────────────────────────────────────────────────
// SUCCESS 8건, FAILED 2건, REFUNDED 1건, PENDING 1건
// fallback 시나리오: PAY-3982(FAILED) → PAY-3985(SUCCESS, fallback=true)
const MOCK_PAYMENTS = [
  {
    id: "PAY-3984",
    date: "2026-04-28",
    time: "14:23:15",
    member: "주식회사 가나다",
    companyId: "CO-00142",
    plan: "PRO",
    amount: 290000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_84afb29e",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3983",
    date: "2026-04-28",
    time: "12:05:42",
    member: "라마바주식회사",
    companyId: "CO-00143",
    plan: "PRO",
    amount: 290000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_92bfc31d",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3982",
    date: "2026-04-27",
    time: "14:22:00",
    member: "한도윤유한회사",
    companyId: "CO-00149",
    plan: "BASIC",
    amount: 88000,
    channel: "TOSS",
    status: "FAILED",
    txId: null,
    reason: "BILLING_KEY_EXPIRED",
    fallback: false,
  },
  {
    id: "PAY-3985",
    date: "2026-04-28",
    time: "14:25:08",
    member: "한도윤유한회사",
    companyId: "CO-00149",
    plan: "BASIC",
    amount: 88000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_71290cba",
    reason: null,
    fallback: true,
  },
  {
    id: "PAY-3981",
    date: "2026-04-27",
    time: "10:14:33",
    member: "사아자유한회사",
    companyId: "CO-00144",
    plan: "ENTERPRISE",
    amount: 800000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_03dea44f",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3980",
    date: "2026-04-26",
    time: "09:30:22",
    member: "차카타합자회사",
    companyId: "CO-00145",
    plan: "ENTERPRISE",
    amount: 800000,
    channel: "TOSS",
    status: "REFUNDED",
    txId: "toss_55abc101",
    reason: null,
    refundedAt: "2026-04-26",
    refundAmount: 640000,
    fallback: false,
  },
  {
    id: "PAY-3979",
    date: "2026-04-25",
    time: "11:45:10",
    member: "세모컨설팅",
    companyId: "CO-00150",
    plan: "PRO",
    amount: 290000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_7f8e22ca",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3978",
    date: "2026-04-25",
    time: "08:20:55",
    member: "오각테크",
    companyId: "CO-00152",
    plan: "BASIC",
    amount: 88000,
    channel: "TOSS",
    status: "FAILED",
    txId: null,
    reason: "INSUFFICIENT_BALANCE",
    fallback: false,
  },
  {
    id: "PAY-3977",
    date: "2026-04-24",
    time: "15:12:44",
    member: "파하주식회사",
    companyId: "CO-00146",
    plan: "PRO",
    amount: 290000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_a19bc3d2",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3976",
    date: "2026-04-24",
    time: "13:05:19",
    member: "하나공공서비스",
    companyId: "CO-00147",
    plan: "BASIC",
    amount: 88000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_e3f2a801",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3975",
    date: "2026-04-23",
    time: "10:30:00",
    member: "네모정보기술",
    companyId: "CO-00151",
    plan: "PRO",
    amount: 290000,
    channel: "TOSS",
    status: "SUCCESS",
    txId: "toss_b82de591",
    reason: null,
    fallback: false,
  },
  {
    id: "PAY-3974",
    date: "2026-04-22",
    time: "16:55:03",
    member: "두리입찰연구소",
    companyId: "CO-00148",
    plan: "BASIC",
    amount: 88000,
    channel: "TOSS",
    status: "PENDING",
    txId: null,
    reason: null,
    fallback: false,
  },
];

// ── TEMPLATES (5종) ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "TMPL-NTC-01",
    type: "NOTICE",
    name: "정기 점검 공지 (월간)",
    version: "v1.2",
    active: true,
    subject: "[공공입찰 SaaS] 정기 점검 안내",
    body: "안녕하세요, {{회사명}}님.\n\n항상 공공입찰 인사이트를 이용해 주셔서 감사합니다.\n\n아래와 같이 정기 점검이 예정되어 있어 안내드립니다.\n\n- 점검 일시: 매월 첫째 주 토요일 02:00 ~ 04:00\n- 점검 내용: 서버 보안 패치 및 데이터베이스 최적화\n- 영향 범위: 전체 서비스 일시 중단\n\n점검 시간 동안 서비스 이용이 불가합니다.\n불편을 드려 죄송합니다.\n\n감사합니다.\n공공입찰 인사이트 운영팀",
  },
  {
    id: "TMPL-NTC-02",
    type: "NOTICE",
    name: "신규 기능 출시 공지",
    version: "v2.0",
    active: true,
    subject: "[공공입찰 SaaS] 신규 기능 출시 안내 — AI 낙찰 예측",
    body: "안녕하세요, {{회사명}}님.\n\n{{플랜명}} 구독자 여러분께 새로운 기능을 소개해 드립니다.\n\n[신규 기능: AI 낙찰 예측]\n- 과거 3년치 낙찰 데이터를 기반으로 낙찰 확률을 자동 산정합니다.\n- 유사 공고 비교 분석 기능이 추가되었습니다.\n- 관심 공고에 대한 알림 설정이 가능합니다.\n\n지금 바로 이용해 보세요!\n\n감사합니다.\n공공입찰 인사이트 운영팀",
  },
  {
    id: "TMPL-EML-01",
    type: "EMAIL",
    name: "결제 실패 안내",
    version: "v1.1",
    active: true,
    subject: "[결제 실패] {{회사명}}님의 {{플랜명}} 정기 결제가 실패했습니다",
    body: "안녕하세요, {{회사명}}님.\n\n정기 결제 처리 중 문제가 발생하여 안내드립니다.\n\n- 결제 금액: {{금액}}\n- 실패 사유: {{사유}}\n- 다음 재시도: 24시간 후 자동 재시도됩니다.\n\n결제 정보를 확인하신 후 카드 한도, 유효기간 등을 점검해 주세요.\n문제가 지속될 경우 고객센터(support@bidinsight.example.kr)로 연락 주세요.\n\n감사합니다.\n공공입찰 인사이트 운영팀",
  },
  {
    id: "TMPL-EML-02",
    type: "EMAIL",
    name: "구독 갱신 영수증",
    version: "v1.5",
    active: true,
    subject: "[영수증] {{회사명}}님의 {{플랜명}} 구독이 갱신되었습니다",
    body: "안녕하세요, {{회사명}}님.\n\n{{플랜명}} 구독이 정상적으로 갱신되었습니다.\n\n[결제 내역]\n- 결제 금액: {{금액}}\n- 결제 일시: {{환불일}}\n- 다음 결제 예정일: 다음 달 동일 일자\n\n영수증은 마이페이지에서 언제든 확인하실 수 있습니다.\n\n감사합니다.\n공공입찰 인사이트 운영팀",
  },
  {
    id: "TMPL-EML-03",
    type: "EMAIL",
    name: "환불 처리 완료 안내",
    version: "v1.0",
    active: true,
    subject: "[환불 완료] {{회사명}}님의 환불이 처리되었습니다",
    body: "안녕하세요, {{회사명}}님.\n\n환불 처리가 완료되었음을 안내드립니다.\n\n[환불 내역]\n- 환불 금액: {{금액}}\n- 환불 처리일: {{환불일}}\n- 잔여 사용 가능: {{잔여일수}}일\n\n구독이 해지되었으며, 현재 결제 사이클 종료 후 서비스 이용이 중단됩니다.\n향후 다시 구독을 원하시면 언제든 가입해 주세요.\n\n감사합니다.\n공공입찰 인사이트 운영팀",
  },
];

// ── TREND_7D (7일 결제 건수) ──────────────────────────────────────────────────
const TREND_7D = [42, 38, 51, 47, 53, 49, 58];

// ── PLAN_TODAY (오늘 플랜 분포) ───────────────────────────────────────────────
const PLAN_TODAY = { BASIC: 12, PRO: 18, ENTERPRISE: 4 };

// ── MRR_BY_PLAN (플랜별 MRR) ──────────────────────────────────────────────────
const MRR_BY_PLAN = { BASIC: 880000, PRO: 5220000, ENTERPRISE: 4800000 };

// ── KPI_TODAY ─────────────────────────────────────────────────────────────────
const KPI_TODAY = {
  mrr: 10900000,
  paidMembers: 34,
  todayPaid: 5800000,
  failedPayments: 3,
};

// ── AUDIT_LOGS (결제별 타임라인) ──────────────────────────────────────────────
const AUDIT_LOGS = {
  "PAY-3984": [
    { at: "14:23:14", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00142)" },
    { at: "14:23:14", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "14:23:15", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_84afb29e" },
    { at: "14:23:16", action: "SUBSCRIPTION_RENEWED", actor: "system", note: "next_billing_at → 2026-05-14" },
    { at: "14:23:16", action: "RECEIPT_SENT", actor: "system", note: "manager@gana.example.kr" },
  ],
  "PAY-3983": [
    { at: "12:05:41", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00143)" },
    { at: "12:05:41", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "12:05:42", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_92bfc31d" },
    { at: "12:05:43", action: "RECEIPT_SENT", actor: "system", note: "contact@lamba.example.kr" },
  ],
  "PAY-3982": [
    { at: "14:22:00", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00149) — 1차 시도" },
    { at: "14:22:00", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "14:22:01", action: "PG_RESPONSE_FAILED", actor: "system", note: "errorCode=BILLING_KEY_EXPIRED" },
    { at: "14:22:01", action: "FAILURE_RECORDED", actor: "system", note: "failure_count=2, 24h 재시도 예약" },
    { at: "14:22:02", action: "FAILURE_MAIL_SENT", actor: "system", note: "manager@handoyun.example.kr" },
  ],
  "PAY-3985": [
    { at: "14:25:07", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "24h 자동 재시도 (CO-00149)" },
    { at: "14:25:07", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 재시도" },
    { at: "14:25:08", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_71290cba (fallback 성공)" },
    { at: "14:25:09", action: "FAILURE_COUNT_RESET", actor: "system", note: "failure_count=0 초기화" },
    { at: "14:25:09", action: "RECEIPT_SENT", actor: "system", note: "manager@handoyun.example.kr" },
  ],
  "PAY-3981": [
    { at: "10:14:32", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00144)" },
    { at: "10:14:32", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "10:14:33", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_03dea44f" },
    { at: "10:14:34", action: "RECEIPT_SENT", actor: "system", note: "admin@saaja.example.kr" },
  ],
  "PAY-3980": [
    { at: "09:30:22", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00145)" },
    { at: "09:30:23", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_55abc101" },
    { at: "11:14:00", action: "REFUND_REQUESTED", actor: "admin_01", note: "운영자 환불 처리 요청" },
    { at: "11:14:01", action: "PG_REFUND_CALLED", actor: "system", note: "토스페이먼츠 환불 API 호출" },
    { at: "11:14:02", action: "PAYMENT_REFUNDED", actor: "system", note: "refundAmount=640000, subscriptionStatus=CANCELED" },
  ],
  "PAY-3979": [
    { at: "11:45:09", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00150)" },
    { at: "11:45:10", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_7f8e22ca" },
    { at: "11:45:10", action: "RECEIPT_SENT", actor: "system", note: "consulting@semo.example.kr" },
  ],
  "PAY-3978": [
    { at: "08:20:54", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00152)" },
    { at: "08:20:55", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "08:20:55", action: "PG_RESPONSE_FAILED", actor: "system", note: "errorCode=INSUFFICIENT_BALANCE" },
    { at: "08:20:56", action: "FAILURE_RECORDED", actor: "system", note: "failure_count=3" },
    { at: "08:20:56", action: "FAILURE_MAIL_SENT", actor: "system", note: "tech@ogak.example.kr" },
  ],
  "PAY-3977": [
    { at: "15:12:43", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00146)" },
    { at: "15:12:44", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_a19bc3d2" },
    { at: "15:12:44", action: "RECEIPT_SENT", actor: "system", note: "team@paha.example.kr" },
  ],
  "PAY-3976": [
    { at: "13:05:18", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00147)" },
    { at: "13:05:19", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_e3f2a801" },
    { at: "13:05:20", action: "RECEIPT_SENT", actor: "system", note: "info@hana-pub.example.kr" },
  ],
  "PAY-3975": [
    { at: "10:29:59", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00151)" },
    { at: "10:30:00", action: "PG_RESPONSE_SUCCESS", actor: "system", note: "tx_id=toss_b82de591" },
    { at: "10:30:01", action: "RECEIPT_SENT", actor: "system", note: "it@nemo-info.example.kr" },
  ],
  "PAY-3974": [
    { at: "16:55:02", action: "PAYMENT_REQUESTED", actor: "scheduler", note: "next_billing_at 도래 (CO-00148)" },
    { at: "16:55:03", action: "PG_CALLED", actor: "system", note: "토스페이먼츠 빌링 청구 요청" },
    { at: "16:55:04", action: "PG_PENDING", actor: "system", note: "결제사 응답 대기 중 (timeout 120s)" },
  ],
};

// ── RECENT_ACTIVITIES (대시보드 최근 활동 7건) ────────────────────────────────
const RECENT_ACTIVITIES = [
  { at: "14:25:08", type: "PAYMENT_SUCCESS", text: "한도윤유한회사 BASIC 결제 성공 (자동 재시도)", payId: "PAY-3985" },
  { at: "14:23:15", type: "PAYMENT_SUCCESS", text: "주식회사 가나다 PRO 결제 성공", payId: "PAY-3984" },
  { at: "12:05:42", type: "PAYMENT_SUCCESS", text: "라마바주식회사 PRO 결제 성공", payId: "PAY-3983" },
  { at: "11:14:02", type: "REFUNDED", text: "차카타합자회사 ENTERPRISE 환불 완료 (₩640,000)", payId: "PAY-3980" },
  { at: "10:14:33", type: "PAYMENT_SUCCESS", text: "사아자유한회사 ENTERPRISE 결제 성공", payId: "PAY-3981" },
  { at: "08:20:55", type: "PAYMENT_FAILED", text: "오각테크 BASIC 결제 실패 — INSUFFICIENT_BALANCE", payId: "PAY-3978" },
  { at: "어제", type: "PAYMENT_FAILED", text: "한도윤유한회사 BASIC 결제 실패 — BILLING_KEY_EXPIRED", payId: "PAY-3982" },
];

// ── window 노출 ───────────────────────────────────────────────────────────────
window.TWEAK_DEFAULTS      = TWEAK_DEFAULTS;
window.MOCK_MEMBERS        = MOCK_MEMBERS;
window.MOCK_PAYMENTS       = MOCK_PAYMENTS;
window.TEMPLATES           = TEMPLATES;
window.TREND_7D            = TREND_7D;
window.PLAN_TODAY          = PLAN_TODAY;
window.MRR_BY_PLAN         = MRR_BY_PLAN;
window.KPI_TODAY           = KPI_TODAY;
window.AUDIT_LOGS          = AUDIT_LOGS;
window.RECENT_ACTIVITIES   = RECENT_ACTIVITIES;

// ── 회원사 화면 신규 mock ─────────────────────────────────────────────────────

// ── REGIONS (17개 광역) ───────────────────────────────────────────────────────
const REGIONS = [
  { code: "11", name: "서울특별시",       short: "서울" },
  { code: "26", name: "부산광역시",       short: "부산" },
  { code: "27", name: "대구광역시",       short: "대구" },
  { code: "28", name: "인천광역시",       short: "인천" },
  { code: "29", name: "광주광역시",       short: "광주" },
  { code: "30", name: "대전광역시",       short: "대전" },
  { code: "31", name: "울산광역시",       short: "울산" },
  { code: "36", name: "세종특별자치시",   short: "세종" },
  { code: "41", name: "경기도",           short: "경기" },
  { code: "42", name: "강원특별자치도",   short: "강원" },
  { code: "43", name: "충청북도",         short: "충북" },
  { code: "44", name: "충청남도",         short: "충남" },
  { code: "45", name: "전북특별자치도",   short: "전북" },
  { code: "46", name: "전라남도",         short: "전남" },
  { code: "47", name: "경상북도",         short: "경북" },
  { code: "48", name: "경상남도",         short: "경남" },
  { code: "50", name: "제주특별자치도",   short: "제주" },
];

// ── INDUSTRY_CATEGORIES (6개 부모) ────────────────────────────────────────────
const INDUSTRY_CATEGORIES = [
  { id: "construction",  name: "건설",     count: 8 },
  { id: "facility",      name: "시설관리", count: 5 },
  { id: "it_service",    name: "IT용역",   count: 6 },
  { id: "goods",         name: "물품구매", count: 5 },
  { id: "study",         name: "용역·연구",count: 4 },
  { id: "etc",           name: "기타",     count: 2 },
];

// ── INDUSTRIES (30개) ─────────────────────────────────────────────────────────
const INDUSTRIES = [
  { id: "C-401", category: "construction",  name: "도로공사" },
  { id: "C-402", category: "construction",  name: "교량·터널" },
  { id: "C-403", category: "construction",  name: "공공건축" },
  { id: "C-404", category: "construction",  name: "조경공사" },
  { id: "C-405", category: "construction",  name: "상하수도" },
  { id: "C-406", category: "construction",  name: "전기공사" },
  { id: "C-407", category: "construction",  name: "소방설비" },
  { id: "C-408", category: "construction",  name: "철거공사" },
  { id: "F-501", category: "facility",      name: "청소용역" },
  { id: "F-502", category: "facility",      name: "경비용역" },
  { id: "F-503", category: "facility",      name: "건물관리" },
  { id: "F-504", category: "facility",      name: "환경미화" },
  { id: "F-505", category: "facility",      name: "조경관리" },
  { id: "I-601", category: "it_service",    name: "전산유지보수" },
  { id: "I-602", category: "it_service",    name: "SI구축" },
  { id: "I-603", category: "it_service",    name: "시스템감리" },
  { id: "I-604", category: "it_service",    name: "정보보안용역" },
  { id: "I-605", category: "it_service",    name: "클라우드전환" },
  { id: "I-606", category: "it_service",    name: "데이터구축" },
  { id: "G-701", category: "goods",         name: "소프트웨어" },
  { id: "G-702", category: "goods",         name: "사무기기" },
  { id: "G-703", category: "goods",         name: "의료기기" },
  { id: "G-704", category: "goods",         name: "차량·장비" },
  { id: "G-705", category: "goods",         name: "교육자재" },
  { id: "S-801", category: "study",         name: "연구용역" },
  { id: "S-802", category: "study",         name: "컨설팅" },
  { id: "S-803", category: "study",         name: "설계용역" },
  { id: "S-804", category: "study",         name: "감정평가" },
  { id: "E-901", category: "etc",           name: "홍보·광고" },
  { id: "E-902", category: "etc",           name: "행사·이벤트" },
];

// ── MOCK_TENDERS (24개) ───────────────────────────────────────────────────────
// analysisAvailable=true : T-20260427-001, T-20260427-005, T-20260427-012
// isScraped=true (8개) : 001, 003, 005, 008, 010, 012, 016, 020
const MOCK_TENDERS = [
  { id: "T-20260427-001", noticeNumber: "20260427-001", title: "ㅇㅇ시청 도로 노후 구간 정비공사", issuer: "ㅇㅇ시청", region: "서울", industry: "C-401", industryName: "도로공사", estimatedAmount: 250000000, deadlineAt: "2026-05-01T18:00:00", postedAt: "2026-04-25", isScraped: true,  attachmentCount: 4, analysisAvailable: true  },
  { id: "T-20260427-002", noticeNumber: "20260427-002", title: "ㅇㅇ구청 청사 신축 및 부대공사", issuer: "ㅇㅇ구청", region: "부산", industry: "C-403", industryName: "공공건축", estimatedAmount: 1800000000, deadlineAt: "2026-05-08T18:00:00", postedAt: "2026-04-24", isScraped: false, attachmentCount: 6, analysisAvailable: false },
  { id: "T-20260427-003", noticeNumber: "20260427-003", title: "ㅇㅇ공사 광역상수도 정비 및 누수 보수", issuer: "ㅇㅇ공사", region: "경기", industry: "C-405", industryName: "상하수도", estimatedAmount: 480000000, deadlineAt: "2026-05-10T18:00:00", postedAt: "2026-04-23", isScraped: true,  attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-004", noticeNumber: "20260427-004", title: "ㅇㅇ교육청 학교 옥외 조경공사", issuer: "ㅇㅇ교육청", region: "인천", industry: "C-404", industryName: "조경공사", estimatedAmount: 75000000, deadlineAt: "2026-05-12T18:00:00", postedAt: "2026-04-23", isScraped: false, attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-005", noticeNumber: "20260427-005", title: "ㅇㅇ시청 행정전산망 유지보수 용역", issuer: "ㅇㅇ시청", region: "서울", industry: "I-601", industryName: "전산유지보수", estimatedAmount: 320000000, deadlineAt: "2026-05-03T18:00:00", postedAt: "2026-04-25", isScraped: true,  attachmentCount: 5, analysisAvailable: true  },
  { id: "T-20260427-006", noticeNumber: "20260427-006", title: "ㅇㅇ대학교 정보보안 컨설팅 및 감리", issuer: "ㅇㅇ대학교", region: "대전", industry: "I-603", industryName: "시스템감리", estimatedAmount: 95000000, deadlineAt: "2026-05-14T18:00:00", postedAt: "2026-04-22", isScraped: false, attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-007", noticeNumber: "20260427-007", title: "ㅇㅇ공사 전기설비 교체 공사", issuer: "ㅇㅇ공사", region: "울산", industry: "C-406", industryName: "전기공사", estimatedAmount: 130000000, deadlineAt: "2026-05-15T18:00:00", postedAt: "2026-04-22", isScraped: false, attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-008", noticeNumber: "20260427-008", title: "ㅇㅇ구청 청소 및 환경미화 용역", issuer: "ㅇㅇ구청", region: "경기", industry: "F-501", industryName: "청소용역", estimatedAmount: 58000000, deadlineAt: "2026-05-07T18:00:00", postedAt: "2026-04-24", isScraped: true,  attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-009", noticeNumber: "20260427-009", title: "ㅇㅇ시청 스마트시티 플랫폼 SI 구축", issuer: "ㅇㅇ시청", region: "광주", industry: "I-602", industryName: "SI구축", estimatedAmount: 2500000000, deadlineAt: "2026-05-20T18:00:00", postedAt: "2026-04-21", isScraped: false, attachmentCount: 8, analysisAvailable: false },
  { id: "T-20260427-010", noticeNumber: "20260427-010", title: "ㅇㅇ교육청 전자칠판 및 교육기자재 구매", issuer: "ㅇㅇ교육청", region: "충남", industry: "G-705", industryName: "교육자재", estimatedAmount: 185000000, deadlineAt: "2026-05-09T18:00:00", postedAt: "2026-04-24", isScraped: true,  attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-011", noticeNumber: "20260427-011", title: "ㅇㅇ공사 교량 안전점검 및 정밀진단 용역", issuer: "ㅇㅇ공사", region: "경북", industry: "C-402", industryName: "교량·터널", estimatedAmount: 420000000, deadlineAt: "2026-05-16T18:00:00", postedAt: "2026-04-21", isScraped: false, attachmentCount: 4, analysisAvailable: false },
  { id: "T-20260427-012", noticeNumber: "20260427-012", title: "ㅇㅇ시청 클라우드 전환 및 데이터센터 이전", issuer: "ㅇㅇ시청", region: "부산", industry: "I-605", industryName: "클라우드전환", estimatedAmount: 780000000, deadlineAt: "2026-05-05T18:00:00", postedAt: "2026-04-25", isScraped: true,  attachmentCount: 7, analysisAvailable: true  },
  { id: "T-20260427-013", noticeNumber: "20260427-013", title: "ㅇㅇ대학교 캠퍼스 경비 및 주차관리 용역", issuer: "ㅇㅇ대학교", region: "대구", industry: "F-502", industryName: "경비용역", estimatedAmount: 90000000, deadlineAt: "2026-05-13T18:00:00", postedAt: "2026-04-23", isScraped: false, attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-014", noticeNumber: "20260427-014", title: "ㅇㅇ구청 소방설비 교체 및 유지보수 공사", issuer: "ㅇㅇ구청", region: "인천", industry: "C-407", industryName: "소방설비", estimatedAmount: 65000000, deadlineAt: "2026-05-17T18:00:00", postedAt: "2026-04-22", isScraped: false, attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-015", noticeNumber: "20260427-015", title: "ㅇㅇ공사 공공데이터 구축 및 운영 용역", issuer: "ㅇㅇ공사", region: "세종", industry: "I-606", industryName: "데이터구축", estimatedAmount: 560000000, deadlineAt: "2026-05-19T18:00:00", postedAt: "2026-04-21", isScraped: false, attachmentCount: 5, analysisAvailable: false },
  { id: "T-20260427-016", noticeNumber: "20260427-016", title: "ㅇㅇ시청 공공청사 건물관리 통합 용역", issuer: "ㅇㅇ시청", region: "경기", industry: "F-503", industryName: "건물관리", estimatedAmount: 210000000, deadlineAt: "2026-05-06T18:00:00", postedAt: "2026-04-25", isScraped: true,  attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-017", noticeNumber: "20260427-017", title: "ㅇㅇ교육청 노후 학교 철거 및 안전공사", issuer: "ㅇㅇ교육청", region: "전북", industry: "C-408", industryName: "철거공사", estimatedAmount: 115000000, deadlineAt: "2026-05-21T18:00:00", postedAt: "2026-04-20", isScraped: false, attachmentCount: 4, analysisAvailable: false },
  { id: "T-20260427-018", noticeNumber: "20260427-018", title: "ㅇㅇ공사 행정시스템 정보보안 용역", issuer: "ㅇㅇ공사", region: "강원", industry: "I-604", industryName: "정보보안용역", estimatedAmount: 145000000, deadlineAt: "2026-05-22T18:00:00", postedAt: "2026-04-20", isScraped: false, attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-019", noticeNumber: "20260427-019", title: "ㅇㅇ시청 공공기관 홍보 대행 용역", issuer: "ㅇㅇ시청", region: "제주", industry: "E-901", industryName: "홍보·광고", estimatedAmount: 72000000, deadlineAt: "2026-05-23T18:00:00", postedAt: "2026-04-20", isScraped: false, attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-020", noticeNumber: "20260427-020", title: "ㅇㅇ대학교 연구역량 강화 컨설팅 용역", issuer: "ㅇㅇ대학교", region: "충북", industry: "S-802", industryName: "컨설팅", estimatedAmount: 88000000, deadlineAt: "2026-05-24T18:00:00", postedAt: "2026-04-19", isScraped: true,  attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-021", noticeNumber: "20260427-021", title: "ㅇㅇ구청 공원 조경 유지관리 용역", issuer: "ㅇㅇ구청", region: "경남", industry: "F-505", industryName: "조경관리", estimatedAmount: 52000000, deadlineAt: "2026-05-25T18:00:00", postedAt: "2026-04-19", isScraped: false, attachmentCount: 2, analysisAvailable: false },
  { id: "T-20260427-022", noticeNumber: "20260427-022", title: "ㅇㅇ공사 업무용 차량 및 장비 구매", issuer: "ㅇㅇ공사", region: "전남", industry: "G-704", industryName: "차량·장비", estimatedAmount: 340000000, deadlineAt: "2026-05-27T18:00:00", postedAt: "2026-04-18", isScraped: false, attachmentCount: 3, analysisAvailable: false },
  { id: "T-20260427-023", noticeNumber: "20260427-023", title: "ㅇㅇ시청 도시 설계 및 도시재생 연구용역", issuer: "ㅇㅇ시청", region: "경기", industry: "S-801", industryName: "연구용역", estimatedAmount: 195000000, deadlineAt: "2026-05-29T18:00:00", postedAt: "2026-04-18", isScraped: false, attachmentCount: 4, analysisAvailable: false },
  { id: "T-20260427-024", noticeNumber: "20260427-024", title: "ㅇㅇ교육청 행사 및 체험학습 이벤트 용역", issuer: "ㅇㅇ교육청", region: "대전", industry: "E-902", industryName: "행사·이벤트", estimatedAmount: 48000000, deadlineAt: "2026-05-31T18:00:00", postedAt: "2026-04-17", isScraped: false, attachmentCount: 1, analysisAvailable: false },
];

// ── SAVED_SEARCHES (5개) ──────────────────────────────────────────────────────
const SAVED_SEARCHES = [
  { id: "SS-1", name: "서울+IT용역",    regions: ["서울"], industries: ["it_service"], amountMin: 50000000, amountMax: 500000000, count: 12 },
  { id: "SS-2", name: "건설 1억+",      regions: [], industries: ["construction"], amountMin: 100000000, amountMax: null, count: 8 },
  { id: "SS-3", name: "이번 주 마감",   regions: [], industries: [], deadlineWithin: 7, count: 5 },
  { id: "SS-4", name: "조경·시설관리",  regions: ["경기", "서울"], industries: ["facility", "construction"], count: 9 },
  { id: "SS-5", name: "공공건축 5억+",  regions: [], industries: ["construction"], amountMin: 500000000, count: 3 },
];

// ── ANALYTICS_BY_TENDER (3개 공고 분석) ──────────────────────────────────────
const ANALYTICS_BY_TENDER = {
  "T-20260427-001": {
    recommendedMin: 218000000,
    recommendedMax: 235000000,
    recommendedCenter: 226000000,
    confidence: 82,
    similarTenderCount: 24,
    dataFreshnessDays: 2,
    industryAvg: 195000000,
    monthlyTrend: [
      { month: "2025-05", avgAmount: 172000000 },
      { month: "2025-06", avgAmount: 178000000 },
      { month: "2025-07", avgAmount: 181000000 },
      { month: "2025-08", avgAmount: 188000000 },
      { month: "2025-09", avgAmount: 192000000 },
      { month: "2025-10", avgAmount: 196000000 },
      { month: "2025-11", avgAmount: 200000000 },
      { month: "2025-12", avgAmount: 207000000 },
      { month: "2026-01", avgAmount: 210000000 },
      { month: "2026-02", avgAmount: 216000000 },
      { month: "2026-03", avgAmount: 220000000 },
      { month: "2026-04", avgAmount: 226000000 },
    ],
    bidRateDist: [
      { range: "85~90%", count: 8,  color: "#10b981" },
      { range: "90~95%", count: 12, color: "#a855f7" },
      { range: "95~100%", count: 4, color: "#f59e0b" },
    ],
    similarTenders: [
      { id: "ST-001", title: "ㅇㅇ시 간선도로 포장 정비공사", bidRate: 91.2, awardAmount: 228000000, openedAt: "2026-03-15" },
      { id: "ST-002", title: "ㅇㅇ구 노후도로 보수 및 안전시설 공사", bidRate: 89.7, awardAmount: 224000000, openedAt: "2026-02-20" },
      { id: "ST-003", title: "ㅇㅇ시 이면도로 정비공사", bidRate: 92.4, awardAmount: 231000000, openedAt: "2026-01-10" },
      { id: "ST-004", title: "ㅇㅇ구 교통약자 보도 개선공사", bidRate: 88.5, awardAmount: 221000000, openedAt: "2025-12-05" },
      { id: "ST-005", title: "ㅇㅇ시 주요 간선도로 노면 교체", bidRate: 90.8, awardAmount: 227000000, openedAt: "2025-11-18" },
    ],
    insights: [
      { type: "info",    text: "최근 12개월 유사 공고의 평균 낙찰률은 90.4%입니다. 추천 투찰가는 예산 대비 90.4% 수준입니다." },
      { type: "warning", text: "동일 업종에서 최근 낙찰가 상승 추세가 관찰됩니다. 투찰가를 보수적으로 설정할 경우 탈락 가능성이 있습니다." },
      { type: "alert",   text: "마감까지 D-3 이내입니다. 서류 준비 및 투찰 시간을 확보하세요." },
    ],
  },
  "T-20260427-005": {
    recommendedMin: 278000000,
    recommendedMax: 301000000,
    recommendedCenter: 289000000,
    confidence: 77,
    similarTenderCount: 18,
    dataFreshnessDays: 3,
    industryAvg: 260000000,
    monthlyTrend: [
      { month: "2025-05", avgAmount: 238000000 },
      { month: "2025-06", avgAmount: 241000000 },
      { month: "2025-07", avgAmount: 245000000 },
      { month: "2025-08", avgAmount: 249000000 },
      { month: "2025-09", avgAmount: 252000000 },
      { month: "2025-10", avgAmount: 256000000 },
      { month: "2025-11", avgAmount: 261000000 },
      { month: "2025-12", avgAmount: 265000000 },
      { month: "2026-01", avgAmount: 270000000 },
      { month: "2026-02", avgAmount: 275000000 },
      { month: "2026-03", avgAmount: 280000000 },
      { month: "2026-04", avgAmount: 289000000 },
    ],
    bidRateDist: [
      { range: "85~90%", count: 5,  color: "#10b981" },
      { range: "90~95%", count: 9,  color: "#a855f7" },
      { range: "95~100%", count: 4, color: "#f59e0b" },
    ],
    similarTenders: [
      { id: "ST-011", title: "ㅇㅇ시 IT인프라 유지보수 통합 용역", bidRate: 90.1, awardAmount: 288000000, openedAt: "2026-03-20" },
      { id: "ST-012", title: "ㅇㅇ구 전산장비 유지관리 용역", bidRate: 87.9, awardAmount: 281000000, openedAt: "2026-02-14" },
      { id: "ST-013", title: "ㅇㅇ공사 정보시스템 유지보수 용역", bidRate: 92.0, awardAmount: 294000000, openedAt: "2026-01-25" },
      { id: "ST-014", title: "ㅇㅇ시 행정망 통합운영 용역", bidRate: 88.5, awardAmount: 283000000, openedAt: "2025-12-10" },
      { id: "ST-015", title: "ㅇㅇ대 전산시스템 유지보수 용역", bidRate: 91.3, awardAmount: 292000000, openedAt: "2025-11-20" },
    ],
    insights: [
      { type: "info",    text: "IT유지보수 업종의 최근 6개월 평균 낙찰률은 90.0%로 안정적입니다." },
      { type: "warning", text: "신뢰도 77% — 유사 공고 표본이 18건으로 다소 적습니다. 추가 시장 조사를 권장합니다." },
      { type: "info",    text: "예산 규모(3억)는 동일 업종 평균(2.6억)보다 높아 경쟁사 수가 많을 수 있습니다." },
    ],
  },
  "T-20260427-012": {
    recommendedMin: 668000000,
    recommendedMax: 725000000,
    recommendedCenter: 697000000,
    confidence: 71,
    similarTenderCount: 15,
    dataFreshnessDays: 5,
    industryAvg: 620000000,
    monthlyTrend: [
      { month: "2025-05", avgAmount: 540000000 },
      { month: "2025-06", avgAmount: 558000000 },
      { month: "2025-07", avgAmount: 572000000 },
      { month: "2025-08", avgAmount: 590000000 },
      { month: "2025-09", avgAmount: 601000000 },
      { month: "2025-10", avgAmount: 615000000 },
      { month: "2025-11", avgAmount: 625000000 },
      { month: "2025-12", avgAmount: 638000000 },
      { month: "2026-01", avgAmount: 650000000 },
      { month: "2026-02", avgAmount: 662000000 },
      { month: "2026-03", avgAmount: 675000000 },
      { month: "2026-04", avgAmount: 697000000 },
    ],
    bidRateDist: [
      { range: "85~90%", count: 6,  color: "#10b981" },
      { range: "90~95%", count: 7,  color: "#a855f7" },
      { range: "95~100%", count: 2, color: "#f59e0b" },
    ],
    similarTenders: [
      { id: "ST-021", title: "ㅇㅇ시 클라우드 전환 및 재해복구 구축", bidRate: 89.5, awardAmount: 698000000, openedAt: "2026-02-28" },
      { id: "ST-022", title: "ㅇㅇ공사 IDC 이전 및 클라우드 마이그레이션", bidRate: 91.2, awardAmount: 711000000, openedAt: "2026-01-15" },
      { id: "ST-023", title: "ㅇㅇ구 데이터센터 이전 용역", bidRate: 86.8, awardAmount: 677000000, openedAt: "2025-12-20" },
      { id: "ST-024", title: "ㅇㅇ시 행정 클라우드 인프라 구축", bidRate: 90.1, awardAmount: 703000000, openedAt: "2025-11-05" },
      { id: "ST-025", title: "ㅇㅇ대 클라우드 전환 및 보안 강화", bidRate: 87.9, awardAmount: 686000000, openedAt: "2025-10-22" },
    ],
    insights: [
      { type: "warning", text: "신뢰도 71% — 클라우드전환 업종 사례가 15건으로 표본이 제한적입니다. 신중한 판단이 필요합니다." },
      { type: "info",    text: "최근 트렌드상 낙찰가가 꾸준히 상승 중입니다. 시장 경쟁 강도가 높아지는 신호일 수 있습니다." },
      { type: "alert",   text: "마감까지 D-5 이내입니다. 대형 공고(7.8억)로 서류 검토 시간을 충분히 확보하세요." },
    ],
  },
};

// ── MOCK_SCRAPS (8개) ─────────────────────────────────────────────────────────
const MOCK_SCRAPS = [
  { id: "SC-001", tenderId: "T-20260427-001", userId: "U-DEMO", memo: "투찰 가능성 검토 중",        createdAt: "2026-04-26 14:23" },
  { id: "SC-002", tenderId: "T-20260427-003", userId: "U-DEMO", memo: "상수도 전문 확인 필요",      createdAt: "2026-04-26 15:10" },
  { id: "SC-003", tenderId: "T-20260427-005", userId: "U-DEMO", memo: "분석 결과 보고 결정",        createdAt: "2026-04-27 09:05" },
  { id: "SC-004", tenderId: "T-20260427-008", userId: "U-DEMO", memo: "담당자 검토 중",             createdAt: "2026-04-27 10:30" },
  { id: "SC-005", tenderId: "T-20260427-010", userId: "U-DEMO", memo: "교육청 실적 있음",           createdAt: "2026-04-27 11:45" },
  { id: "SC-006", tenderId: "T-20260427-012", userId: "U-DEMO", memo: "클라우드 파트너십 활용 가능", createdAt: "2026-04-27 13:20" },
  { id: "SC-007", tenderId: "T-20260427-016", userId: "U-DEMO", memo: "시설관리 실적 확인",         createdAt: "2026-04-28 08:55" },
  { id: "SC-008", tenderId: "T-20260427-020", userId: "U-DEMO", memo: "컨설팅 팀장 문의",           createdAt: "2026-04-28 10:12" },
];

// ── MOCK_PLANNED_BIDS (6개) ───────────────────────────────────────────────────
const MOCK_PLANNED_BIDS = [
  { id: "PB-001", tenderId: "T-20260427-001", status: "REVIEWING",  plannedAmount: 222000000, memo: "예산 부서 승인 대기",       updatedAt: "2026-04-27 10:15" },
  { id: "PB-002", tenderId: "T-20260427-005", status: "REVIEWING",  plannedAmount: 289000000, memo: "IT팀 기술검토 진행 중",     updatedAt: "2026-04-27 14:30" },
  { id: "PB-003", tenderId: "T-20260427-012", status: "CONFIRMED",  plannedAmount: 697000000, memo: "경영진 결재 완료",           updatedAt: "2026-04-28 09:00" },
  { id: "PB-004", tenderId: "T-20260427-003", status: "SUBMITTED",  plannedAmount: 431000000, memo: "나라장터 투찰 완료",         updatedAt: "2026-04-28 11:05" },
  { id: "PB-005", tenderId: "T-20260427-008", status: "WON",        plannedAmount: 53000000,  memo: "낙찰 확정, 계약 준비 중",   updatedAt: "2026-04-28 13:40" },
  { id: "PB-006", tenderId: "T-20260427-010", status: "LOST",       plannedAmount: 170000000, memo: "1원 차이 탈락, 다음 기회",  updatedAt: "2026-04-28 15:00" },
];

// ── 신규 window 노출 ──────────────────────────────────────────────────────────
window.REGIONS              = REGIONS;
window.INDUSTRY_CATEGORIES  = INDUSTRY_CATEGORIES;
window.INDUSTRIES           = INDUSTRIES;
window.MOCK_TENDERS         = MOCK_TENDERS;
window.SAVED_SEARCHES       = SAVED_SEARCHES;
window.ANALYTICS_BY_TENDER  = ANALYTICS_BY_TENDER;
window.MOCK_SCRAPS          = MOCK_SCRAPS;
window.MOCK_PLANNED_BIDS    = MOCK_PLANNED_BIDS;
