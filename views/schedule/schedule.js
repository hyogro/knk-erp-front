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
        if (info.event.extendedProps.type === 'schedule') {
            request('GET', getURL('schedule', info.event.id), drawDetail);
        } else if (info.event.extendedProps.type === 'vacation') {
            request('GET', getURL('vacation', info.event.id), drawDetail);
        }
    }
});
calendar.render();
drawCalendar('all dep own');

function drawDetail(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSD001' || res.code === 'RV001') {
        $("#scheduleTitle").text(res.data.title);
        let start = res.data.startDate.split("T");
        let end = res.data.endDate.split("T");
        $("#scheduleTime").html("시작: " + start[0] + " 🕒" + start[1] +
            "<br> 종료: " + end[0] + " 🕒" + end[1]);
        $("#scheduleMemo").text(res.data.memo);
    } else if (res.code === 'RSD001' || res.code === 'RV002') {
        alert("조회 실패");
    }
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
        request('GET', 'vacation', setVacationList);
    }
}

//달력 일정 셋팅
function setScheduleList(res) {
    console.log(res.data);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSL001') {
        for (let i = 0; i < res.data.length; i++) {
            let color = '#3788d8';
            if (res.data[i].viewOption === "dep") {
                color = '#e09222';
            } else if (res.data[i].viewOption === "own") {
                color = '#d46d8c';
            }
            addEvent(res.data[i], 'schedule', color);
        }
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
        for (let i = 0; i < res.data.length; i++) {
            if (!(res.data[i].reject) && (res.data[i].approval1) && (res.data[i].approval2)) {
                addEvent(res.data[i], 'vacation', '#198754');
            }
        }
    } else if (res.code === 'RVL002') {
        alert("휴가조회 실패");
    }
}

//달력 이벤트 추가
function addEvent(data, type, color) {
    let schedule = {};
    schedule.id = data.id;
    schedule.title = data.title;
    schedule.memo = data.memo;
    schedule.start = data.startDate;
    schedule.end = data.endDate;
    schedule.type = type;
    schedule.color = color;
    schedule.rendering = "background";

    calendar.addEvent(schedule);
}