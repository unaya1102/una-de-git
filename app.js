/* 汉字词外挂 — SRS 引擎 + UI
   再认导向：低门槛第一遍 + 间隔重复 + “记不住的拎回来重背”。 */

const DAY = 86400000;
// box -> 下次间隔(天)。box0=刚学/没记住，10分钟内重来。
const INT = [10/1440, 1, 2, 4, 7, 15, 30, 60];
const MAXBOX = INT.length - 1;
const STORE = 'hanjaSRS_v1';

const todayStr = () => new Date().toISOString().slice(0,10);

function load(){
  let s;
  try { s = JSON.parse(localStorage.getItem(STORE)); } catch(e){ s = null; }
  if(!s) s = {};
  s.cards    = s.cards    || {};
  s.settings = s.settings || { newPerDay: 20 };
  s.face     = s.face     || 'hanja';
  s.hardPool = s.hardPool || [];   // 反复记不住的词(汉字)，按进入顺序
  s.stories  = s.stories  || {};   // 已生成故事缓存：groupKey -> {text, seed}
  if(s.day !== todayStr()){ s.day = todayStr(); s.newToday = 0; }
  s.newToday = s.newToday || 0;
  return s;
}
const LAPSE_THRESHOLD = 3;   // 点几次「不会」算反复记不住
function save(){ try{ localStorage.setItem(STORE, JSON.stringify(state)); }catch(e){} }

let state = load();
let queue = [];
let revealed = false;

/* ---------- 选卡 / 队列 ---------- */
function cardOf(w){ return state.cards[w.hanja]; }

function buildQueue(){
  const now = Date.now();
  const due = [], fresh = [];
  for(const w of WORDS){
    const c = cardOf(w);
    if(c && c.seen){
      if(c.due <= now) due.push(w.hanja);
    } else {
      fresh.push(w.hanja);
    }
  }
  due.sort((a,b)=> state.cards[a].due - state.cards[b].due);
  const room = Math.max(0, state.settings.newPerDay - state.newToday);
  const newPick = fresh.slice(0, room);
  // 复习优先在前，穿插新词
  queue = [];
  let di=0, ni=0;
  while(di<due.length || ni<newPick.length){
    if(di<due.length){ queue.push(due[di++]); }
    if(ni<newPick.length && (di % 3 === 0)){ queue.push(newPick[ni++]); }
    else if(di>=due.length && ni<newPick.length){ queue.push(newPick[ni++]); }
  }
}

function ensureCard(hanja){
  if(!state.cards[hanja]) state.cards[hanja] = { box:0, due:0, seen:false, lapses:0 };
  return state.cards[hanja];
}

/* ---------- 评分 ---------- */
function rate(kind){
  const hanja = queue[0];
  const w = WORDS.find(x=>x.hanja===hanja);
  const c = ensureCard(hanja);
  const wasNew = !c.seen;
  const now = Date.now();

  if(wasNew){ c.seen = true; state.newToday++; }

  if(kind==='again'){
    c.box = 0; c.lapses++; c.due = now + INT[0]*DAY;
    // 反复记不住 → 进入「需要记忆」池
    if(c.lapses >= LAPSE_THRESHOLD && !state.hardPool.includes(hanja)){
      state.hardPool.push(hanja);
    }
  } else if(kind==='good'){
    c.box = Math.min((wasNew?0:c.box)+1, MAXBOX); c.due = now + INT[c.box]*DAY;
  } else if(kind==='easy'){
    c.box = Math.min((wasNew?0:c.box)+2, MAXBOX); c.due = now + INT[c.box]*DAY;
  }
  save();

  queue.shift();
  // 短间隔(10分钟内)= 本轮重来：拎回队列靠后位置
  if(c.due <= now + INT[0]*DAY + 1000){
    const pos = Math.min(queue.length, 7);
    queue.splice(pos, 0, hanja);
  }
  if(queue.length === 0) buildQueue();
  revealed = false;
  renderStudy(); renderProgress(); renderStoryBadge();
}

/* ---------- 渲染：学习 ---------- */
function humanInt(days){
  if(days < 1) return Math.round(days*24*60)+'분';
  if(days < 30) return Math.round(days)+'일';
  return Math.round(days/30)+'개월';
}
function nextInt(box, kind, wasNew){
  let b;
  if(kind==='again') b=0;
  else if(kind==='good') b=Math.min((wasNew?0:box)+1,MAXBOX);
  else b=Math.min((wasNew?0:box)+2,MAXBOX);
  return humanInt(INT[b]);
}

function charsHTML(w){
  return '<div class="chars">' + w.chars.map(c=>
    `<div class="chip"><div class="ch">${c.h}</div><div class="ck">${c.k}</div><div class="cm">${c.m}</div></div>`
  ).join('') + '</div>';
}

