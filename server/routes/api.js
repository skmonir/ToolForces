const axios = require('axios');
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
// let response = {
//   status: 200,
//   result: [],
//   message: null
// };

router.get('/spojstat/:user', (req, res) => {
  let user = req.params.user;
  request('https://toph.co/u/' + user, (error, resp, html) => {
    if (!error && resp.statusCode == 200) {
      let response = {
        status: 200,
        result: [],
        message: null
      };
      const $ = cheerio.load(html);
      const listHeading = $('.feeds');
      // console.log(listHeading.html());
      listHeading.children().each((index, elem) => {
        // grabing problem name
        let prob = $(elem).find('.desc').text();
        if (prob.includes(user + ' solved')) {
          prob = prob.slice(user.length + 7);

          // grabing problem link
          let plink = $(elem).find('a').attr('href');
          if (plink === undefined) {
            plink = '';
          } else {
            plink = 'https://toph.co' + plink;
          }

          // grabing problem submission date
          let epoch = $(elem).find('span').attr('data-time');
          let d = new Date(0);
          d.setUTCSeconds(epoch);
          let t = "" + d;
          t = t.substring(0, 31);
          t = t.substring(0, 3) + ',' + t.substring(3);
          t = t.substring(0, 8) + '-' + t.substring(9);
          t = t.substring(0, 11) + '-' + t.substring(12);
          t = t.substring(0, 16) + ',' + t.substring(16);
          t = t.substring(5, 23);
          //   console.log(prob + ' -> ' + t + ' -> ' + plink);
          response.result.push({
            'problem': prob,
            'link': plink,
            'time': t
          });
        }
      });
      res.json(response);
    }
  });
});

router.get('/toph.contests', (req, res) => {
  request('https://toph.co/contests', (error, resp, html) => {
    const $ = cheerio.load(html);
    const listHeading = $('.portlet-fit');
    //console.log(listHeading.children().html());
    let contestName = listHeading.find('h2').text();
    let contestUrl = listHeading.find('h2').parent().attr('href');
    console.log(contestName + ' ' + contestUrl);
    console.log(listHeading.find('.timestamp').attr('data-time'));
  });
});

router.get('/codechef.user.rating/:user', (req, res) => {
  let user = req.params.user;
  let url = 'https://www.codechef.com/users/' + user;

  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let rating = $('.rating-number').text();
      console.log(rating);
    })
    .catch(console.error);
});

router.get('/hackerrank.user.rating/:user', (req, res) => {
  let user = req.params.user;
  let url = 'https://www.hackerrank.com/' + user;
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let rating = $('#hacker-contest-score').parent().html();
      console.log(rating);
    })
    .catch(console.error);
});

router.get('/toph.user.rating/:user', (req, res) => {
  let user = req.params.user;
  let url = 'https://toph.co/u/' + user;
  request(url, (error, resp, html) => {
    if (!error && resp.statusCode == 200) {
      let response = {
        status: 200,
        result: 0,
        message: null
      };
      const $ = cheerio.load(html);
      let rating = $('.details').find('.number').text();
      response.result = rating;
      res.json(response);
    }
  });
});

router.get('/toph.user.id/:user', (req, res) => {
  let user = req.params.user;
  let url = 'https://toph.co/u/' + user;
  request(url, (error, resp, html) => {
    if (!error && resp.statusCode == 200) {
      let response = {
        status: 200,
        result: '',
        message: null
      };
      const $ = cheerio.load(html);
      let submission_link = $('.numbers').find('a').attr('href');
      // console.log($('.numbers').html());
      let userId = submission_link.substring(27);
      response.result = userId;
      res.json(response);
    } else {
      res.json({
        status: 404,
        message: 'resource not found!'
      });
    }
  });
});

router.get('/toph.user.submissions/:userId/:start', (req, res) => {
  let userId = req.params.userId;
  let start = req.params.start;
  let url = `https://toph.co/submissions/filter?author=${userId}&start=${start}`;
  let response = {
    status: 0,
    subs: [],
    message: null
  };
  request(url, (error, resp, html) => {
    if (!error && resp.statusCode == 200) {
      const $ = cheerio.load(html);
      let rows = $('tbody').find('tr');
      for (let i = start == 0 ? 1 : 0; i < rows.length; ++i) {
        let current = rows[i];
        let problem = $(current).children("td:nth-child(3)").text();
        let url = $(current).children("td:nth-child(3)").find('a').attr('href');
        let when = $(current).children("td:nth-child(4)").find('span').attr('data-time');
        let lang = $(current).children("td:nth-child(5)").text();
        let time = $(current).children("td:nth-child(6)").text();
        let memory = $(current).children("td:nth-child(7)").text();
        let verdict = $(current).children("td:nth-child(8)").find('span').text();
        // console.log(problem, when, lang, time, memory, verdict);
        // console.log('******************************************');
        response.subs.push({
          problem: problem,
          url: url == undefined ? '#' : url,
          when: when,
          lang: lang,
          time: time,
          memory: memory,
          verdict: verdict
        });
      }
      res.json(response);
    }
  });
});

router.get('/spoj.user.check/:user', (req, res) => {
  let user = req.params.user;
  let url = `https://www.spoj.com/status/${user}/all/start=0`;
  let resp = {
    status: 200,
    pages: 0,
    message: null
  };
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let columns = $('thead').find('th');
      if (columns.length == 7) {
        resp.pages = 1;
        let pages = $('.pagination').find('li');
        for (let i = 0; i < pages.length; ++i) {
          let page = $(pages[i]).text();
          if (isNumeric(page)) {
            resp.pages = page;
          }
        }
        res.json(resp);
      } else {
        res.json(resp);
      }
    })
    .catch(console.error);
});

router.get('/spoj.user.submissions/:user/:start', (req, res) => {
  let user = req.params.user;
  let start = req.params.start;
  let url = `https://www.spoj.com/status/${user}/all/start=${start}`;
  let resp = {
    status: 200,
    subs: [],
    message: null
  };
  axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let rows = $('tbody').find('tr');
      for (let i = 0; i < rows.length; ++i) {
        let current = rows[i];
        let problem = $(current).children("td:nth-child(3)").find('a').text().trim();
        let url = $(current).children("td:nth-child(3)").find('a').attr('href').trim();
        let when = Math.floor(new Date($(current).children("td:nth-child(2)").text().trim()).getTime() / 1000 | 0) - 7200;
        let lang = $(current).children("td:nth-child(7)").text().trim();
        let time = $(current).children("td:nth-child(5)").text().trim();
        let memory = $(current).children("td:nth-child(6)").text().trim();
        let verdict = $(current).children("td:nth-child(4)").find('strong').text().trim();
        if (verdict == undefined || verdict == '') {
          verdict = $(current).children("td:nth-child(4)").text().trim();
        }
        // console.log(problem);
        // console.log(problem, url, Math.floor(new Date(when).getTime() / 1000 | 0), lang, time, memory, verdict);
        // console.log('******************************************');
        resp.subs.push({
          problem: problem,
          url: url == undefined ? '#' : url,
          when: when,
          lang: lang,
          time: time,
          memory: memory,
          verdict: verdict
        });
      }
      res.json(resp);
    })
    .catch(console.error);
});

router.get('/get.all.contests', (req, res) => {
  let url = 'http://api.codercalendar.io/';
  let resp = {
    status: 200,
    results: null,
    message: null
  };
  axios(url)
    .then(response => {
      let foo = JSON.parse(JSON.stringify(response.data));
      resp.results = foo['results'];
      res.json(resp);
    })
    .catch(console.error);
});

module.exports = router;
