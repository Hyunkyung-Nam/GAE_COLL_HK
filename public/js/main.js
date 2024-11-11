const token = localStorage.getItem("token");
//로그인 안되어있으면 로그인화면으로 보내기
if (token == null) {
    document.location.href = `/start`;
}

const statusDiv = document.querySelectorAll(".main_status_txt");
let myjobdataByDate = [];
let myteamLogData = [];

for (let i = 0; i < statusDiv.length; i++) {
    statusDiv[i].addEventListener("click", click);
}
function click(e) {
    for (let i = 0; i < statusDiv.length; i++) {
        statusDiv[i].classList.remove("selected");
    }
    this.classList.add("selected");
    document.querySelector("#more-table").classList.remove("hidden");
    getProjectStatusJob(this.textContent);
}
function getProjectStatusJob(selectedProjectStatus) {
    let projectstatus = "";
    const myJobTable = document.querySelector("#my-job-tbody");
    myJobTable.innerHTML = "";

    switch (selectedProjectStatus) {
        case "계획 중":
            projectstatus = "planning";
            break;
        case "진행 중":
            projectstatus = "progress";
            break;
        case "피드백 요청":
            projectstatus = "needFeedback";
            break;
        case "피드백 완료":
            projectstatus = "finishFeedback";
            break;
        case "중단됨":
            projectstatus = "suspend";
            break;
        case "완료":
            projectstatus = "finish";
            break;
    }
    for (let i = 0; i < myjobdataByDate.length; i++) {
        if (myjobdataByDate[i].projectStatus === projectstatus) {
            const tr = document.createElement("tr");
            tr.addEventListener("click", function () {
                goJobDeatil(myjobdataByDate[i].projectId, myjobdataByDate[i].boardId);
            });
            tr.innerHTML = `
                        <td>
                            ${myjobdataByDate[i].title}
                        </td>
                        <td>
                            ${myjobdataByDate[i].deadline}
                        </td>
                        <td>
                            ${myjobdataByDate[i].projectName}
                        </td>
                `;
            myJobTable.appendChild(tr);
            if (myJobTable.childNodes.length === 5) {
                break;
            }
        }
    }
    if (myjobdataByDate.length < 5) {
        document.querySelector("#more-table").classList.add("hidden");
    }
}
function goJobDeatil(projectId, boardId) {
    goBoardContentPage(projectId, boardId);
}

