const tbody = document.querySelector("tbody");
// const token = localStorage.getItem("token");

(async function () {
    //페지네이션 goToPage 함수 정의
    async function goToPage(page) {
        const res = await axios({
            method: "get",
            url: `/api/project/issue/list?page=${page}&pageSize=${pageSize}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        tbody.innerHTML = ""; //페이지 번호에 해당하는 issue들 할당해주기 위한 초기 테이블값 초기화

        //issue[i].userId = i번째 이슈 작성자
        for (let i = 0; i < res.data.result.length; i++) {
            const userId = res.data.result[i].userId;

            const res2 = await axios({
                method: "POST",
                url: "/api/user/findInfo",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    userId: userId,
                },
            });

            //issue[i].userId를 가진 작성자
            const userName = res2.data.result.user_name;

            //[i]번째 이슈글 출력
            const html = `
                <tr>
                    <td>${(page - 1) * 10 + i + 1}</td>
                    <td><a href="/project/issue_content/${res.data.result[i].id}">${res.data.result[i].title}</a></td>
                    <td>${userName}님</td>
                    <td>${res.data.result[i].issue_date}</td>
                </tr>`;
            tbody.insertAdjacentHTML("beforeend", html);
        }
    }

    const prevGroupButt = document.getElementById("prevGroupButton");
    const nextGroupButt = document.getElementById("nextGroupButton");

    prevGroupButt.addEventListener("click", function () {
        goToPrev(pageGroup);
    });
    nextGroupButt.addEventListener("click", function () {
        goToNext(pageGroup);
    });

    //goToPrev 함수 정의
    const goToPrev = (pageGroup) => {
        if (pageGroup > 1) {
            pageGroup -= 1;
        }
        firstPageOfGroup = (pageGroup - 1) * 5 + 1;
        lastPageOfGroup = pageGroup * 5;
        if (lastPageOfGroup > totalPages) {
            lastPageOfGroup = totalPages;
        }

        pageNumberBox.replaceChildren();

        for (let i = firstPageOfGroup; i <= lastPageOfGroup; i++) {
            const pageNumber = document.createElement("span");
            pageNumber.innerText = i;
            pageNumber.addEventListener("click", () => {
                goToPage(i);
            });
            pageNumberBox.appendChild(pageNumber);
        }
        return goToPage(firstPageOfGroup);
    };

    //goToNext 함수 정의
    const goToNext = (pageGroup) => {
        if (pageGroup < totalPages) {
            pageGroup += 1;
            firstPageOfGroup = (pageGroup - 1) * 5 + 1;
            lastPageOfGroup = pageGroup * 5;

            if (lastPageOfGroup > totalPages) {
                lastPageOfGroup = totalPages;
            }

            pageNumberBox.replaceChildren();

            for (let i = firstPageOfGroup; i <= lastPageOfGroup; i++) {
                const pageNumber = document.createElement("span");
                pageNumber.innerText = i;
                pageNumber.addEventListener("click", () => {
                    goToPage(i);
                });
                pageNumberBox.appendChild(pageNumber);
            }
        }
        return goToPage(firstPageOfGroup);
    };

    // 페이지 갯수만큼 페이지 숫자 버튼 생성
    const res3 = await axios({
        method: "get",
        url: `/api/project/issue/list?page=1&pageSize=10`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const page = res3.data.pagination.page; // 현재 페이지
    const pageSize = res3.data.pagination.pageSize; // limit
    const totalPages = res3.data.pagination.totalPages; // 페이지 전체 개수
    const totalIssues = res3.data.pagination.totalIssues;

    // const table = document.querySelectorAll("table");
    const tableBox = document.getElementById("issue-contain-main");

    let pageGroup = Math.ceil(page / pageSize); // 페이지 그룹
    //어떤 한 페이지 그룹의 첫번째 페이지 번호 = ((페이지 그룹 - 1) * 한 화면에 보여질 페이지 개수) + 1
    let firstPageOfGroup = (pageGroup - 1) * 5 + 1;
    //어떤 한 페이지 그룹의 마지막 페이지 번호 = 페이지 그룹 * 한 화면에 보여질 페이지 개수
    let lastPageOfGroup = pageGroup * 5;
    if (lastPageOfGroup > totalPages) {
        lastPageOfGroup = totalPages;
    }

    const paginationBox = document.getElementById("paginationBox");
    const announceTxt = document.querySelector("#announceTxt");
    if (totalIssues === "" || totalIssues === null || totalIssues === undefined || totalIssues === 0) {
        announceTxt.textContent = "작성된 이슈가 없습니다.";
        tableBox.style.visibility = "hidden";
        nextGroupButt.style.visibility = "hidden";
        prevGroupButt.style.visibility = "hidden";
        paginationBox.style.visibility = "hidden";
    } else {
        tableBox.style.visibility = "visible";
        announceTxt.textContent = "";
        nextGroupButt.style.visibility = "visible";
        prevGroupButt.style.visibility = "visible";
        paginationBox.style.visibility = "visible";
    }

    const pageNumberBox = document.getElementById("pageNumber");
    pageNumberBox.replaceChildren(); // 페이지 버튼 초기화

    for (let i = firstPageOfGroup; i <= lastPageOfGroup; i++) {
        const pageNumber = document.createElement("span");
        pageNumber.innerText = i;
        pageNumber.addEventListener("click", () => {
            goToPage(i);
        });
        pageNumberBox.appendChild(pageNumber);
    }

    // 새로고침하면 초기 페이지 로드
    goToPage(1);
})();

//검색
async function searchFunc() {
    const type = document.getElementById("type").value;
    const keyword = document.getElementById("keyword").value;

    async function goToPage(page) {
        const res = await axios({
            method: "get",
            url: `/api/project/issue/search?page=${page}&pageSize=10&type=${type}&keyword=${keyword}`,
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
        });

        tbody.innerHTML = "";

        for (let i = 0; i < res.data.result.length; i++) {
            const userId = res.data.result[i].userId;

            const res2 = await axios({
                method: "POST",
                url: "/api/user/info",
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
                data: {
                    userId: userId,
                },
            });

            const userName = res2.data.result.user_name;

            const html = `
                    <tr>
                        <td>${(page - 1) * 10 + i + 1}</td>
                        <td><a href="/project/issue_content/${res.data.result[i].id}">${
                res.data.result[i].title
            }</a></td>
                        <td>${userName}님</td>
                        <td>${res.data.result[i].issue_date}</td>
                    </tr>`;
            tbody.insertAdjacentHTML("beforeend", html);
        }
    }

    document.getElementById("prevGroupButton").addEventListener("click", function () {
        goToPrev(pageGroup);
    });
    document.getElementById("nextGroupButton").addEventListener("click", function () {
        goToNext(pageGroup);
    });

    //goToPrev 함수 정의
    const goToPrev = (pageGroup) => {
        if (pageGroup > 1) {
            pageGroup -= 1;
        }
        firstPageOfGroup = (pageGroup - 1) * 5 + 1;
        lastPageOfGroup = pageGroup * 5;
        if (lastPageOfGroup > totalPages) {
            lastPageOfGroup = totalPages;
        }

        pageNumberBox.replaceChildren();

        for (let i = firstPageOfGroup; i <= lastPageOfGroup; i++) {
            const pageNumber = document.createElement("span");
            pageNumber.innerText = i;
            pageNumber.addEventListener("click", () => {
                goToPage(i);
            });
            pageNumberBox.appendChild(pageNumber);
        }
        return goToPage(firstPageOfGroup);
    };

    //goToNext 함수 정의
    const goToNext = (pageGroup) => {
        if (pageGroup < totalPages) {
            pageGroup += 1;
            firstPageOfGroup = (pageGroup - 1) * 5 + 1;
            lastPageOfGroup = pageGroup * 5;

            if (lastPageOfGroup > totalPages) {
                lastPageOfGroup = totalPages;
            }

            pageNumberBox.replaceChildren();

            for (let i = firstPageOfGroup; i <= lastPageOfGroup; i++) {
                const pageNumber = document.createElement("span");
                pageNumber.innerText = i;
                pageNumber.addEventListener("click", () => {
                    goToPage(i);
                });
                pageNumberBox.appendChild(pageNumber);
            }
        }
        return goToPage(firstPageOfGroup);
    };

    const res3 = await axios({
        method: "get",
        url: `/api/project/issue/search?page=1&pageSize=10&type=${type}&keyword=${keyword}`,
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
    });

    const page = res3.data.pagination.page;
    const pageSize = res3.data.pagination.pageSize;
    const totalPages = res3.data.pagination.totalPages;

    let pageGroup = Math.ceil(page / pageSize); // 페이지 그룹
    //어떤 한 페이지 그룹의 첫번째 페이지 번호 = ((페이지 그룹 - 1) * 한 화면에 보여질 페이지 개수) + 1
    let firstPageOfGroup = (pageGroup - 1) * 5 + 1;
    //어떤 한 페이지 그룹의 마지막 페이지 번호 = 페이지 그룹 * 한 화면에 보여질 페이지 개수
    let lastPageOfGroup = pageGroup * 5;
    if (lastPageOfGroup > totalPages) {
        lastPageOfGroup = totalPages;
    }

    const pageNumberBox = document.getElementById("pageNumber");
    pageNumberBox.replaceChildren(); // 페이지 버튼 초기화

    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement("span");
        pageNumber.innerText = i;
        pageNumber.addEventListener("click", () => {
            goToPage(i);
        });
        pageNumberBox.appendChild(pageNumber);
    }

    goToPage(1); // 초기 페이지 로드
}
//반복문으로 배열 풀어내기
