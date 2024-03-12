const express = require("express");
const controller = require("../controller/project");
const router = express.Router();
const { uploadProjectImg, uploadProjectFiles } = require("../middleware/multer");
const { auth } = require("../middleware/auth");

//프로젝트 생성
router.post("/create", auth, uploadProjectImg, controller.createProject);
//내 작업(보드) 조회 (사용자가 참여 중인 프로젝트에 있는 자신의 보드)
router.post("/board/mine", auth, controller.getMyBoard);
//사용자가 참여 중인 모든 프로젝트 조회
router.post("/mine", auth, controller.getMyProject);
//팀원 활동(보드) 조회 (사용자가 참여 중인 모든 프로젝트 멤버들의 보드)
router.post("/teamboard", auth, controller.getMyTeamBoard);
//프로젝트 정보 조회
router.post("/get/info", auth, controller.getProjectInfo);
//프로젝트 파일 조회
router.post("/get/file", auth, controller.getProjectFile);
//프로젝트 로그 조회
router.post("/get/log", auth, controller.projectLog);
//프로젝트 이동시 token새로 발급
router.post("/update/token", auth, controller.UpdateToken);

//프로젝트 이름 수정
router.patch("/update/name", auth, controller.updateProjectName);
//프로젝트 이미지 수정
router.patch("/update/img", auth, uploadProjectImg, controller.updateProjectImg);
//프로젝트 상태 수정
router.patch("/update/status", auth, controller.updateProjectStatus);
//프로젝트 기간 수정
router.patch("/update/period", auth, controller.updateProjectperiod);
//프로젝트 overview 수정
router.patch("/update/overview", auth, controller.updateProjectOverview);
//프로젝트 규칙 수정
router.patch("/update/rule", auth, controller.updateProjectRule);
//프로젝트 멤버 추가
router.post("/add/member", auth, controller.addProjectMember);
//프로젝트 멤버 삭제
router.delete("/delete/member", auth, controller.deleteProjectMember);
//프로젝트 파일 수정
router.patch("/update/file", auth, uploadProjectFiles, controller.updateProjectFile);
//프로젝트 파일 삭제
router.delete("/delete/file", auth, controller.deleteFile);
//프로젝트 깃허브 수정
router.patch("/update/github", auth, controller.updateProjectGithub);

module.exports = router;
