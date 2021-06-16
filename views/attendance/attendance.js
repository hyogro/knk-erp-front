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
    dateClick: function (info) {
        console.log('Clicked on: ' + info.dateStr);
        console.log('이벤트: ' + info.jsEvent);
    }
});
calendar.render();

getAttendanceList();

//이전달
$(".fc-prev-button").click(function () {
    getAttendanceList();
});
//다음달
$(".fc-next-button").click(function () {
    getAttendanceList();
});

function getAttendanceList() {
    let sendData = new Object();

    sendData.startDate = $(".fc-scrollgrid-sync-table tr:first-child .fc-daygrid-day:first-child").data("date");
    sendData.endDate = $(".fc-scrollgrid-sync-table tr:last-child .fc-daygrid-day:last-child").data("date");

    request('GET', getURL('attendance', sendData), setAttendanceList);
}

function setAttendanceList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAL001') {
        calendar.removeAllEvents();
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