(async function () {
    const token = localStorage.getItem("token");
    try {
        //내 프로젝트(이름, 깃헙, 블로그) 가져오기
        const getMyProjectResult = await axios({
            method: "post",
            url: "/api/project/mine",
            headers: { Authorization: `Bearer ${token}` },
        });

        const { success, result } = getMyProjectResult.data;

        if (success) {
            result.user_name === ""
                ? (document.getElementById("username").textContent = "")
                : (document.getElementById("username").textContent = `${result.user_name}님`);
            //깃헙링크 보여주기
            result.github === null || result.github === ""
                ? (document.getElementById("github").href = "/mypage")
                : (document.getElementById("github").href = result.github);
            // 블로그 링크 보여주기
            result.blog === null || result.blog === ""
                ? (document.getElementById("blog").href = "/mypage")
                : (document.getElementById("blog").href = result.blog);

            for (i = 0; i < result.projectResult.length; i++) {
                let imgPath = "";
                if (result.projectResult[i][3] === null || result.projectResult[i][3] === "") {
                    imgPath = "../../../public/img/people-group-solid.svg";
                } else if (
                    result.projectResult[i][3].includes("http://") ||
                    result.projectResult[i][3].includes("https://")
                ) {
                    imgPath = result.projectResult[i][3];
                } else {
                    imgPath = `../../../public/uploads/project/${result.projectResult[i][3]}`;
                }
                const html = document.createElement("div");
                const location = "home";
                html.innerHTML = `
                <div class="main_myproject_profile">
                    <button onclick='goProjectPage(${result.projectResult[i][0]},"home")'>
                    <div class="main_myproject_show"><img src=${imgPath} /></div>
                    <div class="txt_place">
                        <div class="main_myproject_name">${result.projectResult[i][1]}</div>
                        <div class="main_myproject_stat">${switchStatus(result.projectResult[i][2]).status}</div>
                    </div>
                    </button>
                </div>
            `;
                document.querySelector(".profiles").appendChild(html);
            }
        }
        //내작업 가져오기
        const getMyJobResultResult = await axios({
            method: "POST",
            url: "/api/project/board/mine",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { success: getMyJobSuccess, result: getMyJobResult } = getMyJobResultResult.data;
        let myjobdata = [];
        if (getMyJobSuccess) {
            for (let i = 0; i < getMyJobResult.length; i++) {
                for (let j = 0; j < getMyJobResult[i].board.length; j++) {
                    const data = {
                        boardId: getMyJobResult[i].board[j].id,
                        title: getMyJobResult[i].board[j].title,
                        projectStatus: getMyJobResult[i].board[j].status,
                        deadline: getMyJobResult[i].board[j].deadline,
                        projectId: getMyJobResult[i].projectId,
                        projectName: getMyJobResult[i].projectName,
                    };
                    myjobdata.push(data);
                }
            }
            //planning인거 deadline별로 넣기 최신부터 보여줌
            myjobdataByDate = myjobdata.sort((a, b) => {
                if (a.deadline > b.deadline) return -1;
                if (a.deadline < b.deadline) return 1;
                return 0;
            });
            getProjectStatusJob("계획 중");
        }
        //팀활동 가져오기
        const getTeamLogResult = await axios({
            method: "POST",
            url: "/api/project/teamboard",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (getTeamLogResult.data.success) {
            myteamLogData = getTeamLogResult.data.result.sort((a, b) => {
                if (a.updatedAt > b.updatedAt) return -1;
                if (a.updatedAt < b.updatedAt) return 1;
                return 0;
            });

            const teamBoardTbody = document.querySelector("#team_board-tbody");
            for (let i = 0; teamBoardTbody.childNodes.length < 5; i++) {
                const tr = document.createElement("tr");
                tr.addEventListener("click", function () {
                    goProjectPage(myteamLogData[i].projectId, "board_main");
                });
                let projectImage = myteamLogData[i].project_img
                    ? "../../public/uploads/project/" + myteamLogData[i].project_img
                    : "../../public/img/people-group-solid.svg";
                tr.innerHTML = `
                        <td class = "teamTd">
                            <img src = "${projectImage}" />
                            
                            ${myteamLogData[i].project_name}
                        </td>
                        <td class = "teamLogTd">
                            ${myteamLogData[i].user_name}님이 
                            ${myteamLogData[i].title}를 ${
                    switchStatus(myteamLogData[i].status).status
                }로 변경하였습니다.
                        </td>
                `;
                teamBoardTbody.appendChild(tr);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();

function switchStatus(status) {
    let data = { color: "", status: "" };

    switch (status) {
        case "planning":
            data.color = "blue";
            data.status = "계획중";
            break;
        case "progress":
            data.color = "yellow";
            data.status = "진행중";
            break;
        case "suspend":
            data.color = "purple";
            data.status = "중단됨";
            break;
        case "finish":
            data.color = "green";
            data.status = "완료";
            break;
        case "needFeedback":
            data.color = "red";
            data.status = "피드백 요청";
            break;
        case "finishFeedback":
            data.color = "black";
            data.status = "피드백 완료";
            break;
    }
    return data;
}

//프로젝트나 팀 로그 누르면  해당프로젝트 홈으로 이동
async function goProjectPage(projectId, location) {
    const token = localStorage.getItem("token");

    try {
        const updateTokenResult = await axios({
            method: "POST",
            url: "/api/project/update/token",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                projectId,
            },
        });
        const { success, token: newToken } = updateTokenResult.data;
        if (success) {
            localStorage.setItem("token", newToken);
            document.location.href = `/project/${location}`;
        }
    } catch (error) {
        console.log(error);
    }
}
//프로젝트누르면 해당프로젝트 보드 상세페이지로
async function goBoardContentPage(projectId, boardId) {
    const token = localStorage.getItem("token");

    try {
        const updateTokenResult = await axios({
            method: "POST",
            url: "/api/project/update/token",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                projectId,
            },
        });
        const { success, token: newToken } = updateTokenResult.data;
        if (success) {
            localStorage.setItem("token", newToken);
            document.location.href = `project/board_content/${boardId}`;
        }
    } catch (error) {
        console.log(error);
    }
}

//내작업에서 더보기 누르면 5개 더 보여주기
function showMoreJob() {
    const tbody = document.querySelector("#my-job-tbody");
    const before = document.querySelector("#my-job-tbody").childNodes.length;
    const selectedProjectStatus = document.querySelector(".selected").textContent;
    let projectstatus = "";

    switch (selectedProjectStatus) {
        case "계획 중":
            projectstatus = "planning";
            break;
        case "진행 중":
            projectstatus = "progress";
            break;
        case "피드백 요청":
            projectstatus = "needFeedback";
            break;
        case "피드백 완료":
            projectstatus = "finishFeedback";
            break;
        case "중단됨":
            projectstatus = "suspend";
            break;
        case "완료":
            projectstatus = "finish";
            break;
    }
    const datas = myjobdataByDate.filter((data) => data.projectStatus === projectstatus);
    if (datas.length > tbody.childNodes.length) {
        for (let i = tbody.childNodes.length; i < datas.length; i++) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    ${datas[i].title}
                </td>
                <td>
                    ${datas[i].deadline}
                </td>
                <td>
                    ${datas[i].projectName}
                </td>
                `;
            tbody.appendChild(tr);
            if (tbody.childNodes.length - before === 5) {
                break;
            }
        }
    }
    if (tbody.childNodes.length === datas.length) {
        document.querySelector("#more-table").classList.add("hidden");
    }
}
