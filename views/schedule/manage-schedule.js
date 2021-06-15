let scheduleArr = [];

setBoardData();

function setBoardData() {
    let scheduleSendData = {};
    scheduleSendData.viewOption = '';
    scheduleSendData.page = 0;
    scheduleSendData.size = 100;

    //전체일정 조회
    request('GET',getURL('schedule', scheduleSendData), setScheduleList);
}

//초기 셋팅
function setScheduleList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSL001') {
        scheduleArr = res.data;
        setDateSelector();
    } else if (res.code === 'RSL002') {
        alert("일정목록 조회 실패");
    }
}

// 초기 날짜 셋팅
function setDateSelector() {
    let dateSet = new Set();
    for (let i = 0; i < scheduleArr.length; i++) {
        dateSet.add((scheduleArr[i].startDate).toString().substring(0, 7));
        dateSet.add((scheduleArr[i].endDate).toString().substring(0, 7));
    }
    let dateArr = Array.from(dateSet);
    for (let i = 0; i < dateArr.length; i++) {
        let date = dateArr[i].split("-");
        $("#year").append("<option>" + date[0] + "</option>");
        $("#month").append("<option>" + date[1] + "</option>");
    }

    searchScheduleList();
}

//내 일정 검색
function searchScheduleList() {
    $("#myScheduleList").empty();
    let date = $("#year").val() + "-" + $("#month").val();
    for (let i = 0; i < scheduleArr.length; i++) {
        if ((scheduleArr[i].startDate).substring(0, 7) === date ||
            (scheduleArr[i].endDate).substring(0, 7) === date) {
            let startDate = (scheduleArr[i].startDate).split("T")[0].replaceAll("-", ".");
            let endDate = (scheduleArr[i].endDate).split("T")[0].replaceAll("-", ".");

            let html = '';
            if (startDate === endDate) {
                html += '<tr><th width="30%">' + startDate + '</th>';
            } else {
                html += '<tr><th width="30%">' + startDate + "~" + endDate + '</th>';
            }
            html += '<td width="70%" id=\'' + scheduleArr[i].id + '\' onclick="request(\'GET\', getURL(\'schedule\', id), detailSchedule)">' +
                scheduleArr[i].title + '</td></tr>';

            $("#myScheduleList").append(html);
        }
    }
}

//일정 상세보기
function detailSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSD001') {
        $("#detailSchedule").css("visibility", "visible");
        $("#scheduleTitle").text(res.data.title);
        $("#scheduleTitle").attr("data-id", res.data.id);
        let start = res.data.startDate.split("T");
        let end = res.data.endDate.split("T");
        $("#scheduleTime").html("시작: " + start[0] + " 🕒" + start[1] +
            "<br>종료: " + end[0] + " 🕒" + end[1]);
        $("#scheduleMemo").text(res.data.memo);
    } else if (res.code === 'RSD002') {
        console.log("일정상세 조회 실패");
    }
}

function chkDate() {
    let start1 = $("#createStartDate").val();
    let start2 = $("#createStartTime").val() + ":00";
    let startDate = new Date(start1 + "T" + start2);
    let end1 = $("#createEndDate").val();
    let end2 = $("#createEndTime").val() + ":00";
    let endDate = new Date(end1 + "T" + end2);

    if (startDate > endDate) {
        return false;
    } else {
        return true;
    }
}

function typeSchedule(type) {
    $("#saveBtn").attr("onclick", "saveSchedule('" + type + "')");

    if(type === 'create') {
        $(".modal-header div").text("일정추가");
    } else if(type === 'update') {
        let scheduleSendData = {};
        let id = $("#scheduleTitle").data("id");
        $(".modal-header div").text("일정수정");
        request('GET', getURL('schedule', id), updateDetailSchedule);
    }
}

function updateDetailSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RSD001') {
        $("#createTitle").val(res.data.title);
        $("#createMemo").val(res.data.memo);
        $("#createViewOption").val(res.data.viewOption);

        let start = res.data.startDate.split("T");
        $("#createStartDate").val(start[0]);
        $("#createStartTime").val(start[1]);

        let end = res.data.endDate.split("T");
        $("#createEndDate").val(end[0]);
        $("#createEndTime").val(end[1]);
    } else if (res.code === 'RSD002') {
        console.log("일정상세 조회 실패");
    }
}

function saveSchedule(type) {
    let scheduleSendData = {};
    scheduleSendData.title = $("#createTitle").val();
    scheduleSendData.memo = $("#createMemo").val();
    scheduleSendData.viewOption = $("#createViewOption").val();
    let start1 = $("#createStartDate").val();
    let start2 = $("#createStartTime").val();
    scheduleSendData.startDate = start1 + "T" + start2;
    let end1 = $("#createEndDate").val();
    let end2 = $("#createEndTime").val();
    scheduleSendData.endDate = end1 + "T" + end2;

    if (isEmpty(scheduleSendData.title)) {
        alert("제목을 입력해주세요.");
    } else if (isEmpty(scheduleSendData.memo)) {
        alert("내용을 입력해주세요.");
    } else if (isEmpty(start1)) {
        alert("시작일을 선택해주세요.");
    } else if (isEmpty(start2)) {
        alert("시작시간을 선택해주세요.");
    } else if (isEmpty(end1)) {
        alert("종료일을 선택해주세요.");
    } else if (isEmpty(end2)) {
        alert("종료시간을 선택해주세요.");
    } else if (!(chkDate())) {
        alert("종료일/시간이 시작일/시간보다 빠를 수 없습니다.\n다시 선택해주세요.");
    } else {
        if (type === 'create') {
            requestWithData('POST', 'schedule', scheduleSendData, createAlertSchedule);
        } else if (type === 'update') {
            let id = $("#scheduleTitle").data("id");
            requestWithData('PUT', getURL('schedule',id), scheduleSendData, updateAlertSchedule);
        }
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
        alert("일정수정 실패");
    } else if (res.code === 'US002') {
        alert("일정수정 실패\n권한이 없습니다.");
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
        alert("일정추가 실패");
    }
}

//일정 삭제
function deleteAlertSchedule() {
    if (confirm("일정을 삭제하시겠습니까??") === true) {
        let scheduleSendData = {};
        let id = $("#scheduleTitle").data("id");
        requestWithData('DELETE', getURL('schedule', id), scheduleSendData, deleteSchedule);
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