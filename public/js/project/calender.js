/* 375최소 사이즈 */
const now = new Date();
let job = [];
let isSelectedMyJob = false;

const make_calender = (now, isFirst) => {
    // date 객체에서 다양한 월을 가져올 수 있으면 해당하는 월에 대한 일, 요일 정보 가져올 수 있을듯?
    // 현재 월에 있는 일을 모두 가져올 수 있다면?
    const this_year = now.getFullYear();
    const this_month = now.getMonth();

    // 해당 월의 일만큼의 div 만들기 + 빈칸 포함(디폴트 값?)
    const current_last_date = new Date(this_year, this_month + 1, 0).getDate(); // 요번 달 일 수

    const first_day = new Date(this_year, this_month, 1).getDay(); // 요번 달 1일 되기 전 칸 수
    // 요번 달 마지막 날이 끝나고 칸 수가 남아 다음 달로 넘어가기 전 표시할 칸 수
    const current_last_day = current_last_date + first_day;
    const current_next_day = Math.ceil(current_last_day / 7) * 7;

    // 일과 요일이 어떻게 매칭이 되는지?
    // 첫 줄 첫 칸과 가장 마지막 줄 마지막 칸을 어떻게 정할 것인가?
    // 뒤로가기 혹은 앞으로 가기 버든을 눌렀을 때, 즉 이전 달 혹은 다음 달의 요일, 일을 보여주는 방법?

    const prev_month = now.getMonth();

    let container = ``;

    for (let i = 0; i < first_day; i++) {
        if (i === 0) {
            container += "<tr>";
        }
        container += `<td class='no_color'></td>`;
    }

    for (let i = 1; i <= current_last_date; i++) {
        if ((first_day + i) % 7 === 0) {
            //토요일
            container += `<td class='day_number blue' id="day${i}"><div class="td-inner" id="td-inner${i}"><div>${i}</div></div></td> </tr>`;
        } else if ((first_day + i) % 7 === 1) {
            //일요일
            container += `<tr> <td class='day_number red' id="day${i}"><div class="td-inner" id="td-inner${i}"><div>${i}</div></div></td>`;
        } else {
            container += `<td class='day_number' id="day${i}"><div class="td-inner" id="td-inner${i}"><div>${i}</div></div></td>`;
        }
    }

    for (let i = current_last_day; i < current_next_day; i++) {
        container += `<td class='no_color'></td>`;
        if (i === current_next_day - 1) {
            container += "</tr>";
        }
    }

    document.querySelector(`.date_board`).innerHTML = container;
    document.querySelector(`.calender_title`).innerText = `${this_year}년 ${this_month + 1}월`;
    if (isFirst) {
        setBoard(now);
    }
};

make_calender(now, true);

// 이전 달

document.querySelector(".prev").onclick = () => {
    make_calender(new Date(now.setMonth(now.getMonth() - 1)), true);
};

// 다음 달

document.querySelector(".next").onclick = () => {
    make_calender(new Date(now.setMonth(now.getMonth() + 1)), true);
};

//  팝업 달력
// function openPop() {
//     document.getElementById('pop_info_1').style.display = 'block';
// }

// 팝업 닫기
function closePop() {
    document.getElementById("pop_info_1").style.display = "none";
}

// const openModalBtn = document.getElementById("openModalBtn");
// const modal = document.getElementById("pop_info_1");
// const closeBtn = document.getElementsByClassName("close")[0];

// openModalBtn.addEventListener("click", function () {
//     modal.style.display = "block";
// });

// closeBtn.addEventListener("click", function () {
//     modal.style.display = "none";
// });

// window.addEventListener("click", function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// });

let todayMark = now.getDate();

// document.querySelector(".today").onclick = () => {
//     make_calender(new Date(now.setMonth(now.getMonth())), true);
// };

async function setBoard(now) {
    const this_year = now.getFullYear();
    const this_month = now.getMonth();
    let yearMonth = ""; //이번 년도 + 달
    if (this_month < 9) {
        yearMonth = `${String(this_year)}-0${String(this_month + 1)}-`;
    } else {
        yearMonth = `${String(this_year)}-${String(this_month + 1)}-`;
    }
    //현재 달의 보드 가져오기
    try {
        const token = localStorage.getItem("token");

        const getBoardMonthResult = await axios({
            method: "get",
            url: "/api/project/board/get/month",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                YYYYMM: yearMonth,
            },
        });
        const { success, result } = getBoardMonthResult.data;
        if (success) {
            job = result;
            isSelectedMyJob
                ? drawBoard(
                      job.filter((data) => data.is_mine === true),
                      yearMonth
                  )
                : drawBoard(result, yearMonth);
        }
    } catch (error) {
        console.log("캘린더 이번달 보드 가져오기 오류", error);
    }
}
//보드 상태에 따른 값 저장
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
function showMyJob() {
    isSelectedMyJob = true;
    let yearMonth = document.getElementById("openModalBtn").textContent;
    yearMonth = yearMonth.replace("년 ", "-");
    yearMonth = yearMonth.replace("월", "-");

    if (yearMonth.length === 7) {
        yearMonth = yearMonth.replace("-", "-0");
    }
    const myJob = job.filter((data) => data.is_mine === true);
    removeBoard(false);
    drawBoard(myJob, yearMonth);
}
function showTeamJob() {
    isSelectedMyJob = false;
    let yearMonth = document.getElementById("openModalBtn").textContent;
    yearMonth = yearMonth.replace("년 ", "-");
    yearMonth = yearMonth.replace("월", "-");

    if (yearMonth.length === 7) {
        yearMonth = yearMonth.replace("-", "-0");
    }
    removeBoard(false);
    drawBoard(job, yearMonth);
}

function removeBoard(set) {
    let yearMonth = document.getElementById("openModalBtn").textContent;
    yearMonth = yearMonth.replace("월", "");
    const year = yearMonth.split("년 ")[0];
    const month = yearMonth.split("년 ")[1];

    const current_last_date = new Date(year, month, 0); // 요번 달 일 수

    make_calender(current_last_date, set);
}
function goToday() {
    make_calender(new Date(), true);
}
function drawBoard(result, yearMonth) {
    for (let i = 0; i < result.length; i++) {
        const day = Number(result[i].deadline.replace(yearMonth, ""));
        const dayBox = document.getElementById(`td-inner${day}`);
        const newDiv = document.createElement("div");
        newDiv.classList.add("inner");
        const manufactureData = switchStatus(result[i].status);
        newDiv.innerHTML = `
        <button type="button" id="bg_${manufactureData.color}" class="board-btn" onclick="goBoardContent(${result[i].id})">
        <div class="board-txt">${result[i].title}</div>
        </button>
        `;
        dayBox.appendChild(newDiv);
    }
}
function goBoardContent(boardId) {
    document.location.href = `/project/board_content/${boardId}`;
}
function writeBoard() {
    document.location.href = "/project/board_write";
}
