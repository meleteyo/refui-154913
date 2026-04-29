// analytics.jsx — UC23 분석 대시보드
const { useState } = React;
const {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid,
} = window.Recharts;

const TICK  = { fill: '#94a3b8', fontSize: 11 };
const AXIS  = { stroke: '#334155' };
const TIP   = { contentStyle: { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: 12 } };
const GRID  = { stroke: '#334155', strokeDasharray: '3 3' };

function Analytics(props) {
  const { navigate, tweaks } = props;
  const brandColor = (tweaks && tweaks.brandColor) || '#a855f7';

  const tenderId = (props.route && props.route.payload && props.route.payload.tenderId)
    || Object.keys(window.ANALYTICS_BY_TENDER || {})[0];

  const analytics = (window.ANALYTICS_BY_TENDER || {})[tenderId];
  const tender    = (window.MOCK_TENDERS || []).find(t => t.id === tenderId);

  const [scraped, setScraped]   = useState(tender ? tender.isScraped : false);
  const [toast, setToast]       = useState(null);
  const [registered, setRegistered] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }
  function fmtM(n) { return '₩' + (n / 1000000).toFixed(0) + 'M'; }
  function fmtAmt(n) {
    if (n >= 100000000) return '₩' + (n / 100000000).toFixed(1) + '억';
    return '₩' + (n / 10000000).toFixed(0) + '천만';
  }
  function insightColor(type) {
    if (type === 'warning') return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
    if (type === 'alert')   return 'border-rose-500/40 bg-rose-500/10 text-rose-300';
    return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';
  }
  function insightIcon(type) {
    if (type === 'warning') return 'alert';
    if (type === 'alert')   return 'bell';
    return 'sparkles';
  }

  // ── 분석 없음 상태 ──────────────────────────────────────────────────────
  if (!analytics || !tender) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <window.Icon name="chart" className="w-12 h-12 text-slate-600" />
        <div className="text-slate-400 text-sm text-center">
          해당 공고의 분석 결과가 아직 준비되지 않았습니다.<br />
          분석 가능한 공고를 선택해 주세요.
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.keys(window.ANALYTICS_BY_TENDER || {}).map(id => {
            const t = (window.MOCK_TENDERS || []).find(x => x.id === id);
            if (!t) return null;
            return (
              <button
                key={id}
                onClick={() => navigate('analytics', { tenderId: id })}
                className="px-3 py-1.5 rounded-lg border border-purple-500/40 text-xs text-purple-300 hover:bg-purple-500/10 transition"
              >
                {t.title.slice(0, 20)}…
              </button>
            );
          })}
        </div>
        <button onClick={() => navigate('search')} className="text-xs text-slate-400 underline">검색으로 돌아가기</button>
      </div>
    );
  }

  const {
    recommendedMin, recommendedMax, recommendedCenter, confidence,
    similarTenderCount, dataFreshnessDays, industryAvg,
    monthlyTrend, bidRateDist, similarTenders, insights,
  } = analytics;

  // 추천가 바 비율 계산 (예산 대비)
  const budget = tender.estimatedAmount;
  const pctMin = Math.round((recommendedMin / budget) * 100);
  const pctMax = Math.round((recommendedMax / budget) * 100);
  const pctCenter = Math.round((recommendedCenter / budget) * 100);

  // 업종 vs 본공고 bar 데이터
  const compareData = [
    { name: '업종 평균', amount: industryAvg },
    { name: '본 공고',   amount: budget },
  ];
  const compareFill = budget > industryAvg ? '#f59e0b' : '#10b981';

  return (
    <div className="space-y-5">
      {/* 1. 컨텍스트 헤더 카드 (col-span-3) */}
      <window.Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <window.SectionLabel color="purple">분석 대시보드</window.SectionLabel>
            <div className="text-lg font-semibold text-slate-100 mt-1">{tender.title}</div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-slate-400">{tender.issuer}</span>
              <span className="font-mono text-xs text-slate-500">{tender.noticeNumber}</span>
              <span className="font-mono text-sm text-emerald-400 font-bold">{fmtAmt(budget)}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.region}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.industryName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate('tenderDetail', { tenderId: tender.id })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700/60 text-xs text-slate-300 hover:bg-slate-800 transition"
            >
              공고 상세 <window.Icon name="arrowRight" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setScraped(s => !s); showToast(scraped ? '스크랩 제거됨' : '스크랩 추가됨'); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition ${scraped ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' : 'border-slate-700/60 text-slate-300 hover:bg-slate-800'}`}
            >
              {scraped ? '★' : '☆'} 스크랩
            </button>
            <button
              onClick={() => { setRegistered(true); showToast('참여예정 등록되었습니다'); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition ${registered ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-slate-700/60 text-slate-300 hover:bg-slate-800'}`}
            >
              <window.Icon name="check" className="w-3.5 h-3.5" />
              {registered ? '참여예정 등록됨' : '참여예정 등록'}
            </button>
          </div>
        </div>
      </window.Card>

      {/* 2~6 벤토 그리드 */}
      <div className="grid grid-cols-3 gap-5">
        {/* 2. 추천 투찰가 메인 (col-span-2) */}
        <window.Card className="col-span-2 p-5">
          <window.SectionLabel color="emerald">추천 투찰가</window.SectionLabel>
          <div className="mt-3 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl text-emerald-400 font-bold">{fmtM(recommendedMin)}</span>
              <span className="text-slate-500">~</span>
              <span className="font-mono text-2xl text-emerald-400 font-bold">{fmtM(recommendedMax)}</span>
            </div>
            <div className="text-xs text-slate-400">
              중심값 <span className="font-mono text-slate-200">{fmtM(recommendedCenter)}</span>
              &nbsp;·&nbsp; 예산 대비 <span className="font-mono text-slate-200">{pctMin}% ~ {pctMax}%</span>
            </div>
            {/* 수평 막대 */}
            <div className="relative h-7 rounded-lg bg-slate-800 overflow-hidden">
              {/* 전체 예산 100% */}
              <div className="absolute inset-0 flex items-center px-2">
                <span className="text-[10px] text-slate-600 font-mono">예산 {fmtM(budget)}</span>
              </div>
              {/* 추천 범위 */}
              <div
                className="absolute top-1 bottom-1 rounded bg-emerald-500/30 border border-emerald-500/50"
                style={{ left: pctMin + '%', width: (pctMax - pctMin) + '%' }}
              />
              {/* center 마커 */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400"
                style={{ left: pctCenter + '%' }}
              />
            </div>
            <div className="text-[10px] text-slate-500">
              예산 {pctMin}% 지점부터 {pctMax}% 지점이 추천 범위입니다. 중심값은 {pctCenter}%입니다.
            </div>
          </div>
        </window.Card>

        {/* 3. 신뢰도 (col-span-1) */}
        <window.Card className="p-5">
          <window.SectionLabel color="purple">분석 신뢰도</window.SectionLabel>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="font-mono text-4xl font-bold text-purple-400">{confidence}%</div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: confidence + '%', background: confidence >= 80 ? '#10b981' : confidence >= 70 ? '#a855f7' : '#f59e0b' }}
              />
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs text-slate-400">유사 공고 <span className="font-mono text-slate-200">{similarTenderCount}건</span></div>
              <div className="text-xs text-slate-400">데이터 최신 <span className="font-mono text-slate-200">D-{dataFreshnessDays}</span></div>
            </div>
          </div>
        </window.Card>

        {/* 4. 12개월 트렌드 (col-span-2) */}
        <window.Card className="col-span-2 p-5">
          <window.SectionLabel color="purple">12개월 금액 트렌드</window.SectionLabel>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" tick={TICK} axisLine={AXIS} tickLine={false} tickFormatter={v => v.slice(2)} />
                <YAxis tick={TICK} axisLine={AXIS} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(0) + 'M'} width={44} />
                <Tooltip {...TIP} formatter={v => fmtM(v)} labelFormatter={l => l} />
                <Line
                  type="monotone" dataKey="avgAmount" stroke="#a855f7"
                  strokeWidth={2} dot={{ r: 2, fill: '#a855f7' }} activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </window.Card>

        {/* 5. 업종 평균 vs 본 공고 (col-span-1) */}
        <window.Card className="p-5">
          <window.SectionLabel color="amber">업종 평균 비교</window.SectionLabel>
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={compareData} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid {...GRID} horizontal={false} />
                <XAxis type="number" tick={TICK} axisLine={AXIS} tickLine={false} tickFormatter={v => (v / 1000000).toFixed(0) + 'M'} />
                <YAxis type="category" dataKey="name" tick={{ ...TICK, fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
                <Tooltip {...TIP} formatter={v => fmtM(v)} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {compareData.map((entry, i) => (
                    <Cell key={i} fill={i === 1 ? compareFill : '#475569'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </window.Card>

        {/* 6. 낙찰률 분포 파이 (col-span-1) */}
        <window.Card className="p-5">
          <window.SectionLabel color="cyan">낙찰률 분포</window.SectionLabel>
          <div className="mt-3 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={bidRateDist} dataKey="count"
                  nameKey="range"
                  innerRadius={38} outerRadius={62}
                  paddingAngle={3}
                >
                  {bidRateDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...TIP} formatter={(v, name) => [v + '건', name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {bidRateDist.map((d, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-[10px] text-slate-400">{d.range} ({d.count}건)</span>
                </div>
              ))}
            </div>
          </div>
        </window.Card>

        {/* 7. 유사 공고 미니 테이블 (col-span-2) */}
        <window.Card className="col-span-2 p-5">
          <window.SectionLabel color="emerald">유사 공고 사례</window.SectionLabel>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left pb-2 text-slate-500 font-normal">공고명</th>
                  <th className="text-right pb-2 text-slate-500 font-normal">낙찰률</th>
                  <th className="text-right pb-2 text-slate-500 font-normal">낙찰금액</th>
                  <th className="text-right pb-2 text-slate-500 font-normal">개찰일</th>
                </tr>
              </thead>
              <tbody>
                {similarTenders.map((st, i) => (
                  <tr key={st.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                    <td className="py-2 text-slate-300 pr-3">{st.title}</td>
                    <td className="py-2 text-right font-mono text-purple-300">{st.bidRate.toFixed(1)}%</td>
                    <td className="py-2 text-right font-mono text-emerald-300">{fmtM(st.awardAmount)}</td>
                    <td className="py-2 text-right text-slate-500">{st.openedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </window.Card>

        {/* 8. 의사결정 인사이트 (col-span-3) */}
        <window.Card className="col-span-3 p-5">
          <window.SectionLabel color="pink">의사결정 인사이트</window.SectionLabel>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${insightColor(ins.type)}`}>
                <window.Icon name={insightIcon(ins.type)} className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{ins.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-slate-500">
            데이터 출처: 자사 분석 시스템 (Q1=A 가정, confidence {confidence}%) · 데이터 최신 D-{dataFreshnessDays} · 유사 공고 {similarTenderCount}건 기반
          </div>
        </window.Card>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700/60 text-sm text-slate-200 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

window.Analytics = Analytics;
