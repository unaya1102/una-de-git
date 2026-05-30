/* 汉字音对照表 + 高频汉字词词库
   数据为常用高频词，面向中文母语者「再认」目标。
   roman 为大致罗马音，仅作辅助；以谚文(한글)发音为准。 */

window.HANJA_TABLE = [
  { group: '人 · 身份 (人/身份)', items: [
    {h:'人',k:'인',m:'人'},{h:'生',k:'생',m:'生/学生'},{h:'學',k:'학',m:'学'},
    {h:'子',k:'자',m:'子'},{h:'女',k:'녀/여',m:'女'},{h:'男',k:'남',m:'男'},
    {h:'王',k:'왕',m:'王'},{h:'民',k:'민',m:'民'},{h:'家',k:'가',m:'家/专家'},
  ]},
  { group: '场所 (场所)', items: [
    {h:'國',k:'국',m:'国'},{h:'市',k:'시',m:'市/市场'},{h:'場',k:'장',m:'场'},
    {h:'室',k:'실',m:'室/房间'},{h:'院',k:'원',m:'院/机构'},{h:'館',k:'관',m:'馆'},
    {h:'校',k:'교',m:'校'},{h:'店',k:'점',m:'店'},{h:'堂',k:'당',m:'堂/食堂'},
    {h:'港',k:'항',m:'港'},{h:'局',k:'국',m:'局'},{h:'社',k:'사',m:'社/公司'},
  ]},
  { group: '时间 · 数量 (时间/数量)', items: [
    {h:'時',k:'시',m:'时'},{h:'間',k:'간',m:'间'},{h:'分',k:'분',m:'分'},
    {h:'年',k:'년/연',m:'年'},{h:'月',k:'월',m:'月'},{h:'日',k:'일',m:'日'},
    {h:'半',k:'반',m:'半'},{h:'全',k:'전',m:'全'},{h:'每',k:'매',m:'每'},
  ]},
  { group: '动作 · 状态 (动作/状态)', items: [
    {h:'動',k:'동',m:'动'},{h:'行',k:'행/항',m:'行/银行'},{h:'食',k:'식',m:'食'},
    {h:'學',k:'학',m:'学'},{h:'用',k:'용',m:'用'},{h:'入',k:'입',m:'入'},
    {h:'出',k:'출',m:'出'},{h:'安',k:'안',m:'安'},{h:'要',k:'요',m:'要'},
    {h:'能',k:'능',m:'能'},{h:'可',k:'가',m:'可'},
  ]},
  { group: '文化 · 抽象 (文化/抽象)', items: [
    {h:'文',k:'문',m:'文'},{h:'語',k:'어',m:'语'},{h:'話',k:'화',m:'话'},
    {h:'音',k:'음',m:'音'},{h:'心',k:'심',m:'心'},{h:'意',k:'의',m:'意'},
    {h:'重',k:'중',m:'重'},{h:'大',k:'대',m:'大'},{h:'中',k:'중',m:'中'},
    {h:'新',k:'신',m:'新'},{h:'電',k:'전',m:'电'},{h:'地',k:'지',m:'地'},
  ]},
];

