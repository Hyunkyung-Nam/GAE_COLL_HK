// const token = localStorage.getItem("token");
// const token =
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzA5NzM4NDQ0LCJleHAiOjE3MDk4MjQ4NDR9.s7E14MGuxf73cKcaexLyg9OWSTiNZT4A31yLH4m_GcY";
//이슈 id
const ids = document.location.href.split("project/issue_content/");
const id = ids[1];

//댓글 작성
async function addCommentFunc() {
    try {
        const comment = document.getElementById("comment_write").innerHTML;
        const id = document.querySelector(".commentUserId").value; // 이슈 ID 가져오기
        const res = await axios({
            method: "post",
            url: `/api/project/issue/comment/${id}`, // 댓글 작성 API 엔드포인트
            headers: {
                Authorization: `Bearer ${token}`, // 토큰 추가
            },
            data: {
                comment,
            },
        });
        return location.reload(); // 페이지 새로고침
    } catch (error) {
        console.log(error);
    }
}

(async function () {
    // 이슈 정보 가져오기
    const res1 = await axios({
        method: "get",
        url: `/api/project/issue/detail/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { title, content, issue_date, files, createdAt, updatedAt, userId } = res1.data.result;
    document.getElementById("content").innerHTML = content;
    document.querySelector(".date_box").textContent = issue_date;
    document.querySelector(".title_box").textContent = title;
    document.querySelector(".userId").value = userId;

    const fileBox = document.querySelector(".file_box");

    // 파일 목록 표시
    if (files !== null && files !== "") {
        fileBox.innerHTML = "";
        const myfile = files.split(",");
        if (myfile && myfile.length > 0) {
            myfile.forEach((file) => {
                // 파일명
                const p = document.createElement("p");
                p.textContent = file;
                p.style.display = "inline-block";

                // 삭제 버튼
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.onclick = function (event) {
                    deleteFileFunc(event); // 파일 삭제 함수 호출
                };
                deleteButton.style.display = "inline-block";

                // 파일명과 삭제 버튼을 포함하는 div 요소 생성
                const newFileBox = document.createElement("div");
                newFileBox.classList.add("file");
                newFileBox.appendChild(p);
                newFileBox.appendChild(deleteButton); // 삭제 버튼 추가
                fileBox.appendChild(newFileBox);
            });
        }
    }

    // 유저 조회해서 이름(이슈 글 작성자) 가져오기
    const user_Id = document.querySelector(".userId").value;
    const res2 = await axios({
        method: "POST",
        url: "/api/user/findInfo",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            userId: user_Id,
        },
    });
    document.querySelector(".writer_box").innerHTML = res2.data.result.user_name;

    // 이슈 댓글 불러오기
    const res3 = await axios({
        method: "get",
        url: `/api/project/issue/comment/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const comments = res3.data.result;
    const commentList = document.querySelector(".comments");
    //axios에서 전체 comment 리스트를 가져올 때 중복되는 댓글인지 아니면 똑같은 댓글은 두 번 쓴 건지 아닌지 판별하기가 어려워서 아예 초기화 후 리스트 재출력
    commentList.innerHTML = ""; // 댓글 목록 초기화
    comments.forEach(async (comment) => {
        try {
            // 각각의 댓글 작성자, 이미지 가져오기
            const commentUserRes = await axios({
                method: "post",
                url: "/api/user/findInfo",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    userId: comment.userId,
                },
            });
            // 유저 정보에서 이미지와 이름 가져오기
            const { user_img, user_name } = commentUserRes.data.result;

            // 댓글을 표시할 HTML 요소 생성
            const li = document.createElement("li");

            // 유저 이미지 표시
            // div가 사이즈 관리하기 편리한데 출력이 안 돼서 img태그로 바꿈
            const userImage = document.createElement("img");
            userImage.classList.add("user_img");
            //파일 삭제한 경우엔 액박 뜸
            if (user_img === null || user_img === "" || user_img === undefined) {
                userImage.src = `../../../public/img/user-solid.svg`; //
            } else if (user_img.includes("http:") || user_img.includes("https://")) {
                userImage.src = user_img;
            } else {
                userImage.src = `../../../public/uploads/profile/${user_img}`;
            }

            // 작성자 이름 표시
            const userName = document.createElement("div");
            userName.classList.add("userName");
            userName.textContent = user_name;

            // 댓글 내용 표시
            const commentText = document.createElement("div");
            commentText.classList.add("comment");
            commentText.textContent = comment.comment; // 댓글 내용

            // 삭제 버튼
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteCommentButt");
            // 삭제 버튼 함수 로직
            deleteButton.onclick = async function () {
                try {
                    const res = await axios({
                        method: "delete",
                        url: `/api/project/issue/comment/${id}`, // 댓글 삭제 API 엔드포인트
                        headers: {
                            Authorization: `Bearer ${token}`, // 토큰 추가
                        },
                        data: { id: comment.id },
                    });
                    if (res.status === 200) {
                        // 성공적으로 삭제되면 화면에서 해당 댓글 제거
                        li.remove();
                    }
                } catch (error) {}
            };

            //css파일에서 flex랑 디자인 처리
            const commentContainer = document.createElement("div");
            commentContainer.classList.add("commentContainer");
            const nameAndText = document.createElement("div"); //이름하고 댓글 묶어줄 div
            nameAndText.classList.add("comment_nameAndText");
            nameAndText.appendChild(userName);
            nameAndText.appendChild(commentText);

            commentContainer.appendChild(userImage);
            commentContainer.appendChild(nameAndText);

            li.appendChild(commentContainer);
            li.appendChild(deleteButton); // 삭제 버튼
            commentList.appendChild(li);
        } catch (error) {
            console.log("Error fetching user info:", error);
        }
    });
})();

//코드 블록
async function codeBlockFunc() {
    const content = document.getElementById("content");
    const newCode = document.createElement("code");
    const span = document.createElement("span");

    span.innerHTML = "&nbsp&nbsp";
    newCode.textContent = "&nbsp코드를 입력하세요.&nbsp";
    content.appendChild(newCode);
    content.insertBefore(span, newCode);
    content.appendChild(span);
}

//파일 삭제
async function deleteFileFunc(event) {
    const fileName = event.target.parentElement.firstChild.textContent;

    try {
        const res = await axios({
            method: "delete",
            url: `/api/project/issue/detail/file/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                fileName,
            },
        });

        // 파일 삭제 요청에 성공한 경우에만 해당 파일 제거
        if (res.status === 200) {
            event.target.parentElement.remove();
        }
    } catch (error) {
        console.log(error);
    }
}

// 편집 도구들 활성화 함수
function editIssueFunc() {
    const content = document.getElementById("content");
    content.setAttribute("contenteditable", "true");
    content.style.backgroundColor = "#f0f0f0";

    const titleBg = document.getElementById("title_box");
    titleBg.setAttribute("contenteditable", "true");
    titleBg.style.backgroundColor = "#f0f0f0";

    const saveButt = document.getElementById("saveButt");
    const cancleButt = document.getElementById("cancleButt");
    saveButt.style.display = "block";
    cancleButt.style.display = "block";
    const codeBlock = document.getElementById("codingIcon");
    codeBlock.style.display = "block";

    const uploadBox = document.querySelector(".uploadBox");
    uploadBox.style.display = "block";

    const fileDeleteButt = document.querySelectorAll(".file button");
    fileDeleteButt.forEach((button) => {
        button.style.visibility = "visible";
    });
}

async function cancleFunc() {
    return location.reload();
}

async function saveFunc() {
    try {
        const contentEl = document.getElementById("content");
        const saveButt = document.getElementById("saveButt");
        contentEl.setAttribute("contenteditable", "false");
        saveButt.style.display = "none";

        const content = document.getElementById("content").innerHTML;
        const issue_date_text = document.querySelector(".date_box").textContent;
        const issue_date = new Date(issue_date_text);
        const title = document.querySelector(".title_box").textContent;
        const userId = document.querySelector(".userId").value;

        //파일 불러오기
        const fileInput = document.getElementById("files");
        const formData = new FormData();

        formData.append("content", content);
        formData.append("issue_date", issue_date);
        formData.append("title", title);
        // formData.append("projectId", "1"); //로컬 스토리지에서 가져오기
        formData.append("userId", userId);

        if (fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append("issue_files", fileInput.files[i]);
            }
        }

        const res = await axios({
            method: "patch",
            url: `/api/project/issue/detail/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        });

        if (!res.data.success) {
            alert("작성자만 수정할 수 있습니다.");
        }
        return location.reload();
    } catch (error) {
        console.log(error);
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

//댓글 작성
async function addCommentFunc() {
    try {
        const comment = document.getElementById("comment_write").textContent;
        const res = await axios({
            method: "post",
            url: `/api/project/issue/comment/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                comment,
            },
        });
        return location.reload();
    } catch (error) {
        console.log(error);
    }
}

//게시글 삭제
async function deleteIssueFunc() {
    try {
        if (!confirm("삭제하시겠습니까?")) {
            return;
        }
        const res = await axios({
            method: "delete",
            url: `/api/project/issue/detail/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.data.success) {
            document.location.href = "/project/issue_main";
        }
    } catch {
        console.log(error);
    }
}