function renderStudy(){
  const area = document.getElementById('studyArea');
  const btns = document.getElementById('btns');
  if(queue.length === 0){
    area.innerHTML = `<div class="empty"><div class="em">🎉</div>
      <b>今天的卡片都过完了！</b><br>
      没有待复习的词了。<br>想多学就去「통계」调高每天新词上限。</div>`;
    btns.innerHTML = '';
    return;
  }
  const hanja = queue[0];
  const w = WORDS.find(x=>x.hanja===hanja);
  const c = cardOf(w);
  const wasNew = !c || !c.seen;
  const face = state.face;

  let front, reveal;
  if(face === 'hanja'){
    front = `<div class="face-tag">看汉字 · 推韩语读音 + 意思</div>
             <div class="hanja">${w.hanja}</div>
             <div class="hint">${wasNew?'🆕 新词':''}</div>`;
    reveal = `<div class="reveal">
      <div class="hangul">${w.hangul}</div>
      <div class="roman">[${w.roman}]</div>
      <div class="mean">${w.mean}</div>
      ${charsHTML(w)}</div>`;
  } else {
    front = `<div class="face-tag">看韩文 · 推中文意思</div>
             <div class="hangul-big">${w.hangul}</div>
             <div class="hint">${wasNew?'🆕 新词':''}</div>`;
    reveal = `<div class="reveal">
      <div class="hangul" style="font-size:30px">${w.hanja}</div>
      <div class="roman">[${w.roman}]</div>
      <div class="mean">${w.mean}</div>
      ${charsHTML(w)}</div>`;
  }

  area.innerHTML = `<div class="card">${front}${revealed?reveal:''}</div>`;

  if(!revealed){
    btns.innerHTML = `<button class="b-show" onclick="doReveal()">보기 · 揭晓</button>`;
  } else {
    btns.innerHTML = `
      <button class="b-bad"  onclick="rate('again')">몰라요<span class="sub-int">${nextInt(c?c.box:0,'again',wasNew)}</span></button>
      <button class="b-good" onclick="rate('good')">알아요<span class="sub-int">${nextInt(c?c.box:0,'good',wasNew)}</span></button>
      <button class="b-easy" onclick="rate('easy')">쉬워요<span class="sub-int">${nextInt(c?c.box:0,'easy',wasNew)}</span></button>`;
  }
}
function doReveal(){ revealed = true; renderStudy(); }

/* ---------- 渲染：进度 / 统计 ---------- */
function renderProgress(){
  const now = Date.now();
  let learned=0, due=0, mature=0;
  for(const w of WORDS){
    const c = cardOf(w);
    if(c && c.seen){
      learned++;
      if(c.due <= now) due++;
      if(c.box >= 4) mature++;
    }
  }
  document.getElementById('prog').innerHTML =
    `今日新词 <b>${state.newToday}</b>/${state.settings.newPerDay}<br>待复习 <b>${due}</b> · 已学 <b>${learned}</b>/${WORDS.length}`;
  document.getElementById('s-total').textContent   = WORDS.length;
  document.getElementById('s-learned').textContent = learned;
  document.getElementById('s-due').textContent     = due;
  document.getElementById('s-mature').textContent  = mature;
}

/* ---------- 故事记忆 ---------- */
// 简单可复现的伪随机（带种子），方便“换个故事”
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

// 离谱故事的模板：每句一个“坑”，把单词塞进去。够离谱、画面感强、无复杂语法。
const STORY_FRAMES = [
  '有一天，一只会说话的猫突然抱住了【】，吓得满街人尖叫。',
  '它把【】顶在头上，像戴了顶发光的帽子，到处跑。',
  '路边的大象看见了，立刻用鼻子卷起【】，塞进自己耳朵里。',
  '突然天上掉下一个巨大的【】，正好砸在西瓜摊上，汁水四溅。',
  '一个穿睡衣的老爷爷骑着扫把飞过，怀里还紧紧抱着【】。',
  '河里的鱼跳出水面，嘴里居然吐出一个闪闪发光的【】。',
  '机器人保安跑过来，非要检查每个人的【】，否则不让进门。',
  '这时一阵怪风把所有【】都吹上了天，像气球一样飘走。',
  '广场中央的喷泉突然喷出彩色的【】，小孩们笑着去接。',
  '最后，月亮裂开一条缝，从里面滚出最大的一个【】，全城轰动。',
];

function storyGroups(){
  // 把 hardPool 按 10 个一组切分
  const groups=[];
  for(let i=0;i<state.hardPool.length;i+=10){
    groups.push(state.hardPool.slice(i,i+10));
  }
  return groups;
}

function buildStory(hanjaList, seed){
  const rand=mulberry32(seed>>>0);
  // 用种子打乱句子顺序（Fisher-Yates），让“换个故事”每次都明显不同
  const frames=STORY_FRAMES.slice();
  for(let i=frames.length-1;i>0;i--){
    const j=Math.floor(rand()*(i+1));
    [frames[i],frames[j]]=[frames[j],frames[i]];
  }
  const parts=[];
  hanjaList.forEach((hanja,idx)=>{
    const w=WORDS.find(x=>x.hanja===hanja);
    if(!w) return;
    const frame=frames[idx%frames.length];
    const slot=`<span class="w">${w.mean}</span>（<span class="wk">${w.hangul}</span>）`;
    parts.push(frame.replace('【】',slot));
  });
  return parts.join('');
}

