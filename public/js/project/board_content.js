/* 화살표 함수 */
const label = document.querySelector(".status_modify");
const options = document.querySelectorAll(".optionItem");
let projectMember = [];

// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = (item) => {
    label.parentNode.classList.remove("active");
    label.innerHTML = item.textContent;
};
// 옵션 클릭시 클릭한 옵션을 넘김
options.forEach((option) => {
    option.addEventListener("click", () => handleSelect(option));
});

const modal = document.querySelector("#dialog");
const userSelectModal = document.querySelector("#selectMember");
const selectMemberForm = document.querySelector("#selectMemberForm");

function showModal(event) {
    modal.showModal();
}
function showUserSelectModal(event) {
    userSelectModal.showModal();
}
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
        const { deadline, user, userId, projectId, status, title, description } = getBoardDetail.data.result.data;

        document.getElementById("new-work-member").textContent = user.user_name;
        document.getElementById("new-work-member").value = userId;

        const getProjectName = await axios({
            method: "POST",
            url: "/api/project/get/info",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { project_name, member } = getProjectName.data.result;

        const deadLine = new Date(deadline);
        const year = deadLine.getFullYear();
        const month = (deadLine.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줌
        const day = deadLine.getDate().toString().padStart(2, "0"); // 일
        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById("boardDeadline").value = formattedDate;
        document.getElementById("myProject").textContent = project_name;
        document.getElementById("writeExplain").value = description;
        document.getElementById("boardTitle").value = title;

        for (let i = 0; i < member.length; i++) {
            projectMember.push(member[i]);

            let imgPath = "";
            if (member[i].user_img === null || member[i].user_img === "") {
                imgPath = "../../../public/img/user-solid.svg";
            } else if (member[i].user_img.includes("http://") || member[i].user_img.includes("https://")) {
                imgPath = member[i].user_img;
            } else {
                imgPath = `../../../public/uploads/profile/${member[i].user_img}`;
            }

            const div = document.createElement("div");
            div.classList.add("flex");
            div.classList.add("justify-between");
            div.classList.add(".align-center");
            div.innerHTML = `
            <button value="${member[i].id}" class="modal-btn">   
                <div style="width:50%;">
                    <img src = "${imgPath}" style="width:30px;height:30px; border-radius:5px"/>
                </div>
                <div style="width:50%;">
                    <span>${member[i].user_name}</span>
                </div>
            </button
            `;
            selectMemberForm.appendChild(div);
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

modal.addEventListener("close", (event) => {
    // event.returnValue는 close이벤트에 대한 리턴 값으로 true를 반환한다.
    if (modal.returnValue === "planning") {
        boardStatusUpdate("planning");
    } else if (modal.returnValue === "progress") {
        boardStatusUpdate("progress");
    } else if (modal.returnValue === "needFeedback") {
        boardStatusUpdate("needFeedback");
    } else if (modal.returnValue === "finishFeedback") {
        boardStatusUpdate("finishFeedback");
    } else if (modal.returnValue === "suspend") {
        boardStatusUpdate("suspend");
    } else if (modal.returnValue === "finish") {
        boardStatusUpdate("finish");
    }
});
modal.addEventListener("close", (event) => {
    // event.returnValue는 close이벤트에 대한 리턴 값으로 true를 반환한다.
    if (modal.returnValue === "planning") {
        boardStatusUpdate("planning");
    } else if (modal.returnValue === "progress") {
        boardStatusUpdate("progress");
    } else if (modal.returnValue === "needFeedback") {
        boardStatusUpdate("needFeedback");
    } else if (modal.returnValue === "finishFeedback") {
        boardStatusUpdate("finishFeedback");
    } else if (modal.returnValue === "suspend") {
        boardStatusUpdate("suspend");
    } else if (modal.returnValue === "finish") {
        boardStatusUpdate("finish");
    }
});
function boardStatusUpdate(boardStatus) {
    const statusDiv = document.getElementById("status");
    let color = "";
    if (statusDiv.textContent === "계획중") {
        color = "blue";
    } else if (statusDiv.textContent === "진행중") {
        color = "yellow";
    } else if (statusDiv.textContent === "중단됨") {
        color = "purple";
    } else if (statusDiv.textContent === "완료") {
        color = "green";
    } else if (statusDiv.textContent === "피드백 요청") {
        color = "red";
    } else if (statusDiv.textContent === "피드백 완료") {
        color = "black";
    }
    const statusButton = document.getElementById("status-btn");
    statusButton.classList.remove(color);
    const circleDiv = document.getElementById(color);
    if (boardStatus === "planning") {
        statusButton.classList.add("blue");
        circleDiv.id = "blue";
        statusDiv.textContent = "계획중";
    } else if (boardStatus === "progress") {
        statusButton.classList.add("yellow");
        circleDiv.id = "yellow";
        statusDiv.textContent = "진행중";
    } else if (boardStatus === "needFeedback") {
        statusButton.classList.add("red");
        circleDiv.id = "red";
        statusDiv.textContent = "피드백 요청";
    } else if (boardStatus === "finishFeedback") {
        statusButton.classList.add("black");
        circleDiv.id = "black";
        statusDiv.textContent = "피드백 완료";
    } else if (boardStatus === "suspend") {
        statusButton.classList.add("purple");
        circleDiv.id = "purple";
        statusDiv.textContent = "중단됨";
    } else if (boardStatus === "finish") {
        statusButton.classList.add("green");
        circleDiv.id = "green";
        statusDiv.textContent = "완료";
    }
}
userSelectModal.addEventListener("close", (event) => {
    // event.returnValue는 close이벤트에 대한 리턴 값으로 true를 반환한다.
    if (userSelectModal.returnValue !== "") {
        boardJobMebmberUpdate(userSelectModal.returnValue);
    }
});
function boardJobMebmberUpdate(member_id) {
    document.getElementById("new-work-member").textContent = projectMember.filter(
        (member) => member.id == member_id
    )[0]["user_name"];
    document.getElementById("new-work-member").value = member_id;
}
// backdrop 클릭시 닫히는 이벤트 함수
modal.addEventListener("click", function (event) {
    /**
     * target === this 조건으로 close를 한다면 dialog 상자 안에 빈 곳을 클릭해도 닫힌다.(this 바인딩에 주의)
     * 정확하게 dialog 바깥인 backdrop 클릭시에만 이벤트를 호출하려면 클릭 포인트가
     * 상자 내부에 있는지를 체크하기 위해 left right top bottom을 확인해야한다.
     */
    const target = event.target;
    const rect = target.getBoundingClientRect();
    if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
    ) {
        modal.close();
    }
});
userSelectModal.addEventListener("click", function (event) {
    /**
     * target === this 조건으로 close를 한다면 dialog 상자 안에 빈 곳을 클릭해도 닫힌다.(this 바인딩에 주의)
     * 정확하게 dialog 바깥인 backdrop 클릭시에만 이벤트를 호출하려면 클릭 포인트가
     * 상자 내부에 있는지를 체크하기 위해 left right top bottom을 확인해야한다.
     */
    const target = event.target;
    const rect = target.getBoundingClientRect();
    if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
    ) {
        userSelectModal.close();
    }
});
//보내기
async function editFunc() {
    try {
        //제목
        const title = document.getElementById("boardTitle").value;
        //작업 설명
        const description = document.getElementById("writeExplain").value;
        //상태
        const statusKor = document.getElementById("status").textContent;
        let status = "planning";
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
        }

        //마감일
        const deadline = document.getElementById("boardDeadline").value;
        const userId = document.getElementById("new-work-member").value;
        console.log("dfasdfasdfasd", userId);

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
                title,
                description,
                status,
                deadline,
                board_id,
                userId,
            },
        });
        if (res.data.success) {
            alert("보드가 수정되었습니다.");
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
