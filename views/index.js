setBoardData();


//전체 정보 조회
function setBoardData() {
    let todayArr = getTodayArr(new Date());
    $("#today").text(todayArr[0] + "년 " + todayArr[1] + "월 " + todayArr[2] + "일 (" + todayArr[6] + ")");

    //부서정보 조회
    request('GET', 'department/readDepartmentNameAndMemberCount', setDepartmentInfo);
    //일정요약(출퇴근) 조회
    request('GET', 'attendance/summary', setAttendanceSummary);
    //휴가요약(출퇴근) 조회
    request('GET', 'vacation/summary', setVacationSummary);
    //출퇴근기록 조회
    request('GET', 'attendance/today', setWorkBoard);
    //공지사항 최근 5개 조회
    request('GET', 'board/noticeLatest', setNoticeList);

    let scheduleSendData = {};
    scheduleSendData.viewOption = 'all dep own';

    //주간일정 조회
    setCalendar();
    getAttendanceList();
}

function getAttendanceList() {
    let sendData = new Object();

    sendData.viewOption = 'all dep own';
    let start = getTodayArr(new Date(new Date().setDate(new Date().getDate() - 7)));
    sendData.startDate = start[0] + "-" + start[1] + "-" + start[2] + "T00:00:00";
    let end = getTodayArr(new Date(new Date().setDate(new Date().getDate() + 7)));
    sendData.endDate = end[0] + "-" + end[1] + "-" + end[2] + "T11:59:59";

    request('GET', getURL('schedule', sendData), setScheduleList);
}

//부서정보 조회
function setDepartmentInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDAM001') {
        $("#departmentName").text(res.data.departmentName);
        $("#memberCount").text(res.data.memberCount);
    } else if (res.code === 'RDAM002') {
        console.log("부서정보 조회 실패");
    } else if (res.code === 'RDAM003') {
        alert("부서정보 조회 실패\n소속된 부서가 존재하지 않습니다.");
    }
}

//일정요약(출퇴근) 조회
function setAttendanceSummary(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAS001') {
        $(".attendance-board").css('display', 'flex');
        $("#onWork").text(res.data.onWork);
        $("#yetWork").text(res.data.yetWork);
        $("#lateWork").text(res.data.lateWork);
    } else if (res.code === 'RAS002') {
        console.log("일정요약 조회 실패");
    } else if (res.code === 'RAS003') {
        $(".attendance-board").hide();
        console.log("일정요약 조회 실패\n권한이 없습니다.");
    }
}

//일정요약(출퇴근) 조회
function setVacationSummary(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVS001') {
        $("#vacation").text(res.data.vacation);
    } else if (res.code === 'RVS002') {
        console.log("휴가요약 조회 실패");
    } else if (res.code === 'RVS003') {
        $(".attendance-board").hide();
        console.log("휴가요약 조회 실패\n권한이 없습니다.");
    }
}

//주간일정 조회
function setScheduleList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSL001') {
        let scheduleArr = new Array();
        for (let i = 0; i < res.data.length; i++) {
            var schedule = new Object();

            schedule.title = res.data[i].title;
            schedule.start = res.data[i].startDate;
            schedule.end = res.data[i].endDate;

            scheduleArr.push(schedule);
        }
        setCalendar(scheduleArr);

    } else if (res.code === 'RSL002') {
        console.log("일정목록 조회 실패");
    }
}

//fullcalendar - 셋팅
function setCalendar(data) {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listWeek',
        locale: 'ko',
        events: data,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    });
    calendar.render();
}

//출근 기록
function onWork(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'ON001') {
        alert("출근이 기록되었습니다.");
        location.reload();
    } else if (res.code === 'ON002') {
        alert("출근 기록 실패");
    } else if (res.code === 'ON003') {
        alert("이미 출근 기록이 존재합니다.");
    } else if (res.code === 'ON004') {
        alert("권한이 없습니다.");
    }
}

//퇴근 기록
function offWork(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'OFF001') {
        alert("퇴근이 기록되었습니다.");
        location.reload();
    } else if (res.code === 'OFF002') {
        alert("퇴근 기록 실패");
    } else if (res.code === 'OFF003') {
        alert("이미 퇴근 기록이 존재합니다.");
    } else if (res.code === 'OFF004') {
        alert("권한이 없습니다.");
    } else if (res.code === 'OFF005') {
        alert("출근 기록이 존재하지 않습니다.");
    }
}

//출퇴근기록
function setWorkBoard(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RA001') {
        $("#onWorkTime").text(res.data.onWork);
        $("#offWorkTime").text(res.data.offWork);
    } else if (res.code === 'RA002') {
        console.log("출근기록 조회 실패");
    } else if (res.code === 'RA003') {
        console.log("출근기록 조회 실패\n출근정보 존재하지 않음");
    }
}

//공지 리스트
function setNoticeList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'NBL001') {
        $("#noticeList").empty();
        for (let i = 0; i < res.page.content.length; i++) {
            let data = res.page.content[i];
            let html = '';
            html += '<tr>' +
                '<td>' + data.board_idx +'</td>' +
                '<td class="notice-title">' + data.title +'</td>' +
                '<td>' + data.writerMemberName +'</td>' +
                '<td>' + getToday(data.createDate.split("T")[0]) +'</td>' +
                '</tr>';
            $("#noticeList").append(html);
        }
    } else if (res.code === 'NBL002') {
        console.log("공지사항 조회 실패");
    }
}