function renderStory(){
  const el=document.getElementById('tab-story');
  const groups=storyGroups();
  if(groups.length===0){
    el.innerHTML=`<div class="story-intro">
      <b>📖 故事记忆区</b><br><br>
      当你对同一个词点了 <b>${LAPSE_THRESHOLD} 次「몰라요(不会)」</b>，它就会自动进到这里。<br>
      每攒够 <b>10 个</b>顽固词，就自动编成一个<b>离谱小故事</b>，把词义和韩文都塞进剧情里，方便你靠画面记住。<br><br>
      现在还没有顽固词——继续在「학습」里背，记不住的会自己跑来这儿。</div>`;
    return;
  }
  let html=`<div class="story-intro">这里是反复记不住的词，编成离谱故事帮你记。读的时候<b>在脑子里把画面演一遍</b>，越夸张越好记。记住了就点「这组记住了」移走。</div>`;
  groups.forEach((g,gi)=>{
    const key='g'+gi+'_'+g.join('');
    if(!state.stories[key]) state.stories[key]={seed:(gi+1)*7919};
    const seed=state.stories[key].seed;
    const text=buildStory(g, seed);
    const legend=g.map(hanja=>{
      const w=WORDS.find(x=>x.hanja===hanja);
      if(!w) return '';
      return `<div class="li"><span class="lh">${w.hanja}</span><span class="lk">${w.hangul}</span><span class="lm">${w.mean}</span></div>`;
    }).join('');
    html+=`<div class="story-card">
      <h3>故事 ${gi+1} · 共 ${g.length} 词</h3>
      <div class="story-text">${text}</div>
      <div class="story-legend">${legend}</div>
      <div class="story-actions">
        <button class="sa-reroll" onclick="rerollStory('${key}')">🎲 换个故事</button>
        <button class="sa-done" onclick="storyDone(${gi})">✅ 这组记住了</button>
      </div>
    </div>`;
  });
  el.innerHTML=html;
}

function rerollStory(key){
  if(!state.stories[key]) state.stories[key]={seed:1};
  state.stories[key].seed = Math.floor(Math.random()*1e9);
  save(); renderStory();
}

function storyDone(groupIndex){
  // 移除该组的 10 个词
  const start=groupIndex*10;
  const removed=state.hardPool.slice(start,start+10);
  state.hardPool.splice(start,10);
  // 清掉相关故事缓存
  state.stories={};
  save();
  renderStory(); renderStoryBadge();
}

function renderStoryBadge(){
  const badge=document.getElementById('storyBadge');
  if(!badge) return;
  const n=state.hardPool.length;
  if(n>0){ badge.textContent=n; badge.classList.add('show'); }
  else{ badge.classList.remove('show'); }
}

/* ---------- 渲染：汉字音表 ---------- */
function renderTable(){
  const el = document.getElementById('tab-table');
  el.innerHTML = `<div class="note">背熟这些「汉字 → 固定韩音」对应，就能<b>批量推出</b>大量汉字词的读音。这是中文母语者最大的捷径。</div>` +
    HANJA_TABLE.map(g=>`
      <div class="group"><h3>${g.group}</h3>
        <div class="htable">${g.items.map(it=>
          `<div class="hcell"><div class="h">${it.h}</div><div class="k">${it.k}</div><div class="m">${it.m}</div></div>`
        ).join('')}</div></div>`).join('');
}

/* ---------- 导航 / 设置 ---------- */
function showTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on', b.dataset.tab===name));
  const btns = document.getElementById('btns');
  btns.style.display = (name==='study') ? 'flex' : 'none';
  if(name==='study'){ buildQueue(); renderStudy(); }
  if(name==='stats'){ renderProgress(); }
  if(name==='story'){ renderStory(); }
}

document.querySelectorAll('nav button').forEach(b=>
  b.addEventListener('click', ()=>showTab(b.dataset.tab)));

document.querySelectorAll('#faceSwitch button').forEach(b=>
  b.addEventListener('click', ()=>{
    state.face = b.dataset.face; save();
    document.querySelectorAll('#faceSwitch button').forEach(x=>x.classList.toggle('on', x===b));
    revealed=false; renderStudy();
  }));

const npd = document.getElementById('newPerDay');
npd.value = state.settings.newPerDay;
npd.addEventListener('change', ()=>{
  state.settings.newPerDay = Math.max(0, parseInt(npd.value)||0);
  save(); buildQueue(); renderStudy(); renderProgress();
});

document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('确定清空所有学习进度？此操作不可恢复。')){
    localStorage.removeItem(STORE); state = load();
    npd.value = state.settings.newPerDay;
    buildQueue(); renderStudy(); renderProgress(); renderStoryBadge(); showTab('study');
  }
});

/* ---------- 启动 ---------- */
document.querySelectorAll('#faceSwitch button').forEach(x=>
  x.classList.toggle('on', x.dataset.face===state.face));
renderTable();
buildQueue();
renderStudy();
renderProgress();
renderStoryBadge();
