// scraps.jsx — UC24 스크랩 + 참여예정
const { useState, useMemo } = React;

const KANBAN_COLS = [
  { id: 'REVIEWING',  label: '검토중',  color: 'text-slate-300',   dot: 'bg-slate-400' },
  { id: 'CONFIRMED',  label: '확정',    color: 'text-purple-300',  dot: 'bg-purple-400' },
  { id: 'SUBMITTED',  label: '투찰완료', color: 'text-cyan-300',    dot: 'bg-cyan-400' },
  { id: 'WON',        label: '낙찰',    color: 'text-emerald-300', dot: 'bg-emerald-400' },
  { id: 'LOST',       label: '탈락',    color: 'text-rose-300',    dot: 'bg-rose-400' },
];

function Scraps(props) {
  const { navigate, tweaks } = props;
  const brandColor = (tweaks && tweaks.brandColor) || '#a855f7';

  const [activeMainTab, setActiveMainTab] = useState('scraps');
  const [scrapSort, setScrapSort]         = useState('createdAt');
  const [scraps, setScraps]               = useState(window.MOCK_SCRAPS || []);
  const [plannedBids, setPlannedBids]     = useState(window.MOCK_PLANNED_BIDS || []);
  const [selectedPb, setSelectedPb]       = useState(null); // 사이드패널
  const [toast, setToast]                 = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function getTender(id) {
    return (window.MOCK_TENDERS || []).find(t => t.id === id);
  }

  function dDay(deadlineAt) {
    if (!deadlineAt) return null;
    const now  = new Date('2026-04-29T00:00:00');
    const dead = new Date(deadlineAt);
    return Math.ceil((dead - now) / (1000 * 60 * 60 * 24));
  }

  function fmtAmt(n) {
    if (!n) return '—';
    if (n >= 100000000) return '₩' + (n / 100000000).toFixed(1) + '억';
    return '₩' + (n / 10000000).toFixed(0) + '천만';
  }

  // ── 스크랩 정렬 ──────────────────────────────────────────────────────────
  const sortedScraps = useMemo(() => {
    const list = [...scraps];
    if (scrapSort === 'createdAt') {
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    if (scrapSort === 'deadline') {
      return list.sort((a, b) => {
        const ta = getTender(a.tenderId);
        const tb = getTender(b.tenderId);
        if (!ta || !tb) return 0;
        return new Date(ta.deadlineAt) - new Date(tb.deadlineAt);
      });
    }
    return list;
  }, [scraps, scrapSort]);

  function removeScrap(id) {
    setScraps(prev => prev.filter(s => s.id !== id));
    showToast('스크랩이 제거되었습니다');
  }

  function updateMemo(id, memo) {
    setScraps(prev => prev.map(s => s.id === id ? { ...s, memo } : s));
  }

  function registerPlanFromScrap(tenderId) {
    const exists = plannedBids.find(p => p.tenderId === tenderId);
    if (exists) { showToast('이미 참여예정에 등록되어 있습니다'); return; }
    const newPb = {
      id: 'PB-' + Date.now(),
      tenderId,
      status: 'REVIEWING',
      plannedAmount: null,
      memo: '',
      updatedAt: '2026-04-29 00:00',
    };
    setPlannedBids(prev => [...prev, newPb]);
    setActiveMainTab('bids');
    showToast('참여예정에 등록되었습니다');
  }

  function updatePb(id, patch) {
    setPlannedBids(prev => prev.map(p => p.id === id ? { ...p, ...patch, updatedAt: '2026-04-29 00:00' } : p));
    if (selectedPb && selectedPb.id === id) {
      setSelectedPb(prev => ({ ...prev, ...patch }));
    }
  }

  // ── 칸반 컬럼별 그룹 ──────────────────────────────────────────────────────
  const kanbanGroups = useMemo(() => {
    const map = {};
    KANBAN_COLS.forEach(c => { map[c.id] = []; });
    plannedBids.forEach(pb => {
      if (map[pb.status]) map[pb.status].push(pb);
    });
    return map;
  }, [plannedBids]);

  return (
    <div className="space-y-5">
      {/* 메인 탭 */}
      <div className="flex gap-1 border-b border-slate-800">
        <button
          onClick={() => setActiveMainTab('scraps')}
          className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
            activeMainTab === 'scraps'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          스크랩 ({scraps.length})
        </button>
        <button
          onClick={() => setActiveMainTab('bids')}
          className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
            activeMainTab === 'bids'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          참여예정 ({plannedBids.length})
        </button>
      </div>

      {/* ── 탭 1: 스크랩 ───────────────────────────────────────────────── */}
      {activeMainTab === 'scraps' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <window.SectionLabel color="purple">스크랩 목록</window.SectionLabel>
            <select
              className="bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
              value={scrapSort}
              onChange={e => setScrapSort(e.target.value)}
            >
              <option value="createdAt">최근 스크랩순</option>
              <option value="deadline">마감 임박순</option>
            </select>
          </div>

          {sortedScraps.length === 0 && (
            <window.Card className="p-12 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl text-slate-700">☆</span>
              <div className="text-slate-400 text-sm">스크랩한 공고가 없습니다.</div>
              <button onClick={() => navigate('search')} className="text-xs text-purple-400 underline">공고 검색하러 가기</button>
            </window.Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedScraps.map(sc => {
              const tender = getTender(sc.tenderId);
              if (!tender) return null;
              const dd = dDay(tender.deadlineAt);
              const hasAnalytics = !!(window.ANALYTICS_BY_TENDER || {})[tender.id];
              return (
                <window.Card key={sc.id} className="p-4 flex flex-col gap-3 hover:border-slate-600 transition">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{tender.noticeNumber}</span>
                    <span className={`font-mono text-xs font-semibold ${dd <= 3 ? 'text-rose-400' : dd <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>
                      D-{dd}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">{tender.issuer}</div>
                  <div className="text-sm font-medium text-slate-100 leading-snug line-clamp-2">{tender.title}</div>
                  <div className="font-mono text-base text-emerald-400 font-bold">{fmtAmt(tender.estimatedAmount)}</div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.region}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.industryName}</span>
                  </div>

                  {/* 메모 인라인 입력 */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500">메모</div>
                    <input
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none"
                      placeholder="메모를 입력하세요…"
                      value={sc.memo}
                      onChange={e => updateMemo(sc.id, e.target.value)}
                    />
                  </div>

                  {/* 스크랩 날짜 */}
                  <div className="text-[10px] text-slate-600">{sc.createdAt} 스크랩</div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-1.5 mt-auto pt-1 border-t border-slate-800 flex-wrap">
                    <button
                      onClick={() => navigate('tenderDetail', { tenderId: tender.id })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition"
                    >
                      상세
                    </button>
                    {hasAnalytics && (
                      <button
                        onClick={() => navigate('analytics', { tenderId: tender.id })}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 transition"
                      >
                        분석
                      </button>
                    )}
                    <button
                      onClick={() => registerPlanFromScrap(tender.id)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 transition"
                    >
                      참여예정
                    </button>
                    <button
                      onClick={() => removeScrap(sc.id)}
                      className="ml-auto px-2.5 py-1.5 rounded-lg text-[11px] text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition"
                    >
                      삭제
                    </button>
                  </div>
                </window.Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 탭 2: 참여예정 칸반 ─────────────────────────────────────────── */}
      {activeMainTab === 'bids' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLS.map(col => (
            <div key={col.id} className="w-64 shrink-0 space-y-3">
              {/* 컬럼 헤더 */}
              <div className="flex items-center gap-2 px-1">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                <span className="text-[10px] text-slate-600 font-mono ml-auto">{kanbanGroups[col.id].length}</span>
              </div>

              {/* 카드 목록 */}
              {kanbanGroups[col.id].length === 0 && (
                <div className="h-20 rounded-xl border border-dashed border-slate-700/60 flex items-center justify-center">
                  <span className="text-[10px] text-slate-600">없음</span>
                </div>
              )}
              {kanbanGroups[col.id].map(pb => {
                const tender = getTender(pb.tenderId);
                if (!tender) return null;
                return (
                  <window.Card
                    key={pb.id}
                    className="p-3 space-y-2 cursor-pointer hover:border-slate-600 transition"
                    onClick={() => setSelectedPb(pb)}
                  >
                    <div className="text-xs font-medium text-slate-200 leading-snug line-clamp-2">{tender.title}</div>
                    <div className="text-[11px] text-slate-500">{tender.issuer}</div>
                    {pb.plannedAmount && (
                      <div className="font-mono text-xs text-emerald-400">{fmtAmt(pb.plannedAmount)}</div>
                    )}
                    {pb.memo && (
                      <div className="text-[10px] text-slate-500 line-clamp-2 italic">{pb.memo}</div>
                    )}
                    <div className="text-[10px] text-slate-600">{pb.updatedAt}</div>
                    {/* 상태 변경 select */}
                    <select
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none"
                      value={pb.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { updatePb(pb.id, { status: e.target.value }); showToast('상태가 변경되었습니다'); }}
                    >
                      {KANBAN_COLS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </window.Card>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── 사이드 패널 ─────────────────────────────────────────────────── */}
      {selectedPb && (() => {
        const pb     = plannedBids.find(p => p.id === selectedPb.id) || selectedPb;
        const tender = getTender(pb.tenderId);
        if (!tender) return null;
        const dd = dDay(tender.deadlineAt);
        return (
          <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedPb(null)} />
            <div className="relative w-96 bg-slate-950 border-l border-slate-800 flex flex-col overflow-y-auto">
              {/* 패널 헤더 */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <window.SectionLabel color="purple">참여예정 상세</window.SectionLabel>
                <button
                  onClick={() => setSelectedPb(null)}
                  className="text-slate-500 hover:text-slate-200 transition"
                >
                  <window.Icon name="x" className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5 flex-1">
                {/* 공고 정보 */}
                <div className="space-y-1.5">
                  <div className="text-sm font-semibold text-slate-100 leading-snug">{tender.title}</div>
                  <div className="text-xs text-slate-400">{tender.issuer}</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="font-mono text-emerald-400 font-bold">{fmtAmt(tender.estimatedAmount)}</span>
                    <span className={`font-mono ${dd <= 3 ? 'text-rose-400' : dd <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>D-{dd}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate('tenderDetail', { tenderId: tender.id })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition"
                    >
                      공고 상세
                    </button>
                    {(window.ANALYTICS_BY_TENDER || {})[tender.id] && (
                      <button
                        onClick={() => navigate('analytics', { tenderId: tender.id })}
                        className="px-3 py-1.5 rounded-lg text-xs text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 transition"
                      >
                        분석
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800" />

                {/* 상태 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">진행 상태</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
                    value={pb.status}
                    onChange={e => { updatePb(pb.id, { status: e.target.value }); showToast('상태가 변경되었습니다'); }}
                  >
                    {KANBAN_COLS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* 투찰 예정금액 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">투찰 예정금액 (원)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono outline-none"
                    placeholder="예: 220000000"
                    value={pb.plannedAmount || ''}
                    onChange={e => updatePb(pb.id, { plannedAmount: e.target.value ? Number(e.target.value) : null })}
                  />
                  {pb.plannedAmount && (
                    <div className="text-xs text-emerald-400 font-mono">{fmtAmt(pb.plannedAmount)}</div>
                  )}
                </div>

                {/* 메모 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">메모</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none resize-none"
                    placeholder="투찰 전략, 담당자 메모 등…"
                    value={pb.memo || ''}
                    onChange={e => updatePb(pb.id, { memo: e.target.value })}
                  />
                </div>

                <div className="text-[10px] text-slate-600">최종 수정: {pb.updatedAt}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 text-sm text-slate-200 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

window.Scraps = Scraps;
