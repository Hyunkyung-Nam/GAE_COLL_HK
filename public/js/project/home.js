// 프로젝트 규칙, 멤버 조회, project overview 조회
const ruleData = [];
(async function loadProjectInfo() {
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "POST",
            url: `/api/project/get/info`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { success, result } = response.data;
        if (success) {
            //project overview 관리
            document.getElementById("overview-text").textContent = result.overview;

            // 멤버
            var memberDivs = "";
            for (var i = 0; i < result.member.length; i++) {
                memberDivs += `
                <div id="pro-img-div" data-id="${result.member[i].id}">
                    <img src="../../public/img/mypage.png" id="pen-img" />
                    <div class="member-div" onclick="deleteMember(event);">${result.member[i].user_name}</div>
                </div>`;
            }
            document.getElementById("member-main").innerHTML = memberDivs;

            // 규칙
            if (result.rule !== null && result.rule !== "") {
                const rule = JSON.parse(result.rule);
                for (let i = 0; i < rule.length; i++) {
                    let div = document.createElement("div");
                    div.id = `ruleList${i}`;
                    div.innerHTML = `   
                    <li class="li" style = "background : white;">
                        <span class="text-element" >${rule[i]}</span>
                        <span class="rule-icon" onclick="deleteProjectRuleFunc(${i})">
                        <img src="../../public/img/trash.png" class="rule-img delete-icon" />
                    </span>
                    </li>
                    `;
                    ruleData.push(rule[i]);
                    document.getElementById("rule-list").appendChild(div);
                }
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

//파일 정보 조회
(async function () {
    const token = localStorage.getItem("token");
    const getProjectFile = await axios({
        method: "POST",
        url: "/api/project/get/file",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { success, result } = getProjectFile.data;
    if (success) {
        console.log("result", result);
        if (result.plan !== null && result.plan !== "") {
            const plan = JSON.parse(result.plan);
            // document.getElementsByClassName("plan-file-contain").textContent = result.plan;
            for (let i = 0; i < plan.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="plan-file-name" data-id="${plan[i]}">
                <div class="plan-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                </div>
                <a href="../../public/uploads/project_file/${plan[i]}" download >
                <div class="fileDeleteBox">${plan[i]}</div>
            </a>
            <button onclick="deleteFile(event, ${i}, 'plan')"  class = "fileButton" >삭제<button>
            </div>
        `;
                document.getElementsByClassName("plan-file-contain")[0].appendChild(div);
            }
        }
        // document.getElementsByClassName("erd-file-contain").textContent = result.erd;
        if (result.erd !== null && result.erd !== "") {
            const erd = JSON.parse(result.erd);
            for (let i = 0; i < erd.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="erd-file-name" data-id="${erd[i]}">
                <div class="erd-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <a href="../../public/uploads/project_file/${erd[i]}" download>
                <div class="fileDeleteBox">${erd[i]}</div>
            </a>
            <button class = "fileButton" onclick="deleteFile(event, ${i}, 'erd')">삭제<button>
            </div>
            `;
                document.getElementsByClassName("erd-file-contain")[0].appendChild(div);
            }
        }
        // document.getElementsByClassName("api-file-contain").textContent = result.api;
        if (result.api !== null && result.api !== "") {
            const api = JSON.parse(result.api);
            for (let i = 0; i < api.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="api-file-name" data-id="${api[i]}">
            
                <div class="api-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <a href="../../public/uploads/project_file/${api[i]}" download>
                <div class="fileDeleteBox">${api[i]}</div>
            </a>
            <button class = "fileButton" onclick="deleteFile(event, ${i}, 'api')">삭제<button>
            </div>
            `;
                document.getElementsByClassName("api-file-contain")[0].appendChild(div);
            }
        }
    }
})();

//이슈 노트 가져오기
(async function () {
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "GET",
            url: "/api/project/issue",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { success, result } = response.data;
        if (success) {
            for (let i = 0; i < result.length; i++) {
                console.log("!", result);
                try {
                    const userResponse = await axios({
                        method: "POST",
                        url: "/api/user/findInfo",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: { userId: result[i].userId },
                    });
                    const { success: userSuccess, result: userInfo } = userResponse.data;
                    console.log("ss", userSuccess);
                    if (userSuccess) {
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td class="td1">${i + 1}</td>
                            <td class="td2"><a href="/project/issue_content/${result[i].id}" class = "issue-a">${
                            result[i].title
                        }</td></a>
                            <td class="td3">${userInfo.user_name}</td>
                            <td class="td4">${result[i].issue_date}</td>
                        `;
                        document.getElementById("issueTbody").appendChild(tr);
                    } else {
                        console.error("사용자 정보 요청 실패:", userResponse.data);
                    }
                } catch (error) {
                    console.error("사용자 정보 요청 중 오류 발생:", error);
                }
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

//팀 활동, 피드백 요청 목록
(async function () {
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "post",
            url: "/api/project/get/log",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { result, success } = response.data;
        let organizedTeamLog = result.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) return -1;
            if (a.updatedAt < b.updatedAt) return 1;
            return 0;
        });

        if (success) {
            for (let i = 0; i < organizedTeamLog.length; i++) {
                // `${changeStatusKor(organizedTeamLog[i].boardStatus)}`가 '피드백 요청'이 아닌 경우에만 div를 생성하고 추가합니다.
                if (changeStatusKor(organizedTeamLog[i].boardStatus) !== "피드백 요청") {
                    let div = document.createElement("div");
                    div.classList.add("teamDiv");
                    let userImage = "";
                    if (
                        organizedTeamLog[i].user_img !== null &&
                        (organizedTeamLog[i].user_img.includes("http://") ||
                            organizedTeamLog[i].user_img.includes("https://"))
                    ) {
                        userImage = organizedTeamLog[i].user_img;
                    } else {
                        userImage = organizedTeamLog[i].user_img
                            ? "../../public/uploads/profile/" + organizedTeamLog[i].user_img
                            : "../../public/img/user-solid.svg";
                    }

                    div.innerHTML = `<div class = "teamDivImg">
                    <img src="${userImage}" class = "teamImg"></div>
                    <div id="team-work-list-text"><a href="/project/board_content/${
                        organizedTeamLog[i].boardId
                    }" class = "poject-a">  
                    ${organizedTeamLog[i].user_name}님이 ${organizedTeamLog[i].title}을 ${changeStatusKor(
                        organizedTeamLog[i].boardStatus
                    )}으로 변경하였습니다.</div>
                    `;
                    document.getElementsByClassName("team-work-list")[0].appendChild(div);
                }

                if (organizedTeamLog[i].boardStatus === "needFeedback") {
                    let div = document.createElement("div");

                    let userImage = "";
                    if (
                        organizedTeamLog[i].user_img !== null &&
                        (organizedTeamLog[i].user_img.includes("http://") ||
                            organizedTeamLog[i].user_img.includes("https://"))
                    ) {
                        userImage = organizedTeamLog[i].user_img;
                    } else {
                        userImage = organizedTeamLog[i].user_img
                            ? "../../public/uploads/profile/" + organizedTeamLog[i].user_img
                            : "../../public/img/user-solid.svg";
                    }

                    div.classList.add("needFeedDiv");
                    div.innerHTML = `<div class = "teamDivImg"> <img src="${userImage}" class = "teamImg"></div>
                    <div id="feedback-list-text">
                    <a href="/project/board_content/${organizedTeamLog[i].boardId}" class = "poject-a">${
                        organizedTeamLog[i].user_name
                    }님이 ${organizedTeamLog[i].title}을 ${changeStatusKor(
                        organizedTeamLog[i].boardStatus
                    )}으로 변경하였습니다.</div></a>
                        `;
                    document.getElementsByClassName("feedback-list")[0].appendChild(div);
                    if (organizedTeamLog.length.length === 5) {
                        break;
                    }
                }
            }
        } else {
            console.error("팀 활동 요청 실패 : ", response.data);
        }
    } catch (error) {
        console.error("팀 활동 요청 중 오류 발생 : ", error);
    }
})();
function changeStatusKor(selectedProjectStatus) {
    let statusKor = "";
    switch (selectedProjectStatus) {
        case "planning":
            statusKor = "계획 중";
            break;
        case "progress":
            statusKor = "진행 중";
            break;
        case "needFeedback":
            statusKor = "피드백 요청";
            break;
        case "finishFeedback":
            statusKor = "피드백 완료";
            break;
        case "suspend":
            statusKor = "중단됨";
            break;
        case "finish":
            statusKor = "완료";
            break;
    }
    return statusKor;
}

//프로젝트 규칙 생성
async function projectRuleGeneration() {
    const list = document.getElementById("rule-list");
    const li = document.createElement("li");
    li.className = "li";

    const textElement = document.createElement("span");
    textElement.className = "text-element";
    textElement.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";

    const ruleIcon = document.createElement("span");
    ruleIcon.className = "rule-icon";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";

    ruleIcon.appendChild(deleteIcon);

    li.appendChild(input);
    li.appendChild(textElement);
    li.appendChild(ruleIcon);
    list.appendChild(li);
    input.focus();

    input.onkeydown = async function (event) {
        if (event.key !== "Enter") return;
        const rule = input.value;
        ruleData.push(rule);
        const token = localStorage.getItem("token");
        try {
            const response = await axios({
                method: "PATCH",
                url: "/api/project/update/rule",
                data: {
                    rule: ruleData,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            const { success, result } = response.data;
            if (success) {
                console.log("규칙 추가 성공 : ", result);
                location.reload(true);
            } else {
                console.log("규칙 추가 실패");
            }
        } catch (error) {
            console.log("규칙 추가 중 에러 발생 : ", error);
        }
    };
}

//규칙 삭제
async function deleteProjectRuleFunc(ruleIndex) {
    const divTag = document.querySelector(`#ruleList${[ruleIndex]}`);
    divTag.remove();
    const token = localStorage.getItem("token");
    ruleData.splice(ruleIndex, 1);

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/rule",
            data: {
                rule: ruleData,
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("규칙 추가 성공 : ", result);
            location.reload(true);
        } else {
            console.log("규칙 추가 실패");
        }
    } catch (error) {
        console.log("규칙 추가 중 에러 발생 : ", error);
    }
}
window.onload = function () {
    target1 = document.getElementById("file-upload-plan"); // file 아이디 선언
    target1.addEventListener("change", function () {
        // change 함수

        if (target1.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            uploadPlan();
        }
    });
    target2 = document.getElementById("file-upload-erd"); // file 아이디 선언
    target2.addEventListener("change", function () {
        // change 함수

        if (target2.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            uploadERD();
        }
    });
    target3 = document.getElementById("file-upload-api"); // file 아이디 선언
    target3.addEventListener("change", function () {
        // change 함수

        if (target3.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            uploadAPI();
        }
    });
};

//파일 업로드
async function uploadPlan() {
    const fileInput = document.getElementById("file-upload-plan");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");
    console.log("first");
    if (!file) {
        alert("파일을 선택해주세요");
        console.log("파일을 선택해주세요.");
        return;
    }
    console.log(file);
    const formData = new FormData();
    formData.append("project_files", file);
    const type = "plan";
    formData.append("type", type);
    // location.reload(true);
    const response = await axios({
        method: "PATCH",
        url: "/api/project/update/file",
        data: formData,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    const { result, success } = response.data;
    console.log("success", success);
    if (success) {
        let div = document.createElement("div");
        div.innerHTML = `
                <div class="plan-file-name">
                    <div class="plan-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
        document.getElementsByClassName("plan-file-contain")[0].appendChild(div);
        alert("파일이 업로드 되었습니다.");
    } else {
        alert("파일이 업로드에 실패하였습니다.");
        console.log("파일 업로드에 실패하였습니다.");
    }
}

//파일 업로드(ERD)
async function uploadERD() {
    const fileInput = document.getElementById("file-upload-erd");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
        alert("파일을 선택해주세요");
        console.log("파일을 선택해주세요.");
        return;
    }

    const formData = new FormData();
    formData.append("project_files", file);
    const type = "erd";
    formData.append("type", type);
    // location.reload(true);
    const response = await axios({
        method: "PATCH",
        url: "/api/project/update/file",
        data: formData,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    const { result, success } = response.data;
    if (success) {
        let div = document.createElement("div");
        div.innerHTML = `
                <div class="erd-file-name">
                    <div class="erd-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
        document.getElementsByClassName("erd-file-contain")[0].appendChild(div);
        alert("파일이 업로드 되었습니다.");
    } else {
        alert("파일이 업로드에 실패하였습니다.");
        console.log("파일 업로드에 실패하였습니다.");
    }
}

//파일 업로드(API)
async function uploadAPI() {
    try {
        const fileInput = document.getElementById("file-upload-api");
        const file = fileInput.files[0];
        const token = localStorage.getItem("token");

        if (!file) {
            alert("파일을 선택해주세요");
            console.log("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("project_files", file);
        const type = "api";
        formData.append("type", type);
        // location.reload(true);
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/file",
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        const { result, success } = response.data;
        if (success) {
            let div = document.createElement("div");
            div.classList.add("fileDeleteButton");
            div.innerHTML = `
                <div class="api-file-name">
                    <div class="api-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
            document.getElementsByClassName("api-file-contain")[0].appendChild(div);
            alert("파일이 업로드 되었습니다.");
        } else {
            alert("파일이 업로드에 실패하였습니다.");
            console.log("파일 업로드에 실패하였습니다.");
        }
    } catch (error) {
        console.log(error);
    }
}

//파일 삭제
async function deleteFile(e, fileIndex, type) {
    let element = e.target;
    const token = localStorage.getItem("token");
    while (element && !element.getAttribute("data-id")) {
        element = element.parentNode;
    }
    if (element) {
        let project_file = element.getAttribute("data-id");
        if (confirm("파일 삭제 하시겠습니까?")) {
            try {
                const response = await axios({
                    method: "DELETE",
                    url: "/api/project/delete/file",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: { project_file: fileIndex, type },
                });
                const { result, success } = response.data;
                if (success) {
                    e.target.parentNode.remove();
                    console.log("파일 삭제에 성공하였습니다.", result);
                } else {
                    console.log("파일 삭제에 실패하였습니다.");
                }
            } catch (error) {
                console.log("규칙 추가 중 에러 발생 : ", error);
            }
        }
    }
}

//멤버 추가
async function addMember() {
    let inputMemberEmail = prompt("회원님의 이메일을 입력해주세요:");
    if (!inputMemberEmail) {
        return;
    }

    let email = inputMemberEmail;
    const token = localStorage.getItem("token");

    try {
        //유저조회
        const response = await axios({
            method: "POST",
            url: "/api/user/find",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                email,
            },
        });
        const { result, success } = response.data;
        if (success) {
            const member_id = [result.id];
            //멤버 초대
            const userInvite = await axios({
                method: "POST",
                url: "/api/project/add/member",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    member_id,
                },
            });

            console.log("멤버 초대 응답", userInvite);
            const inviteResult = userInvite.data.result; // 결과값을 새로운 변수에 저장
            if (inviteResult.success) {
                let div = document.createElement("div");
                div.classList.add("memberDiv");
                div.setAttribute("data-id", member_id[0]); // div에 data-id 속성 추가
                div.onclick = deleteMember; // div에 클릭 이벤트를 바인딩
                div.innerHTML = `
                        <div id="pro-img-div">
                            <img src="../../public/img/mypage.png" id="pen-img" />
                            <div>${result.member.user_name}</div>
                            <div>${member_id[0]}</div>
                        </div>`;
                document.getElementById("member-main").appendChild(div);
            }
            console.log("멤버 추가 성공 : ", result);
            alert("멤버가 추가 되었습니다.");
            location.reload(true);
        } else {
            if (result.message) {
                alert(result.message);
            } else {
                alert("이메일을 다시 확인해주세요");
            }
        }
    } catch (error) {
        console.error("멤버 추가 도중에 오류가 발생하였습니다. ", error);
    }
}

//멤버 강퇴
async function deleteMember(e) {
    let element = e.target;
    while (element && !element.getAttribute("data-id")) {
        element = element.parentNode;
    }
    if (element) {
        let member_id = element.getAttribute("data-id");

        const token = localStorage.getItem("token");
        if (confirm("강퇴하시겠습니까?")) {
            try {
                const response = await axios({
                    method: "delete",
                    url: "/api/project/delete/member",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        member_id,
                    },
                });
                const { result, success } = response.data;
                if (success) {
                    e.target.parentNode.remove();
                } else {
                }
            } catch (error) {
                console.error("멤버 강퇴 도중에 오류가 발생하였습니다. ", error);
            }
        }
    }
}

//project overview 수정
let projectId = localStorage.getItem("project_id");
async function changeOverview(e) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    input.style.display = "inline";
    input.value = text.textContent;
    text.style.display = "none";
    input.focus();
    const token = localStorage.getItem("token");
}

async function saveOverview(event) {
    if (event.key !== "Enter") return;
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                overview: input.value,
            },
        });
        const { success, result } = response.data;
        if (success) {
            console.log("Overview 업데이트에 성공하셨습니다. :", result);
        } else {
            console.error("overview 업데이트에 실패하셨습니다.");
        }
    } catch (error) {
        console.error("overview 업데이트 도중 오류가 발생하였습니다. :", error);
    }
}
async function saveBlurOverview(event) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";

    const token = localStorage.getItem("token");

    const project_id = 10;

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id,
                overview: input.value,
            },
        });
        const { success, result } = response.data;
        if (success) {
            console.log("Overview 업데이트에 성공하셨습니다. :", result);
        } else {
            console.error("overview 업데이트에 실패하셨습니다.");
        }
    } catch (error) {
        console.error("overview 업데이트 도중 오류가 발생하였습니다. :", error);
    }
}
