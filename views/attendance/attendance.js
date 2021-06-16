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
    height: 700,
    eventClick: function (info) {
        // if (info.event.extendedProps.type === 'schedule') {
        //     request('GET', getURL('schedule', info.event.id), drawDetail);
        // } else if (info.event.extendedProps.type === 'vacation') {
        //     request('GET', getURL('vacation', info.event.id), drawDetail);
        // }
    }
});
calendar.render();

request('GET', 'attendance', setAttendanceList);

function setAttendanceList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAL001') {
        for (let i = 0; i < res.data.length; i++) {
            if (!isEmpty(res.data[i].onWork)) {
                addEvent(res.data[i], "출근", res.data[i].onWork, "#3788d8");
            }
            if (!isEmpty(res.data[i].offWork)) {
                addEvent(res.data[i], "퇴근", res.data[i].offWork, "#ec2323");
            }
        }
    } else if (res.code === 'RAL002') {
        console.log("출퇴근 목록 조회 실패");
    }
}

//달력 이벤트 추가
function addEvent(data, type, time, color) {
    let schedule = {};
    schedule.id = data.id;
    schedule.title = type;
    schedule.start = data.attendanceDate + "T" + time;
    schedule.color = color;
    schedule.rendering = "background";

    calendar.addEvent(schedule);
}