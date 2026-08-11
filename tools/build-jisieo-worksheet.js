/* 지시어(이/그/저) 연습지 생성기 — 문제지와 정답지를 한 소스에서 */
const fs = require('fs');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* A. 이/그/저 판별 — 상황(중국어)만 보고 고르기 */
const A = [
  ['书在我手里', '이'], ['书在你手里', '그'], ['对面书架上，我俩都够不到', '저'],
  ['我脚边的包', '이'], ['你身上穿的那件衣服', '그'], ['远处山上的建筑', '저'],
  ['刚才你说的那家店（看不见）', '그'], ['我正坐的这个位置', '이'], ['你旁边的椅子', '그'],
  ['教室最后面的黑板（我俩都在前面）', '저'], ['昨天看的那部电影（看不见）', '그'], ['我现在住的地方', '이'],
  ['你手机里的那张照片', '그'], ['窗外远处的车', '저'], ['我们刚聊到的那个人（不在场）', '그'],
  ['我手上这支笔', '이'], ['对面墙上挂的画', '저'], ['你刚提到的那位老师', '그'],
];

/* B. 형식표 — 빈칸 9개 */
const BTAB = [
  ['이', [['이것', 0], ['여기', 1], ['이 사람', 0], ['이 + N', 0]]],
  ['그', [['그것', 1], ['거기', 1], ['그 사람', 1], ['그 + N', 0]]],
  ['저', [['저것', 1], ['저기', 1], ['저 사람', 0], ['저 + N', 1]]],
];  // 두 번째 값 1 = 빈칸

/* D. 대화 — 물을 땐 이/가, 답할 땐 은/는 */
const D = [
  ['이 사람', '누구입니까', '제 동생입니다', '이', '은'],
  ['여기', '어디입니까', '교실입니다', '가', '는'],
  ['그것', '무엇입니까', '한국어 책입니다', '이', '은'],
  ['저 사람', '누구입니까', '제 친구입니다', '이', '은'],
  ['이 책', '무슨 책입니까', '사전입니다', '이', '은'],
  ['거기', '어디입니까', '도서관입니다', '가', '는'],
];

/* E. 도 / 그리고 / 하지만 */
const E = [
  ['저는 학생입니다. 동생( ) 학생입니다.', '도', '我是学生，弟弟也是学生。'],
  ['이 책은 재미있습니다. ( ) 쌉니다.', '그리고', '这本书有意思，而且便宜。'],
  ['이 가방은 예쁩니다. ( ) 비쌉니다.', '하지만', '这个包漂亮，但是贵。'],
  ['여기는 교실입니다. ( ) 저기는 도서관입니다.', '그리고', '这里是教室，那边是图书馆。'],
  ['이 커피는 맛있습니다. ( ) 비쌉니다.', '하지만', '这咖啡好喝，但是贵。'],
  ['저( ) 한국어를 공부합니다.', '도', '我也学韩语。'],
  ['그 사람은 친절합니다. ( ) 조용합니다.', '그리고', '那个人亲切，而且安静。'],
  ['이 방은 넓습니다. ( ) 어둡습니다.', '하지만', '这房间宽敞，但是暗。'],
];

/* F. DV 연결 — 8/7 형용사와 합치기 */
const F = [
  ['这本书有意思。', '이 책이 재미있습니다.'],
  ['那个包贵。（远处看得见）', '저 가방이 비쌉니다.'],
  ['那个人亲切。（刚说过的）', '그 사람이 친절합니다.'],
  ['这里安静。', '여기가 조용합니다.'],
  ['那件衣服漂亮。（你身上的）', '그 옷이 예쁩니다.'],
  ['那个教室宽敞。（远处）', '저 교실이 넓습니다.'],
];

/* C. 의문사 — 대답을 보고 물음말 채우기 */
const C = [
  ['이것이 (　　　)입니까?', '책입니다.', '무엇'],
  ['이 사람이 (　　　)입니까?', '제 동생입니다.', '누구'],
  ['여기가 (　　　)입니까?', '교실입니다.', '어디'],
  ['이 책이 (　　　) 책입니까?', '한국어 책입니다.', '무슨'],
  ['저 사람이 (　　　)입니까?', '제 친구입니다.', '누구'],
  ['거기가 (　　　)입니까?', '도서관입니다.', '어디'],
];

let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
const key = { A: [], B: [], C: [], D: [], E: [], F: [] };

let pA = '';
A.forEach(([sit, ans]) => {
  a++; key.A.push(`A${a}. ${sit} → ${ans}`);
  pA += `<div class="gcell"><span class="gn">${a}</span><span class="gc">${esc(sit)}</span>` +
        `<span class="bub"><b class="i">이</b><b class="g">그</b><b class="j">저</b></span></div>`;
});

