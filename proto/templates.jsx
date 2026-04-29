// templates.jsx — 공지·알림 템플릿 관리
// UC43 공지사항관리 + 알림 모듈. 3컬럼 레이아웃.

const Templates = ({ route, navigate, tweaks }) => {
  const { useState, useMemo } = React;

  const initialTemplates = window.TEMPLATES;

  // ── 상태 ──────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState(
    initialTemplates.map((t) => ({ ...t }))
  );
  const [selectedId, setSelectedId] = useState(initialTemplates[0].id);
  const [saveToast, setSaveToast] = useState(null);

  // 선택된 템플릿
  const selected = useMemo(
    () => templates.find((t) => t.id === selectedId) || templates[0],
    [templates, selectedId]
  );

  // 편집 핸들러
  const handleEdit = (field, value) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedId ? { ...t, [field]: value } : t
      )
    );
  };

  // 활성 토글
  const handleToggleActive = (id) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  // 저장 시뮬
  const handleSave = () => {
    setSaveToast(selected.name + " 저장되었습니다 (시뮬)");
    setTimeout(() => setSaveToast(null), 2500);
  };

  // 변수 치환 (라이브 프리뷰용)
  const PREVIEW_VARS = {
    "{{회사명}}":   "주식회사 가나다",
    "{{플랜명}}":   "PRO",
    "{{금액}}":     "₩290,000",
    "{{환불일}}":   "2026-04-28",
    "{{잔여일수}}": "15",
    "{{사유}}":     "카드 한도 초과",
  };

  const applyVars = (text) => {
    if (!text) return "";
    let result = text;
    Object.entries(PREVIEW_VARS).forEach(([k, v]) => {
      result = result.split(k).join(v);
    });
    return result;
  };

  // 타입별 분류
  const noticeTemplates = templates.filter((t) => t.type === "NOTICE");
  const emailTemplates  = templates.filter((t) => t.type === "EMAIL");

  return (
    <div className="max-w-full">
      {/* ── 헤더 ── */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">공지·알림 템플릿</h1>
        <p className="text-xs text-slate-500 font-mono">UC43 공지사항관리 + 알림 모듈 — 편집 즉시 우측 프리뷰 반영</p>
      </div>

      {/* ── 3컬럼 레이아웃 ── */}
      <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[600px]">

        {/* ── 좌: 템플릿 목록 (240px) ── */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-3">
          {/* NOTICE 그룹 */}
          <div>
            <window.SectionLabel color="amber">NOTICE ({noticeTemplates.length})</window.SectionLabel>
            <div className="mt-2 space-y-1">
              {noticeTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition group ${
                    selectedId === t.id
                      ? "bg-slate-800 border-purple-700/60 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium leading-tight truncate pr-2">{t.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleActive(t.id); }}
                      className={`w-7 h-4 rounded-full flex-shrink-0 relative transition ${t.active ? "bg-emerald-600" : "bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${t.active ? "left-3.5" : "left-0.5"}`} />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-600">{t.id} · {t.version}</div>
                </button>
              ))}
            </div>
          </div>

          {/* EMAIL 그룹 */}
          <div>
            <window.SectionLabel color="cyan">EMAIL ({emailTemplates.length})</window.SectionLabel>
            <div className="mt-2 space-y-1">
              {emailTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition group ${
                    selectedId === t.id
                      ? "bg-slate-800 border-purple-700/60 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium leading-tight truncate pr-2">{t.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleActive(t.id); }}
                      className={`w-7 h-4 rounded-full flex-shrink-0 relative transition ${t.active ? "bg-emerald-600" : "bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${t.active ? "left-3.5" : "left-0.5"}`} />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-600">{t.id} · {t.version}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 중: 편집 폼 (flex-1) ── */}
        <div className="flex-1 min-w-0 flex flex-col">
          <window.Card className="flex-1 flex flex-col overflow-hidden">
            {/* 폼 헤더 */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  selected.type === "NOTICE"
                    ? "bg-amber-900/40 text-amber-300 border-amber-700/40"
                    : "bg-cyan-900/40 text-cyan-300 border-cyan-700/40"
                }`}>{selected.type}</span>
                <span className="text-xs font-mono text-slate-500">{selected.id}</span>
                <span className="text-xs font-mono text-slate-600">{selected.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono ${selected.active ? "text-emerald-400" : "text-slate-600"}`}>
                  {selected.active ? "활성" : "비활성"}
                </span>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-medium transition"
                >
                  <window.Icon name="check" className="w-3.5 h-3.5" />
                  저장 (시뮬)
                </button>
              </div>
            </div>

            {/* 편집 영역 */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {/* 이름 */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">템플릿 이름</label>
                <input
                  type="text"
                  value={selected.name}
                  onChange={(e) => handleEdit("name", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* 제목 */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  제목 (Subject)
                  <span className="ml-2 text-slate-600 font-mono text-[10px]">변수: {"{{회사명}}"} {"{{플랜명}}"}</span>
                </label>
                <input
                  type="text"
                  value={selected.subject}
                  onChange={(e) => handleEdit("subject", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* 본문 */}
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">
                  본문 (Body)
                  <span className="ml-2 text-slate-600 font-mono text-[10px]">{"{{회사명}}"} {"{{플랜명}}"} {"{{금액}}"} {"{{환불일}}"} {"{{잔여일수}}"} {"{{사유}}"}</span>
                </label>
                <textarea
                  value={selected.body}
                  onChange={(e) => handleEdit("body", e.target.value)}
                  rows={14}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition resize-none font-mono leading-relaxed"
                />
              </div>

              {/* 변수 안내 */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 font-mono mb-2">사용 가능한 치환 변수</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PREVIEW_VARS).map(([k, v]) => (
                    <span key={k} className="text-[10px] font-mono">
                      <span className="text-purple-400">{k}</span>
                      <span className="text-slate-600"> → </span>
                      <span className="text-slate-400">{v}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </window.Card>
        </div>

        {/* ── 우: 라이브 프리뷰 (400px) ── */}
        <div className="w-96 flex-shrink-0 flex flex-col">
          <window.Card className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
              <window.Icon name="eye" className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-400">라이브 프리뷰</span>
              <span className="text-[10px] font-mono text-slate-600 ml-1">(편집 즉시 반영)</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selected.type === "EMAIL" ? (
                /* EMAIL 타입: 메일 클라이언트 스타일 */
                <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                  {/* 메일 헤더 */}
                  <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 w-8">From</span>
                      <span className="text-xs font-mono text-slate-400">noreply@bidinsight.example.kr</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 w-8">To</span>
                      <span className="text-xs font-mono text-slate-400">manager@gana.example.kr</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] text-slate-500 w-8">제목</span>
                      <span className="text-xs text-slate-200 leading-tight flex-1">{applyVars(selected.subject)}</span>
                    </div>
                  </div>
                  {/* 메일 본문 */}
                  <div className="px-4 py-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: tweaks.brandColor }}>
                        <window.Icon name="mail" className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{tweaks.brandName}</div>
                        <div className="text-[10px] text-slate-500">운영팀</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {applyVars(selected.body)}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-600 font-mono">
                      이 메일은 {tweaks.brandName} 시스템에서 자동 발송되었습니다.
                    </div>
                  </div>
                </div>
              ) : (
                /* NOTICE 타입: 공지사항 카드 스타일 */
                <div className="bg-slate-900 border border-amber-700/30 rounded-xl overflow-hidden">
                  {/* 공지 헤더 */}
                  <div className="bg-amber-950/40 px-4 py-3 border-b border-amber-700/30 flex items-center gap-2">
                    <window.Icon name="bell" className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">공지사항</span>
                    <span className="ml-auto text-[10px] font-mono text-amber-700">2026-04-28</span>
                  </div>
                  {/* 공지 본문 */}
                  <div className="px-4 py-4">
                    <h3 className="text-sm font-bold text-slate-100 mb-3 leading-tight">
                      {applyVars(selected.subject)}
                    </h3>
                    <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {applyVars(selected.body)}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-slate-600 font-mono">{tweaks.brandName} 운영팀</span>
                      <button className="text-xs px-3 py-1 rounded-lg bg-amber-800/50 border border-amber-700/40 text-amber-300 hover:bg-amber-800 transition">
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 템플릿 메타 정보 */}
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] text-slate-600 font-mono mb-2">템플릿 메타</div>
                {[
                  ["ID", selected.id],
                  ["버전", selected.version],
                  ["타입", selected.type],
                  ["활성", selected.active ? "ON" : "OFF"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-[11px]">
                    <span className="text-slate-600 w-12">{k}</span>
                    <span className={`font-mono ${
                      k === "활성" ? (selected.active ? "text-emerald-400" : "text-slate-600") : "text-slate-400"
                    }`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </window.Card>
        </div>
      </div>

      {/* ── 저장 토스트 ── */}
      {saveToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900 border border-emerald-700 text-sm text-emerald-200 shadow-xl">
          <window.Icon name="check" className="w-4 h-4 text-emerald-400" />
          {saveToast}
        </div>
      )}
    </div>
  );
};

window.Templates = Templates;
