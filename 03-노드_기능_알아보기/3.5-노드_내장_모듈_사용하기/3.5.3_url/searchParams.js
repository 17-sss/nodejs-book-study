// [3.5.3] url : searchParams.js
const { URL } = require('url');

const myURL = new URL('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
console.log('searchParams: ', myURL.searchParams);
console.log('searchParams.getAll(\'category\'): ', myURL.searchParams.getAll('category'));
console.log('searchParams.get(\'limit\'): ', myURL.searchParams.get('limit'));
console.log('searchParams.has(\'page\'): ', myURL.searchParams.has('page'));

console.log('searchParams.keys(): ', myURL.searchParams.keys());
console.log('searchParams.values(): ', myURL.searchParams.values());

myURL.searchParams.append('filter', 'es3');
myURL.searchParams.append('filter', 'es5');
console.log('[append] myURL.searchParams.getAll(\'filter\'): ', myURL.searchParams.getAll('filter'));

myURL.searchParams.set('filter', 'es6');
console.log('[set] myURL.searchParams.getAll(\'filter\'): ', myURL.searchParams.getAll('filter'));

myURL.searchParams.delete('filter');
console.log('[delete] myURL.searchParams.getAll(\'filter\'): ', myURL.searchParams.getAll('filter'));

console.log('searchParams.toString(): ', myURL.searchParams.toString());
myURL.search = myURL.searchParams.toString();
