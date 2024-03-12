const express = require("express");
const controller = require("../controller/user");
const router = express.Router();
const middleware = require("../middleware/auth");
const { uploadProfileImg } = require("../middleware/multer");

//회원가입
router.post("/signup", controller.signup);
//회원가입시 이메일 조회
router.post("/check", controller.checkUser);
//카카오 회원가입
router.get("/auth/kakao", controller.getKakaoAuth);
//이메일 확인
router.post("/emailAuth", controller.emailAuth);
//로그인
router.post("/login/email", controller.loginEmail);
// router.post('/login/google', controller.loginGoogle);

//아이디 찾기
router.post("/findID", controller.findID);
//비밀번호 찾기
router.post("/findPW", controller.findPW);
//유저프로필 조회
router.post("/info", middleware.auth, controller.getUserInfo);

//유저 프로필 수정
router.patch("/update/info", middleware.auth, controller.updateUser);
//비밀번호 확인
router.post("/check/pw", middleware.auth, controller.checkPW);

//유저 비밀번호 수정
router.patch("/update/pw", middleware.auth, controller.updatePassword);

//유저 이미지 수정
router.patch("/update/profileimg", middleware.auth, uploadProfileImg, controller.updateUserImage);

//회원탈퇴
router.delete("/drop", middleware.auth, controller.userDrop);

//이메일용 유저조회
router.post("/find", middleware.auth, controller.findUser);
//userId용 유저조회
router.post("/findInfo", controller.getUserInfoBody);

module.exports = router;