let pB = '';
BTAB.forEach(([row, cells]) => {
  pB += `<tr><th class="rh">${row}</th>`;
  cells.forEach(([txt, blank]) => {
    if (blank) { b++; key.B.push(`B${b}. ${txt}`); pB += `<td><span class="wl b"><i>B${b}</i></span></td>`; }
    else pB += `<td class="given">${esc(txt)}</td>`;
  });
  pB += `</tr>`;
});

let pC = '';
C.forEach(([q, ans, w]) => {
  c++; key.C.push(`C${c}. ${w}　（${q.replace('(　　　)', '【' + w + '】')}）`);
  pC += `<div class="erow"><span class="en">C${c}</span><span class="es">${esc(q)}<s>— ${esc(ans)}</s></span><span class="wl sm"></span></div>`;
});

let pD = '';
D.forEach(([subj, q, ans, p1, p2]) => {
  const n1 = ++d, n2 = ++d;
  key.D.push(`D${n1}. ${subj}${p1} ${q}?`);
  key.D.push(`D${n2}. ${subj}${p2} ${ans}`);
  pD += `<div class="dlg">` +
    `<div class="ln"><span class="sp">가</span>${esc(subj)}<span class="bl"><i>D${n1}</i></span> ${esc(q)}?</div>` +
    `<div class="ln"><span class="sp">나</span>${esc(subj)}<span class="bl"><i>D${n2}</i></span> ${esc(ans)}</div></div>`;
});

let pE = '';
E.forEach(([s, ans, cn]) => {
  e++; key.E.push(`E${e}. ${ans}　（${s.replace('( )', '【' + ans + '】')}）`);
  pE += `<div class="erow"><span class="en">E${e}</span><span class="es">${esc(s)}<s>${esc(cn)}</s></span><span class="wl sm"></span></div>`;
});

let pF = '';
F.forEach(([cn, ans]) => {
  f++; key.F.push(`F${f}. ${cn} → ${ans}`);
  pF += `<div class="frow"><span class="en">F${f}</span><span class="fc">${esc(cn)}</span><span class="wl grow"></span></div>`;
});

const CSS = `
@page{size:A4;margin:0}
html,body{background:#DCE7DA;-webkit-print-color-adjust:exact;print-color-adjust:exact}
*{box-sizing:border-box}
body{margin:0;font-family:'NanumBarunGothic','Nanum Gothic',sans-serif;color:#232A21;font-size:10.5pt;line-height:1.4}
s{text-decoration:none;font-family:'WenQuanYi Zen Hei',sans-serif;color:#5E6659;font-size:8pt;margin-left:5pt}
.cn{font-family:'WenQuanYi Zen Hei',sans-serif}
.page{page-break-after:always;display:flex;flex-direction:column;min-height:295mm;padding:11mm 10mm 9mm;background:#DCE7DA}
.page:last-child{page-break-after:auto}
.ph{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.4pt solid #232A21;padding-bottom:3pt;margin-bottom:8pt}
.ph .t{font-size:17pt;font-weight:800;letter-spacing:-.02em}
.ph .t b{color:#B0402A}
.ph .m{font-size:8.5pt;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif}
.lead{font-size:9pt;color:#3B4438;font-family:'WenQuanYi Zen Hei',sans-serif;background:#D0DCCD;border-left:2.5pt solid #B0402A;padding:7pt 9pt;margin-bottom:10pt;line-height:1.55}
.lead b{color:#B0402A}
.sec{font-size:11.5pt;font-weight:800;margin:9pt 0 5pt;padding-bottom:2pt;border-bottom:.8pt solid #AFBCAB}
.sec s{font-size:8.5pt}
.sec .tm{float:right;font-size:8.5pt;font-weight:400;color:#5E6659;font-family:'WenQuanYi Zen Hei',sans-serif}

/* A 판별 */
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0}
.gcell{display:flex;align-items:center;gap:6pt;border-bottom:.5pt solid #C6D2C3;border-right:.5pt solid #C6D2C3;padding:5.5pt 7pt}
.gcell:nth-child(2n){border-right:none}
.gn{font-size:7.5pt;color:#98A394;width:14pt;font-variant-numeric:tabular-nums}
.gc{font-size:9.5pt;font-family:'WenQuanYi Zen Hei',sans-serif;flex:1;line-height:1.3}
.bub{display:flex;gap:4pt;flex:none}
.bub b{width:18pt;height:18pt;border:1pt solid;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10pt;font-weight:700}
.bub .i{color:#B0402A;border-color:#B0402A}
.bub .g{color:#7A6A2E;border-color:#7A6A2E}
.bub .j{color:#2B5870;border-color:#2B5870}

/* 쓰기 줄 */
.wl{display:inline-block;border-bottom:.8pt solid #8C9788;min-width:120pt;height:26pt;position:relative}
.wl.grow{flex:1}.wl.sm{min-width:72pt}.wl.b{min-width:0;width:100%;height:22pt}
.wl i{position:absolute;left:1pt;bottom:1pt;font-style:normal;font-size:7pt;color:#AAB6A6}

/* B 표 */
table{width:100%;border-collapse:collapse;margin-top:2pt}
th{font-size:8pt;color:#5E6659;border-bottom:1pt solid #232A21;padding:3pt 4pt;font-family:'WenQuanYi Zen Hei',sans-serif;font-weight:600;text-align:left}
td{border-bottom:.5pt solid #C6D2C3;padding:4pt;vertical-align:bottom}
.rh{font-size:14pt;font-weight:800;width:34pt;text-align:center;color:#B0402A;border-bottom:.5pt solid #C6D2C3}
.given{font-size:12pt;font-weight:700;color:#5E6659}

/* D 대화 */
.dgrid{display:grid;grid-template-columns:1fr 1fr;gap:0 16pt}
.dlg{border-bottom:.5pt solid #C6D2C3;padding:4pt 0}
.ln{font-size:11pt;display:flex;align-items:baseline;flex-wrap:wrap;line-height:1.7}
.sp{font-size:8pt;color:#5E6659;width:16pt;flex:none}
.bl{display:inline-block;border-bottom:.8pt solid #8C9788;width:34pt;height:17pt;position:relative;margin:0 2pt}
.bl i{position:absolute;left:0;bottom:1pt;font-style:normal;font-size:6.5pt;color:#AAB6A6}

/* E / F */
.erow,.frow{display:flex;align-items:flex-end;gap:6pt;border-bottom:.5pt solid #D2DCCF;padding:3pt 0}
.erow .wl{height:19pt}
.en{font-size:8pt;color:#5E6659;width:20pt;flex:none}
.es{font-size:10.5pt;flex:1}
.fc{font-size:10pt;font-family:'WenQuanYi Zen Hei',sans-serif;width:150pt;flex:none}
.foot{margin-top:auto;padding-top:8pt;display:flex;justify-content:space-between;font-size:7.5pt;color:#98A394;border-top:.5pt solid #C6D2C3}
`;

