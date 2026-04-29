// search.jsx — UC21 다중 조건 검색
const { useState, useMemo } = React;

function Search(props) {
  const { navigate, tweaks } = props;
  const brandColor = (tweaks && tweaks.brandColor) || '#a855f7';

  // ── 필터 상태 ─────────────────────────────────────────────────────────────
  const [keyword, setKeyword]           = useState('');
  const [sortBy, setSortBy]             = useState('deadline');
  const [selRegions, setSelRegions]     = useState([]);
  const [selCategories, setSelCategories] = useState([]);
  const [amountMin, setAmountMin]       = useState('');
  const [amountMax, setAmountMax]       = useState('');
  const [deadlineFrom, setDeadlineFrom] = useState('');
  const [deadlineTo, setDeadlineTo]     = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [page, setPage]                 = useState(1);
  const [scrapStates, setScrapStates]   = useState(() => {
    const init = {};
    (window.MOCK_TENDERS || []).forEach(t => { init[t.id] = t.isScraped; });
    return init;
  });
  const [toast, setToast]               = useState(null);
  const [savedSearches, setSavedSearches] = useState(window.SAVED_SEARCHES || []);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLabel, setSaveLabel]         = useState('');

  const PAGE_SIZE = 6;

  // ── 필터 적용 ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const tenders = window.MOCK_TENDERS || [];
    let list = tenders.filter(t => {
      if (keyword && !t.title.includes(keyword) && !t.issuer.includes(keyword)) return false;
      if (selRegions.length > 0 && !selRegions.includes(t.region)) return false;
      if (selCategories.length > 0) {
        const catOfIndustry = (window.INDUSTRIES || []).find(i => i.id === t.industry);
        if (!catOfIndustry || !selCategories.includes(catOfIndustry.category)) return false;
      }
      const minVal = amountMin !== '' ? Number(amountMin) * 10000 : null;
      const maxVal = amountMax !== '' ? Number(amountMax) * 10000 : null;
      if (minVal !== null && t.estimatedAmount < minVal) return false;
      if (maxVal !== null && t.estimatedAmount > maxVal) return false;
      if (deadlineFrom && t.deadlineAt < deadlineFrom) return false;
      if (deadlineTo && t.deadlineAt > deadlineTo + 'T23:59:59') return false;
      if (hasAttachment && t.attachmentCount === 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadlineAt) - new Date(b.deadlineAt);
      if (sortBy === 'latest')   return new Date(b.postedAt)  - new Date(a.postedAt);
      if (sortBy === 'amountAsc') return a.estimatedAmount - b.estimatedAmount;
      if (sortBy === 'amountDesc') return b.estimatedAmount - a.estimatedAmount;
      return 0;
    });
    return list;
  }, [keyword, selRegions, selCategories, amountMin, amountMax, deadlineFrom, deadlineTo, hasAttachment, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── 헬퍼 ─────────────────────────────────────────────────────────────────
  function toggleRegion(short) {
    setPage(1);
    setSelRegions(prev => prev.includes(short) ? prev.filter(r => r !== short) : [...prev, short]);
  }
  function toggleCategory(id) {
    setPage(1);
    setSelCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }
  function resetFilters() {
    setKeyword(''); setSelRegions([]); setSelCategories([]);
    setAmountMin(''); setAmountMax(''); setDeadlineFrom(''); setDeadlineTo('');
    setHasAttachment(false); setPage(1);
  }
  function applySaved(ss) {
    setPage(1);
    setSelRegions(ss.regions || []);
    setSelCategories(ss.industries || []);
    setAmountMin(ss.amountMin ? String(ss.amountMin / 10000) : '');
    setAmountMax(ss.amountMax ? String(ss.amountMax / 10000) : '');
    setDeadlineFrom(''); setDeadlineTo('');
  }
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }
  function toggleScrap(id) {
    setScrapStates(prev => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? '스크랩 추가됨' : '스크랩 제거됨');
      return next;
    });
  }
  function saveSearch() {
    if (!saveLabel.trim()) return;
    const newSS = {
      id: 'SS-' + Date.now(),
      name: saveLabel.trim(),
      regions: selRegions,
      industries: selCategories,
      amountMin: amountMin ? Number(amountMin) * 10000 : null,
      amountMax: amountMax ? Number(amountMax) * 10000 : null,
      count: filtered.length,
    };
    setSavedSearches(prev => [...prev, newSS]);
    setSaveLabel('');
    setShowSaveModal(false);
    showToast('검색 조건이 저장되었습니다');
  }

  function dDay(deadlineAt) {
    const now  = new Date('2026-04-29T00:00:00');
    const dead = new Date(deadlineAt);
    const diff = Math.ceil((dead - now) / (1000 * 60 * 60 * 24));
    return diff;
  }
  function fmtAmount(n) {
    if (n >= 100000000) return '₩' + (n / 100000000).toFixed(1) + '억';
    if (n >= 10000)     return '₩' + Math.round(n / 10000) + '만';
    return '₩' + window.fmt(n);
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* 상단 검색 바 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-2.5">
          <window.Icon name="search" className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            placeholder="공고명, 발주처 키워드 검색…"
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); setPage(1); }}
        >
          <option value="deadline">마감 임박순</option>
          <option value="latest">최신 등록순</option>
          <option value="amountAsc">금액 낮은순</option>
          <option value="amountDesc">금액 높은순</option>
        </select>
        <button
          onClick={() => showToast('엑셀 내보내기는 실서비스에서 지원됩니다')}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700/60 text-sm text-slate-300 hover:bg-slate-800 transition"
        >
          <window.Icon name="download" className="w-4 h-4" />
          엑셀
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700/60 text-sm text-slate-300 hover:bg-slate-800 transition"
        >
          <window.Icon name="plus" className="w-4 h-4" />
          검색 저장
        </button>
      </div>

      <div className="flex gap-5">
        {/* 좌측 필터 */}
        <aside className="w-72 shrink-0 space-y-4 sticky top-0 self-start">
          {/* 저장된 검색 */}
          <window.Card className="p-4">
            <window.SectionLabel color="purple">저장된 검색</window.SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {savedSearches.map(ss => (
                <button
                  key={ss.id}
                  onClick={() => applySaved(ss)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:border-purple-500/50 hover:text-purple-300 transition"
                >
                  {ss.name}
                  <span className="ml-1 text-slate-500 font-mono">{ss.count}</span>
                </button>
              ))}
            </div>
          </window.Card>

          {/* 지역 */}
          <window.Card className="p-4">
            <window.SectionLabel color="cyan">지역</window.SectionLabel>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {(window.REGIONS || []).map(r => (
                <label key={r.code} className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-purple-500 w-3 h-3"
                    checked={selRegions.includes(r.short)}
                    onChange={() => toggleRegion(r.short)}
                  />
                  <span className={`text-xs transition ${selRegions.includes(r.short) ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {r.short}
                  </span>
                </label>
              ))}
            </div>
          </window.Card>

          {/* 업종 */}
          <window.Card className="p-4">
            <window.SectionLabel color="emerald">업종</window.SectionLabel>
            <div className="space-y-1 mt-2">
              {(window.INDUSTRY_CATEGORIES || []).map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-3 h-3"
                    checked={selCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span className={`text-xs transition flex-1 ${selCategories.includes(cat.id) ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{cat.count}</span>
                </label>
              ))}
            </div>
          </window.Card>

          {/* 금액 */}
          <window.Card className="p-4">
            <window.SectionLabel color="amber">금액 범위 (만원)</window.SectionLabel>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                placeholder="최소"
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none w-0"
                value={amountMin}
                onChange={e => { setAmountMin(e.target.value); setPage(1); }}
              />
              <span className="text-slate-500 text-xs">~</span>
              <input
                type="number"
                placeholder="최대"
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none w-0"
                value={amountMax}
                onChange={e => { setAmountMax(e.target.value); setPage(1); }}
              />
            </div>
          </window.Card>

          {/* 마감일 */}
          <window.Card className="p-4">
            <window.SectionLabel color="pink">마감일</window.SectionLabel>
            <div className="space-y-1.5 mt-2">
              <input
                type="date"
                className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                value={deadlineFrom}
                onChange={e => { setDeadlineFrom(e.target.value); setPage(1); }}
              />
              <input
                type="date"
                className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                value={deadlineTo}
                onChange={e => { setDeadlineTo(e.target.value); setPage(1); }}
              />
            </div>
          </window.Card>

          {/* 첨부파일 */}
          <window.Card className="p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-purple-500 w-3.5 h-3.5"
                checked={hasAttachment}
                onChange={e => { setHasAttachment(e.target.checked); setPage(1); }}
              />
              <span className="text-xs text-slate-300">첨부파일 있는 공고만</span>
            </label>
          </window.Card>

          {/* 초기화 */}
          <button
            onClick={resetFilters}
            className="w-full py-2 rounded-xl border border-slate-700/60 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            필터 초기화
          </button>
        </aside>

        {/* 우측 결과 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-400">
              검색 결과 <span className="font-mono text-slate-200">{filtered.length}</span>건
            </div>
          </div>

          {filtered.length === 0 && (
            <window.Card className="p-12 flex flex-col items-center gap-3 text-center">
              <window.Icon name="search" className="w-8 h-8 text-slate-600" />
              <div className="text-slate-400 text-sm">검색 결과가 없습니다.</div>
              <button onClick={resetFilters} className="text-xs text-purple-400 underline">필터 초기화</button>
            </window.Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map(t => {
              const dd = dDay(t.deadlineAt);
              const scraped = scrapStates[t.id];
              return (
                <window.Card key={t.id} className="p-4 flex flex-col gap-3 hover:border-slate-600 transition">
                  {/* 헤더 행 */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-mono text-[10px] text-slate-500">{t.noticeNumber}</div>
                    <button
                      onClick={() => toggleScrap(t.id)}
                      className={`text-base transition ${scraped ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'}`}
                      title={scraped ? '스크랩 제거' : '스크랩 추가'}
                    >
                      {scraped ? '★' : '☆'}
                    </button>
                  </div>

                  {/* 발주처 */}
                  <div className="text-[11px] text-slate-400">{t.issuer}</div>

                  {/* 제목 */}
                  <div className="text-sm font-medium text-slate-100 leading-snug line-clamp-2">{t.title}</div>

                  {/* 금액 */}
                  <div className="font-mono text-lg text-emerald-400 font-bold">{fmtAmount(t.estimatedAmount)}</div>

                  {/* 칩 행 */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{t.region}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{t.industryName}</span>
                    {t.attachmentCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-400">
                        첨부 {t.attachmentCount}
                      </span>
                    )}
                  </div>

                  {/* 마감 */}
                  <div className={`font-mono text-xs font-semibold ${dd <= 3 ? 'text-rose-400' : dd <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>
                    마감 D-{dd} ({t.deadlineAt.slice(0, 10)})
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 mt-auto pt-1 border-t border-slate-800">
                    <button
                      onClick={() => navigate('tenderDetail', { tenderId: t.id })}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition"
                    >
                      상세
                    </button>
                    {t.analysisAvailable && (
                      <button
                        onClick={() => navigate('analytics', { tenderId: t.id })}
                        className="flex-1 py-1.5 rounded-lg text-xs text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 transition"
                      >
                        분석
                      </button>
                    )}
                  </div>
                </window.Card>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-700/60 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition"
              >
                <window.Icon name="chevronLeft" className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono transition ${
                    p === page
                      ? 'text-white border border-purple-500/60 bg-purple-500/20'
                      : 'text-slate-400 border border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-700/60 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition"
              >
                <window.Icon name="chevronRight" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 검색 저장 모달 */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <window.Card className="w-80 p-6 space-y-4">
            <div className="text-sm font-semibold text-slate-100">검색 조건 저장</div>
            <input
              className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
              placeholder="저장 이름 (예: 서울 IT용역)"
              value={saveLabel}
              onChange={e => setSaveLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveSearch()}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={saveSearch} className="flex-1 py-2 rounded-lg text-xs text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 transition">저장</button>
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2 rounded-lg text-xs text-slate-400 border border-slate-700/60 hover:bg-slate-800 transition">취소</button>
            </div>
          </window.Card>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 text-sm text-slate-200 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

window.Search = Search;
