// [3.6.3] 기타 fs 메서드

const fs = require('fs');

fs.access('./folder', fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
        if (err.code === 'ENOENT') {
            console.log('폴더 없음');
            fs.mkdir('./folder', (err) => {
                if (err) {
                    throw err;
                }
                console.log('폴더 만들기 성공');
                
                fs.open('./folder/file.js', 'w', (err, fd) => {
                    if (err) {
                        throw err;
                    }
                    console.log('빈 파일 만들기 성공', fd);
                    
                    fs.rename('./folder/file.js', './folder/newfile.js', (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('이름 바꾸기 성공');
                    });
                });
            });
        } else {
            throw err;
        }
    } else {
        console.log('이미 폴더 있음');
    }
});

/* 
    * fs.access(경로, 옵션, 콜백): 폴더나 파일에 접근할 수 있는지를 체크함.
        1) 두번째 인자의 상수들 (옵션) 
            - F_OK: 파일의 존재 여부
            - R_OK: 읽기 권한 여부
            - W_OK: 쓰기 권한 여부
        2) 파일/폴더나 권한이 없다면 에러 발생하는데, 
            파일/폴더가 없을 때 에러코드는 'ENOENT'

    * fs. mkdir(경로, 콜백): 폴더를 만드는 메서드
        - 이미 폴더가 있다면 에러가 발생!
            먼저 access()메서드를 호출하여 확인하는 것이 중요

    * fs.open(경로, 옵션, 콜백): 파일의 아이디(fd 변수)를 가져오는 메서드
        1) 파일이 없다면 파일을 생성한 뒤 그 아이디를 가져오고 가져온 아이디를
            사용해 fs.read()나 fs.write()로 읽거나 쓸 수 있음.
        2) 두 번째 인자로 어떤 동작을 할 것인지 설정 할 수 있음
            - w: 쓰기
            - r: 읽기
            - a: 기존 파일에 추가
    
    * fs.rename(기존 경로, 새 경로, 콜백): 파일의 이름을 바꾸는 메서드
        기존 파일 위치와 새로운 파일 위치를 적어주면 됨
        반드시 같은 폴더를 지정할 필요 없으므로 잘라내기 같은 기능을 할 수도 있음.
*/