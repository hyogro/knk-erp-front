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
    selectable: true,
    eventClick: function (info) {
        if (info.event.extendedProps.type === 'schedule') {
            new bootstrap.Modal(document.getElementById('scheduleModal')).show();
            request('GET', getURL('schedule', info.event.id), detailScheduleView);
        } else if (info.event.extendedProps.type === 'vacation') {
            new bootstrap.Modal(document.getElementById('vacationModal')).show();
            request('GET', getURL('vacation', info.event.id), detailVacationView);
        }
    },
    select: function (info) {
        new bootstrap.Modal(document.getElementById('scheduleModal')).show();
        setCreateSchedule(getYYYYMMDD(info.start), getYYYYMMDD(new Date(info.end.setDate(info.end.getDate() - 1))));
    }
});
calendar.render();

//이전달
$(".fc-prev-button").click(function () {
    chkViewOption();
});
//다음달
$(".fc-next-button").click(function () {
    chkViewOption();
});

setScheduleCalendar('all dep own');

//체크값 전달
function chkViewOption() {
    let viewOptionArr = [];
    $('input:checkbox[name="viewOption"]').each(function () {
        viewOptionArr.push(this.value);
    });
    let viewOption = viewOptionArr.join(" ");

    setScheduleCalendar(viewOption);
}

//달력에 한달 일정 셋팅
function setScheduleCalendar(viewOption) {
    calendar.removeAllEvents();

    if (!(isEmpty(viewOption))) {
        //전체일정 조회
        let sendData = new Object();
        sendData.viewOption = viewOption;
        sendData.startDate = $(".fc-scrollgrid-sync-table tr:first-child .fc-daygrid-day:first-child").data("date") + "T00:00:00";
        sendData.endDate = $(".fc-scrollgrid-sync-table tr:last-child .fc-daygrid-day:last-child").data("date") + "T11:59:59";

        request('GET', getURL('schedule', sendData), setScheduleList);

        //내일정 조회
        sendData.viewOption = '';
        request('GET', getURL('schedule', sendData), setMyScheduleList);
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

let myScheduleArr = [];

//내 일정 조회
function setMyScheduleList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSL001') {
        $("#myScheduleList").empty();

        if (res.data.length === 0) {
            let html = '<tr style="cursor: default"><td>일정이 없습니다.</td></td>'
            $("#myScheduleList").append(html);
            return false;
        }

        for (let i = 0; i < res.data.length; i++) {
            let html = '';
            html += '<tr data-bs-toggle="modal" data-bs-target="#scheduleModal"' +
                'onclick=" request(\'GET\', getURL(\'schedule\', \'' + res.data[i].id + '\'), detailScheduleView);">';

            let start = getYYYYMMDD(new Date(res.data[i].startDate));
            let end = getYYYYMMDD(new Date(res.data[i].endDate));
            if (start === end) {
                html += '<th>' + start.replaceAll("-", ".").substring(5, 10) + '</th>';
            } else {
                html += '<th>' +
                    start.replaceAll("-", ".").substring(5, 10) + '~' +
                    end.replaceAll("-", ".").substring(5, 10) +
                    '</th>';
            }

            if (res.data[i].viewOption === "all") {
                html += '<td style="color: #3788d8">■ 전체</td>'
            } else if (res.data[i].viewOption === "dep") {
                html += '<td style="color: #e09222">■ 팀</td>'
            } else if (res.data[i].viewOption === "own") {
                html += '<td style="color: #d46d8c">■ 개인</td>'
            }

            html += '<td>' + res.data[i].title + '</td>';
            html += '</tr>';

            $("#myScheduleList").append(html);
        }

        myScheduleArr = res.data;
    } else if (res.code === 'RSL002') {
        console.log("일정목록 조회 실패");
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

//입력값 초기화
function resetScheduleData(set, type) {
    if (type === "create") {
        $("#scheduleMember").text('');
    }

    if (type !== "update") {
        $('.schedule-write').find('input').val('');
        $('textarea').val('');
        $('#scheduleMemoTextCnt').text('(0 / 255)');
    }

    $('input').prop('readonly', set);
    $('textarea').prop('readonly', set);
    $('option').attr('disabled', set);
}

//일정등록 모달 초기화
function setCreateSchedule(start, end) {
    resetScheduleData(false, "create");

    if (!isEmpty(start) && !isEmpty(end)) {
        $("#scheduleStartDate").val(start);
        $("#scheduleEndDate").val(end);
    }

    let html = '';
    html += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>';
    html += '<button type="button" class="btn btn-primary" onclick="saveSchedule(\'create\')">저장</button>';
    $("#scheduleFooter").html(html);
}

//일정 상세보기
function detailScheduleView(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSD001') {
        resetScheduleData(true, "read");

        $("#scheduleTitle").val(res.data.title);
        $("#scheduleMember").text(res.data.memberName);
        $("#scheduleViewOption").val(res.data.viewOption);
        let start = res.data.startDate.split("T");
        $("#scheduleStartDate").val(start[0]);
        $("#scheduleStartTime").val(start[1]);
        let end = res.data.endDate.split("T");
        $("#scheduleEndDate").val(end[0]);
        $("#scheduleEndTime").val(end[1]);
        $("#scheduleMemo").val(res.data.memo);
        $("#scheduleMemoTextCnt").text("(" + $("#scheduleMemo").val().length + " / 255)");

        //내 일정인지 체크
        chkMySchedule(res.data.id);
    } else if (res.code === 'RSD001') {
        console.log("일정 상세 조회 실패");
    }
}

//내 일정인지 체크
function chkMySchedule(id) {
    for (let i = 0; i < myScheduleArr.length; i++) {
        let html = '';
        if (id === myScheduleArr[i].id) {
            html += '<button type="button" class="btn btn-danger" onclick="deleteAlertSchedule(\'' + id + '\')">삭제</button>';
            html += '<button type="button" class="btn btn-primary" onclick="setUpdateSchedule(\'' + id + '\')">수정</button>';
            html += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">확인</button>';
            $("#scheduleFooter").html(html);
            return false;
        } else {
            html += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">확인</button>';
            $("#scheduleFooter").html(html);
        }
    }
}

//휴가 상세보기
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

//일정 삭제
function deleteAlertSchedule(id) {
    if (confirm("일정을 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('schedule', id), deleteSchedule);
    } else {
        return false;
    }
}

//일정 삭제
function deleteSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DS001') {
        alert("일정이 삭제되었습니다.");
        location.reload();
    } else if (res.code === 'DS002') {
        alert("일정삭제 실패");
    } else if (res.code === 'DS003') {
        alert("일정삭제 실패\n권한이 없습니다.");
    }
}

