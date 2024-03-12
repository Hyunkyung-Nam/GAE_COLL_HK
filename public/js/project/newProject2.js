function openPopup() {
    document.querySelector(".popup-overlay").style.display = "block";
    document.querySelector(".popup-content").style.display = "block";
}

function closePopup() {
    document.querySelector(".popup-overlay").style.display = "none";
    document.querySelector(".popup-content").style.display = "none";
}

window.onload = function () {
    target = document.getElementById("proImg"); // file 아이디 선언
    target.addEventListener("change", function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            $("#origin_name").html(target.files[0].name);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $("#origin_name").html("");
        }
    });
};

const emailInput = document.getElementById("email-write");
const emailList = document.getElementById("emailList");
const inviteForm = document.getElementById("member-invitation");
const emailList2 = document.getElementById("emailList2");

async function createProject() {
    const projectName = document.querySelector("#projectName").value;
    const projectDateStart = document.querySelector("#start_date").value;
    const projectDateEnd = document.querySelector("#end_date").value;
    const projectImg = document.querySelector("#proImg");
    const projectOverview = document.querySelector("#proIntro").value;

    const token = localStorage.getItem("token");

    let imgSelected = false;

    if (projectName === "") {
        alert("프로젝트 이름을 작성해주세요.");
        return;
    }
    if (projectDateStart === "") {
        alert("프로젝트 시작 날짜를 입력해주세요.");
        return;
    }
    if (projectDateEnd === "") {
        alert("프로젝트 마감 날짜를 입력해주세요.");
        return;
    }

    if (projectImg.files[0] === undefined) {
        alert("프로젝트 이미지를 첨부해주세요.");
        return;
    }

    if (projectOverview === "") {
        alert("프로젝트 소개글을 작성해주세요.");
        return;
    }

    const formData = new FormData();
    if (projectImg.files[0] !== undefined) {
        imgSelected = true;
        formData.append("project_img", projectImg.files[0]);
    }

    formData.append("project_name", projectName);
    formData.append("start_date", projectDateStart);
    formData.append("end_date", projectDateEnd);
    formData.append("member_id", JSON.stringify(inviteUser));
    // 임의로 넣어준 값
    formData.append("send_img", imgSelected);
    formData.append("overview", projectOverview);

    const careateProjectResponse = await axios({
        method: "post",
        url: "/api/project/create",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });

    const { success, result, token: newToken } = careateProjectResponse.data;

    if (success) {
        localStorage.setItem("token", newToken);
        document.location.href = `/project/home`;
    } else {
        alert("프로젝트 생성에 실패하였습니다.");
    }
}

// 1. axios를 쓰기 전에 값을 가져온다
const inviteUser = [];
async function addEmail() {
    const projectEmail = document.getElementById("email-write").value;

    const token = localStorage.getItem("token");

    const emailInviteRespond = await axios({
        method: "post",
        url: "/api/user/find",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            email: projectEmail,
        },
    });
    const { success, result } = emailInviteRespond.data;

    if (success) {
        inviteUser.push(result.id);
        const listItem = document.createElement("li");
        listItem.classList.add("liEmail");
        listItem.textContent = projectEmail;
        emailList2.appendChild(listItem);
        alert("프로젝트 멤버를 초대하였습니다.");
        emailInput.value = "";
    } else {
        alert("본인이나 등록되지 않은 사용자는 초대할 수 없습니다.");
    }
}
