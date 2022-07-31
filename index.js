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
    "question": "〈廉恥〉「《五代史‧馮道傳》論曰」句中「傳」的讀音，與下列何者 相同？",
    "answers": {
      1: "「傳」奇",
      2: "言歸正「傳」",
      3: "「傳」家寶",
      4: "名不虛「傳」"
    },
    "right_answer": 2
  },
  {
    "id": 2,
    "question": "下列各組「 」內的注音，何者字形兩兩相同？",
    "answers": {
      1: "「ㄊㄧㄢˊ」不 知恥／香「ㄊㄧㄢˊ」 可口",
      2: "不「ㄔˇ」下問／令人不「ㄔˇ」",
      3: "「ㄧㄡ」關天下／「ㄧㄡ」然神往",
      4: "並行 不「ㄅㄟˋ」／「ㄅㄟˋ」 禮犯義"
    },  "right_answer": 4
  },
  {
    "id": 3,
    "question": "〈廉恥〉一文中的「恥」字，何者的意義與其他三者不同？",
    "answers": {
      1: "行己有「恥」",
      2: "無恥之 「恥」，無恥矣",
      3: "人不可以無「恥」",
      4: "「恥」之於人大矣"
    },  "right_answer": 2
  },
  {
    "id": 4,
    "question": "「天下其有不亂，國家其有不亡」一句中「其」字的用法，與下列何者相同？",
    "answers": {
      1: "「其」受 之人也，賢於材人遠矣",
      2: "而予亦悔「其」隨之而不得極夫遊之樂也",
      3: "不可為常者「其」聖人之法乎",
      4: "既「其」出，則或咎其欲出者"
    },  "right_answer": 3
  },
  {
    "id": 5,
    "question": "下列選項中的「而」字用法，何者與「人而如此，則禍敗亂亡，亦無 所不至」中的「而」 相同？",
    "answers": {
      1: "況為大臣「而」無所不取",
      2: "人「而」 不仁，如禮何",
      3: "人之不廉「而」至於悖 禮犯義",
      4: "人非生「而」知之者，孰能無惑"
    },  "right_answer": 2
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