const page = (n, title, meta, lead, body) =>
  `<div class="page"><div class="ph"><span class="t">${title}</span><span class="m">${meta}</span></div>` +
  `<div class="lead">${lead}</div>${body}` +
  `<div class="foot"><span>지시어 연습 · 2026-08-11</span><span>${n} / 2</span></div></div>`;

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>지시어 연습</title><style>${CSS}</style></head><body>

${page(1, '① 이 · 그 · 저 <b>31</b>', '中文两分 → 韩语三分',
  '<b>只判断，先不要造句。</b>判断顺序是「在谁旁边」，不是「远不远」：在我这边 → <b>이</b>；在你那边、或前面提过的 → <b>그</b>；我俩都够不着但看得见 → <b>저</b>。<br>看不见的东西只能用 <b>그</b>，不能用 저。',
  `<div class="sec">A1 – A18 <s>圈出正确的一个</s><span class="tm">错 ______ 个</span></div><div class="grid">${pA}</div>
   <div class="sec">B1 – B7 <s>补全形式表 —— 有一格是不规则的</s></div>
   <table><thead><tr><th></th><th>事物</th><th>场所</th><th>人</th><th>冠形词</th></tr></thead><tbody>${pB}</tbody></table>
   <div class="sec">C1 – C6 <s>看回答，填疑问词：무엇 / 무슨 / 누구 / 어디</s></div>${pC}`)}

${page(2, '② 대화 · 연결 · DV <b>26</b>', '问用 이/가 · 答用 은/는',
  '<b>D 题的规律自己先找出来</b>：同一个词，问句里加什么、答句里加什么？<br>F 题要用 8/7 那 40 个形容词，括号里的提示决定用 이/그/저 哪一个。',
  `<div class="sec">D1 – D12 <s>填助词</s></div><div class="dgrid">${pD}</div>
   <div class="sec">E1 – E8 <s>填 도 / 그리고 / 하지만</s></div>${pE}
   <div class="sec">F1 – F6 <s>翻译成韩语（합니다체）</s></div>${pF}`)}

</body></html>`;

fs.writeFileSync('jisieo.html', html);
fs.writeFileSync('jisieo-key.md', `# 지시어 연습 · 정답지 (2026-08-11)

> 做完再看。先拍照发我。

## A. 이/그/저 판별 18
${key.A.join('\n')}

## B. 형식표 9
${key.B.join('\n')}

## C. 의문사 6
${key.C.join('\n')}

## D. 대화 조사 12
${key.D.join('\n')}

## E. 도 / 그리고 / 하지만 8
${key.E.join('\n')}

## F. DV 연결 6
${key.F.join('\n')}
`);
console.log(`jisieo.html ok | A${a} B${b} C${c} D${d} E${e} F${f} = ${a + b + c + d + e + f}`);
