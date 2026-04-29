// console.jsx — 결제 환불 위저드 (4스텝)
// UC42 결제·환불 처리. policyMode Tweaks 연동.

const Console = ({ route, navigate, tweaks }) => {
  const { useState, useEffect, useRef } = React;

  const payments = window.MOCK_PAYMENTS;

  // ── 위저드 상태 ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // Step 1 필터
  const [searchMember, setSearchMember] = useState("");
  const [searchStatus, setSearchStatus] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("2026-03-28");
  const [dateTo, setDateTo] = useState("2026-04-28");
  const [filteredPayments, setFilteredPayments] = useState(payments);

  // Step 2 선택
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  // Step 3 환불 정책 (policyMode에서 파생)
  const TODAY = new Date("2026-04-28");

  // Step 4 실행
  const [executing, setExecuting] = useState(false);
  const [execDone, setExecDone] = useState(false);
  const [refundResult, setRefundResult] = useState(null);

  // ── 필터 로직 ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    let result = payments.filter((p) => {
      const matchMember = searchMember.trim() === "" ||
        p.member.includes(searchMember.trim());
      const matchStatus = searchStatus === "ALL" || p.status === searchStatus;
      const matchDate = p.date >= dateFrom && p.date <= dateTo;
      return matchMember && matchStatus && matchDate;
    });
    setFilteredPayments(result);
  };

  const handleReset = () => {
    setSearchMember("");
    setSearchStatus("ALL");
    setDateFrom("2026-03-28");
    setDateTo("2026-04-28");
    setFilteredPayments(payments);
  };

  // ── 환불 금액 산정 ─────────────────────────────────────────────────────────
  const calcRefund = (payment) => {
    if (!payment) return { remainingDays: 0, periodDays: 30, refundAmount: 0 };
    const member = (window.MOCK_MEMBERS || []).find((m) => m.companyId === payment.companyId);
    const nextBilling = member && member.nextBillingAt
      ? new Date(member.nextBillingAt)
      : new Date("2026-05-28");
    const periodDays = 30;
    const remainingDays = Math.max(
      0,
      Math.round((nextBilling - TODAY) / (1000 * 60 * 60 * 24))
    );

    let refundAmount;
    if (tweaks.policyMode === "PRIORITY") {
      // 사용자 친화: 즉시 전액 환불
      refundAmount = payment.amount;
    } else {
      // BROADCAST: 약관·PG 정책 — 일할 환불
      refundAmount = Math.floor(payment.amount * remainingDays / periodDays);
    }
    return { remainingDays, periodDays, refundAmount };
  };

  // ── Step 1 → 2 이동 ────────────────────────────────────────────────────────
  const handleSelectPayment = (p) => {
    if (p.status !== "SUCCESS") return;
    setSelectedPayment(p);
    setRefundReason("");
    setReasonError("");
    setStep(2);
  };

  // ── Step 2 → 3 이동 ────────────────────────────────────────────────────────
  const handleToStep3 = () => {
    if (refundReason.trim().length < 10) {
      setReasonError("환불 사유를 10자 이상 입력하세요.");
      return;
    }
    setReasonError("");
    setStep(3);
  };

  // ── Step 4 실행 ────────────────────────────────────────────────────────────
  const handleExecute = () => {
    setStep(4);
    setExecuting(true);
    setExecDone(false);
    setTimeout(() => {
      const calc = calcRefund(selectedPayment);
      const now = new Date();
      const timeStr = `${window.pad(now.getHours())}:${window.pad(now.getMinutes())}:${window.pad(now.getSeconds())}`;
      setRefundResult({
        refundId: "RF-" + Math.floor(Math.random() * 90000 + 10000),
        processedAt: "2026-04-28 " + timeStr,
        pgRefundTxId: "toss_refund_" + Math.random().toString(36).substring(2, 10),
        refundAmount: calc.refundAmount,
        companyName: selectedPayment.member,
        planName: selectedPayment.plan,
        subscriptionStatus: "CANCELED",
        mailSent: true,
        auditLogged: true,
      });
      setExecuting(false);
      setExecDone(true);
    }, 1500);
  };

  // ── 위저드 리셋 ────────────────────────────────────────────────────────────
  const handleReset2 = () => {
    setStep(1);
    setSelectedPayment(null);
    setRefundReason("");
    setReasonError("");
    setExecuting(false);
    setExecDone(false);
    setRefundResult(null);
    handleReset();
  };

  const calc = selectedPayment ? calcRefund(selectedPayment) : null;
  const policyMode = tweaks.policyMode || "PRIORITY";

  // ── 스텝 라벨 ──────────────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: "결제 조회" },
    { n: 2, label: "선택·사유" },
    { n: 3, label: "정책 검증" },
    { n: 4, label: "실행 결과" },
  ];

  return (
    <div className="max-w-5xl">
      {/* ── 헤더 ── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">결제 환불 위저드</h1>
        <p className="text-xs text-slate-500 font-mono">UC42 결제·환불 처리 — 4단계 워크플로</p>
      </div>

      {/* ── 스텝 진행률 바 ── */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                step === s.n
                  ? "bg-purple-600 border-purple-400 text-white"
                  : step > s.n
                  ? "bg-emerald-700 border-emerald-500 text-emerald-100"
                  : "bg-slate-800 border-slate-600 text-slate-500"
              }`}>
                {step > s.n
                  ? <window.Icon name="check" className="w-4 h-4" />
                  : s.n}
              </div>
              <span className={`text-[11px] font-mono ${step === s.n ? "text-purple-300" : step > s.n ? "text-emerald-400" : "text-slate-600"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition ${step > s.n ? "bg-emerald-600" : "bg-slate-700"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── 2컬럼 레이아웃 ── */}
      <div className="flex gap-6">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">

          {/* ════ STEP 1: 결제 조회 ════ */}
          {step === 1 && (
            <div className="space-y-4">
              <window.SectionLabel color="purple">Step 1 — 결제 조회</window.SectionLabel>

              {/* 필터 바 */}
              <window.Card className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">회원사명</label>
                    <input
                      type="text"
                      value={searchMember}
                      onChange={(e) => setSearchMember(e.target.value)}
                      placeholder="부분 검색..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">결제 상태</label>
                    <select
                      value={searchStatus}
                      onChange={(e) => setSearchStatus(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="ALL">전체</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">조회 시작일</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">조회 종료일</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium transition"
                  >
                    <window.Icon name="search" className="w-3.5 h-3.5" />
                    조회
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition"
                  >
                    초기화
                  </button>
                </div>
              </window.Card>

              {/* 결제 테이블 */}
              <window.Card className="overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">
                    결제 내역 <span className="font-mono text-slate-500 text-xs ml-1">{filteredPayments.length}건</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">SUCCESS 행 클릭 시 선택</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] text-slate-500 bg-slate-950 border-b border-slate-800">
                        <th className="text-left px-4 py-2 font-medium">결제일·시각</th>
                        <th className="text-left px-4 py-2 font-medium">회원사</th>
                        <th className="text-left px-4 py-2 font-medium">플랜</th>
                        <th className="text-right px-4 py-2 font-medium">금액</th>
                        <th className="text-left px-4 py-2 font-medium">상태</th>
                        <th className="text-left px-4 py-2 font-medium font-mono">TX ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((p) => {
                        const isSelectable = p.status === "SUCCESS";
                        return (
                          <tr
                            key={p.id}
                            onClick={() => isSelectable && handleSelectPayment(p)}
                            className={`border-b border-slate-800/50 transition ${
                              isSelectable
                                ? "cursor-pointer hover:bg-slate-800"
                                : "opacity-50 cursor-not-allowed"
                            } ${
                              p.status === "FAILED" ? "bg-rose-950/20" :
                              p.status === "REFUNDED" ? "bg-amber-950/20" : ""
                            }`}
                          >
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-400">
                              {p.date}<br />
                              <span className="text-slate-600">{p.time}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-200">
                              {p.member}
                              {p.fallback && (
                                <span className="ml-1.5 text-[10px] bg-emerald-900/50 text-emerald-400 border border-emerald-700/40 rounded px-1 py-0.5">
                                  재시도 성공
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{p.plan}</td>
                            <td className="px-4 py-2.5 font-mono text-right text-slate-200">
                              ₩{window.fmt(p.amount)}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                p.status === "SUCCESS"  ? "bg-emerald-900/50 text-emerald-300" :
                                p.status === "FAILED"   ? "bg-rose-900/50 text-rose-300" :
                                p.status === "REFUNDED" ? "bg-amber-900/50 text-amber-300" :
                                "bg-slate-800 text-slate-400"
                              }`}>{p.status}</span>
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[11px] text-slate-600">
                              {p.txId || "—"}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredPayments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-600 text-sm">
                            조회 결과가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </window.Card>
            </div>
          )}

          {/* ════ STEP 2: 선택 확인 + 사유 ════ */}
          {step === 2 && selectedPayment && (
            <div className="space-y-4">
              <window.SectionLabel color="purple">Step 2 — 선택 확인 · 환불 사유</window.SectionLabel>

              {/* 선택된 결제 카드 */}
              <window.Card className="p-4 border-purple-700/40">
                <div className="flex items-center gap-2 mb-3">
                  <window.Icon name="check" className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">선택된 결제</span>
                  <span className="text-[11px] font-mono text-slate-500 ml-auto">{selectedPayment.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ["회원사", selectedPayment.member],
                    ["플랜", selectedPayment.plan],
                    ["결제 금액", "₩" + window.fmt(selectedPayment.amount)],
                    ["결제일", selectedPayment.date + " " + selectedPayment.time],
                    ["PG TX ID", selectedPayment.txId],
                    ["채널", selectedPayment.channel],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-slate-500 w-20 flex-shrink-0">{k}</span>
                      <span className={`text-slate-200 font-mono text-xs ${k === "결제 금액" ? "text-white font-bold" : ""}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </window.Card>

              {/* 환불 사유 */}
              <window.Card className="p-4">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  환불 사유 <span className="text-rose-400">*</span>
                  <span className="text-[11px] text-slate-600 font-normal ml-2">(필수, 10자 이상)</span>
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => {
                    setRefundReason(e.target.value);
                    if (e.target.value.trim().length >= 10) setReasonError("");
                  }}
                  placeholder="환불 사유를 상세히 입력하세요. (예: 회원 요청에 따른 중도 해지 환불 처리)"
                  rows={4}
                  maxLength={200}
                  className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition resize-none ${
                    reasonError ? "border-rose-500 focus:border-rose-400" : "border-slate-700 focus:border-purple-500"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {reasonError
                    ? <span className="text-xs text-rose-400">{reasonError}</span>
                    : <span />
                  }
                  <span className="text-[11px] text-slate-600 font-mono">{refundReason.length}/200</span>
                </div>
              </window.Card>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition"
                >
                  이전
                </button>
                <button
                  onClick={handleToStep3}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium transition"
                >
                  다음: 정책 검증
                  <window.Icon name="chevronRight" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════ STEP 3: 환불 정책 검증 ════ */}
          {step === 3 && selectedPayment && calc && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <window.SectionLabel color="purple">Step 3 — 환불 정책 검증</window.SectionLabel>
                <span className="text-[11px] font-mono text-slate-600">Tweaks › policyMode = {policyMode}</span>
              </div>

              {/* 정책 카드 — PRIORITY */}
              {policyMode === "PRIORITY" && (
                <window.Card className="p-4 border-emerald-700/50 bg-emerald-950/30">
                  <div className="flex items-center gap-2 mb-3">
                    <window.Icon name="shieldCheck" className="w-5 h-5 text-emerald-400" />
                    <span className="text-base font-bold text-emerald-300">PRIORITY 모드 — 사용자 친화</span>
                    <span className="ml-auto text-[11px] font-mono text-emerald-600 bg-emerald-900/40 px-2 py-0.5 rounded">즉시 전액 환불</span>
                  </div>
                  <p className="text-sm text-emerald-200 mb-3">
                    PG 정책을 무시하고 결제 금액 전액을 즉시 환불합니다.<br/>
                    구독 권한은 다음 결제 사이클 종료 시까지 유지됩니다.
                  </p>
                  <div className="bg-slate-900 rounded-lg p-3 space-y-2 text-sm border border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">결제 금액</span>
                      <span className="font-mono text-slate-300">₩{window.fmt(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">잔여 일수</span>
                      <span className="font-mono text-slate-300">{calc.remainingDays}일</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-700 pt-2">
                      <span className="text-emerald-300">환불 금액 (전액)</span>
                      <span className="font-mono text-emerald-200 text-lg">₩{window.fmt(calc.refundAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">구독 EXPIRED 시점</span>
                      <span className="font-mono text-slate-400">다음 결제일 이후 자동 만료</span>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-emerald-700 border border-emerald-800/50 rounded p-2 bg-emerald-950/20">
                    약관 §8.2: "PRIORITY 정책 하에서 운영자는 회원의 서비스 이용 경험 보호를 최우선으로 하여<br/>
                    PG사 정책에 관계없이 전액 환불을 제공할 수 있습니다."
                  </div>
                </window.Card>
              )}

              {/* 정책 카드 — BROADCAST */}
              {policyMode === "BROADCAST" && (
                <window.Card className="p-4 border-amber-700/50 bg-amber-950/30">
                  <div className="flex items-center gap-2 mb-3">
                    <window.Icon name="shield" className="w-5 h-5 text-amber-400" />
                    <span className="text-base font-bold text-amber-300">BROADCAST 모드 — 약관·PG 정책 우선</span>
                    <span className="ml-auto text-[11px] font-mono text-amber-600 bg-amber-900/40 px-2 py-0.5 rounded">일할 환불</span>
                  </div>
                  <p className="text-sm text-amber-200 mb-3">
                    PG 정책 및 서비스 약관에 따라 잔여 일수만큼만 일할 계산하여 환불합니다.<br/>
                    환불 즉시 구독이 EXPIRED 처리됩니다.
                  </p>
                  <div className="bg-slate-900 rounded-lg p-3 space-y-2 text-sm border border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">결제 금액</span>
                      <span className="font-mono text-slate-300">₩{window.fmt(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">잔여 일수</span>
                      <span className="font-mono text-slate-300">{calc.remainingDays}일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">구독 기간</span>
                      <span className="font-mono text-slate-300">{calc.periodDays}일</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>계산식</span>
                      <span className="font-mono">
                        ₩{window.fmt(selectedPayment.amount)} × {calc.remainingDays} ÷ {calc.periodDays} = ₩{window.fmt(calc.refundAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-700 pt-2">
                      <span className="text-amber-300">환불 금액 (일할)</span>
                      <span className="font-mono text-amber-200 text-lg">₩{window.fmt(calc.refundAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">구독 EXPIRED 시점</span>
                      <span className="font-mono text-rose-400">환불 처리 즉시</span>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-amber-700 border border-amber-800/50 rounded p-2 bg-amber-950/20">
                    약관 §8.1: "BROADCAST 정책 하에서 환불 금액은 잔여 일수 기준 일할 계산으로 산정되며,<br/>
                    PG사(토스페이먼츠) 환불 정책 MG1107을 따릅니다. 환불 즉시 구독이 종료됩니다."
                  </div>
                </window.Card>
              )}

              {/* policyMode 안내 */}
              <div className="text-[11px] text-slate-600 font-mono">
                * Tweaks 패널에서 policyMode를 변경하면 환불 금액·EXPIRED 시점·약관 인용이 실시간으로 달라집니다.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition"
                >
                  이전
                </button>
                <button
                  onClick={handleExecute}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium transition ${
                    policyMode === "PRIORITY"
                      ? "bg-emerald-700 hover:bg-emerald-600"
                      : "bg-amber-700 hover:bg-amber-600"
                  }`}
                >
                  <window.Icon name="send" className="w-4 h-4" />
                  환불 실행 (₩{window.fmt(calc.refundAmount)})
                </button>
              </div>
            </div>
          )}

          {/* ════ STEP 4: 실행 결과 ════ */}
          {step === 4 && (
            <div className="space-y-4">
              <window.SectionLabel color="purple">Step 4 — 실행 결과</window.SectionLabel>

              {executing && (
                <window.Card className="p-8 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  <p className="text-slate-400 text-sm">PG 환불 API 호출 중...</p>
                  <p className="text-slate-600 text-xs font-mono">토스페이먼츠 환불 요청 → audit_log 기록 → 메일 발송</p>
                </window.Card>
              )}

              {execDone && refundResult && (
                <div className="space-y-3">
                  {/* 성공 배너 */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950 border border-emerald-700">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center flex-shrink-0">
                      <window.Icon name="check" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-emerald-300 font-bold">환불 처리 완료</div>
                      <div className="text-emerald-500 text-xs font-mono">{refundResult.processedAt}</div>
                    </div>
                    <span className="ml-auto font-mono text-2xl font-bold text-emerald-200">
                      ₩{window.fmt(refundResult.refundAmount)}
                    </span>
                  </div>

                  {/* 결과 상세 */}
                  <window.Card className="p-4">
                    <window.SectionLabel color="emerald">환불 영수증</window.SectionLabel>
                    <div className="mt-3 space-y-2 text-sm">
                      {[
                        ["환불 ID", refundResult.refundId],
                        ["처리 일시", refundResult.processedAt],
                        ["PG 환불 TX", refundResult.pgRefundTxId],
                        ["환불 금액", "₩" + window.fmt(refundResult.refundAmount)],
                        ["회원사", refundResult.companyName],
                        ["플랜", refundResult.planName],
                        ["구독 상태", refundResult.subscriptionStatus],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <span className="text-slate-500 w-24 flex-shrink-0">{k}</span>
                          <span className={`font-mono text-xs ${k === "구독 상태" ? "text-rose-300" : k === "환불 금액" ? "text-emerald-300 font-bold" : "text-slate-300"}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </window.Card>

                  {/* 감사 로그 기록 */}
                  <window.Card className="p-4">
                    <window.SectionLabel color="cyan">감사 로그 · 후속 처리</window.SectionLabel>
                    <div className="mt-3 space-y-2">
                      {[
                        { icon: "check", color: "text-emerald-400", text: "audit_logs 기록 완료 — PAYMENT_REFUNDED" },
                        { icon: "check", color: "text-emerald-400", text: "subscriptions.status → CANCELED" },
                        { icon: "check", color: "text-emerald-400", text: "users.role → FREE" },
                        { icon: "mail", color: "text-cyan-400",    text: "환불 확인 메일 발송 완료 (" + (window.MOCK_MEMBERS.find(m => m.name === refundResult.companyName) || {}).contactEmail + ")" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <window.Icon name={item.icon} className={`w-3.5 h-3.5 flex-shrink-0 ${item.color}`} />
                          <span className="text-slate-400">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </window.Card>

                  {/* 회원사 메일 미리보기 */}
                  <window.Card className="p-4">
                    <window.SectionLabel color="amber">회원사 발송 메일 미리보기</window.SectionLabel>
                    <div className="mt-3 bg-slate-950 rounded-lg border border-slate-800 p-3 text-xs font-mono text-slate-400 space-y-1">
                      <div className="text-slate-500">From: noreply@bidinsight.example.kr</div>
                      <div className="text-slate-500">To: {(window.MOCK_MEMBERS.find(m => m.name === refundResult.companyName) || {}).contactEmail}</div>
                      <div className="text-slate-300 mt-2">[환불 완료] {refundResult.companyName}님의 환불이 처리되었습니다</div>
                      <div className="mt-2 text-slate-500 border-t border-slate-800 pt-2">
                        안녕하세요, {refundResult.companyName}님.<br/>
                        환불 금액: ₩{window.fmt(refundResult.refundAmount)}<br/>
                        환불 처리일: {refundResult.processedAt}<br/>
                        구독 상태: {refundResult.subscriptionStatus}<br/>
                        <br/>
                        감사합니다. 공공입찰 인사이트 운영팀
                      </div>
                    </div>
                  </window.Card>

                  <div className="flex gap-2">
                    <button
                      onClick={handleReset2}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm hover:bg-slate-700 transition"
                    >
                      <window.Icon name="refresh" className="w-4 h-4" />
                      새 환불 처리
                    </button>
                    <button
                      onClick={() => navigate('history')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium transition"
                    >
                      <window.Icon name="history" className="w-4 h-4" />
                      결제 이력 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 우측 사이드 패널 (Sticky 요약) ── */}
        <div className="w-72 flex-shrink-0">
          <div className="sticky top-4 space-y-3">
            <window.Card className="p-4">
              <window.SectionLabel color="cyan">진행 상태</window.SectionLabel>
              <div className="mt-3 space-y-2">
                {steps.map((s) => (
                  <div key={s.n} className={`flex items-center gap-2 text-xs ${step === s.n ? "text-purple-300 font-medium" : step > s.n ? "text-emerald-400" : "text-slate-600"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                      step === s.n ? "bg-purple-700 text-white" :
                      step > s.n  ? "bg-emerald-700 text-white" :
                      "bg-slate-800 text-slate-600"
                    }`}>
                      {step > s.n ? "✓" : s.n}
                    </div>
                    {s.label}
                  </div>
                ))}
              </div>
            </window.Card>

            {/* 입력 데이터 누적 요약 */}
            {step >= 2 && selectedPayment && (
              <window.Card className="p-4">
                <window.SectionLabel color="purple">입력 데이터 요약</window.SectionLabel>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">선택 결제</span>
                    <span className="font-mono text-slate-300">{selectedPayment.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">회원사</span>
                    <span className="text-slate-300">{selectedPayment.member}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">결제 금액</span>
                    <span className="font-mono text-slate-200 font-bold">₩{window.fmt(selectedPayment.amount)}</span>
                  </div>
                  {step >= 2 && refundReason && (
                    <div>
                      <span className="text-slate-500 block">환불 사유</span>
                      <span className="text-slate-400 leading-tight">{refundReason.substring(0, 40)}{refundReason.length > 40 ? "..." : ""}</span>
                    </div>
                  )}
                  {step >= 3 && calc && (
                    <>
                      <div className="border-t border-slate-800 pt-2">
                        <span className="text-slate-500 block">정책 모드</span>
                        <span className={`font-mono font-bold ${policyMode === "PRIORITY" ? "text-emerald-400" : "text-amber-400"}`}>{policyMode}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">환불 금액</span>
                        <span className="font-mono text-white font-bold text-base">₩{window.fmt(calc.refundAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </window.Card>
            )}

            {/* policyMode 현황 */}
            <window.Card className="p-3">
              <div className="text-[10px] text-slate-600 font-mono mb-1">Tweaks › policyMode</div>
              <div className={`text-sm font-bold font-mono ${policyMode === "PRIORITY" ? "text-emerald-400" : "text-amber-400"}`}>
                {policyMode}
              </div>
              <div className="text-[10px] text-slate-600 mt-1">
                {policyMode === "PRIORITY"
                  ? "Step 3에서 전액 환불 적용"
                  : "Step 3에서 일할 환불 적용"}
              </div>
            </window.Card>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Console = Console;