window.WORDS = [
  // —— 出差/旅行 高频 (旅行) ——
  {hanja:'出張',hangul:'출장',roman:'chuljang',mean:'出差',tags:['旅行'],chars:[{h:'出',k:'출',m:'出'},{h:'張',k:'장',m:'张/伸展'}]},
  {hanja:'豫約',hangul:'예약',roman:'yeyak',mean:'预约',tags:['旅行'],chars:[{h:'豫',k:'예',m:'预'},{h:'約',k:'약',m:'约'}]},
  {hanja:'旅券',hangul:'여권',roman:'yeogwon',mean:'护照',tags:['旅行'],chars:[{h:'旅',k:'여',m:'旅'},{h:'券',k:'권',m:'券'}]},
  {hanja:'空港',hangul:'공항',roman:'gonghang',mean:'机场',tags:['旅行'],chars:[{h:'空',k:'공',m:'空/航空'},{h:'港',k:'항',m:'港'}]},
  {hanja:'飛行機',hangul:'비행기',roman:'bihaenggi',mean:'飞机',tags:['旅行'],chars:[{h:'飛',k:'비',m:'飞'},{h:'行',k:'행',m:'行'},{h:'機',k:'기',m:'机'}]},
  {hanja:'入國',hangul:'입국',roman:'ipguk',mean:'入境',tags:['旅行'],chars:[{h:'入',k:'입',m:'入'},{h:'國',k:'국',m:'国'}]},
  {hanja:'出國',hangul:'출국',roman:'chulguk',mean:'出境',tags:['旅行'],chars:[{h:'出',k:'출',m:'出'},{h:'國',k:'국',m:'国'}]},
  {hanja:'案內',hangul:'안내',roman:'annae',mean:'引导/咨询',tags:['旅行'],chars:[{h:'案',k:'안',m:'案'},{h:'內',k:'내',m:'内'}]},
  {hanja:'地下鐵',hangul:'지하철',roman:'jihacheol',mean:'地铁',tags:['旅行'],chars:[{h:'地',k:'지',m:'地'},{h:'下',k:'하',m:'下'},{h:'鐵',k:'철',m:'铁'}]},
  {hanja:'換錢',hangul:'환전',roman:'hwanjeon',mean:'换钱',tags:['旅行'],chars:[{h:'換',k:'환',m:'换'},{h:'錢',k:'전',m:'钱'}]},
  {hanja:'藥局',hangul:'약국',roman:'yakguk',mean:'药店',tags:['旅行'],chars:[{h:'藥',k:'약',m:'药'},{h:'局',k:'국',m:'局'}]},
  {hanja:'計算',hangul:'계산',roman:'gyesan',mean:'结账/计算',tags:['旅行'],chars:[{h:'計',k:'계',m:'计'},{h:'算',k:'산',m:'算'}]},
  {hanja:'注文',hangul:'주문',roman:'jumun',mean:'点餐/下单',tags:['旅行'],chars:[{h:'注',k:'주',m:'注'},{h:'文',k:'문',m:'文'}]},
  {hanja:'領收證',hangul:'영수증',roman:'yeongsujeung',mean:'收据',tags:['旅行'],chars:[{h:'領',k:'영',m:'领'},{h:'收',k:'수',m:'收'},{h:'證',k:'증',m:'证'}]},
  {hanja:'化粧室',hangul:'화장실',roman:'hwajangsil',mean:'洗手间',tags:['旅行'],chars:[{h:'化',k:'화',m:'化'},{h:'粧',k:'장',m:'妆'},{h:'室',k:'실',m:'室'}]},

  // —— 场所 (场所) ——
  {hanja:'圖書館',hangul:'도서관',roman:'doseogwan',mean:'图书馆',tags:['场所'],chars:[{h:'圖',k:'도',m:'图'},{h:'書',k:'서',m:'书'},{h:'館',k:'관',m:'馆'}]},
  {hanja:'學校',hangul:'학교',roman:'hakgyo',mean:'学校',tags:['场所'],chars:[{h:'學',k:'학',m:'学'},{h:'校',k:'교',m:'校'}]},
  {hanja:'敎室',hangul:'교실',roman:'gyosil',mean:'教室',tags:['场所'],chars:[{h:'敎',k:'교',m:'教'},{h:'室',k:'실',m:'室'}]},
  {hanja:'病院',hangul:'병원',roman:'byeongwon',mean:'医院',tags:['场所'],chars:[{h:'病',k:'병',m:'病'},{h:'院',k:'원',m:'院'}]},
  {hanja:'銀行',hangul:'은행',roman:'eunhaeng',mean:'银行',tags:['场所'],chars:[{h:'銀',k:'은',m:'银'},{h:'行',k:'행',m:'行'}]},
  {hanja:'食堂',hangul:'식당',roman:'sikdang',mean:'食堂/餐厅',tags:['场所'],chars:[{h:'食',k:'식',m:'食'},{h:'堂',k:'당',m:'堂'}]},
  {hanja:'市場',hangul:'시장',roman:'sijang',mean:'市场',tags:['场所'],chars:[{h:'市',k:'시',m:'市'},{h:'場',k:'장',m:'场'}]},
  {hanja:'會社',hangul:'회사',roman:'hoesa',mean:'公司',tags:['场所'],chars:[{h:'會',k:'회',m:'会'},{h:'社',k:'사',m:'社'}]},
  {hanja:'工場',hangul:'공장',roman:'gongjang',mean:'工厂',tags:['场所'],chars:[{h:'工',k:'공',m:'工'},{h:'場',k:'장',m:'场'}]},
  {hanja:'大學',hangul:'대학',roman:'daehak',mean:'大学',tags:['场所'],chars:[{h:'大',k:'대',m:'大'},{h:'學',k:'학',m:'学'}]},

  // —— 日常/生活 (日常) ——
  {hanja:'時間',hangul:'시간',roman:'sigan',mean:'时间',tags:['日常'],chars:[{h:'時',k:'시',m:'时'},{h:'間',k:'간',m:'间'}]},
  {hanja:'電話',hangul:'전화',roman:'jeonhwa',mean:'电话',tags:['日常'],chars:[{h:'電',k:'전',m:'电'},{h:'話',k:'화',m:'话'}]},
  {hanja:'自動車',hangul:'자동차',roman:'jadongcha',mean:'汽车',tags:['日常'],chars:[{h:'自',k:'자',m:'自'},{h:'動',k:'동',m:'动'},{h:'車',k:'차',m:'车'}]},
  {hanja:'新聞',hangul:'신문',roman:'sinmun',mean:'报纸',tags:['日常'],chars:[{h:'新',k:'신',m:'新'},{h:'聞',k:'문',m:'闻'}]},
  {hanja:'映畵',hangul:'영화',roman:'yeonghwa',mean:'电影',tags:['日常'],chars:[{h:'映',k:'영',m:'映'},{h:'畵',k:'화',m:'画'}]},
  {hanja:'音樂',hangul:'음악',roman:'eumak',mean:'音乐',tags:['日常'],chars:[{h:'音',k:'음',m:'音'},{h:'樂',k:'악',m:'乐'}]},
  {hanja:'寫眞',hangul:'사진',roman:'sajin',mean:'照片',tags:['日常'],chars:[{h:'寫',k:'사',m:'写'},{h:'眞',k:'진',m:'真'}]},
  {hanja:'食事',hangul:'식사',roman:'siksa',mean:'用餐/吃饭',tags:['日常'],chars:[{h:'食',k:'식',m:'食'},{h:'事',k:'사',m:'事'}]},
  {hanja:'運動',hangul:'운동',roman:'undong',mean:'运动',tags:['日常'],chars:[{h:'運',k:'운',m:'运'},{h:'動',k:'동',m:'动'}]},
  {hanja:'旅行',hangul:'여행',roman:'yeohaeng',mean:'旅行',tags:['日常'],chars:[{h:'旅',k:'여',m:'旅'},{h:'行',k:'행',m:'行'}]},
  {hanja:'約束',hangul:'약속',roman:'yaksok',mean:'约定',tags:['日常'],chars:[{h:'約',k:'약',m:'约'},{h:'束',k:'속',m:'束'}]},
  {hanja:'準備',hangul:'준비',roman:'junbi',mean:'准备',tags:['日常'],chars:[{h:'準',k:'준',m:'准'},{h:'備',k:'비',m:'备'}]},

  // —— 抽象/常用 (抽象) ——
  {hanja:'人間',hangul:'인간',roman:'ingan',mean:'人/人类',tags:['抽象'],chars:[{h:'人',k:'인',m:'人'},{h:'間',k:'간',m:'间'}]},
  {hanja:'世界',hangul:'세계',roman:'segye',mean:'世界',tags:['抽象'],chars:[{h:'世',k:'세',m:'世'},{h:'界',k:'계',m:'界'}]},
  {hanja:'經濟',hangul:'경제',roman:'gyeongje',mean:'经济',tags:['抽象'],chars:[{h:'經',k:'경',m:'经'},{h:'濟',k:'제',m:'济'}]},
  {hanja:'政治',hangul:'정치',roman:'jeongchi',mean:'政治',tags:['抽象'],chars:[{h:'政',k:'정',m:'政'},{h:'治',k:'치',m:'治'}]},
  {hanja:'歷史',hangul:'역사',roman:'yeoksa',mean:'历史',tags:['抽象'],chars:[{h:'歷',k:'역',m:'历'},{h:'史',k:'사',m:'史'}]},
  {hanja:'文化',hangul:'문화',roman:'munhwa',mean:'文化',tags:['抽象'],chars:[{h:'文',k:'문',m:'文'},{h:'化',k:'화',m:'化'}]},
  {hanja:'質問',hangul:'질문',roman:'jilmun',mean:'提问',tags:['抽象'],chars:[{h:'質',k:'질',m:'质'},{h:'問',k:'문',m:'问'}]},
  {hanja:'練習',hangul:'연습',roman:'yeonseup',mean:'练习',tags:['抽象'],chars:[{h:'練',k:'연',m:'练'},{h:'習',k:'습',m:'习'}]},
  {hanja:'必要',hangul:'필요',roman:'piryo',mean:'必要',tags:['抽象'],chars:[{h:'必',k:'필',m:'必'},{h:'要',k:'요',m:'要'}]},
  {hanja:'重要',hangul:'중요',roman:'jungyo',mean:'重要',tags:['抽象'],chars:[{h:'重',k:'중',m:'重'},{h:'要',k:'요',m:'要'}]},
  {hanja:'注意',hangul:'주의',roman:'juui',mean:'注意',tags:['抽象'],chars:[{h:'注',k:'주',m:'注'},{h:'意',k:'의',m:'意'}]},
  {hanja:'安全',hangul:'안전',roman:'anjeon',mean:'安全',tags:['抽象'],chars:[{h:'安',k:'안',m:'安'},{h:'全',k:'전',m:'全'}]},
  {hanja:'可能',hangul:'가능',roman:'ganeung',mean:'可能',tags:['抽象'],chars:[{h:'可',k:'가',m:'可'},{h:'能',k:'능',m:'能'}]},
  {hanja:'部分',hangul:'부분',roman:'bubun',mean:'部分',tags:['抽象'],chars:[{h:'部',k:'부',m:'部'},{h:'分',k:'분',m:'分'}]},
  {hanja:'計劃',hangul:'계획',roman:'gyehoek',mean:'计划',tags:['抽象'],chars:[{h:'計',k:'계',m:'计'},{h:'劃',k:'획',m:'划'}]},
  {hanja:'問題',hangul:'문제',roman:'munje',mean:'问题',tags:['抽象'],chars:[{h:'問',k:'문',m:'问'},{h:'題',k:'제',m:'题'}]},
  {hanja:'方法',hangul:'방법',roman:'bangbeop',mean:'方法',tags:['抽象'],chars:[{h:'方',k:'방',m:'方'},{h:'法',k:'법',m:'法'}]},
  {hanja:'生活',hangul:'생활',roman:'saenghwal',mean:'生活',tags:['抽象'],chars:[{h:'生',k:'생',m:'生'},{h:'活',k:'활',m:'活'}]},
  {hanja:'國家',hangul:'국가',roman:'gukga',mean:'国家',tags:['抽象'],chars:[{h:'國',k:'국',m:'国'},{h:'家',k:'가',m:'家'}]},
  {hanja:'家族',hangul:'가족',roman:'gajok',mean:'家族/家人',tags:['抽象'],chars:[{h:'家',k:'가',m:'家'},{h:'族',k:'족',m:'族'}]},
  {hanja:'學生',hangul:'학생',roman:'haksaeng',mean:'学生',tags:['抽象'],chars:[{h:'學',k:'학',m:'学'},{h:'生',k:'생',m:'生'}]},
  {hanja:'先生',hangul:'선생',roman:'seonsaeng',mean:'老师/先生',tags:['抽象'],chars:[{h:'先',k:'선',m:'先'},{h:'生',k:'생',m:'生'}]},
  {hanja:'韓國',hangul:'한국',roman:'hanguk',mean:'韩国',tags:['抽象'],chars:[{h:'韓',k:'한',m:'韩'},{h:'國',k:'국',m:'国'}]},
  {hanja:'中國',hangul:'중국',roman:'jungguk',mean:'中国',tags:['抽象'],chars:[{h:'中',k:'중',m:'中'},{h:'國',k:'국',m:'国'}]},
  {hanja:'外國',hangul:'외국',roman:'oeguk',mean:'外国',tags:['抽象'],chars:[{h:'外',k:'외',m:'外'},{h:'國',k:'국',m:'国'}]},
];
