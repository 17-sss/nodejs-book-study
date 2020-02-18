// [3.5.2] path
// 폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈

const path = require('path');

const strFileName = __filename;

console.log('path.sep: ', path.sep);                // 파일 경로 구분자
console.log('path.delimiter: ', path.delimiter);    // 환경 변수의 구분자
console.log('------------------------------');

// path.dirname(): 파일이 위치한 폴더 경로
console.log('path.dirname(): ', path.dirname(strFileName));     

// path.extname(): 파일의 확장자를 보여줌
console.log('path.extname(): ', path.extname(strFileName));     

// path.basename(): 파일의 이름(확장자 포함)을 보여줌
console.log('path.basename(): ', path.basename(strFileName));   

// path.basename(2param): 파일의 이름만 표시하고 싶다면 basename의 두 번째 인자로 파일의 확장자를 넣어주면 됨.
console.log('path.basename(2param(ext Cut)): ', path.basename(strFileName, path.extname(strFileName)));
console.log('------------------------------');

// path.parse(): 파일 경로를 root, dir, base, ext, name으로 분리
console.log('path.parse(): ', path.parse(strFileName)); 

// path.format(): path.parse()한 객체를 파일 경로로 합칩
console.log('path.format(): ', path.format({    
    dir: 'C:\\Users\\Administrator\\Desktop\\Develop\\Develop_File\\Node_Study'
        + '\\Study\\Book\\02_NodeJS\\03\\3.5-노드_내장_모듈_사용하기',
    name: '3.5.2_path1_없는파일_path.format용',
    ext: '.js'
}));

// path.normalize(): /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환해줌
console.log('path.normalize(): ', path.normalize(
    'C:\\Users\\Administrator\\Desktop\\Develop\\Develop_File\\\Node_Study'
    + '\\Study\\Book\\02_NodeJS\\03\\3.5-노드_내장_모듈_사용하기\\\\3.5.2_path.js'
));
console.log('------------------------------');
// path.isAbsolute(): 파일의 경로가 절대경로인지 상대경로인지 true나 false로 알려줌
console.log('path.isAbsolute(): ', path.isAbsolute('C:\\'));
console.log('path.isAbsolute(): ', path.isAbsolute('./home'));
console.log('------------------------------');

// path.relative(): 경로를 두 개 넣으면 첫 번째 경로에서 두 번째 경로로 가는 방법을 알려줌.
console.log('path.relative(): ', path.relative('C:\\Users\\Administrator\\Desktop\\Develop', 'C:\\')) ;

// path.join(): 여러 인자를 넣으면 하나의 인자로 합쳐줌. 상대경로인 ..(부모 디렉토리)와 .(현위치)도 알아서 처리해줌.
console.log('path.join(): ', path.join(__dirname,'..','..','/users','.','/zerocho')) ;

// path.resolve(): path.join과 비슷하지만, path.resolve는 /를 만나면 절대경로로 인식해서 앞의 경로를 무시하고, path.join은 상대경로로 처리.
console.log('path.resolve(): ', path.resolve(__dirname,'..','..','/users','.','/zerocho')) ;

