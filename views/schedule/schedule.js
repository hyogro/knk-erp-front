let calendarEl = document.getElementById('calendar');
let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ko',
    eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    },
    dayMaxEventRows: true,
    views: {
        timeGrid: {
            dayMaxEventRows: 6
        }
    },
    fixedWeekCount: false,
    height: 800,
    eventClick: function (info) {
        if (info.event.extendedProps.type === 'schedule') {
            new bootstrap.Modal(document.getElementById('scheduleModal')).show();
            request('GET', getURL('schedule', info.event.id), detailScheduleView);
        } else if (info.event.extendedProps.type === 'vacation') {
            new bootstrap.Modal(document.getElementById('vacationModal')).show();
            request('GET', getURL('vacation', info.event.id), detailVacationView);
        }
    }
});
calendar.render();
drawCalendar('all dep own');

//이전달
$(".fc-prev-button").click(function () {
    chkViewOption();
});
//다음달
$(".fc-next-button").click(function () {
    chkViewOption();
});

//체크값 전달
function chkViewOption() {
    let viewOptionArr = [];
    $('input:checkbox[name="viewOption"]').each(function () {
        viewOptionArr.push(this.value);
    });
    let viewOption = viewOptionArr.join(" ");

    drawCalendar(viewOption);
}

//달력에 한달 일정 셋팅
function drawCalendar(viewOption) {
    calendar.removeAllEvents();

    //전체일정 조회
    if (!(isEmpty(viewOption))) {
        let sendData = new Object();
        sendData.viewOption = viewOption;
        sendData.startDate = $(".fc-scrollgrid-sync-table tr:first-child .fc-daygrid-day:first-child").data("date") + "T00:00:00";
        sendData.endDate = $(".fc-scrollgrid-sync-table tr:last-child .fc-daygrid-day:last-child").data("date") + "T11:59:59";

        request('GET', getURL('schedule', sendData), setScheduleList);
    }

    //휴가일정 조회
    if ($("#checkViewOptionVac").is(":checked")) {
        request('GET', 'vacation', setVacationList);
    }
}

//달력 일정 셋팅 - 근무일정
function setScheduleList(res) {
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
        console.log("일정목록 조회 실패");
    }
}

//달력 일정 셋팅 - 휴가
function setVacationList(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].reject || (res.data[i].approval1 && res.data[i].approval2)) {
                addEvent(res.data[i], 'vacation', '#198754');
            }
        }
    } else if (res.code === 'RVL002') {
        console.log("휴가조회 실패");
    }
}

//달력 이벤트 추가
function addEvent(data, type, color) {
    let schedule = {};
    schedule.id = data.id;
    schedule.title = (type === 'vacation') ? data.type : data.title;
    schedule.memo = data.memo;
    schedule.start = data.startDate;
    schedule.end = data.endDate;
    schedule.type = type;
    schedule.color = color;
    schedule.rendering = "background";

    calendar.addEvent(schedule);
}

//일정 상세보기
function detailScheduleView(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSD001') {
        console.log(res);
        //읽기전용
        $('input').prop('readonly', true);
        $('textarea').prop('readonly', true);
        $('option').attr('disabled', true);

        $("#scheduleTitle").val(res.data.title);
        $("#scheduleMember").val(res.data.memberName);
        $("#scheduleViewOption").val(res.data.viewOption);
        let start = res.data.startDate.split("T");
        $("#scheduleStartDate").val(start[0]);
        $("#scheduleStartTime").val(start[1]);
        let end = res.data.endDate.split("T");
        $("#scheduleEndDate").val(end[0]);
        $("#scheduleEndTime").val(end[1]);
        $("#scheduleMemo").val(res.data.memo);
        $("#scheduleMemoTextCnt").text("(" + $("#scheduleMemo").val().length + " / 255)");
    } else if (res.code === 'RSD001') {
        console.log("일정 상세 조회 실패");
    }
}

function detailVacationView(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVD001') {
        $("#vacationType").text(res.data.type);
        let start = res.data.startDate.split("T");
        $("#vacationStart").text(start[0]);
        let end = res.data.endDate.split("T");
        $("#vacationEnd").text(end[0]);
        $("#vacationMemo").text(res.data.memo);
    } else if (res.code === 'RVD002') {
        console.log("휴가 상세 조회 실패");
    }
}