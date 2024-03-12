const { Board, BoardComment, User } = require("../models");
const { Op } = require("sequelize");

//보드 전체 조회
exports.getBoardAll = async (req, res) => {
    try {
        const projectId = req.projectId;
        console.log(projectId);

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { projectId: Number(projectId) },
        });
        const teamBoards = [];
        for (let boardResult of getBoardAllResult) {
            const userInfoResult = await User.findOne({
                where: { id: Number(boardResult.userId) },
                attributes: ["user_name"],
            });

            const board = {
                deadline: boardResult.deadline,
                description: boardResult.description,
                id: boardResult.id,
                projectId: boardResult.projectId,
                status: boardResult.status,
                title: boardResult.title,
                userId: boardResult.userId,
                user_name: userInfoResult.user_name,
                updatedAt: boardResult.updatedAt,
            };
            teamBoards.push(board);
        }

        res.json({ success: true, result: teamBoards });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};

//보드작성
exports.boardWrite = async (req, res) => {
    const projectId = req.projectId;
    let userId = 0;

    try {
        const { title, description, status, deadline, userId: member_id } = req.body;
        member_id === null || member_id === undefined ? (userId = req.userId) : (userId = member_id);
        // console.log(member_id, typeof member_id);
        // console.log(deadline, typeof deadline);
        // console.log("userId", userId);
        const boardWriteResult = await Board.create({
            projectId: Number(projectId),
            title,
            description,
            userId: Number(userId),
            status,
            deadline,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 1개조회
exports.getBoardDetail = async (req, res) => {
    try {
        const userId = req.userId;

        const { board_id: id } = req.params;

        const getBoardDatail = await Board.findOne({
            order: [["id", "DESC"]],
            where: { id: Number(id) },
        });

        let is_mine = false;

        getBoardDatail.userId == userId ? (is_mine = true) : (is_mine = false);

        res.json({ success: true, result: { data: getBoardDatail, is_mine } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 월별조회
exports.getBoardMonth = async (req, res) => {
    try {
        const my_id = req.userId;
        const projectId = req.projectId;
        const { YYYYMM } = req.query;
        let is_mine = false;
        const boardData = [];

        const getBoardAllResult = await Board.findAll({
            order: [["id", "DESC"]],
            where: { projectId, deadline: { [Op.like]: `${YYYYMM}%` } },
        });
        for (let board of getBoardAllResult) {
            board.userId === my_id ? (is_mine = true) : (is_mine = false);
            const data = {
                deadline: board.deadline,
                id: board.id,
                status: board.status,
                title: board.title,
                is_mine,
            };
            boardData.push(data);
        }
        res.json({ success: true, result: boardData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 수정
exports.updateBoard = async (req, res) => {
    try {
        const { title, description, status, deadline, board_id: id, userId } = req.body;
        console.log(userId);
        const boardWriteResult = await Board.update(
            {
                title,
                description,
                userId: Number(userId),
                status,
                deadline,
            },
            {
                where: {
                    id,
                },
            }
        );
        console.log(boardWriteResult);
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드 삭제
exports.deleteBoard = async (req, res) => {
    try {
        const { board_id: id } = req.body;
        const deleteBoardResult = await Board.destroy({
            where: {
                id,
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//보드에 해당하는 댓글 가져오기
exports.getComment = async (req, res) => {
    try {
        const { id } = req.params;
        const boardData = [];

        const getCommentAllResult = await BoardComment.findAll({
            order: [["id", "DESC"]],
            where: { boardId: id },
        });
        console.log(getCommentAllResult);
        //포문돌려서 유저 아이디에 해당하는 유저 이름, 프로필, 가져오기!

        for (result of getCommentAllResult) {
            console.log(result);
            const findUserInfoResult = await User.findOne({
                where: { id: result.userId },
                attributes: ["user_name", "user_img"],
            });
            const data = {
                id: result.id,
                comment: result.comment,
                userId: result.userId,
                user_name: findUserInfoResult.user_name,
                user_img: findUserInfoResult.user_img,
            };
            boardData.push(data);
        }
        console.log("boardData", boardData);
        res.json({ success: true, result: boardData });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
//댓글 작성
exports.writeCommnet = async (req, res) => {
    try {
        const userId = req.userId;

        const { comment, board_id: boardId } = req.body;
        const createCommentResult = await BoardComment.create({
            boardId: Number(boardId),
            userId: Number(userId),
            comment,
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, result: error });
    }
};
//댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const { comment_id: id } = req.body;
        const deleteCommentResult = await BoardComment.destroy({
            where: {
                id: Number(id),
            },
        });
        res.json({ success: true, result: "" });
    } catch (error) {
        res.json({ success: false, result: error });
    }
};
