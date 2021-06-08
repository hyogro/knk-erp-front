
//월별 주차 계산
function getWeekCountOfMonth() {
    let date = new Date();
    let weekCnt = Math.ceil((date.getDate() + 1) / 7);
    let month = new String(date.getMonth()+1);

    return month + "월 " + weekCnt.toString() + "주차"
}