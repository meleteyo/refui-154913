// history.jsx — 결제 이력 + 감사 로그
// UC42 + AuditLog 화면. 행 클릭 시 우측 사이드패널.

const History = ({ route, navigate, tweaks }) => {
  const { useState, useMemo } = React;

  const payments = window.MOCK_PAYMENTS;
  const auditLogs = window.AUDIT_LOGS;

  // ── 필터 상태 ──────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [memberSearch, setMemberSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [retryToast, setRetryToast] = useState(null);

  // ── 필터 적용 ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
      const matchMember = memberSearch.trim() === "" || p.member.includes(memberSearch.trim());
      const matchFrom = !dateFrom || p.date >= dateFrom;
      const matchTo   = !dateTo   || p.date <= dateTo;
      return matchStatus && matchMember && matchFrom && matchTo;
    });
  }, [statusFilter, memberSearch, dateFrom, dateTo]);

  // ── 재시도 시뮬 ────────────────────────────────────────────────────────────
  const handleRetry = (p) => {
    setRetryToast("PAY-RETRY-" + p.id + " 재시도 요청 전송됨 (시뮬)");
    setTimeout(() => setRetryToast(null), 3000);
  };

  // ── CSV 내보내기 시뮬 ──────────────────────────────────────────────────────
  const handleCSV = () => {
    setRetryToast("CSV 내보내기 시뮬 — payments_export_2026-04-28.csv");
    setTimeout(() => setRetryToast(null), 3000);
  };

  const logs = selectedRow ? (auditLogs[selectedRow.id] || []) : [];

  // 상태 스타일 헬퍼
  const statusStyle = (status) => {
    if (status === "SUCCESS")  return "bg-emerald-900/50 text-emerald-300 border-emerald-700/40";
    if (status === "FAILED")   return "bg-rose-900/50 text-rose-300 border-rose-700/40";
    if (status === "REFUNDED") return "bg-amber-900/50 text-amber-300 border-amber-700/40";
    if (status === "PENDING")  return "bg-slate-800 text-slate-300 border-slate-600";
    return "bg-slate-800 text-slate-400 border-slate-700";
  };

  const rowBg = (p) => {
    if (p.status === "FAILED")   return "bg-rose-950/15";
    if (p.status === "REFUNDED") return "bg-amber-950/15";
    return "";
  };

  const actionLabel = (action) => {
    const map = {
      PAYMENT_REQUESTED:   "결제 요청",
      PG_CALLED:           "PG 호출",
      PG_RESPONSE_SUCCESS: "PG 성공",
      PG_RESPONSE_FAILED:  "PG 실패",
      PG_PENDING:          "PG 대기",
      SUBSCRIPTION_RENEWED:"구독 갱신",
      RECEIPT_SENT:        "영수증 발송",
      FAILURE_RECORDED:    "실패 기록",
      FAILURE_MAIL_SENT:   "실패 메일",
      FAILURE_COUNT_RESET: "실패 초기화",
      REFUND_REQUESTED:    "환불 요청",
      PG_REFUND_CALLED:    "PG 환불",
      PAYMENT_REFUNDED:    "환불 완료",
    };
    return map[action] || action;
  };

  const actionColor = (action) => {
    if (action.includes("SUCCESS") || action.includes("RENEWED") || action.includes("RESET") || action.includes("REFUNDED")) return "text-emerald-400";
    if (action.includes("FAILED") || action.includes("FAILURE")) return "text-rose-400";
    if (action.includes("REFUND")) return "text-amber-400";
    if (action.includes("PENDING")) return "text-slate-400";
    return "text-purple-400";
  };

  return (
    <div className="max-w-full">
      {/* ── 헤더 ── */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">결제 이력 · 감사 로그</h1>
        <p className="text-xs text-slate-500 font-mono">UC42 + AuditLog — 행 클릭 시 우측 상세 패널 열림</p>
      </div>

      {/* ── 필터 바 ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* 상태 토글 */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
          {["ALL", "SUCCESS", "FAILED", "REFUNDED", "PENDING"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                statusFilter === s
                  ? s === "ALL"      ? "bg-slate-700 text-white"
                  : s === "SUCCESS"  ? "bg-emerald-800 text-emerald-200"
                  : s === "FAILED"   ? "bg-rose-900 text-rose-200"
                  : s === "REFUNDED" ? "bg-amber-900 text-amber-200"
                  : "bg-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 회원사 검색 */}
        <div className="relative">
          <window.Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="회원사 검색..."
            className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition w-44"
          />
        </div>

        {/* 기간 */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition"
        />
        <span className="text-slate-600 text-xs">~</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition"
        />

        <span className="text-slate-600 text-xs font-mono">{filtered.length}건</span>

        {/* CSV */}
        <button
          onClick={handleCSV}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:bg-slate-700 transition"
        >
          <window.Icon name="download" className="w-3.5 h-3.5" />
          CSV 내보내기
        </button>
      </div>

      {/* ── 메인 레이아웃: 테이블 + 사이드패널 ── */}
      <div className="flex gap-4">
        {/* 결제 테이블 */}
        <div className={`${selectedRow ? "flex-1 min-w-0" : "w-full"}`}>
          <window.Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-slate-500 bg-slate-950 border-b border-slate-800">
                    <th className="text-left px-4 py-2.5 font-medium">결제 ID</th>
                    <th className="text-left px-4 py-2.5 font-medium">일시</th>
                    <th className="text-left px-4 py-2.5 font-medium">회원사</th>
                    <th className="text-left px-4 py-2.5 font-medium">플랜</th>
                    <th className="text-right px-4 py-2.5 font-medium">금액</th>
                    <th className="text-left px-4 py-2.5 font-medium">PG</th>
                    <th className="text-left px-4 py-2.5 font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedRow(selectedRow && selectedRow.id === p.id ? null : p)}
                      className={`border-b border-slate-800/50 cursor-pointer transition hover:bg-slate-800 ${rowBg(p)} ${
                        selectedRow && selectedRow.id === p.id ? "bg-slate-800 ring-1 ring-inset ring-purple-700/50" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{p.id}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                        {p.date}<br/>
                        <span className="text-slate-700">{p.time}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-200">
                        <span>{p.member}</span>
                        {p.fallback && (
                          <span className="ml-1.5 text-[10px] bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 rounded px-1 py-0.5 font-mono">
                            재시도 성공
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{p.plan}</td>
                      <td className="px-4 py-2.5 font-mono text-right text-slate-200">
                        ₩{window.fmt(p.amount)}
                        {p.status === "REFUNDED" && p.refundAmount && (
                          <div className="text-[10px] text-amber-400">
                            환불 ₩{window.fmt(p.refundAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.channel}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${statusStyle(p.status)}`}>
                          {p.status}
                        </span>
                        {p.status === "FAILED" && p.reason && (
                          <div className="text-[10px] text-rose-500 font-mono mt-0.5">{p.reason}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-600 text-sm">
                        조회 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </window.Card>
        </div>

        {/* 우측 사이드패널 */}
        {selectedRow && (
          <div className="w-96 flex-shrink-0">
            <window.Card className="overflow-hidden">
              {/* 패널 헤더 */}
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div>
                  <div className="text-sm font-medium text-slate-200 font-mono">{selectedRow.id}</div>
                  <div className="text-[11px] text-slate-500">{selectedRow.member}</div>
                </div>
                <button
                  onClick={() => setSelectedRow(null)}
                  className="text-slate-500 hover:text-slate-300 transition p-1"
                >
                  <window.Icon name="x" className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)]">
                {/* 결제 상세 */}
                <div>
                  <window.SectionLabel color="purple">결제 상세</window.SectionLabel>
                  <div className="mt-2 space-y-1.5 text-xs">
                    {[
                      ["결제 ID",   selectedRow.id],
                      ["회원사",   selectedRow.member],
                      ["플랜",     selectedRow.plan],
                      ["금액",     "₩" + window.fmt(selectedRow.amount)],
                      ["결제일",   selectedRow.date + " " + selectedRow.time],
                      ["채널",     selectedRow.channel],
                      ["PG TX ID", selectedRow.txId || "—"],
                      ["상태",     selectedRow.status],
                      ["실패 사유", selectedRow.reason || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-slate-500 w-20 flex-shrink-0">{k}</span>
                        <span className={`font-mono flex-1 ${
                          k === "상태" ? (
                            selectedRow.status === "SUCCESS" ? "text-emerald-300" :
                            selectedRow.status === "FAILED"  ? "text-rose-300" :
                            selectedRow.status === "REFUNDED"? "text-amber-300" : "text-slate-300"
                          ) : k === "실패 사유" && selectedRow.reason ? "text-rose-400" : "text-slate-300"
                        }`}>{v}</span>
                      </div>
                    ))}
                    {selectedRow.status === "REFUNDED" && selectedRow.refundAmount && (
                      <>
                        <div className="flex gap-2">
                          <span className="text-slate-500 w-20 flex-shrink-0">환불 금액</span>
                          <span className="font-mono text-amber-300">₩{window.fmt(selectedRow.refundAmount)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-500 w-20 flex-shrink-0">환불일</span>
                          <span className="font-mono text-slate-300">{selectedRow.refundedAt}</span>
                        </div>
                      </>
                    )}
                    {selectedRow.fallback && (
                      <div className="flex gap-2 mt-1">
                        <span className="text-slate-500 w-20 flex-shrink-0">비고</span>
                        <span className="text-emerald-400 text-[11px]">자동 재시도 성공 (24h fallback)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 감사 로그 타임라인 */}
                <div>
                  <window.SectionLabel color="cyan">감사 로그 타임라인</window.SectionLabel>
                  {logs.length === 0 ? (
                    <p className="text-xs text-slate-600 mt-2">로그 없음</p>
                  ) : (
                    <div className="mt-2 space-y-0 relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800" />
                      {logs.map((log, i) => (
                        <div key={i} className="relative pl-5 pb-3">
                          <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            log.action.includes("SUCCESS") || log.action.includes("RENEWED") || log.action.includes("RESET") || log.action.includes("REFUNDED")
                              ? "border-emerald-600 bg-emerald-950"
                              : log.action.includes("FAILED") || log.action.includes("FAILURE")
                              ? "border-rose-600 bg-rose-950"
                              : log.action.includes("REFUND")
                              ? "border-amber-600 bg-amber-950"
                              : "border-purple-700 bg-slate-900"
                          }`} />
                          <div className="text-[11px] font-mono text-slate-600">{log.at}</div>
                          <div className={`text-xs font-medium ${actionColor(log.action)}`}>
                            {actionLabel(log.action)}
                          </div>
                          <div className="text-[11px] text-slate-500">{log.note}</div>
                          <div className="text-[10px] font-mono text-slate-700">actor: {log.actor}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  {selectedRow.status === "FAILED" && (
                    <button
                      onClick={() => handleRetry(selectedRow)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-900/40 border border-rose-700/40 text-rose-300 text-sm hover:bg-rose-900/70 transition"
                    >
                      <window.Icon name="refresh" className="w-4 h-4" />
                      재시도 요청 (시뮬)
                    </button>
                  )}
                  {selectedRow.status === "REFUNDED" && (
                    <button
                      onClick={() => navigate('console')}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm hover:bg-amber-900/60 transition"
                    >
                      <window.Icon name="file" className="w-4 h-4" />
                      환불 영수증 보기
                    </button>
                  )}
                  {selectedRow.status === "SUCCESS" && (
                    <button
                      onClick={() => navigate('console')}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-700/40 text-purple-300 text-sm hover:bg-purple-900/60 transition"
                    >
                      <window.Icon name="send" className="w-4 h-4" />
                      이 결제 환불하기
                    </button>
                  )}
                </div>
              </div>
            </window.Card>
          </div>
        )}
      </div>

      {/* ── 토스트 ── */}
      {retryToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-600 text-sm text-slate-200 shadow-xl">
          <window.Icon name="check" className="w-4 h-4 text-emerald-400" />
          {retryToast}
        </div>
      )}
    </div>
  );
};

window.History = History;
