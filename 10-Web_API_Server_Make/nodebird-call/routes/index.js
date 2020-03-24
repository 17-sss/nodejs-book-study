// [10.5]
const express = require('express');
const axios = require('axios');

const router = express.Router();

// const URL = 'http://localhost:8002/v1';  // [10.5]
const URL = 'http://localhost:8002/v2';     // [10.6]

axios.defaults.headers.origin = 'http://localhost:8003';  

const request = async(req, api) => {
  try {
    if(!req.session.jwt) {  // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }

    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청

  } catch (error) {
    console.error(error);

    if (error.response.status < 500) {  // 410이나 419처럼 의도된 에러면 발생
    // [10.8.1] : 3-1 START
      delete req.session.jwt;
      request(req, api);
    // [10.8.1] : 3-1 END
      return error.response;
    }
    throw error;
  }
};

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

// [10.7] START
router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET }); // [10.8.1] - 3. 참고 (수정하진않음)
});
// [10.7] END

// [10.8.1] START -------------------------------------------------------
// 1. 팔로워나 팔로잉 목록을 가져오는 API 만들기
router.get('/follower', async (req, res, next) => {
  try {
    const result = await request(req, '/follow/me');
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

router.get('/following', async (req, res, next) => {
  try {
    const result = await request(req, '/follow/friend');
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

// [10.8.1] END -------------------------------------------------------

module.exports = router;