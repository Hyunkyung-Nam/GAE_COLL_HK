let today = new Date();

let month = today.getMonth() + 1;
let date = today.getDate();

const header_today = `TODAY ${month}월 ${date}일`;

document.getElementById('now_date').innerHTML = header_today;
