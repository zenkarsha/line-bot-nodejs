'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const config = {
  channelAccessToken: '',
  channelSecret: '',
};

const client = new line.Client(config);
const app = express();
const questions = require('./question-sample.json');
let echo = { type: 'text', text: '請從選單選擇指令' };

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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

function handleEvent(event) {
  if (event.type !== 'message' || event.type !== 'postback')
  {
    switch (event.type) {
      case 'message':
        handleMessageEvent(event);
        break;
      case 'postback':
        handlePostbackEvent(event);
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

function handleMessageEvent(event) {
  switch (event.message.text) {
    case '開始測驗':
      let question_json = createQuestion(questions);
      return client.replyMessage(event.replyToken, [question_json]);
      break;
    case '分數':
      return handleUserPoints(event);
      break;
    default:
      return client.replyMessage(event.replyToken, echo);
  }
}

function handlePostbackEvent(event) {
  const postback_result = handleUrlParams(event.postback.data);
  switch (postback_result.type) {
    case 'answer':
      let answer_result = handleAnswer(event.postback.data)
      if (answer_result) {
        updateUserPoints(event);
        return client.replyMessage(event.replyToken, moreQuestion(postback_result.qid));
      }
      else {
        echo = { type: "text", text: "答錯了" };
        return client.replyMessage(event.replyToken, echo);
      }
      break;
    case 'more_question':
      let json = createQuestion(questions, postback_result.qid);
      return client.replyMessage(event.replyToken, [json]);
      break;
    case 'more_test':
      let question_json = createQuestion(questions);
      return client.replyMessage(event.replyToken, [question_json]);
      break;
    default:
      return client.replyMessage(event.replyToken, echo);
  }
}

function handleUrlParams(data) {
  const params = new URLSearchParams(data);
  const qid = params.get('qid');
  const type = params.get('type');
  const content = params.get('content');
  return {'qid': qid, 'type': type, 'content': content};
}

function createQuestion(questions, current_qid = null) {
  let new_questions = questions;

  if (current_qid !== null) {
    let index = questions.findIndex(function(x){
      return x.id === parseInt(current_qid);
    })
    if (index !== -1) new_questions = removeByIndex(new_questions, index);
  }

  let q = new_questions[Math.floor(Math.random() * new_questions.length)];
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
        "data": `qid=${q.id}&type=answer&content=${key}`
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

function moreQuestion(qid) {
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
              "type": "postback",
              "label": "再來一題",
              "displayText": "再來一題",
              "data": `qid=${qid}&type=more_question&content=再來一題`
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
  return result.content == q[0].right_answer ? true : false;
}

function handleUserPoints(event) {
  let user = event.source.userId;
  let path = `./users/${user}.json`;
  let user_json = `[{"user": "${user}", "point": 0}]`;

  if (fs.existsSync(path)) {
    fs.readFile(path, function (error, data) {
      if (error) throw error;
      else {
        let current_json = JSON.parse(data)
        return client.replyMessage(event.replyToken, createPointMessage(current_json[0].point));
      }
    });
  }
  else {
    fs.writeFile(path, user_json, function (error, data) {
      if (error) {
        console.error(error);
      }
    });

    echo = { type: "text", text: "零分啦！" };
    return client.replyMessage(event.replyToken, echo);
  }
}

function createPointMessage(point, qid) {
  let gold_stars = 1;

  if (point >= 250) gold_stars = 5;
  else if (point >= 100) gold_stars = 4;
  else if (point >= 50) gold_stars = 3;
  else if (point >= 10) gold_stars = 2;
  else gold_stars = 1;

  let stars_contents = [];
  for (let i = 0; i < gold_stars; i++) {
    stars_contents.push({
      "type": "icon",
      "size": "sm",
      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
    });
  }

  for (let j = 0; stars_contents.length < 5; j++) {
    stars_contents.push({
      "type": "icon",
      "size": "sm",
      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
    });
  }

  return {
    "type": "flex",
    "altText": "你的分數",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "https://cdn2.ettoday.net/images/5588/5588832.jpg",
            "flex": 1,
            "size": "full",
            "aspectRatio": "2:1",
            "aspectMode": "cover"
          }
        ],
        "paddingAll": "0px"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": `你目前的得分為：${point}分\n\n`
          },
          {
            "type": "box",
            "layout": "baseline",
            "margin": "md",
            "contents": stars_contents
          },
          {
            "type": "button",
            "action": {
              "type": "postback",
              "label": "繼續測驗",
              "displayText": "繼續測驗",
              "data": `type=more_test&content=繼續測驗`
            },
            "style": "primary"
          }
        ]
      }
    }
  };
}

function updateUserPoints(event) {
  let user = event.source.userId;
  let path = `./users/${user}.json`;
  let user_json = '';

  if (fs.existsSync(path)) {
    fs.readFile(path, function (error, data) {
      if (error) throw error;
      else {
        let old_json = JSON.parse(data)
        let point = old_json[0].point + 1;
        user_json = `[{"user": "${user}", "point": ${point}}]`
        fs.writeFile(path, user_json, function (error, data) {
          if (error) throw error;
        });
      }
    });
  }
  else {
    user_json = `[{"user": "${user}", "point": 1}]`
    fs.writeFile(path, user_json, function (error, data) {
      if (error) throw error;
    });
  }
}

function removeByIndex(array, index) {
  return array.filter(function (el, i) {
    return index !== i;
  });
}


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
