#!/usr/bin/env node

// [14.2]
const program = require('commander');

// [14.2 : 04] (template.js의 코드를 다수 가져옴) START === 
const fs = require('fs');
const path = require('path');

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta chart='utf-8' />
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>`;

const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (errer) {
        console.error(error);
        next(error);
    }
}); 
module.exports =router;`;

// 2: exist와 mkdirp. 편의를 위해 만든 함수
// exist: fs.accessSync 메서드를 통해 파일이나 폴더가 존재하는지 검사.
const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (error) {
        return false;
    }
};

// mkdir(mkdir -p): 현재 경로와 입력한 경로의 상대적인 위치 파악 후 순차적으로 상위 폴더부터 만들어나감.
const mkdirp = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = (type, name, directory) => {   // [14.2 : 04] 매개변수 추가
    //directory = String(directory);
    
    mkdirp(directory);

    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);

        if (exist(pathToFile)) {
            console.error('이미 해당 파일이 존재합니다.');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);

        if (exist(pathToFile)) {
            console.error('이미 해당 파일이 존재합니다.');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else {
        console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};
// [14.2 : 04]  (template.js의 코드를 다수 가져옴)  END ===


program
    // version: 프로그램의 버전을 설정. 첫 번째 인자로 버전을 넣어줌, 두 번째 인자로 버전을 보여줄 옵션을 넣어줌
    .version('0.0.1', '-v, --version')
    // usage: 명령어의 사용법 설정. [options]라고 되어있는데, [] 필수가 아닌 선택이라는 뜻. (옵션을 넣어도되고 안넣어도 됨)
    .usage('[options]');

program
    // command: 명령어를 설정하는 메서드
    .command('template <type>')
    .usage('--name<name> --path[path]')
    // description: 명령어에 대한 설명을 설정하는 메서드
    .description('템플릿을 생성합니다.')
    // alias: 명령어의 별칭을 설정
    .alias('tmpl')
    // option: 명령어에 대한 부가적인 옵션을 설정
    .option('-n, --name <name>', '파일명을 입력하세요.', 'index')
    .option('-d, --directory[path]', '생성 경로를 입력하세요', '.')
    // action: 명령어에 대한 실제 동작을 정의하는 메서드
    .action((type, options) => {
        //console.log(type, options.name, options.directory);
        makeTemplate(type, options.name, options.directory);    // [14.2 : 04] 
    });

program
    .command('*', {noHelp: true})
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
    });

program
    // parse: program 객체의 마지막에 붙이는 메서드
    .parse(process.argv);
