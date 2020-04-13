#!/usr/bin/env node

// [14.2]
const program = require('commander');

// [14.2 : 05] (template.js의 코드를 다수 가져옴) START === 
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');   // [14.2 : 07]
const chalk = require('chalk');         // [14.2 : 09]


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
module.exports = router;`;

const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (error) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter(p => !!p);
    
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx +1).join(path.sep);

        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = (type, name, directory) => {
    mkdirp(directory);

    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);

        if (exist(pathToFile)) {
            // console.error('이미 해당 파일이 존재합니다.');
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));  // [14.2 : 09]
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            // console.log(pathToFile, '생성 완료');
            console.log(chalk.green(pathToFile, '생성 완료')); // [14.2 : 09]
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);

        if (exist (pathToFile)) {
            // console.error('이미 해당 파일이 존재합니다.');
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));  // [14.2 : 09]
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            // console.log(pathToFile, '생성 완료');
            console.log(chalk.green(pathToFile, '생성 완료'));
        }
    } else {
        console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.')); // [14.2 : 09]
        // console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};
// [14.2 : 05] (template.js의 코드를 다수 가져옴) END === 


let triggered = false;  // [14.2 : 07]

program
    // version: 프로그램의 버전을 설정. 첫 번째 인자로 버전을 넣어줌, 두 번째 인자로 버전을 보여줄 옵션을 넣어줌
    .version('0.0.1', '-v, --version')
    // usage: 명령어의 사용법 설정. [options]라고 되어있는데, [] 필수가 아닌 선택이라는 뜻. (옵션을 넣어도되고 안넣어도 됨)
    .usage('[options]');

program
    // command: 명령어를 설정하는 메서드
    .command('template <type>')
    .usage('--name <name> --path [path]')
    // description: 명령어에 대한 설명을 설정하는 메서드
    .description('템플릿을 생성합니다.')
    // alias: 명령어의 별칭을 설정
    .alias('tmpl')
    // option: 명령어에 대한 부가적인 옵션을 설정
    .option('-n, --name <name>', '파일명을 입력하세요.', 'index')
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    // action: 명령어에 대한 실제 동작을 정의하는 메서드
    .action((type, options) => {
        //console.log(type, options.name, options.directory);
        makeTemplate(type, options.name, options.directory);    // [14.2 : 05] 
        triggered = true;   // [14.2 : 07]
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

// [14.2 : 07] START === 
if (!triggered) {
    /* 
        inquirer.prompt의 속성
        - type: 질문의 종류. input. checkbox, list, password, confirm 등 있음
        - name: 질문의 이름
        - message: 사용자에게 표시되는 문자열
        - choices: type이 checkbox, list 등인 경우 선택지를 넣는 곳. 배열로 넣어주기
        - default: 답을 적지 않았을 경우 기본값.    
    */
    inquirer.prompt([{
        type: 'list',
        name: 'type',           // 아래에서 answers.type이 됨.
        message: '템플릿 종류를 선택하세요.',
        choices: ['html', 'express-router'],
    }, {
        type: 'input',
        name: 'name',           // 아래에서 answers.name 됨.
        message: '파일의 이름을 입력하세요.',
        default: 'index',
    }, {
        type: 'input',
        name: 'directory',      // 아래에서 answers.directory 됨.
        message: '파일이 위치할 폴더의 경로를 입력하세요.',
        default: '.',
    }, {
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?',        
    }])
        .then((answers) => {
            if (answers.confirm) {
                makeTemplate(answers.type, answers.name, answers.directory);
                console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'));  // [14.2 : 09]
            }
        });
}
// [14.2 : 07] END === 
