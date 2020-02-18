// [3.5.3] url :: url.js
const url = require('url');

const URL = url.URL;
// new URL(): WHATWG 방식
const myURL = new URL('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('new URL(): ', myURL);
console.log('url.format(): ', url.format(myURL));
console.log('--------------------------');

// url.parse(): node의 url방식
const parsedUrl = url.parse('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('url.parse(): ', parsedUrl);
console.log('url.format(): ', url.format(parsedUrl));