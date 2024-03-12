(function () {
    axios({
        method: "POST",
        url: "/api/user/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        console.log("res data결과", res.data);
        const { user_name, id } = res.data.result;
        document.querySelector(".userId").value = id;
        document.querySelector(".writer_box").innerHTML = user_name;
        document.getElementById("issue_date").value = new Date().toISOString().slice(0, 10);
    });
})();

//코드 블록
async function codeBlockFunc() {
    const content = document.getElementById("content");
    const newCode = document.createElement("code");
    const span = document.createElement("span");

    span.innerHTML = "&nbsp&nbsp";
    newCode.innerHTML = "&nbsp코드를 입력하세요.&nbsp";
    span.style.color = "black";
    span.style.backgroundColor = "none";
    content.append(newCode);
    content.insertBefore(span, newCode);
    content.append(span);
}

async function submitFunc() {
    try {
        const content = document.getElementById("content").innerHTML;
        const issue_date = document.querySelector(".issueDate").value;
        const title = document.querySelector(".title_box").textContent;
        const userId = document.querySelector(".userId").value;

        //파일 불러오기
        const fileInput = document.getElementById("files");
        const formData = new FormData();

        formData.append("content", content);
        formData.append("issue_date", issue_date);
        formData.append("title", title);
        formData.append("projectId", "1"); // 로컬 스토리지 가져오기
        formData.append("userId", userId);

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("issue_files", fileInput.files[i]);
        }

        // console.log("files", fileInput.files[0]);
        // console.log("formData", formData);

        const res = await axios({
            method: "POST",
            url: "/api/project/issue",
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        // console.log(res);
        document.location.href = "issue_main";
    } catch (error) {
        console.error(error);
    }
}

window.onload = function () {
    target = document.getElementById("files"); // file 아이디 선언
    target.addEventListener("change", function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            let filenames = "";
            for (let i = 0; i < target.files.length; i++) {
                filenames += target.files[i].name + "&nbsp&nbsp&nbsp&nbsp";
            }
            $("#origin_name").html(filenames);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $("#origin_name").html("");
        }
    });
};