//업데이트 입력창 활성화
function setUpdateSchedule(id) {
    resetScheduleData(false, "update");

    let html = '';
    html += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>';
    html += '<button type="button" class="btn btn-primary" onclick="saveSchedule(\'update\', \'' + id + '\')">저장</button>';
    $("#scheduleFooter").html(html);
}

//스케줄 저장
function saveSchedule(type, id) {
    let saveData = {};
    saveData.title = $("#scheduleTitle").val();
    saveData.memo = $("#scheduleMemo").val();
    saveData.viewOption = $("#scheduleViewOption").val();
    let start1 = $("#scheduleStartDate").val();
    let start2 = $("#scheduleStartTime").val();
    saveData.startDate = start1 + "T" + start2;
    let end1 = $("#scheduleEndDate").val();
    let end2 = $("#scheduleEndTime").val();
    saveData.endDate = end1 + "T" + end2;

    if (isEmpty(saveData.title)) {
        alert("제목을 입력해주세요.");
    } else if (isEmpty(saveData.memo)) {
        alert("내용을 입력해주세요.");
    } else if (isEmpty(start1)) {
        alert("시작일을 선택해주세요.");
    } else if (isEmpty(start2)) {
        alert("시작시간을 선택해주세요.");
    } else if (isEmpty(end1)) {
        alert("종료일을 선택해주세요.");
    } else if (isEmpty(end2)) {
        alert("종료시간을 선택해주세요.");
    } else if (chkDate(saveData.startDate, saveData.endDate)) {
        alert("종료일/시간이 시작일/시간보다 빠를 수 없습니다.\n다시 선택해주세요.");
    } else {
        if (type === 'create') {
            requestWithData('POST', 'schedule', saveData, createAlertSchedule);
        } else if (type === 'update') {
            requestWithData('PUT', getURL('schedule', id), saveData, updateAlertSchedule);
        }
    }
}

//일정 추가 결과 알림창
function createAlertSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CS001') {
        alert("일정이 추가되었습니다.");
        location.reload();
    } else if (res.code === 'CS002') {
        console.log("일정추가 실패");
    }
}

//일정 수정 결과 알림창
function updateAlertSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'US001') {
        alert("일정이 수정되었습니다.");
        location.reload();
    } else if (res.code === 'US002') {
        console.log("일정수정 실패");
    } else if (res.code === 'US002') {
        alert("일정수정 실패\n권한이 없습니다.");
    }
}