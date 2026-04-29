// tender-detail.jsx — UC22 공고 상세
const { useState } = React;

// 공고 본문 가공 텍스트 생성 (tenderId, tender 기반)
function buildBodyText(tender) {
  const issuer = tender.issuer;
  const title  = tender.title;
  const amt    = (tender.estimatedAmount / 100000000).toFixed(1) + '억 원';
  return [
    `본 공사(용역)는 ${issuer}에서 발주하는 「${title}」으로, 지역 주민의 생활 환경 개선 및 공공 인프라의 안전성 강화를 목적으로 시행됩니다.`,
    `추정 금액은 ${amt}이며, 입찰 참가 자격은 관계 법령에 따른 해당 업종 등록 업체로 제한됩니다. 자세한 자격 요건은 입찰 공고문 및 첨부 서류를 참조하시기 바랍니다.`,
    `본 사업의 수행 기간은 계약 체결일로부터 착수하며, 준공 기한은 계약서에 명시된 날짜를 기준으로 합니다. 공사(용역) 기간 중 관련 법령 및 발주처 지침을 준수하여야 합니다.`,
    `입찰 참가 신청은 나라장터(G2B) 시스템을 통해 전자 입찰로 진행되며, 마감 일시까지 제출하지 않은 경우 입찰 참여가 불가합니다. 제출 서류 목록 및 양식은 공고문 첨부 파일을 확인하시기 바랍니다.`,
    `본 공사(용역)와 관련한 현장 설명회는 별도 일정에 따라 진행될 예정이며, 참석 희망 업체는 사전 등록 후 참석하여야 합니다. 현장 설명 미참석 업체도 입찰 참여는 가능하나, 현장 여건 숙지의 책임은 해당 업체에 있습니다.`,
    `낙찰자 결정은 최저가낙찰제 또는 적격심사낙찰제 방식으로 진행되며, 세부 방식은 입찰 공고문을 기준으로 합니다. 예정가격은 입찰 마감 후 ${issuer}에서 개봉하여 공개됩니다.`,
    `본 계약과 관련한 이의 제기 및 문의사항은 ${issuer} 계약 담당 부서(☎ 가공 번호)로 연락하시기 바랍니다. 본 공고에 기재되지 않은 사항은 국가계약법령 및 관련 예규에 따릅니다.`,
  ];
}

// 가공 첨부파일 (tenderId 기반으로 파일명 생성)
function buildAttachments(tender) {
  const prefix = tender.noticeNumber;
  const names = [
    `[공고문] ${prefix}_입찰공고문.pdf`,
    `[서식] ${prefix}_입찰참가신청서.hwp`,
    `[설계] ${prefix}_설계도서.zip`,
    `[규격] ${prefix}_과업지시서.pdf`,
    `[내역] ${prefix}_공사원가계산서.xlsx`,
    `[서식] ${prefix}_청렴서약서.hwp`,
    `[참고] ${prefix}_현장설명회자료.pdf`,
    `[기타] ${prefix}_질의응답서.pdf`,
  ].slice(0, tender.attachmentCount || 3);
  const sizes = ['245 KB', '182 KB', '3.2 MB', '512 KB', '890 KB', '128 KB', '1.4 MB', '340 KB'];
  return names.map((name, i) => ({
    name,
    size: sizes[i] || '256 KB',
    paidOnly: i >= 2, // 첫 2개는 무료, 나머지는 유료
  }));
}

