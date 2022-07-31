'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
let echo = { type: 'text', text: '請從選單選擇指令' };

// create LINE SDK config from env variables
const config = {
  channelAccessToken: '',
  channelSecret: '',
};
const client = new line.Client(config);
const app = express();

const questions = [
  {
    "id": 1,
    "question": "下列文句中，關於「齒、恥」二字的使用，正確的選項是：",
    "answers": {
      1: "他公然說謊卻絲毫不覺愧疚，難怪會被批評為無齒",
      2: "有些人只寫過幾篇小文章就自號才子，真是讓人齒冷",
      3: "謙虛的人能不齒下問，驕傲的人總自以為是",
      4: "高舉公理正義的大旗做傷天害理的事，最令人不恥"
    },
    "right_answer": 2
  },
  {
    "id": 2,
    "question": "下列「 」內的字，讀音前後相同的是：",
    "answers": {
      1: "餔糟歠「醨」／探「驪」得珠",
      2: "撫弦登「陴」／彈箏搏「髀」",
      3: "批「郤」導窾／欲深「谿」壑",
      4: "「攘」除姦凶／追思「曩」昔"
    },
    "right_answer": 1
  },
  {
    "id": 3,
    "question": "下列「 」中的字義，何者兩兩相同？",
    "answers": {
      1: "宋人有「酤」酒者／令孺子懷錢挈壺罋而往「酤」",
      2: "足以極視聽之娛，「信」可樂也／低眉「信」手續續彈",
      3: "昔者，仲尼「與」於蜡賓／失其所「與」，不知",
      4: "「樹」靈鼉之鼓／外「樹」怨於諸侯"
    },
    "right_answer": 4
  },
  {
    "id": 4,
    "question": "下列文句畫底線處的詞語，運用恰當的選項是？",
    "answers": {
      1: "這篇文章漏洞百出，除了文詞淺白，謀篇尚缺乏構思，可見作者文不加點，只是敷衍了事",
      2: "承霖太過溺愛寵物了，家中的貓狗吃得太好，都擁有珠圓玉潤的身材",
      3: "只要議題或事件不涉及個人利益，人們往往作壁上觀，對現今社會的不公不義視而不見",
      4: "她面龐姣好、儀態高雅，遂憑藉著蒲柳之姿，順利當選本校校花"
    },
    "right_answer": 3
  },
  {
    "id": 5,
    "question": "〈明湖居聽書〉對於聲音有許多獨到的描寫，請選出正確的詮釋：",
    "answers": {
      1: "聲音入耳舒服像一絲鋼線拋入天際",
      2: "形容歌聲越唱越高，並突然轉高如花塢春曉，好鳥亂鳴",
      3: "聲音越唱越低，並迂迴曲折像熨斗燙過，無一處不伏貼，三萬六千個毛孔，像吃了人參果",
      4: "形容聲音節節高起，連接了三四層由傲來峰西面攀登泰山景象(傲來峰—扇子崖—南天門)"
    },
    "right_answer": 4
  },
  {
    "id": 6,
    "question": "下列「」內不屬於自謙詞的選項是：",
    "answers": {
      1: "「僕」自到九江，已涉三載，形骸且健，方寸甚安",
      2: "魯智深道：「洒家」趕不上宿頭，欲借貴莊投宿一宵，明早便行",
      3: "齊王封書謝孟嘗君曰：「寡人」不祥……",
      4: "凡我多士，及我友朋，惟仁惟孝，義勇奉公，以發揚種性，此則「不佞」之幟也"
    },
    "right_answer": 2
  },
  {
    "id": 7,
    "question": "古人寫作為求行文流暢，有時將數字詞拆以上下相乘表示，如「三五」之夜表示十五之夜。下列「」中使用這種方式表示的選項是：",
    "answers": {
      1: "不知不覺便「三五」成群，四五作隊的走了出來",
      2: "莫春者，春服既成；冠者五、六人，童子「六、七」人，浴乎沂，風乎舞雩，詠而歸",
      3: "隔壁家的姊姊正值「二八」年華，追求者不乏名門望族",
      4: "讀書一事，也必須有「一二」知己為伴，時常大家討論，才能進益"
    },
    "right_answer": 3
  },
  {
    "id": 8,
    "question": "荀子〈勸學〉：「螣蛇無足而飛，梧鼠五技而窮。」其中「梧鼠五技而窮」是比喻一個人：",
    "answers": {
      1: "多才多藝卻不專精",
      2: "才藝洋溢卻家境窮困",
      3: "才藝洋溢卻不知變通",
      4: "多才多藝卻窮於時機無法展現"
    },
    "right_answer": 1
  },
  {
    "id": 9,
    "question": "下列作品、作家、時代及體裁，對應完全正確的選項是：",
    "answers": {
      1: "〈鶯鶯傳〉／杜光庭／唐代傳奇小說",
      2: "《三國演義》／羅貫中／宋代話本小說",
      3: "《聊齋誌異》／蒲松齡／唐代筆記小說",
      4: "《世說新語》／劉義慶／南朝宋志人小說"
    },
    "right_answer": 4
  },
  {
    "id": 10,
    "question": "下列關於人物言語或行為的分析，錯誤的選項是：",
    "answers": {
      1: "馮諼詐稱孟嘗君之命，「以責賜諸民，因燒其券」，反映出道義重於私利的政治觀點",
      2: "諸葛亮建議後主要「開張聖聽，以光先帝遺德」，是希望後主能諮諏善道，察納雅言",
      3: "燭之武勸秦伯「焉用亡鄭以陪鄰？鄰之厚，君之薄也」，提醒他不要用自己的薄情寡義來襯托鄰國國君的仁厚寬容",
      4: "魏徵諫太宗「怨不在大，可畏惟人；載舟覆舟，所宜深慎；奔車朽索，其可忽乎」，強調民心向背對主政者的重要"
    },
    "right_answer": 3
  },
  {
    "id": 11,
    "question": "有關先秦諸子思想，配合有誤的選項是：",
    "answers": {
      1: "重仁重禮／愛無等差→墨家",
      2: "小國寡民／齊萬物，一死生→道家",
      3: "街談巷議／道聽塗說→小說家",
      4: "嚴而少恩／正君臣上下之分→法家"
    },
    "right_answer": 1
  },
  {
    "id": 12,
    "question": "所謂「移情作用」乃個體將自身的感受、情緒投注於某一特定個人、事物上的一種心理歷程。如：「夏蟲也為我沉默，沉默是今晚的康橋！」下列文學作品中，何者沒有「移情作用」：",
    "answers": {
      1: "蠟燭有心還惜別，替人垂淚到天明",
      2: "無是真正的有，失落是最崇高的獲得",
      3: "我見青山多嫵媚，料青山見我應如是",
      4: "感時花濺淚，恨別鳥驚心"
    },
    "right_answer": 2
  },
  {
    "id": 13,
    "question": "〈典論論文〉提及「夫文本同而末異，蓋奏議宜雅，書論宜理，銘誄尚實，詩賦欲麗。此四科不同，故能之者偏也；唯通才能備其體。」由曹丕的論述可知各種文類皆有其特點，請選出正確的配對︰",
    "answers": {
      1: "〈諫太宗十思疏〉、〈陳情表〉～宜雅",
      2: "〈祭妹文〉、〈祭十二郎文〉～欲麗",
      3: "〈秋聲賦〉、〈登金陵鳳凰台〉～宜理",
      4: "〈典論論文〉、〈原君〉～尚實"
    },
    "right_answer": 1
  },
  {
    "id": 14,
    "question": "下列文句，何者最能表現諸葛亮討賊興漢之志？",
    "answers": {
      1: "今當遠離，臨表涕泣，不知所云",
      2: "然侍衛之臣，不懈於內；忠志之士，忘身於外",
      3: "後值傾覆，受任於敗軍之際，奉命於危難之間",
      4: "今南方已定，兵甲已足，當獎率三軍，北定中原，庶竭駑鈍，攘除姦凶"
    },
    "right_answer": 4
  },
  {
    "id": 15,
    "question": "「黃髮垂髫，並怡然自樂」中「黃髮」借指老人，「垂髫」借指小孩。下列未使用借代修辭的選項是：",
    "answers": {
      1: "人生不相見，動如參與商",
      2: "私家收拾，半付祝融",
      3: "沙鷗翔集，錦鱗游泳",
      4: "潯陽地僻無音樂，終歲不聞絲竹聲"
    },
    "right_answer": 1
  },
  {
    "id": 16,
    "question": "下列關於「記」體的文章敘述，何者正確？",
    "answers": {
      1: "〈始得西山宴遊記〉記敘柳宗元首次至永州西山宴遊，乘興而去卻敗興而歸的心情",
      2: "〈醉翁亭記〉是歐陽脩在貶官後以順處逆的心境，並抒發與民同樂的情懷",
      3: "〈黃州快哉亭記〉為蘇軾謫居黃州時，抒發先憂後樂的情懷",
      4: "范仲淹抒發貶謫抑鬱而作〈岳陽樓記〉，慨嘆人生無法超脫自適"
    },
    "right_answer": 2
  },
  {
    "id": 17,
    "question": "《紅樓夢》角色繁多，請閱讀甲、乙兩文後，判斷文中介紹的主要人物分別是誰？ \n【甲】、學識淵博懷詠絮才的□□□，出身書香門第，自小父親便請私塾老師教她讀書，加上身體孱弱，養成她孤傲清高、我行我素的性格。母親逝世後，她寄居外祖母家，寄人籬下的生活，使她更加多愁善感，抑鬱敏感且自尊心極強。\n【乙】、□□□集美麗、聰明、能幹、潑辣、狠毒於一身，十八、九歲就成為賈府的管家，指揮若定，把偌大的賈府掌理得有模有樣。她處處討賈母、王夫人歡心，賈母衣食住行，都由她親自打理，她非常擅長掌握氣氛，插科打諢，無所不至。當她病重時，賈府陷入空前混亂，不復昔日的繁華。",
    "answers": {
      1: "史湘雲／賈探春",
      2: "李紈／賈探春",
      3: "林黛玉／王熙鳳",
      4: "林黛玉／薛寶釵"
    },
    "right_answer": 3
  },
  {
    "id": 18,
    "question": "下列關於臺灣現代作家的敘述，何者錯誤？",
    "answers": {
      1: "黃春明：擅長描寫宜蘭平原農村小人物，語言質樸親切，臺灣當代重要的鄉土文學作家，小說作品有《鑼》、《兒子的大玩偶》等",
      2: "賴和：一生漢詩創作不輟，又以白話創作小說、散文和詩歌，既是仁醫，又有「臺灣新文學之父」之譽",
      3: "紀弦：組成「現代詩社」，在新詩創作上主張「橫的移植」，強調對中國文化傳統的繼承",
      4: "洪醒夫：彰化縣二林人，出身農家，對農村生活有深入的了解與感情"
    },
    "right_answer": 3
  },
  {
    "id": 19,
    "question": "諧音雙關的修辭常被應用在招牌或廣告臺詞上，例如「找茶」飲料店、「銷肺者」戒菸廣告、「飛髮走絲」髮廊店。下列諧音雙關的詞句與行業配對，不適當的選項是：",
    "answers": {
      1: "「情有獨鐘」花店",
      2: "「涼上君子」冰店",
      3: "「汙衣巷」洗衣店",
      4: "「真峰相對」美容中心"
    },
    "right_answer": 1
  },
  {
    "id": 20,
    "question": "下列關於文學常識的敘述，不正確的選項是：",
    "answers": {
      1: "白居易大力提倡新樂府運動，其反映現實的主張，影響深遠",
      2: "先秦諸子散文各具特色，如孟子善於雄辯、氣勢壯闊，莊子善用寓言、想像豐富",
      3: "以黃庭堅為首的「江西詩派」寫詩講究詩法，喜好用典",
      4: "傳奇是小說的代稱，明、清兩代的傳奇都是傳述奇聞異事的小說"
    },
    "right_answer": 4
  },
  {
    "id": 21,
    "question": "〈桃花源記〉：「遂與外人間隔。問今是何世？乃不知有漢，無論魏、晉！」此句意同於：",
    "answers": {
      1: "浮雲遊子意，落日故人情",
      2: "挾飛仙以遨遊，抱明月而長終",
      3: "山中無曆日，寒盡不知年",
      4: "小隱隱陵藪，大隱隱朝市"
    },
    "right_answer": 3
  },
  {
    "id": 22,
    "question": "顧炎武曾言：「人之為學，不日進則日退。」可作為下列何種學習情況的註腳？",
    "answers": {
      1: "君子慎其所立",
      2: "君子生非異也，善假於物也",
      3: "君子之學也以美其身",
      4: "君子曰：「學不可以已。」"
    },
    "right_answer": 4
  },
  {
    "id": 23,
    "question": "下列有關「史書」之敘述，下列選項何者是正確的？",
    "answers": {
      1: "國別史之祖、紀傳體之祖、斷代史之祖分別為:《國語》、《史記》、《漢書》",
      2: "《韓非子》、《國語》、《戰國策》皆是戰國時代著名的歷史散文",
      3: "依四庫全書的分類法，《水經注》和《尚書》都列在「史部」",
      4: "《臺灣通史》的體例仿《資治通鑑》而略作改變，記隋朝大業年間至臺灣割讓為止"
    },
    "right_answer": 1
  },
  {
    "id": 24,
    "question": "有關韓愈與古文運動的敘述，下列說明正確的是：",
    "answers": {
      1: "「古文」指六朝華而不實的駢文",
      2: "韓愈為古文運動先驅，經友人柳宗元等人努力，古文運動在中唐已取得成功",
      3: "晚唐駢文又興起，至北宋歐陽脩等人提倡，古文始成為文章正宗",
      4: "歐陽脩曾稱譽他：「匹夫而為百世師，一言而為天下法」"
    },
    "right_answer": 3
  },
  {
    "id": 25,
    "question": "下列古人與其相關典故，配對錯誤的選項是：",
    "answers": {
      1: "項羽：破釜沉舟",
      2: "曹操：夢中殺人",
      3: "司馬相如：當壚賣酒",
      4: "劉備：金屋藏嬌"
    },
    "right_answer": 4
  },
  {
    "id": 26,
    "question": "阿傑終於有自己的書房了，以下對聯適合貼在書房的是：",
    "answers": {
      1: "願世人皆能容忍，唯此地必較短長",
      2: "胸中常貯七囊錦，手裡時藏四季花",
      3: "胸羅文史盡人見，腹有詩書曠世珍",
      4: "非以朝暮觀時刻，要識光陰等箭梭"
    },
    "right_answer": 3
  },
  {
    "id": 27,
    "question": "說話行文為引起對方注意，不作普通敘述，故意採用詢問或詰問的語氣，叫做設問。而其中以反詰方式發問，語氣較為強烈，答案在問題反面的，稱為「激問」。以下不是運用此法的選項是：",
    "answers": {
      1: "彼閹然媚於世者，能無愧哉",
      2: "座中泣下誰最多？江州司馬青衫濕",
      3: "客曰：「『月明星稀，烏鵲南飛』此非曹孟德之詩乎？」",
      4: "安能以身之察察，受物之汶汶者乎？"
    },
    "right_answer": 2
  },
  {
    "id": 28,
    "question": "下列題辭用法何者正確？",
    "answers": {
      1: "「萱萎北堂」輓女喪",
      2: "「福壽全歸」賀壽誕",
      3: "「功在杏林」贈師長",
      4: "「熊夢徵祥」賀生女"
    },
    "right_answer": 1
  },
  {
    "id": 29,
    "question": "以下各組成語的意義，何者相同？",
    "answers": {
      1: "畫虎類犬／維妙維肖",
      2: "買櫝還珠／捨本逐末",
      3: "社鼠猛狗／與虎謀皮",
      4: "抱薪救火／釜底抽薪"
    },
    "right_answer": 2
  }
];

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.on('postback', function (event) {
  console.log(event);
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.type !== 'postback')
  {
    switch (event.type) {
      case 'message':
        switch (event.message.text) {
          case '開始測驗':
          case '再來一題':
            console.log(event.message);
            let json = createQuestion(questions);
            return client.replyMessage(event.replyToken, [json]);
            break;
         default:
            return client.replyMessage(event.replyToken, echo);
        }
        break;
      case 'postback':
        const result = handleAnswer(event.postback.data);
        if (result) {
          return client.replyMessage(event.replyToken, oneMoreQuestion());
        }
        else {
          echo = { type: "text", text: "答錯了" };
          return client.replyMessage(event.replyToken, echo);
        }
        break;
      default:
        return client.replyMessage(event.replyToken, echo);
    }
  }
  else {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
}

function createQuestion(questions) {
  // let result = handleUrlParams(data);
  // let current_qid = result.qid

  // while (true) {
  //   let q = questions[Math.floor(Math.random() * questions.length)];
  //   if (q.id != current_qid) {
  //     break;
  //   }
  // }

  let q = questions[Math.floor(Math.random() * questions.length)];
  let contents = [];
  let q_text = {
    "type": "text",
    "text": `${q.question}\n`,
    "wrap": true
  };

  contents.push(q_text);

  for (const [key, value] of Object.entries(q.answers)) {
    contents.push({
      "type": "button",
      "action": {
        "type": "postback",
        "label": value,
        "displayText": value,
        "data": `qid=${q.id}&answer=${key}`
      },
      "style": "secondary",
      "adjustMode": "shrink-to-fit"
    });
  }

  return {
    "type": "flex",
    "altText": "考試開始，不要作弊！",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": contents
      }
    }
  };
}

function oneMoreQuestion() {
  return {
    "type": "flex",
    "altText": "再來一題",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": "恭喜、答對了！！！\n"
          },
          {
            "type": "button",
            "action": {
              "type": "message",
              "label": "再來一題",
              "text": "再來一題"
            },
            "style": "primary"
          }
        ]
      }
    }
  }
}

function handleAnswer(data) {
  let result = handleUrlParams(data);
  let q = questions.filter(x => x.id == result.qid);
  return result.answer == q[0].right_answer ? true : false;
}

function handleUrlParams(data) {
  const params = new URLSearchParams(data);
  const qid = params.get('qid');
  const answer = params.get('answer');
  return {'qid': qid, 'answer': answer};
}

// listen on port
const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
