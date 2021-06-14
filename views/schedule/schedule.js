let calendarEl = document.getElementById('calendar');
let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ko',
    eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    },
    eventClick: function (info) {
        getScheduleDetail(info.event.id)
    }
});
calendar.render();
drawCalendar('all dep own');

function getScheduleDetail(id){
    request('GET', getURL('schedule', id), drawDetail);
}
function drawDetail(res){
    $("#scheduleTitle").text(res.data.title);
    let start = res.data.startDate.split("T");
    let end = res.data.endDate.split("T");
    $("#scheduleTime").html("시작: " + start[0] + " 🕒" + start[1] +
        "<br> 종료: " + end[0] + " 🕒" + end[1]);
    $("#scheduleMemo").text(res.data.memo);
}

function checkViewOption() {
    let viewOptionArr = [];
    if ($("#checkViewOptionAll").is(":checked")) {
        viewOptionArr.push("all");
    }
    if ($("#checkViewOptionDep").is(":checked")) {
        viewOptionArr.push("dep");
    }
    if ($("#checkViewOptionOwn").is(":checked")) {
        viewOptionArr.push("own");
    }
    let viewOption = viewOptionArr.join(" ");
    drawCalendar(viewOption);
}

function drawCalendar(viewOption) {
    calendar.removeAllEvents();

    let scheduleSendData = {};
    scheduleSendData.viewOption = viewOption;
    scheduleSendData.page = 0;
    scheduleSendData.size = 100;

    //전체일정 조회
    if (!(isEmpty(viewOption))) {
        request('GET', getURL('schedule', scheduleSendData), setScheduleList);
    }

    //휴가일정 조회
    if ($("#checkViewOptionVac").is(":checked")) {
        request('POST', 'vacation/readVacationList', setVacationList);
    }
}

//달력 일정 셋팅
function setScheduleList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSL001') {
        addEvent(res.data);
    } else if (res.code === 'RSL002') {
        alert("일정목록 조회 실패");
    }
}

//달력 일정 셋팅
function setVacationList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        addEvent(res.data);
    } else if (res.code === 'RVL002') {
        alert("휴가조회 실패");
    }
}

//달력 이벤트 추가
function addEvent(data) {
    for (let i = 0; i < data.length; i++) {
        let schedule = {};
        schedule.id = data[i].id;
        schedule.title = data[i].title;
        schedule.memo = data[i].memo;
        schedule.start = data[i].startDate;
        schedule.end = data[i].endDate;

        calendar.addEvent(schedule);
    }
}