function TenderDetail(props) {
  const { navigate, tweaks } = props;
  const brandColor = (tweaks && tweaks.brandColor) || '#a855f7';

  const tenderId = (props.route && props.route.payload && props.route.payload.tenderId)
    || (window.MOCK_TENDERS && window.MOCK_TENDERS[0] && window.MOCK_TENDERS[0].id);

  const tender   = (window.MOCK_TENDERS || []).find(t => t.id === tenderId);

  const [activeTab, setActiveTab]   = useState('info');
  const [scraped, setScraped]       = useState(tender ? tender.isScraped : false);
  const [registered, setRegistered] = useState(false);
  const [toast, setToast]           = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <window.Icon name="file" className="w-12 h-12 text-slate-600" />
        <div className="text-slate-400 text-sm">공고 정보를 찾을 수 없습니다.</div>
        <button onClick={() => navigate('search')} className="text-xs text-purple-400 underline">검색으로 돌아가기</button>
      </div>
    );
  }

  const bodyParagraphs = buildBodyText(tender);
  const attachments    = buildAttachments(tender);
  const analytics      = (window.ANALYTICS_BY_TENDER || {})[tender.id];

  function dDay(deadlineAt) {
    const now  = new Date('2026-04-29T00:00:00');
    const dead = new Date(deadlineAt);
    return Math.ceil((dead - now) / (1000 * 60 * 60 * 24));
  }
  function fmtAmt(n) {
    if (n >= 100000000) return '₩' + (n / 100000000).toFixed(1) + '억';
    return '₩' + (n / 10000000).toFixed(0) + '천만';
  }
  function fmtM(n) { return '₩' + (n / 1000000).toFixed(0) + 'M'; }

  const dd = dDay(tender.deadlineAt);

  const tabs = [
    { id: 'info',     label: '공고 본문' },
    { id: 'analysis', label: '분석 미리보기', disabled: !analytics },
    { id: 'award',    label: '낙찰 결과' },
  ];

  return (
    <div className="space-y-5">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('search')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
      >
        <window.Icon name="chevronLeft" className="w-4 h-4" />
        검색으로
      </button>

      {/* 상단 메타 헤더 */}
      <window.Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1 min-w-0">
            <window.SectionLabel color="emerald">공고 상세</window.SectionLabel>
            <h1 className="text-xl font-bold text-slate-100 leading-snug">{tender.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-400">{tender.issuer}</span>
              <span className="font-mono text-xs text-slate-500">{tender.noticeNumber}</span>
              <span className="font-mono text-lg text-emerald-400 font-bold">{fmtAmt(tender.estimatedAmount)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.region}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300">{tender.industryName}</span>
              <span className={`font-mono text-xs font-semibold ${dd <= 3 ? 'text-rose-400' : dd <= 7 ? 'text-amber-400' : 'text-slate-400'}`}>
                마감 D-{dd} ({tender.deadlineAt.slice(0, 10)})
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={() => { setScraped(s => !s); showToast(scraped ? '스크랩 제거됨' : '스크랩 추가됨'); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition ${
                scraped ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' : 'border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {scraped ? '★' : '☆'} 스크랩
            </button>
            <button
              onClick={() => { setRegistered(true); showToast('참여예정 등록되었습니다'); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition ${
                registered ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <window.Icon name="check" className="w-3.5 h-3.5" />
              {registered ? '참여예정 등록됨' : '참여예정 등록'}
            </button>
            {analytics && (
              <button
                onClick={() => navigate('analytics', { tenderId: tender.id })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-purple-500/40 text-xs text-purple-300 hover:bg-purple-500/10 transition"
              >
                <window.Icon name="chart" className="w-3.5 h-3.5" />
                분석 보기 <window.Icon name="arrowRight" className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </window.Card>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-slate-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-300'
                : tab.disabled
                  ? 'border-transparent text-slate-600 cursor-not-allowed'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {tab.id === 'analysis' && !analytics && (
              <span className="ml-1.5 text-[10px] text-slate-600">미제공</span>
            )}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          {/* 본문 */}
          <window.Card className="p-6">
            <window.SectionLabel color="cyan">공고 내용</window.SectionLabel>
            <div className="mt-4 space-y-3">
              {bodyParagraphs.map((p, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed">{p}</p>
              ))}
            </div>
          </window.Card>

          {/* 첨부파일 */}
          <window.Card className="p-6">
            <window.SectionLabel color="amber">첨부파일 ({attachments.length}건)</window.SectionLabel>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left pb-2 text-slate-500 font-normal">파일명</th>
                    <th className="text-right pb-2 text-slate-500 font-normal pr-4">크기</th>
                    <th className="text-center pb-2 text-slate-500 font-normal">권한</th>
                    <th className="text-right pb-2 text-slate-500 font-normal">다운로드</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((att, i) => (
                    <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                      <td className="py-2.5 text-slate-300 pr-3 flex items-center gap-2">
                        <window.Icon name="file" className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        {att.name}
                      </td>
                      <td className="py-2.5 text-right text-slate-500 font-mono pr-4">{att.size}</td>
                      <td className="py-2.5 text-center">
                        {att.paidOnly
                          ? <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300">PAID</span>
                          : <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300">FREE</span>
                        }
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => showToast(att.paidOnly ? '유료 구독 후 다운로드 가능합니다' : '다운로드를 시작합니다')}
                          className={`flex items-center gap-1 ml-auto px-2 py-1 rounded text-[10px] transition ${
                            att.paidOnly
                              ? 'text-slate-600 border border-slate-700/60 hover:text-slate-400'
                              : 'text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10'
                          }`}
                        >
                          <window.Icon name="download" className="w-3 h-3" />
                          받기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </window.Card>
        </div>
      )}

      {activeTab === 'analysis' && analytics && (
        <div className="space-y-4">
          {/* 추천 투찰가 미니 카드 */}
          <window.Card className="p-5">
            <window.SectionLabel color="emerald">추천 투찰가 미리보기</window.SectionLabel>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono text-2xl text-emerald-400 font-bold">
                {fmtM(analytics.recommendedMin)}
              </span>
              <span className="text-slate-500">~</span>
              <span className="font-mono text-2xl text-emerald-400 font-bold">
                {fmtM(analytics.recommendedMax)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span>신뢰도 <span className="font-mono text-purple-300">{analytics.confidence}%</span></span>
              <span>·</span>
              <span>유사 공고 <span className="font-mono text-slate-200">{analytics.similarTenderCount}건</span></span>
              <span>·</span>
              <span>데이터 D-{analytics.dataFreshnessDays}</span>
            </div>
          </window.Card>

          {/* 유사 공고 미니 리스트 */}
          <window.Card className="p-5">
            <window.SectionLabel color="purple">유사 공고 사례 (상위 3건)</window.SectionLabel>
            <div className="mt-3 space-y-2">
              {analytics.similarTenders.slice(0, 3).map(st => (
                <div key={st.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-800/60">
                  <span className="text-xs text-slate-300 truncate flex-1">{st.title}</span>
                  <span className="font-mono text-xs text-purple-300 shrink-0">{st.bidRate.toFixed(1)}%</span>
                  <span className="font-mono text-xs text-emerald-300 shrink-0">{fmtM(st.awardAmount)}</span>
                </div>
              ))}
            </div>
          </window.Card>

          <div className="flex justify-end">
            <button
              onClick={() => navigate('analytics', { tenderId: tender.id })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-purple-500/40 text-sm text-purple-300 hover:bg-purple-500/10 transition"
            >
              전체 분석 보기 <window.Icon name="arrowRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'award' && (
        <window.Card className="p-8 flex flex-col items-center gap-4 text-center">
          <window.Icon name="clock" className="w-10 h-10 text-slate-600" />
          <div className="space-y-1">
            <div className="text-slate-300 font-medium">
              개찰 D-{dd}
            </div>
            <div className="text-sm text-slate-500">
              아직 개찰 전 공고입니다. 마감일({tender.deadlineAt.slice(0, 10)}) 이후 낙찰 결과가 공개됩니다.
            </div>
          </div>
        </window.Card>
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

window.TenderDetail = TenderDetail;
