// [13.2]
const express = require('express');
const util = require('util');
const googleMaps = require('@google/maps'); 

const History = require('../schemas/history');

const router = express.Router();

// (1) @google/maps 패키지로부터 구글 지도 클라이언트를 만드는 방법
const googleMapsClient = googleMaps.createClient({
    key: process.env.PLACES_API_KEY,
    /*
        위 API키로 생성된 클라이언트에는 
        places, placesQueryAutoComplete, placeNearBy 등 메서드가 들어있음
    */
});

router.get('/', (req, res) => {   
    res.render('index') ;
});

// (2) 구글 지도 클라이언트의 placesQueryAutoComplete API(검색어 자동완성)을 사용한 라우터
/* 
    - '강'을 입력하면 강남, 강북, 강북 등을 추천해줌 (예상 검색어는 최대 5개까지 반환)
    -  라우터로부터 전달된 쿼리를 input으로 넣어주고
        language를 'ko'로 설정해야 한국어 결과값을 받을 수 있음
    - 콜백방식으로 동작하며, 결과는 response.json.predictions에 들어있음
*/
router.get('/autocomplete/:query', (req, res, next) => {
    googleMapsClient.placesQueryAutoComplete({
        input: req.params.query,
        language: 'ko',
    }, (err, response) => {
        if (err) {
            return next(err);
        }
        return res.json(response.json.predictions);
    });
});

// (3) 실제 장소 검색 시 결과값을 반환하는 라우터
router.get('/search/:query', async(req, res, next) => {
    /* 
        - 구글 지도 클라이언트 (변수 googleMapsClient)는 콜백 방식으로 동작.
            하지만 여기선 몽구스 프로미스와 같이 사용하기 위해 
            util.promisify 사용하여 프로미스 패턴으로 바꿈.

            바꿀 수 있는 콜백은 프로미스로 바꿔서 async/await 문법 사용하는 것이 깔끔
    */
    const googlePlaces = util.promisify(googleMapsClient.places); // 구글 지도 클라이언트의 places 메서드: 장소 검색
    
    try {
        const history = new History({
            query: req.params.query,
        });
        await history.save();
        // ▲ 결괏값 반환 전, 검색 내역을 구현하기 위해 데이터베이스에 검색어 저장

        const response = await googlePlaces({
            query: req.params.query,    // 검색어
            language: 'ko',             // 한국어로 설정
        });

        res.render('result', {
            title: `${req.params.query} 검색 결과`,
            results: response.json.results, // 결괏값 들어 있음.
            query: req.params.query,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;