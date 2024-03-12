const axios = require("axios");
//쿼리스트링으로 바꿔주기 위한 npm패키지
const qs = require("qs");
const alertmove = require("../util/alert_move");

exports.main = (req, res) => {
    res.render("main");
};
exports.start = (req, res) => {
    res.render("start/index");
};
exports.login = (req, res) => {
    res.render("start/login");
};
exports.signup = (req, res) => {
    res.render("start/signup");
};
exports.idFind = (req, res) => {
    res.render("start/idFind");
};
exports.pwFind = (req, res) => {
    res.render("start/pwFind");
};
exports.google = (req, res) => {
    res.render("start/google");
};
exports.kakao = (req, res) => {
    res.render("start/kakao");
};
exports.kakaoLogin = (req, res) => {
    res.render("start/kakao_login");
};
exports.header = (req, res) => {
    res.render("common/header");
};
exports.projectheader = (req, res) => {
    res.render("project/header");
};
exports.project = (req, res) => {
    res.render("project/home");
};
exports.mypage = (req, res) => {
    res.render("mypage");
};
exports.board_write = (req, res) => {
    res.render("project/board_write");
};
exports.footer = (req, res) => {
    res.render("common/footer");
};
exports.board_main = (req, res) => {
    res.render("project/board_main");
};
exports.board_content = (req, res) => {
    res.render("project/board_content");
};
exports.issue_write = (req, res) => {
    res.render("project/issue_write");
};
exports.issue = (req, res) => {
    res.render("project/issue_main");
};

exports.issue_content = (req, res) => {
    res.render("project/issue_content");
};

exports.issue_write = (req, res) => {
    res.render("project/issue_write");
};

exports.newProject = (req, res) => {
    res.render("project/newProject2");
};
exports.calender = (req, res) => {
    res.render("project/calender");
};
exports.write = (req, res) => {
    res.render("project/issue_write");
};

const kakaoOpt = {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    develRedirectUri: process.env.DEVEL_KAKAO_REDIRECT_URI,
    prodRedirectUri: process.env.PROD_KAKAO_REDIRECT_URI,
};
const googleOpt = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    develRedirectUri: process.env.DEVEL_GOOGLE_REDIRECT_URI,
    prodRedirectUri: process.env.PROD_GOOGLE_REDIRECT_URI,
};

exports.getKakaoAuthCallback = async (req, res) => {
    console.log(req.query.code);
    let token;
    try {
        const url = "https://kauth.kakao.com/oauth/token";
        let redirectUri = "";
        process.env.NODE_ENV === "production"
            ? (redirectUri = kakaoOpt.prodRedirectUri)
            : (redirectUri = kakaoOpt.develRedirectUri);
        const body = qs.stringify({
            grant_type: "authorization_code",
            client_id: kakaoOpt.clientId,
            client_secret: kakaoOpt.clientSecret,
            redirectUri,
            code: req.query.code,
        });
        const header = { "content-type": "application/x-www-form-urlencoded" };
        const response = await axios.post(url, body, header);
        token = response.data.access_token;
        console.log("token", token);
        res.send(alertmove("/start/kakaoLogin", token));
    } catch (err) {
        console.log(err);
        console.log("에러1");
        res.send("에러1");
    }
};

exports.getGoogleAuth = (req, res) => {
    let googleLoginURL = "";
    if (process.env.NODE_ENV === "production") {
        googleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${googleOpt.prodRedirectUri}&client_id=${googleOpt.clientId}`;
    } else {
        googleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email profile&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${googleOpt.develRedirectUri}&client_id=${googleOpt.clientId}`;
    }
    res.redirect(googleLoginURL);
};
