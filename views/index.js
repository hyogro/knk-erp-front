setBoardData();

//전체 정보 조회
function setBoardData() {
    let todayArr = getTodayArr(new Date());
    $("#today").text(todayArr[0] + "년 " + todayArr[1] + "월 " + todayArr[2] + "일 (" + todayArr[6] + ")");

    //부서정보 조회
    request('GET', 'department/readDepartmentNameAndMemberCount', setDepartmentInfo);
    //일정요약(출퇴근), 휴가요약(출퇴근) 조회
    request('GET', 'attendance/summary', setAttendanceSummary);

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

        $("#onWork").text(res.data.onWork.length);
        $("#lateWork").text(res.data.lateWork.length);
        $("#yetWork").text(res.data.yetWork.length);
        $("#offWork").text(res.data.offWork.length);
        $("#vacation").text(res.data.vacation.length);

        $("#onWork").parent().click(function () {
            setSelectedList(this, "출근", res.data.onWork);
        });
        $("#lateWork").parent().click(function () {
            setSelectedList(this, "지각", res.data.lateWork);
        });
        $("#yetWork").parent().click(function () {
            setSelectedList(this, "미출근", res.data.yetWork);
        });
        $("#offWork").parent().click(function () {
            setSelectedList(this, "퇴근", res.data.offWork);
        });
        $("#vacation").parent().click(function () {
            setSelectedList(this, "휴가", res.data.vacation);
        });
    } else if (res.code === 'RAS002') {
        console.log("일정요약 조회 실패");
    } else if (res.code === 'RAS003') {
        $(".attendance-board").hide();
        console.log("일정요약 조회 실패\n권한이 없습니다.");
    }
}

function setSelectedList(select, type, data) {
    $(".col-md").removeClass('active');
    $(select).addClass('active');

    $("#selectedList").empty();

    if (data.length === 0) {
        $("#selectedList").html('<tr><td colspan="3">내역이 없습니다.</td></tr>')
    }

    //부서 이름으로 정렬
    data = data.sort(function (a, b) {
        let x = a.departmentName.toLowerCase();
        let y = b.departmentName.toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });

    $("#logTitle").text(type);

    if (type === "출근") { //출근
        $("#logTitle").css("color", "#1354d9");
    } else if (type === "지각") { //지각
        $("#logTitle").css("color", "#f3a01a");
    } else if (type === "미출근") { //미출근
        $("#logTitle").css("color", "#6c6c6c");
    } else if (type === "퇴근") { //퇴근
        $("#logTitle").css("color", "#ea0404");
    } else if (type === "휴가") { //휴가
        $("#logTitle").css("color", "#01853d");
    }

    for (let i = 0; i < data.length; i++) {
        let html = '';
        html += '<tr>' +
            '<td>' + data[i].departmentName + '</td>' +
            '<td>' + data[i].memberName + '(' + data[i].memberId + ')</td>';

        if (type === "출근" || type === "지각") {
            html += '<td>출근: ' + data[i].onWork + '</td>';
        } else if (type === "미출근") {
            html += '<td>기록 없음</td>';
        } else if (type === "퇴근") {
            html += '<td>출근: ' + data[i].onWork + ' / 퇴근: ' + data[i].offWork + '</td>';
        } else if (type === "휴가") {
            html += '휴가: ' + data[i].vacationStartDate + '~' + data[i].vacationEndDate + '</td>';
        }
        html += '</tr>';

        $("#selectedList").append(html);
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

//출,퇴근 기록
function checkWork(type) {
    let allowIP = '61.42.17.186'; // 허용할 IP
    let remoteIp = ip(); // 사용자 IP

    if (allowIP === remoteIp) {
        if (type === 'onWork') {
            request('POST', 'attendance/onWork', onWork);
        } else if (type === 'offWork') {
            request('POST', 'attendance/offWork', offWork);
        } else {
            alert('올바른 요청이 아닙니다.');
        }
    } else {
        alert('요청하신 주소: ' + remoteIp + ' 에서는 출/퇴근 기록을 할 수 없습니다.');
    }
}

//출근 기록 찍기
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

//퇴근 기록 찍기
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
    if (res.code === null) {
        return;
    }
    if (res.code === 'NBL001') {
        for (let i = 0; i < res.page.content.length; i++) {
            let data = res.page.content[i];
            let html = '';
            html += '<tr>' +
                '<td>' + data.board_idx + '</td>' +
                '<td class="board-title" onclick="getNoticeDetail(' + data.board_idx + ')">' +
                data.title + '</td>' +
                '<td>' + data.writerMemberName + '</td>' +
                '<td>' + getToday(data.createDate.split("T")[0]) + '</td>' +
                '</tr>';
            $("#noticeList").append(html);
        }
    } else if (res.code === 'NBL002') {
        console.log("공지사항 조회 실패");
    }
}

//공지 상세
function getNoticeDetail(idx) {
    location.href = '/board/notice/view?id=' + idx;
}

//매뉴얼 다운로드
function downloadManual() {
    location.href = '<%= fileApi %>' + 'user_manual.pdf';
}