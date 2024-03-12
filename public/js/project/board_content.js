/* 화살표 함수 */
const label = document.querySelector(".status_modify");
const options = document.querySelectorAll(".optionItem");

// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = (item) => {
    label.parentNode.classList.remove("active");
    label.innerHTML = item.textContent;
};
// 옵션 클릭시 클릭한 옵션을 넘김
options.forEach((option) => {
    option.addEventListener("click", () => handleSelect(option));
});

// 라벨을 클릭시 옵션 목록이 열림/닫힘
// label.addEventListener("click", () => {
//     if (label.parentNode.classList.contains("active")) {
//         label.parentNode.classList.remove("active");
//     } else {
//         label.parentNode.classList.add("activxe");
//     }
// });
const token = localStorage.getItem("token");
const ids = document.location.href.split("project/board_content/");
const board_id = ids[1];
// 불러오기
(async function () {
    try {
        const getBoardDetail = await axios({
            method: "get",
            url: `/api/project/board/${board_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        //deadline, userId, projectId, status, title, description
        console.log("보드", getBoardDetail.data.result);
        const { deadline, userId, projectId, status, title, description } = getBoardDetail.data.result.data;

        console.log(deadline, userId, projectId, status, title, "설명", description);

        const getProjectName = await axios({
            method: "POST",
            url: "/api/project/get/info",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { project_name, member } = getProjectName.data.result;
        const boardManager = document.getElementById("boardManager");

        for (let i = 0; i < member.length; i++) {
            const optionEl = document.createElement("option");
            optionEl.value = member[i].user_name;
            optionEl.textContent = member[i].user_name;
            optionEl.className = `${member[i].id}`;
            // console.log("아이디", member[i].user_name, member[i].id, optionEl.className);
            boardManager.appendChild(optionEl);
        }

        const getUserName = await axios({
            method: "POST",
            url: "/api/user/findInfo",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                userId,
            },
        });

        console.log(getUserName.data.result.user_name);
        const { user_name } = getUserName.data.result;
        const deadLine = new Date(deadline);
        const year = deadLine.getFullYear();
        const month = (deadLine.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줌
        const day = deadLine.getDate().toString().padStart(2, "0"); // 일
        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById("boardDeadline").value = formattedDate;
        document.getElementById("boardManager").value = user_name;
        document.getElementById("myProject").textContent = project_name;
        document.getElementById("writeExplain").value = description;
        document.getElementById("boardTitle").value = title;

        const circle = document.querySelector("#blue");
        const statusEl = document.getElementById("pro_status");
        const bg = document.getElementById("bg");
        if (status === "planning") {
            statusEl.textContent = "";
            statusEl.textContent = "계획중";
            bg.style.backgroundColor = "hsl(199, 74%, 85%)";
            circle.style.backgroundColor = "hsl(198, 60%, 70%)";
        } else if (status === "needFeedback") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 요청";
            bg.style.backgroundColor = "#f8cfcf";
            circle.style.backgroundColor = "#f25c5c";
        } else if (status === "finishFeedback") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 완료";
            bg.style.backgroundColor = "#d1d0d0";
            circle.style.backgroundColor = "#504e4e";
        } else if (status === "suspend") {
            statusEl.textContent = "";
            statusEl.textContent = "중단";
            bg.style.backgroundColor = "#f8d6f8";
            circle.style.backgroundColor = "purple";
        } else if (status === "finish") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 완료";
            bg.style.backgroundColor = "#d1d0d0";
            circle.style.backgroundColor = "#504e4e";
        } else if (status === "progress") {
            statusEl.textContent = "";
            statusEl.textContent = "진행중";
            bg.style.backgroundColor = "#f9f9c1";
            circle.style.backgroundColor = "#eaea5e";
        } else {
            statusEl.textContent = "";
            console.log("작업상태 없음");
        }

        //보드 댓글 가져오기
        const id = board_id;
        const getComments = await axios({
            method: "get",
            url: `/api/project/board/get/comment/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("댓글가져온거", getComments.data.result);
        const boardComments = document.querySelector(".boradComments");
        for (let i = 0; i < getComments.data.result.length; i++) {
            //댓글 작성자 프로필 이미지
            const commentWriterImg = document.createElement("img");
            if (
                getComments.data.result[i].user_img === null ||
                getComments.data.result[i].user_img === "" ||
                getComments.data.result[i].user_img === undefined
            ) {
                commentWriterImg.src = `../../../public/img/user-solid.svg`; //
            } else if (
                getComments.data.result[i].user_img.includes("http:") ||
                getComments.data.result[i].user_img.includes("https://")
            ) {
                commentWriterImg.src = getComments.data.result[i].user_img;
            } else {
                commentWriterImg.src = `../../../public/uploads/profile/${getComments.data.result[i].user_img}`;
            }
            commentWriterImg.className = "member_profile_img";

            //댓글 작성자 이름 + 댓글
            const commentBox = document.createElement("div");
            const commentWriter = document.createElement("div");
            const comment = document.createElement("div");
            commentWriter.textContent = getComments.data.result[i].user_name;
            comment.textContent = getComments.data.result[i].comment;
            comment.className = `comment ${getComments.data.result[i].id}`;
            commentBox.appendChild(commentWriter);
            commentBox.appendChild(comment);

            //삭제
            const deleteIcon = document.createElement("button");
            // deleteIcon.src = "../../public/img/trash.png";
            deleteIcon.className = "deleteCommentIcon";
            deleteIcon.onclick = async function () {
                try {
                    if (!confirm("댓글을 삭제하시겠습니까?")) {
                        return;
                    }
                    const deleteComment = await axios({
                        method: "delete",
                        url: "/api/project/board/delete/comment",
                        headers: {
                            Authorization: `Bearer ${token}`, // 토큰 추가
                        },
                        data: { comment_id: getComments.data.result[i].id },
                    });
                    console.log(deleteComment.data);
                    if (deleteComment.data.success) {
                        setBox.remove();
                        location.reload();
                    } else {
                        alert("댓글 작성자만 삭제할 수 있습니다.");
                        return;
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            const setBox = document.createElement("div");
            setBox.className = `commentBox ${i}`;
            setBox.appendChild(commentWriterImg);
            setBox.appendChild(commentBox);
            setBox.appendChild(deleteIcon);

            boardComments.appendChild(setBox);
        }
    } catch (error) {
        console.log("error", error);
    }
})();

//보내기
async function editFunc() {
    try {
        //제목
        const title = document.getElementById("boardTitle").value;
        //작업 설명
        const description = document.getElementById("writeExplain").value;
        //상태
        // const status = document.getElementById("boardStatus").value;
        const statusKor = document.getElementById("pro_status").textContent;
        let status = "";
        console.log(statusKor);
        if (statusKor === "계획중") {
            status = "planning";
        } else if (statusKor === "피드백 요청") {
            status = "needFeedback";
        } else if (statusKor === "피드백 완료") {
            status = "finishFeedback";
        } else if (statusKor === "중단") {
            status = "suspend";
        } else if (statusKor === "완료") {
            status = "finish";
        } else if (statusKor === "진행중") {
            status = "progress";
        } else {
            return console.log("status값 없음");
        }

        //마감일
        const deadline = document.getElementById("boardDeadline").value;
        console.log(deadline, status, description, title);
        // //프로젝트 멤버id = 담당자 id (class이름에 저장)
        const boardManager = document.getElementById("boardManager");
        const selectedOption = boardManager.options[boardManager.selectedIndex];
        const userId = selectedOption.className;

        if (title === "" || title === undefined || title === null) {
            alert("제목을 작성해주세요.");
            return;
        }
        if (description === "" || description === undefined || description === null) {
            alert("설명을 작성해주세요.");
            return;
        }
        if (status === "" || status === undefined || status === null) {
            alert("작업 상태를 선택해주세요.");
            return;
        }
        if (userId === "" || userId === undefined || userId === null) {
            alert("담당자를 선택해주세요");
            return;
        }
        if (deadline === "" || deadline === undefined || deadline === null) {
            alert("마감일을 설정해주세요.");
            return;
        }

        const res = await axios({
            method: "patch",
            url: "/api/project/board/update",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                // title, description, status, deadline, board_id: id, userId
                title,
                description,
                status,
                deadline,
                board_id,
                userId,
            },
        });
        if (res.data.success) {
            alert("일정이 수정되었습니다.");
            location.reload();
        } else {
            alert("수정에 실패하였습니다.");
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

//작업상태 디자인 변경 함수 모음
async function changeStatusToPlan() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "계획중";
    bg.style.backgroundColor = "hsl(199, 74%, 85%)";
    circle.style.backgroundColor = "hsl(198, 60%, 70%)";
}
async function changeStatusToProg() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "진행중";
    bg.style.backgroundColor = "#f9f9c1";
    circle.style.backgroundColor = "#eaea5e";
}
async function changeStatusToSus() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "중단";
    bg.style.backgroundColor = "#f8d6f8";
    circle.style.backgroundColor = "purple";
}
async function changeStatusToFin() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "완료";
    bg.style.backgroundColor = "#d2f5d2";
    circle.style.backgroundColor = "#328d32";
}
async function changeStatusToNeedFeed() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "피드백 완료";
    bg.style.backgroundColor = "#d1d0d0";
    circle.style.backgroundColor = "#504e4e";
}
async function changeStatusToNeedFeed() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "피드백 요청";
    bg.style.backgroundColor = "#f8cfcf";
    circle.style.backgroundColor = "#f25c5c";
}

//보드 삭제
async function deleteBoard() {
    try {
        if (!confirm("삭제하시겠습니까?")) {
            return;
        }

        // 보드 댓글 삭제 , 외래키 옵션 설정해놨나..?ㅎㅋㅎㅋ
        // const deleteCommentAll = await axios({
        // })

        const deleteBoard = await axios({
            method: "delete",
            url: `/api/project/board/delete`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                board_id,
            },
        });

        if (deleteBoard.data.success) {
            alert("보드가 삭제되었습니다.");
            document.location.href = "/project/board_main";
        } else {
            alert("보드 삭제에 실패하였습니다.");
        }
    } catch (error) {
        console.log(error);
    }
}

//댓글 작성
async function addComment() {
    const comment = document.querySelector(".comment_area").value;
    const addCommentRes = await axios({
        method: "post",
        url: "/api/project/board/write/comment",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            board_id,
            comment,
        },
    });
    if (addCommentRes.data.success) {
        return location.reload();
    } else {
        return alert("댓글 작성에 실패하였습니다.");
    }
}

// //댓글 삭제
// async function deleteComment() {
//     const
// }
