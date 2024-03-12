const token = localStorage.getItem("token");
let selectedUser = 0;

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

//프로젝트명 불러오기
(function () {
    axios({
        method: "POST",
        url: "/api/project/get/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        console.log("res data결과", res.data);
        const { project_name, member } = res.data.result;

        const myProjectBox = document.getElementById("myProject");

        for (let i = 0; i < member.length; i++) {
            //프로젝트 멤버 데이터 저장
            // projectMember.push(member[i]);
            //모달안에 유저 만들어주기!
            projectMember.push(member[i]);

            const div = document.createElement("div");
            div.classList.add("flex");
            div.classList.add("justify-between");
            div.classList.add(".align-center");
            div.innerHTML = `
            <button value="${member[i].id}" class="modal-btn">   
                <div style="width:50%;">
                    <img src = "../../../public/uploads/profile/${member[i].user_img}" style="width:30px;height:30px; border-radius:5px"/>
                </div>
                <div style="width:50%;">
                    <span>${member[i].user_name}</span>
                </div>
            </button
            `;
            selectMemberForm.appendChild(div);
        }

        myProjectBox.textContent = "";
        myProjectBox.textContent = project_name;
    });
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
    selectedUser = member_id;
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
//보드 작성
async function submitFunc() {
    try {
        //작업 제목
        const title = document.getElementById("boardTitle").value;
        //작업 설명
        const description = document.getElementById("writeExplain").value;
        //상태
        // const status = document.getElementById("boardStatus").value;
        const statusKor = document.getElementById("status").textContent;
        let status = "";
        console.log(statusKor);
        if (statusKor === "계획중") {
            status = "planning";
        } else if (statusKor === "피드백 요청") {
            status = "needFeedback";
        } else if (statusKor === "피드백 완료") {
            status = "finishFeedback";
        } else if (statusKor === "중단됨") {
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
        if (selectedUser === 0) {
            alert("담당자를 선택해주세요");
            return;
        }
        if (deadline === "" || deadline === undefined || deadline === null) {
            alert("마감일을 설정해주세요.");
            return;
        }
        const res = await axios({
            method: "POST",
            url: "/api/project/board/write",
            data: {
                title,
                description,
                status,
                deadline,
                member_id: selectedUser,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.data.success) {
            alert("새로운 일정이 추가되었습니다.");
            return (document.location.href = "board_main");
        }
    } catch (error) {
        console.error(error);
    }
}
