#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// [14.1 [2]: 05] START
const readline = require('readline'); 

let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] ||'.';
 // [14.1 [2]: 05] END

// [14.1 [2]] BAK
/*
const type = process.argv[2];
const name = process.argv[3];
const directory = process.argv[4] ||'.';
*/


// 1: 생성할 html 코드와 js 코드
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

// 3: makeTemplate: 실질적인 프로그램 로직을 담고있음.
const makeTemplate = () => {
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


// [14.1 [2]: 05] START
// dirAnswer: 디렉토리에 대해 사용자 입력을 받는 함수
const dirAnswer = (answer) => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate();
};

// nameAnswer: 파일명에 대해 사용자 입력을 받는 함수
const nameAnswer = (answer) => {
    if (!answer || !answer.trim()) {
        console.clear();
        console.log('name은 반드시 입력해야합니다.');
        return rl.question('파일명을 설정하세요', nameAnswer);      
    }
    name = answer;
    return rl.question('저장할 경로를 설정하세요. (설정하지 않으면 현재경로)', dirAnswer);
};

// typeAnswer: 템플릿에 대해 사용자 입력을 받는 함수
const typeAnswer = (answer) => {
    if (answer !== 'html' && answer !== 'express-router') {
        console.clear();
        console.log('html 또는 express-router만 지원합니다.');
        return rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
    }

    type = answer;
    return rl.question('파일명을 설정하세요.', nameAnswer);
}
// [14.1 [2]: 05] END



// 4: 명령어 호출 시 program 함수가 호출되어 내부 로직이 돌아가게 됨.
const program = () => {
    if (!type || !name) {
        // [14.1 [2]: 05] START
        // 명령어에서 템플릿 종류나 파일명을 입력하지 않았을 때 상호작용할 수 있는 입력창을 띄우는 부분
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.clear();
        
        rl.question('어떤 템플릿이 필요하십니까?', typeAnswer);
        // [14.1 [2]: 05] END

        // console.error('사용방법: cli html|express-router 파일명[생성 경로]');    // [14.1 [2]] BAK
    } else {
        makeTemplate();
    }
};

program();