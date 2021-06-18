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
        $("#applyBtn").attr('data-empty', false);
        request('GET', getURL('attendance', info.event.id), detailAttendanceData);
    },
    dateClick: function (info) {
        let id = searchAttendanceDate(info.dateStr);
        if (!isEmpty(id)) {
            $("#applyBtn").attr('data-empty', false);
            $("#saveBtn").attr('data-target', id);
            request('GET', getURL('attendance', id), detailAttendanceData);
        } else {
            $("#applyBtn").attr('data-empty', true);
            emptyAttendanceData(info.dateStr);
        }
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

//한달 출석 정보 조회
function getAttendanceList() {
    let sendData = {};
    sendData.startDate = $(".fc-scrollgrid-sync-table tr:first-child .fc-daygrid-day:first-child").data("date");
    sendData.endDate = $(".fc-scrollgrid-sync-table tr:last-child .fc-daygrid-day:last-child").data("date");

    request('GET', getURL('attendance', sendData), setAttendanceList);
    request('GET', 'attendance/rectify', setMyApplyList);
}

let AttendanceArr = [];

//출석 정보 셋팅
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
        AttendanceArr = res.data;
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

//출퇴근 날짜 검색으로 id 찾기
function searchAttendanceDate(date) {
    for (let i = 0; i < AttendanceArr.length; i++) {
        if (AttendanceArr[i].attendanceDate === date) {
            return AttendanceArr[i].id;
        }
    }
    return null;
}

//출퇴근 기록 상세 보기
function detailAttendanceData(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAD001') {
        $("#applyBtn").attr('data-day', res.data.attendanceDate);
        let day = getTodayArr(new Date(res.data.attendanceDate));
        $("#attendanceTitle").text(day[0] + "." + day[1] + "." + day[2] + " (" + day[6] + ")");
        $("#attendanceMemo").html("출근 🕒 " + res.data.onWork + "<br>퇴근 🕒 " + res.data.offWork);
    } else if (res.code === 'RAD002') {
        console.log("출퇴근 기록 상세 조회 실패");
    }
}

//출퇴근 기록 없는 날
function emptyAttendanceData(date) {
    $("#applyBtn").attr('data-day', date);
    let day = getTodayArr(new Date(date));
    $("#attendanceTitle").text(day[0] + "." + day[1] + "." + day[2] + " (" + day[6] + ")");
    $("#attendanceMemo").html("출/퇴근 기록이 존재하지 않습니다.");
}

//정정희망일 클릭한 날짜로 셋팅
$("#applyBtn").click(function () {
    $('.write').find('input').val('');
    $('textarea').val('');

    let date = $('#applyBtn').attr('data-day');
    $('#applyAttendanceDate').val(date);
});

//기존 날짜 출퇴근 정보 수정시 수정할 타켓 id 부여
$("#saveBtn").click(function () {
    let id = $('#saveBtn').attr('data-target');
    applyAttendanceData(id);
});

//출퇴근 기록 정정요청
function applyAttendanceData(id) {
    let saveData = {};
    saveData.attendanceDate = $("#applyAttendanceDate").val();
    saveData.onWork = $("#applyOnWork").val();
    saveData.offWork = $("#applyOffWork").val();
    saveData.memo = $("#applyMemo").val();

    let start = saveData.attendanceDate + "T" + saveData.onWork;
    let end = saveData.attendanceDate + "T" + saveData.offWork;

    if (isEmpty(saveData.attendanceDate)) {
        alert("정정희망일을 입력해주세요.");
    } else if (isEmpty(saveData.onWork)) {
        alert("출근시간을 선택해주세요.");
    } else if (isEmpty(saveData.offWork)) {
        alert("퇴근시간을 선택해주세요.");
    } else if (isEmpty(saveData.memo)) {
        alert("사유를 작성해주세요.");
    } else if (chkDate(start, end)) {
        alert("출근시간이 퇴근시간보다 빠를 수 없습니다.다시 선택해주세요.");
    } else {
        console.log(id, saveData);
        if ($("#applyBtn").attr('data-empty')) {
            requestWithData('POST', getURL('attendance/rectify', id), saveData, applyAlertAttendance);
        } else {
            requestWithData('POST', 'attendance/rectify', saveData, applyAlertAttendance);
        }
    }
}

//출퇴근 기록 정정요청 결과 알림 alert
function applyAlertAttendance(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CRA001' || res.code === 'URA001') {
        alert("제출되었습니다");
        location.reload();
    } else if (res.code === 'CRA002' || res.code === 'URA002') {
        console.log("출퇴근 정정 요청 실패");
    }
}

//내 정정요청 목록 조회
function setMyApplyList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RRAL001') {
        $("#myApplyList").empty();
        for (let i = 0; i < res.data.length; i++) {
            let html = '';
            html = ' <tr data-bs-toggle="modal" data-bs-target="#attendanceModal"' +
                'onclick="request(\'GET\', getURL(\'attendance/rectify\', \'' + res.data[i].id + '\'), detailMyApply);">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + (res.data[i].attendanceDate).replaceAll("-", ".") + '</td>' +
                '<td>' + (res.data[i].createDate).split("T")[0].replaceAll("-", ".") + '</td>' +
                '</tr>';
            $("#myApplyList").append(html);
        }
    } else if (res.code === 'RRAL002') {
        console.log("출퇴근 정정 목록 조회 실패");
    }
}

function detailMyApply(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RRA001') {


        $("#applyAttendanceDate").val(res.data.attendanceDate);
        $("#applyOnWork").val(res.data.onWork);
        $("#applyOffWork").val(res.data.offWork);
        $("#applyMemo").val(res.data.memo);

    } else if (res.code === 'RRA002') {
        console.log("출퇴근 정정 상세 조회 실패");
    }
}