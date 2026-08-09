/* 숫자 워크시트 생성기 — 워크시트·정답지·듣기 데이터를 한 소스에서 뽑는다 */
const fs = require('fs');

/* ---------- 결정적 난수(빌드 재현용) ---------- */
let _s = 20260809;
const rnd = () => (_s = (_s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const pick = a => a[Math.floor(rnd() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- 수 읽기 ---------- */
const SD = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
function sino4(n) {
  let o = '';
  const th = Math.floor(n / 1000), h = Math.floor(n / 100) % 10, t = Math.floor(n / 10) % 10, u = n % 10;
  if (th) o += (th > 1 ? SD[th] : '') + '천';
  if (h) o += (h > 1 ? SD[h] : '') + '백';
  if (t) o += (t > 1 ? SD[t] : '') + '십';
  if (u) o += SD[u];
  return o;
}
function sino(n) {
  if (n === 0) return '영';
  const p = [];
  const man = Math.floor(n / 10000), rest = n % 10000;
  if (man) p.push((man === 1 ? '' : sino4(man)) + '만');
  if (rest) p.push(sino4(rest));
  return p.join(' ');
}
const NO = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
const NT = ['', '열', '', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
function nativeAttr(n) {           // 단위명사 앞 형태
  const t = Math.floor(n / 10), u = n % 10;
  let s = t === 2 ? (u === 0 ? '스무' : '스물') : NT[t];
  return s + NO[u];
}
const MONTH = ['', '일월', '이월', '삼월', '사월', '오월', '유월', '칠월', '팔월', '구월', '시월', '십일월', '십이월'];

/* ---------- 단위명사 ---------- */
const N = (u, cn, note) => ({ u, cn, side: 'n', note });   // 고유어
const S = (u, cn, note) => ({ u, cn, side: 's', note });   // 한자어
const UNITS = [
  N('개', '个'), N('명', '名·人'), N('마리', '只·头'), N('살', '岁'),
  N('시', '点钟', '★'), N('시간', '小时·时长', '★'), N('잔', '杯'), N('병', '瓶'),
  N('권', '本'), N('장', '张'), N('그릇', '碗'), N('켤레', '双'),
  N('벌', '套·件'), N('대', '台·辆'), N('송이', '朵'), N('조각', '块'),
  N('자루', '支'), N('분', '位（敬语）', '★'), N('번', '次·回', '★'), N('달', '个月', '★'),
  S('분', '分钟', '★'), S('초', '秒'), S('원', '韩元'), S('년', '年份'),
  S('월', '月份'), S('일', '日·号'), S('층', '层'), S('인분', '人份'),
  S('개월', '个月', '★'), S('학년', '年级'), S('페이지', '页'), S('호', '号·房间'),
  S('도', '度'), S('번', '第…号', '★'), S('킬로', '公斤'), S('미터', '米'),
  S('주일', '周'), S('퍼센트', '%'),
];
/* 함정(★)은 3번, 나머지는 1~2번 — 시트 안에서 자체 간격반복 */
let gridPool = [];
UNITS.forEach(x => { gridPool.push(x); if (x.note === '★') gridPool.push(x, x); else if (rnd() > .45) gridPool.push(x); });
/* 같은 항목이 몰리지 않도록 최대 간격으로 배치 (반복은 간격을 둬야 의미가 있다) */
function spread(pool) {
  const cnt = new Map(), last = new Map(), out = [];
  shuffle(pool).forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
  for (let i = 0; i < pool.length; i++) {
    let best = null, bestScore = -Infinity;
    for (const [item, c] of cnt) {
      if (c <= 0) continue;
      const score = (i - (last.has(item) ? last.get(item) : -999)) * 100 + c;
      if (score > bestScore) { bestScore = score; best = item; }
    }
    out.push(best); cnt.set(best, cnt.get(best) - 1); last.set(best, i);
  }
  return out;
}
const GRID = spread(gridPool).slice(0, 60);
/* 배치 검증: 같은 항목 사이 최소 간격 */
(() => {
  const seen = new Map(); let min = 99;
  GRID.forEach((x, i) => { if (seen.has(x)) min = Math.min(min, i - seen.get(x)); seen.set(x, i); });
  console.log('판별 그리드 최소 반복 간격:', min);
})();

/* ---------- 시계 ---------- */
const CLOCKS = [[1, 0], [3, 15], [7, 30], [10, 45], [5, 5], [12, 40]];
const TIMES = [[2, 10], [4, 25], [6, 50], [8, 5], [9, 35], [11, 20], [7, 55], [3, 0]];
const DURS = [[3, 20], [1, 45], [5, 30], [2, 15]];
const readTime = (h, m) => nativeAttr(h) + ' 시' + (m ? ' ' + sino(m) + ' 분' : '');
const readDur = (h, m) => nativeAttr(h) + ' 시간' + (m ? ' ' + sino(m) + ' 분' : '');

/* ---------- 카페 ---------- */
const CAFE = [
  { n: '아메리카노', cn: '美式', q: 3, c: '잔', p: 4500 },
  { n: '카페라테', cn: '拿铁', q: 2, c: '잔', p: 5000 },
  { n: '치즈케이크', cn: '芝士蛋糕', q: 4, c: '조각', p: 6500 },
  { n: '샌드위치', cn: '三明治', q: 2, c: '개', p: 7200 },
  { n: '생수', cn: '矿泉水', q: 6, c: '병', p: 1200 },
  { n: '쿠키', cn: '曲奇', q: 12, c: '개', p: 2800 },
];
CAFE.forEach(r => { r.sum = r.q * r.p; });
const CAFE_TOTAL = CAFE.reduce((a, r) => a + r.sum, 0);

/* ---------- 날짜·나이·번호 ---------- */
const DATES = [[8, 9], [6, 15], [10, 3], [12, 25], [6, 6], [10, 30]];
const AGES = [7, 15, 20, 21, 33, 48, 60, 99];
const SINOBITS = [
  { q: '5층', a: '오 층', cn: '5楼' },
  { q: '2026년', a: '이천이십육 년', cn: '2026年' },
  { q: '301호', a: '삼백일 호', cn: '301房' },
  { q: '3인분', a: '삼 인분', cn: '3人份' },
  { q: '6개월', a: '육 개월', cn: '6个月' },
  { q: '010-9482-3517', a: '공일공 구사팔이 삼오일칠', cn: '手机号' },
  { q: '128페이지', a: '백이십팔 페이지', cn: '128页' },
  { q: '37도', a: '삼십칠 도', cn: '37度' },
];

/* ---------- 받아쓰기(듣기) ---------- */
const DICT = [
  { ko: '세 시 십오 분', cn: '3:15' }, { ko: '스물다섯 살', cn: '25岁' },
  { ko: '만 이천 원', cn: '12,000韩元' }, { ko: '아홉 개', cn: '9个' },
  { ko: '유월 십사 일', cn: '6月14日' }, { ko: '네 시간 삼십 분', cn: '4小时30分' },
  { ko: '서른두 명', cn: '32人' }, { ko: '십오 층', cn: '15层' },
  { ko: '두 잔', cn: '2杯' }, { ko: '시월 구 일', cn: '10月9日' },
  { ko: '칠만 오천 원', cn: '75,000韩元' }, { ko: '열두 시 오십 분', cn: '12:50' },
  { ko: '삼 개월', cn: '3个月' }, { ko: '다섯 마리', cn: '5只' },
  { ko: '이천이십육 년', cn: '2026年' }, { ko: '스무 개', cn: '20个' },
  { ko: '여섯 시 오 분', cn: '6:05' }, { ko: '백삼십 페이지', cn: '130页' },
  { ko: '아흔아홉 살', cn: '99岁' }, { ko: '팔십 퍼센트', cn: '80%' },
];

/* ---------- 오류 사냥 (correct=true면 고칠 게 없음) ---------- */
const HUNT = [
  { s: '커피 삼 잔 주세요.', ok: false, fix: '세 잔', cn: '请给我3杯咖啡。' },
  { s: '지금 다섯 시 삼십 분이에요.', ok: true, cn: '现在5点30分。' },
  { s: '저는 스물다섯 살이에요.', ok: true, cn: '我25岁。' },
  { s: '오늘은 육월 십오 일이에요.', ok: false, fix: '유월', cn: '今天6月15日。' },
  { s: '사과 다섯 개하고 물 두 병 주세요.', ok: true, cn: '给我5个苹果和2瓶水。' },
  { s: '우리 집은 삼 층이에요.', ok: true, cn: '我家在3层。' },
  { s: '영화가 두 시간 십 분이에요.', ok: true, cn: '电影2小时10分。' },
  { s: '이 책은 삼만 원이에요.', ok: true, cn: '这本书3万韩元。' },
  { s: '한국에 세 개월 있었어요.', ok: false, fix: '삼 개월 / 세 달', cn: '在韩国待了3个月。' },
  { s: '학생이 스물 명 있어요.', ok: false, fix: '스무 명', cn: '有20个学生。' },
  { s: '십월 삼 일에 만나요.', ok: false, fix: '시월', cn: '10月3日见。' },
  { s: '버스 세 번을 타세요.', ok: false, fix: '삼 번', cn: '请坐3路公交。' },
];

/* ================= 워크시트 HTML ================= */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function clockSVG(h, m) {
  const ha = (h % 12 + m / 60) * 30 - 90, ma = m * 6 - 90;
  const pt = (a, r) => [50 + r * Math.cos(a * Math.PI / 180), 50 + r * Math.sin(a * Math.PI / 180)];
  const [hx, hy] = pt(ha, 24), [mx, my] = pt(ma, 34);
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = pt(i * 30 - 90, 40), [x2, y2] = pt(i * 30 - 90, 44.5);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#232A21" stroke-width="${i % 3 === 0 ? 2 : 1}"/>`;
  }
  return `<svg viewBox="0 0 100 100" class="clk"><circle cx="50" cy="50" r="46" fill="none" stroke="#232A21" stroke-width="1.6"/>${ticks}` +
    `<line x1="50" y1="50" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="#B0402A" stroke-width="3.6" stroke-linecap="round"/>` +
    `<line x1="50" y1="50" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#2B5870" stroke-width="2.2" stroke-linecap="round"/>` +
    `<circle cx="50" cy="50" r="2.6" fill="#232A21"/></svg>`;
}

const bubbles = id => `<span class="bub"><b>고</b><b>한</b></span>`;
const line = (w, id) => `<span class="wl" style="min-width:${w}"><i>${id}</i></span>`;

let A = 0, B = 0, C = 0, D = 0, E = 0, F = 0;
const key = { A: [], B: [], C: [], D: [], E: [], F: [] };

/* --- P1 판별 --- */
let p1 = '';
GRID.forEach(x => {
  A++;
  key.A.push(`A${A}. ${x.u}（${x.cn}）→ ${x.side === 'n' ? '고유어' : '한자어'}`);
  p1 += `<div class="gcell"><span class="gn">${A}</span><span class="gu">${esc(x.u)}</span><span class="gc">${esc(x.cn)}</span>${bubbles()}</div>`;
});

/* --- P2 시계 --- */
let p2a = '';
CLOCKS.forEach(([h, m]) => {
  B++; key.B.push(`B${B}. ${h}:${String(m).padStart(2, '0')} → ${readTime(h, m)}`);
  p2a += `<div class="ccell">${clockSVG(h, m)}<span class="cn2">B${B}</span><span class="wl wide"></span></div>`;
});
let p2b = '';
TIMES.forEach(([h, m]) => {
  B++; key.B.push(`B${B}. ${h}:${String(m).padStart(2, '0')} → ${readTime(h, m)}`);
  p2b += `<div class="row half"><span class="q">B${B}. <b>${h}시 ${m}분</b></span><span class="wl grow"></span></div>`;
});
let p2c = '';
DURS.forEach(([h, m]) => {
  B++; key.B.push(`B${B}. ${h}시간 ${m}분(时长) → ${readDur(h, m)}`);
  p2c += `<div class="row half"><span class="q">B${B}. <b>${h}시간 ${m}분</b></span><span class="wl grow"></span></div>`;
});

/* --- P3 카페 --- */
let p3 = '';
CAFE.forEach(r => {
  const q = ++C, s1 = ++C, s2 = ++C;
  key.C.push(`C${q}. ${r.q}${r.c} → ${nativeAttr(r.q)} ${r.c}`);
  key.C.push(`C${s1}. 금액 숫자 → ${r.sum.toLocaleString()}원`);
  key.C.push(`C${s2}. 금액 한글 → ${sino(r.sum)} 원`);
  p3 += `<tr><td class="mn">${esc(r.n)}<s>${esc(r.cn)}</s></td>` +
    `<td class="qt">${r.q}${esc(r.c)}</td>` +
    `<td><span class="wl"><i>C${q}</i></span></td>` +
    `<td class="pr">${r.p.toLocaleString()}</td>` +
    `<td><span class="wl sm"><i>C${s1}</i></span></td>` +
    `<td><span class="wl"><i>C${s2}</i></span></td></tr>`;
});
const ct1 = ++C, ct2 = ++C;
key.C.push(`C${ct1}. 총합계 숫자 → ${CAFE_TOTAL.toLocaleString()}원`);
key.C.push(`C${ct2}. 총합계 한글 → ${sino(CAFE_TOTAL)} 원`);
const PAID = 150000, CHANGE = PAID - CAFE_TOTAL;
const cg1 = ++C, cg2 = ++C;
key.C.push(`C${cg1}. 거스름돈 숫자 → ${CHANGE.toLocaleString()}원`);
key.C.push(`C${cg2}. 거스름돈 한글 → ${sino(CHANGE)} 원`);

/* --- P4 날짜·나이·번호 --- */
let p4a = '';
DATES.forEach(([m, d]) => {
  D++; key.D.push(`D${D}. ${m}월 ${d}일 → ${MONTH[m]} ${sino(d)} 일`);
  p4a += `<div class="row"><span class="q">D${D}. <b>${m}월 ${d}일</b></span><span class="wl grow"></span></div>`;
});
let p4b = '';
AGES.forEach(n => {
  D++; key.D.push(`D${D}. ${n}살 → ${nativeAttr(n)} 살`);
  p4b += `<div class="row half"><span class="q">D${D}. <b>${n}살</b></span><span class="wl grow"></span></div>`;
});
let p4c = '';
SINOBITS.forEach(x => {
  D++; key.D.push(`D${D}. ${x.q}（${x.cn}）→ ${x.a}`);
  const full = x.q.length > 9;
  p4c += `<div class="row${full ? ' wide' : ' half'}"><span class="q">D${D}. <b>${esc(x.q)}</b> <s>${esc(x.cn)}</s></span><span class="wl grow"></span></div>`;
});

/* --- P5 받아쓰기 + 오류사냥 --- */
let p5a = '';
DICT.forEach(x => {
  E++; key.E.push(`E${E}. ${x.ko}（${x.cn}）`);
  p5a += `<div class="dcell"><span class="dn">E${E}</span><span class="wl grow"></span></div>`;
});
let p5b = '';
HUNT.forEach(x => {
  F++; key.F.push(`F${F}. ${x.s} → ${x.ok ? '✓ 맞음' : '✗ ' + x.fix}`);
  p5b += `<div class="hrow"><span class="hn">F${F}</span><span class="hs">${esc(x.s)}<s>${esc(x.cn)}</s></span><span class="wl fix"></span></div>`;
});

const CSS = `
@page{size:A4;margin:0}
html,body{background:#DCE7DA;-webkit-print-color-adjust:exact;print-color-adjust:exact}
*{box-sizing:border-box}
body{margin:0;font-family:'NanumBarunGothic','Nanum Gothic',sans-serif;color:#232A21;font-size:10.5pt;line-height:1.4;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cn3{font-family:'WenQuanYi Zen Hei',sans-serif}
s{text-decoration:none;font-family:'WenQuanYi Zen Hei',sans-serif;color:#5E6659;font-size:8pt;margin-left:3pt}
.page{page-break-after:always;display:flex;flex-direction:column;min-height:295mm;padding:11mm 10mm 9mm;background:#DCE7DA}
.page:last-child{page-break-after:auto}
.ph{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.4pt solid #232A21;padding-bottom:3pt;margin-bottom:7pt}
.ph .t{font-size:17pt;font-weight:800;letter-spacing:-.02em}
.ph .t b{color:#B0402A}
.ph .m{font-size:8.5pt;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif}
.lead{font-size:9pt;color:#3B4438;font-family:'WenQuanYi Zen Hei',sans-serif;background:#D0DCCD;border-left:2.5pt solid #B0402A;padding:7pt 9pt;margin-bottom:10pt;line-height:1.5}
.lead b{color:#B0402A}
.sec{font-size:11.5pt;font-weight:800;margin:12pt 0 6pt;padding-bottom:2pt;border-bottom:.8pt solid #AFBCAB}
.sec s{font-size:8.5pt}
.timer{float:right;font-size:8.5pt;font-weight:400;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif}

/* 판별 그리드 */
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.gcell{display:flex;align-items:center;gap:5pt;border-bottom:.5pt solid #C6D2C3;border-right:.5pt solid #C6D2C3;padding:4.6pt 7pt}
.gcell:nth-child(3n){border-right:none}
.gn{font-size:7.5pt;color:#98A394;width:14pt;font-variant-numeric:tabular-nums}
.gu{font-size:14pt;font-weight:800;min-width:36pt}
.gc{font-size:8pt;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif;flex:1}
.bub{display:flex;gap:4pt}
.bub b{width:17pt;height:17pt;border:1pt solid #232A21;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10pt;font-weight:700}
.bub b:first-child{color:#B0402A;border-color:#B0402A}
.bub b:last-child{color:#2B5870;border-color:#2B5870}

/* 쓰기 줄 */
.wl{display:inline-block;border-bottom:.8pt solid #8C9788;min-width:130pt;height:30pt;position:relative}
.wl.grow{flex:1}
.wl.wide{width:100%;margin-top:3pt}
.wl.sm{min-width:60pt}
.wl.fix{min-width:95pt;margin-left:auto}
.wl i{position:absolute;left:1pt;bottom:1pt;font-style:normal;font-size:7pt;color:#AAB6A6}
.row{display:flex;align-items:flex-end;gap:8pt;margin-bottom:8pt}
.row.half{width:48%}
.row.wide{width:100%}
.rows2{display:flex;flex-wrap:wrap;gap:0 4%}
.q{font-size:10.5pt;white-space:nowrap}
.q b{font-size:13pt;font-weight:800}

/* 시계 */
.clocks{display:grid;grid-template-columns:repeat(3,1fr);gap:14pt 14pt}
.ccell{display:flex;flex-direction:column;align-items:center}
.clk{width:80pt;height:80pt}
.cn2{font-size:8pt;color:#5E6659;margin-top:1pt}

/* 카페 */
.menu{display:flex;flex-wrap:wrap;gap:4pt 12pt;font-size:9pt;color:#3B4438;background:#D0DCCD;padding:5pt 7pt;margin-bottom:7pt}
.menu span b{font-weight:800}
table{width:100%;border-collapse:collapse}
th{font-size:8pt;color:#5E6659;text-align:left;border-bottom:1pt solid #232A21;padding:2pt 3pt;font-family:'WenQuanYi Zen Hei',sans-serif;font-weight:600}
td{border-bottom:.5pt solid #C6D2C3;padding:7pt 4pt;vertical-align:bottom}
.mn{font-size:11pt;font-weight:700;white-space:nowrap}
.qt{font-size:13.5pt;font-weight:800;color:#B0402A;white-space:nowrap}
.pr{font-size:11pt;color:#2B5870;font-variant-numeric:tabular-nums;white-space:nowrap}
.tot{background:#D0DCCD}
.tot td{font-weight:800;border-bottom:1.4pt solid #232A21}

/* 받아쓰기 */
.dgrid{display:grid;grid-template-columns:1fr 1fr;gap:0 14pt}
.dcell{display:flex;align-items:flex-end;gap:6pt;margin-bottom:7pt}
.dn{font-size:8pt;color:#5E6659;width:24pt;font-variant-numeric:tabular-nums}
/* 오류사냥 */
.hrow{display:flex;align-items:flex-end;gap:6pt;border-bottom:.5pt solid #D2DCCF;padding:3.5pt 0}
.hrow .wl.fix{height:23pt}
.hn{font-size:8pt;color:#5E6659;width:22pt}
.hs{font-size:11pt;flex:1}
/* 기록 */
.rec{width:100%;margin-top:6pt}
.rec td,.rec th{border:.6pt solid #AFBCAB;height:26pt;text-align:center;font-size:9pt}
.foot{margin-top:auto;padding-top:8pt;display:flex;justify-content:space-between;font-size:7.5pt;color:#98A394;border-top:.5pt solid #C6D2C3;padding-top:2pt}
`;

function page(n, title, meta, lead, body) {
  return `<div class="page"><div class="ph"><span class="t">${title}</span><span class="m">${meta}</span></div>` +
    (lead ? `<div class="lead">${lead}</div>` : '') + body +
    `<div class="foot"><span>숫자 집중 훈련 · 2026-08-09</span><span>${n} / 6</span></div></div>`;
}

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>숫자 집중 훈련</title><style>${CSS}</style></head><body>

${page(1, '① 판별 <b>60</b>', '고유어 = 고 / 한자어 = 한 · 只圈不读',
  '<b>只做一件事：</b>看单位，圈出它配哪套数字。<b>不要念数字，不要翻译整句。</b>60 个，目标 <b>90 秒内</b>。做完记下用时和错数——这是你之后判断进步的基线。<br>有几个单位会重复出现，那是最容易混的，属于故意安排。',
  `<div class="sec">A1 – A60 <span class="timer">用时 ______ 秒 ／ 错 ______ 个</span></div><div class="grid">${p1}</div>`)}

${page(2, '② 시계 <b>18</b>', '시 = 고유어 · 분 = 한자어',
  '一句话里换两次手：<b>点钟用固有词，分钟用汉字词</b>。写全（例：3:15 → 세 시 십오 분）。最后 4 题是<b>时长</b>，注意 시 和 시간 的区别。',
  `<div class="sec">B1 – B6 <s>看钟面写读法</s></div><div class="clocks">${p2a}</div>
   <div class="sec">B7 – B14 <s>写出完整读法</s></div><div class="rows2">${p2b}</div>
   <div class="sec">B15 – B18 <s>时长 — 不是「几点」是「几个小时」</s></div><div class="rows2">${p2c}</div>`)}

${page(3, '③ 카페 주문서 <b>22</b>', '수량 = 고유어 · 금액 = 한자어',
  '这一页最接近真实使用：<b>同一行里数量走固有词、金额走汉字词</b>。金额先算出数字再写读法（韩语和中文一样按「万」进位，这一步对你是免费的）。',
  `<div class="menu"><span><b>아메리카노</b> 4,500</span><span><b>카페라테</b> 5,000</span><span><b>치즈케이크</b> 6,500</span><span><b>샌드위치</b> 7,200</span><span><b>생수</b> 1,200</span><span><b>쿠키</b> 2,800</span></div>
   <table><thead><tr><th>메뉴</th><th>수량</th><th>수량 읽기（고유어）</th><th>단가</th><th>금액 숫자</th><th>금액 읽기（한자어）</th></tr></thead><tbody>${p3}
   <tr class="tot"><td>총합계</td><td></td><td></td><td></td><td><span class="wl sm"><i>C${ct1}</i></span></td><td><span class="wl"><i>C${ct2}</i></span></td></tr></tbody></table>
   <div class="sec">거스름돈 <s>付 15万韩元，找零多少？</s></div>
   <div class="row"><span class="q">C${cg1}. <b>150,000원</b> 냈어요 → 거스름돈 <s>数字</s></span><span class="wl sm"><i>C${cg1}</i></span><span class="q"><s>读法</s></span><span class="wl grow"><i>C${cg2}</i></span></div>
   <div class="sec">소리 내어 <s>写完后把整张单子出声念一遍 —— 数字的瓶颈在发音速度，默读练不到</s></div>
   <div style="font-size:8pt;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif">念完打勾：<span style="letter-spacing:6pt">☐☐☐</span> （念 3 遍，第 3 遍不看纸）</div>`)}

${page(4, '④ 날짜 · 나이 · 번호 <b>22</b>', '날짜/번호 = 한자어 · 나이 = 고유어',
  '<b>两个不规则务必记住：6월 = 유월（不是 육월）、10월 = 시월（不是 십월）。</b>本页故意各放了两次。电话号码里的 0 念 <b>공</b>。',
  `<div class="sec">D1 – D6 <s>日期 — 全部汉字词</s></div>${p4a}
   <div class="sec">D7 – D14 <s>年龄 — 全部固有词</s></div><div class="rows2">${p4b}</div>
   <div class="sec">D15 – D22 <s>楼层·房号·电话·期间 — 全部汉字词</s></div><div class="rows2">${p4c}</div>`)}

${page(5, '⑤ 받아쓰기 <b>20</b>', '听写 · 配发音页使用',
  '<b>这一页要配发音页用</b>（我另外给你一个能出声的页面，点一下念一句，可以重复听）。<b>听到什么写什么，写韩文不写中文。</b><br>听不出来就空着——空着比乱猜有用，那是我批改时最需要看到的信息。一句最多重复听 <b>3 遍</b>，再听不出就跳过。',
  `<div class="sec">E1 – E20 <span class="timer">对 ______ / 20</span></div><div class="dgrid">${p5a}</div>`)}

${page(6, '⑥ 오류 사냥 <b>12</b>', '找错 · 判断力训练',
  '<b>里面混着本来就正确的句子</b>——不要看到一句改一句，那样练的是手不是判断。<br>对的在句子上画 <b>○</b>；错的圈出错的部分，把正确写法写在右边横线上。',
  `<div class="sec">F1 – F12</div>${p5b}
   <div class="sec">기록 <s>每天做完填一行，5 天一轮 —— 这张表比分数本身更重要，它让你看见哪条规则在漏</s></div>
   <table class="rec"><tr><th>날짜</th><th>판별 用时/错</th><th>시계 错</th><th>주문서 错</th><th>날짜 错</th><th>듣기 对/20</th><th>오류사냥 错</th></tr>
   ${[1,2,3,4].map(()=>'<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}</table>`)}

</body></html>`;

fs.writeFileSync('worksheet.html', html);

/* ---------- 정답지 ---------- */
const keyMd = `# 숫자 집중 훈련 · 정답지 (2026-08-09)

> 做完再看。先把照片发给我批改，我能看出你是哪条规则在漏。

## A. 판별 60 (고유어 = 고 / 한자어 = 한)
${key.A.join('\n')}

## B. 시계 18
${key.B.join('\n')}

## C. 카페 주문서 20
${key.C.join('\n')}

## D. 날짜·나이·번호 22
${key.D.join('\n')}

## E. 받아쓰기 20
${key.E.join('\n')}

## F. 오류 사냥 12
${key.F.join('\n')}
`;
fs.writeFileSync('answerkey.md', keyMd);
fs.writeFileSync('dict.json', JSON.stringify(DICT));

console.log(`worksheet.html ok | 문항 A${A} B${B} C${C} D${D} E${E} F${F} = ${A + B + C + D + E + F}`);
console.log('카페 합계:', CAFE_TOTAL, '=', sino(CAFE_TOTAL));
console.log('샘플:', readTime(3, 15), '|', nativeAttr(21), '|', nativeAttr(20), '|', sino(12000), '|', MONTH[6], MONTH[10]);
