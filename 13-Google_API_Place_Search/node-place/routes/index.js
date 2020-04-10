// [13.2]
const express = require('express');
const util = require('util');
const googleMaps = require('@google/maps'); 

const History = require('../schemas/history');
const Favorite = require('../schemas/favorite');

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

    // [13.4 : 02.] START ---
    const googlePlacesNearby = util.promisify(googleMapsClient.placesNearby);
    const { lat, lng, type } = req.query;

    try {
        const history = new History({
            query: req.params.query,
        });
        await history.save();
        // ▲ 결괏값 반환 전, 검색 내역을 구현하기 위해 데이터베이스에 검색어 저장

        let response;

        if (lat && lng) {            
            // 만약 쿼리스트링으로 lat과 lng가 제공되면 places API 대신 placesNearby API 사용            
            response = await googlePlacesNearby({
                keyword: req.params.query,  // 찾을 검색어
                location: `${lat}, ${lng}`, // 위도와 경도
                rankby: 'distance',         // 정렬 순서 (가까운 거리순 정렬)
                // radius: 5000,   // 인기순으로 정렬 (검색반경 5000) | rankby와 radius 중 둘중하나만 써야하는 듯.
                language: 'ko',             // 검색 언어
                type,
            });
        } else {
            response = await googlePlaces({
                query: req.params.query,    // 검색어
                language: 'ko',             // 한국어로 설정
                type,
            });
        }        
        // [13.4 : 02.]  END ---

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

// [13.4 : 06.] START
router.post('/location/:id/favorite', async (req, res, next) => {
    try {
        const favorite = await Favorite.create({
            placeId: req.params.id,
            name: req.body.name,

            // 주의! 
                // 보통은 Google Maps API 사용시엔 위도(lat) 경도(lng)순이지만
                // 여기선 (Favorite 스키마_몽구스) 역순으로 넣어야함. 경도, 위도 순으로
            location: [req.body.lng, req.body.lat],
        });

        res.send(favorite);
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// [13.4 : 06.] END

// [13.5 : 02.] START
router.get('/', async(req, res, next) => {
    try {
        const favorites = await Favorite.find({});
        res.render('index', {results: favorites });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// [13.5 : 02.] END


module.exports = router;