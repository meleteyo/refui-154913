// dashboard.jsx — 운영자 대시보드
// UC41 회원관리 + 운영 KPI 화면

const Dashboard = ({ route, navigate, tweaks }) => {
  const { useState } = React;

  const kpi = window.KPI_TODAY;
  const trend = window.TREND_7D;
  const planToday = window.PLAN_TODAY;
  const mrrByPlan = window.MRR_BY_PLAN;
  const activities = window.RECENT_ACTIVITIES;

  // 플랜 분포 stacked bar 계산
  const planTotal = planToday.BASIC + planToday.PRO + planToday.ENTERPRISE;
  const basicPct  = ((planToday.BASIC / planTotal) * 100).toFixed(1);
  const proPct    = ((planToday.PRO   / planTotal) * 100).toFixed(1);
  const entPct    = ((planToday.ENTERPRISE / planTotal) * 100).toFixed(1);

  // MRR 합계 (검증용)
  const mrrTotal = mrrByPlan.BASIC + mrrByPlan.PRO + mrrByPlan.ENTERPRISE;

  const activityIcon = (type) => {
    if (type === "PAYMENT_SUCCESS") return { color: "text-emerald-400", dot: "bg-emerald-400" };
    if (type === "PAYMENT_FAILED")  return { color: "text-rose-400",    dot: "bg-rose-400" };
    if (type === "REFUNDED")        return { color: "text-amber-400",   dot: "bg-amber-400" };
    if (type === "JOIN")            return { color: "text-purple-400",  dot: "bg-purple-400" };
    return { color: "text-slate-400", dot: "bg-slate-400" };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">운영자 대시보드</h1>
          <p className="text-xs text-slate-500 font-mono">
            공공입찰 SaaS — UC41 회원관리·운영 KPI &nbsp;·&nbsp; 기준일: 2026-04-28
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('console')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:bg-slate-700 transition"
          >
            <window.Icon name="send" className="w-3.5 h-3.5" />
            결제 환불
          </button>
          <button
            onClick={() => navigate('history')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:bg-slate-700 transition"
          >
            <window.Icon name="history" className="w-3.5 h-3.5" />
            전체 이력
          </button>
        </div>
      </div>

      {/* ── KPI Bento 4개 ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* MRR */}
        <window.Card className="p-4">
          <window.SectionLabel color="purple">Monthly MRR</window.SectionLabel>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ₩{window.fmt(kpi.mrr)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <span>▲</span>
            <span>전월 대비 +8.3%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            BASIC ₩{window.fmt(mrrByPlan.BASIC)} · PRO ₩{window.fmt(mrrByPlan.PRO)}
          </div>
        </window.Card>

        {/* 유료 회원 */}
        <window.Card className="p-4">
          <window.SectionLabel color="cyan">유료 회원</window.SectionLabel>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {kpi.paidMembers}
            <span className="text-base text-slate-400 font-normal ml-1">사</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-emerald-400">신규 +2</span>
            <span className="text-rose-400">이탈 -1</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            이번 달 순증 +1사
          </div>
        </window.Card>

        {/* 오늘 결제 */}
        <window.Card className="p-4">
          <window.SectionLabel color="emerald">오늘 결제</window.SectionLabel>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ₩{window.fmt(kpi.todayPaid)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            결제 건수: <span className="font-mono text-slate-300">8건</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            2026-04-28 기준
          </div>
        </window.Card>

        {/* 이상 결제 — rose 강조 */}
        <window.Card className="p-4 !bg-rose-950 !border-rose-700">
          <window.SectionLabel color="rose">이상 결제</window.SectionLabel>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-50">
            {kpi.failedPayments}
            <span className="text-base font-normal ml-1 text-rose-200">건</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-rose-300">
            <window.Icon name="alert" className="w-3 h-3" />
            <span>failure_count &gt; 1</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-400">
            오각테크, 한도윤유한회사, 육각솔루션
          </div>
        </window.Card>
      </div>

      {/* ── 7일 추이 + 플랜 분포 ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* 7일 결제 추이 */}
        <window.Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <window.SectionLabel color="purple">7일 결제 추이</window.SectionLabel>
            <span className="text-[11px] font-mono text-slate-500">건/일</span>
          </div>
          <window.Sparkline data={trend} color="#a855f7" height={56} />
          <div className="mt-2 flex justify-between text-[11px] font-mono text-slate-500">
            {["4/22","4/23","4/24","4/25","4/26","4/27","4/28"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[11px] font-mono text-slate-400">
            {trend.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        </window.Card>

        {/* 플랜 분포 */}
        <window.Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <window.SectionLabel color="cyan">오늘 플랜 분포</window.SectionLabel>
            <span className="text-[11px] font-mono text-slate-500">총 {planTotal}건</span>
          </div>

          {/* Stacked bar */}
          <div className="w-full h-6 rounded-md overflow-hidden flex">
            <div
              className="bg-slate-500 transition-all"
              style={{ width: basicPct + "%" }}
              title={"BASIC " + planToday.BASIC + "건"}
            />
            <div
              className="bg-purple-500 transition-all"
              style={{ width: proPct + "%" }}
              title={"PRO " + planToday.PRO + "건"}
            />
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: entPct + "%" }}
              title={"ENTERPRISE " + planToday.ENTERPRISE + "건"}
            />
          </div>

          <div className="mt-3 space-y-1.5">
            {[
              { label: "BASIC",      count: planToday.BASIC,      pct: basicPct, color: "bg-slate-500",   mrr: mrrByPlan.BASIC },
              { label: "PRO",        count: planToday.PRO,        pct: proPct,   color: "bg-purple-500",  mrr: mrrByPlan.PRO },
              { label: "ENTERPRISE", count: planToday.ENTERPRISE, pct: entPct,   color: "bg-emerald-500", mrr: mrrByPlan.ENTERPRISE },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${row.color}`} />
                <span className="text-slate-300 w-20">{row.label}</span>
                <span className="font-mono text-slate-400">{row.count}건</span>
                <span className="font-mono text-slate-500 text-[11px]">({row.pct}%)</span>
                <span className="ml-auto font-mono text-slate-400 text-[11px]">₩{window.fmt(row.mrr)}</span>
              </div>
            ))}
          </div>
        </window.Card>
      </div>

      {/* ── 최근 활동 ── */}
      <window.Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <window.SectionLabel color="amber">최근 활동</window.SectionLabel>
          <button
            onClick={() => navigate('history')}
            className="text-[11px] text-slate-500 hover:text-slate-300 font-mono transition flex items-center gap-1"
          >
            전체 보기 <window.Icon name="chevronRight" className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-0">
          {activities.map((act, i) => {
            const style = activityIcon(act.type);
            return (
              <div
                key={i}
                className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 px-1 rounded transition cursor-default"
              >
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                <span className={`text-[11px] font-mono flex-shrink-0 w-14 ${style.color}`}>{act.at}</span>
                <span className="text-sm text-slate-300 flex-1">{act.text}</span>
                {act.payId && (
                  <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">{act.payId}</span>
                )}
              </div>
            );
          })}
        </div>
      </window.Card>

      {/* ── 이상 결제 회원 목록 ── */}
      <window.Card className="p-4 border-rose-800/40">
        <div className="flex items-center gap-2 mb-3">
          <window.Icon name="alert" className="w-4 h-4 text-rose-400" />
          <window.SectionLabel color="rose">이상 결제 회원 (failure_count ≥ 2)</window.SectionLabel>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-slate-500 border-b border-slate-800">
              <th className="text-left py-1.5 font-medium">회원사</th>
              <th className="text-left py-1.5 font-medium">플랜</th>
              <th className="text-left py-1.5 font-medium font-mono">실패 횟수</th>
              <th className="text-left py-1.5 font-medium">상태</th>
              <th className="text-left py-1.5 font-medium">담당자</th>
            </tr>
          </thead>
          <tbody>
            {window.MOCK_MEMBERS
              .filter((m) => m.failureCount >= 2)
              .map((m) => (
                <tr key={m.companyId} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                  <td className="py-2 text-slate-200">{m.name}</td>
                  <td className="py-2">
                    <span className="font-mono text-xs text-slate-400">{m.plan}</span>
                  </td>
                  <td className="py-2 font-mono text-rose-300">{m.failureCount}회</td>
                  <td className="py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                      m.status === "ACTIVE" ? "bg-emerald-900/50 text-emerald-300" :
                      m.status === "CANCELED" ? "bg-rose-900/50 text-rose-300" :
                      m.status === "EXPIRED" ? "bg-amber-900/50 text-amber-300" :
                      "bg-slate-800 text-slate-400"
                    }`}>{m.status}</span>
                  </td>
                  <td className="py-2 text-slate-400 text-xs">{m.contactPerson}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </window.Card>

      {/* ── 하단 버튼 ── */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => navigate('console')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium transition"
        >
          <window.Icon name="send" className="w-4 h-4" />
          결제 환불 위저드로 이동
        </button>
        <button
          onClick={() => navigate('history')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition"
        >
          <window.Icon name="history" className="w-4 h-4" />
          전체 결제 이력 보기
        </button>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
