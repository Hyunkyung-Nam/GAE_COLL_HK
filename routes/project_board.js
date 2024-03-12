const express = require("express");
const controller = require("../controller/project_board");
const router = express.Router();
const { auth } = require("../middleware/auth");

//보드 조회
router.get("/get", auth, controller.getBoardAll);
//보드 월별 조회
router.get("/get/month", auth, controller.getBoardMonth);
//보드 수정
router.patch("/update", auth, controller.updateBoard);
//보드 삭제
router.delete("/delete", auth, controller.deleteBoard);
//보드 작성
router.post("/write", auth, controller.boardWrite);
//보드 1개 조회
router.get("/:board_id", auth, controller.getBoardDetail);
//보드 댓글 조회
router.get("/get/comment/:id", auth, controller.getComment);
//보드 댓글 작성
router.post("/write/comment", auth, controller.writeCommnet);
//보드 댓글 삭제
router.delete("/delete/comment", auth, controller.deleteComment);

module.exports = router;
