//월별 주차 계산
function getWeekCountOfMonth() {
    let date = new Date();
    let weekCnt = Math.ceil((date.getDate() + 1) / 7);
    let month = new String(date.getMonth() + 1);

    return month + "월 " + weekCnt.toString() + "주차"
}

//빈값 체크
function isEmpty(val) {
    return val == null || val === '';
}

//날짜 년, 월, 일 배열
function getTodayArr(date) {
    let dateArr = [];

    dateArr[0] = date.getFullYear();
    dateArr[1] = (1 + date.getMonth());
    dateArr[2] = date.getDate();
    dateArr[3] = date.getHours();
    dateArr[4] = date.getMinutes();
    dateArr[5] = date.getSeconds();

    let week = new Array('일', '월', '화', '수', '목', '금', '토');
    dateArr[6] = week[date.getDay()];

    return dateArr;
}

//날짜
function getToday(date) {
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = date.getHours(); // 시
    let minutes = date.getMinutes();  // 분
    let seconds = date.getSeconds();  // 초

    return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}
