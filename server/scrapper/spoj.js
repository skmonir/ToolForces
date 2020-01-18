const request = require('request');
const cheerio = require('cheerio');

let response = {
  'status': 200,
  'data': [],
  'message': null
};

function spoj(user) {
  request('https://toph.co/u/' + user, (error, resp, html) => {
    if (!error && resp.statusCode == 200) {
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
          //console.log(prob + ' -> ' + t + ' -> ' + plink);
          response.data.push({
            'problem': prob,
            'link': plink,
            'time': t
          });
        }
      });
      console.log(JSON.stringify(response));
      return JSON.stringify(response);
    }
  });
}

module.exports = spoj;
