setBoardData();

//전체 정보 조회
function setBoardData() {
    let todayArr = getTodayArr(new Date());
    $("#today").text(todayArr[0] + "년 " + todayArr[1] + "월 " + todayArr[2] + "일 (" + todayArr[6] + ")");

    //부서정보 조회
    request('GET', 'department/readDepartmentNameAndMemberCount', setDepartmentInfo);
    //일정요약(출퇴근), 휴가요약(출퇴근) 조회
    request('GET', 'attendance/summary', setAttendanceSummary, false);
    //출퇴근기록 조회
    request('GET', 'attendance/today', setWorkBoard, false);
    //공지사항 최근 5개 조회
    request('GET', 'board/noticeLatest', setNoticeList, false);

    let scheduleSendData = {};
    scheduleSendData.viewOption = 'all dep own';

    //주간일정 조회
    setCalendar();
    getAttendanceList();

    let authority = $.cookie('authority');
    //정산해야할자재 버튼
    if (authority === "MATERIALS") {
        $("#btnToolUpload").show()
    } else {
        $("#btnToolUpload").hide()
    }
    // 지표 관리 버튼
    if (authority === "LVL3" || authority === "LVL4" || authority === "LVL5" || authority === "ADMIN") {
        $("#btnEvaluationUpload").show()
    } else {
        $("#btnEvaluationUpload").hide()
    }

}

function getAttendanceList() {
    let sendData = {};

    sendData.viewOption = 'all dep own';
    let start = getTodayArr(new Date(new Date().setDate(new Date().getDate() - 7)));
    sendData.startDate = start[0] + "-" + start[1] + "-" + start[2] + "T00:00:00";
    let end = getTodayArr(new Date(new Date().setDate(new Date().getDate() + 7)));
    sendData.endDate = end[0] + "-" + end[1] + "-" + end[2] + "T11:59:59";

    // 주간일정 조회
    request('GET', getURL('schedule', sendData), setScheduleList, false);
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
    if (res.code === 'A5508') {
        $(".attendance-board").css('display', 'flex');

        $("#onWork").text(res.data.onWork.length);
        $("#lateWork").text(res.data.lateWork.length);
        $("#yetWork").text(res.data.yetWork.length);
        $("#offWork").text(res.data.offWork.length);
        $("#vacation").text(res.data.vacation.length);

        $("#onWork").parent().click(function () {
            setSelectedList("출근", res.data.onWork);
        });
        $("#lateWork").parent().click(function () {
            setSelectedList("지각", res.data.lateWork);
        });
        $("#yetWork").parent().click(function () {
            setSelectedList("미출근", res.data.yetWork);
        });
        $("#offWork").parent().click(function () {
            setSelectedList("퇴근", res.data.offWork);
        });
        $("#vacation").parent().click(function () {
            setSelectedList("휴가", res.data.vacation);
        });
    }
}

//전직원 출퇴근 요약 모달창 기록 내용
function setSelectedList(type, data) {
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
            html += '<td class="time-size">출근 🕒 ' + data[i].onWork + '</td>';
        } else if (type === "미출근") {
            html += '<td class="time-size">-</td>';
        } else if (type === "퇴근") {
            html += '<td class="time-size">출근 🕒 ' + data[i].onWork +
                ' / 퇴근 🕒 ' + data[i].offWork + '</td>';
        } else if (type === "휴가") {
            let start = (data[i].vacationStartDate).split('T');
            let end = (data[i].vacationEndDate).split('T');
            html += '<td class="time-size">' +
                getToday(start[0]) + ' 🕒 ' + start[1] + '<br> ~ ' +
                getToday(end[0]) + ' 🕒 ' + end[1] + '</td>';
        }
        html += '</tr>';

        $("#selectedList").append(html);
    }
}

//주간일정 조회
function setScheduleList(res) {
    if (res.code === 'A5602') {
        let scheduleArr = [];
        for (let i = 0; i < res.data.length; i++) {
            let schedule = {};

            schedule.title = res.data[i].title;
            schedule.start = res.data[i].startDate;
            schedule.end = res.data[i].endDate;

            scheduleArr.push(schedule);
        }

        setCalendar(scheduleArr);
    }
}

//주간일정 fullcalendar - 셋팅
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
        },
        googleCalendarApiKey: 'AIzaSyDzvT6BwKaKBK4vnBPr_dFL6iBbP4ZJRfY',
        eventSources:
            [{
                googleCalendarId: 'ko.south_korea.official#holiday@group.v.calendar.google.com',
                className: 'ko_event',
                backgroundColor: '#f11212',
                borderColor: '#f11212'
            }]
    });
    calendar.render();
}

//출퇴근 기록 찍기
function checkWork(type) {
    $.getJSON("https://api.ipify.org?format=json", function (data) {
            let allowIP = ['112.216.6.34', '59.1.168.71', '61.42.17.186']; // 허용할 IP
            let remoteIp = data.ip; // 사용자 IP
            let uuid = UUID_Check_localStorage();

            if (0 <= allowIP.indexOf(remoteIp)) {
                if (type === 'onWork') {
                    let requestData = {};
                    requestData.uuid = uuid;
                    requestWithData('POST', 'attendance/onWork', requestData, onWork, true);
                } else if (type === 'offWork') {
                    request('POST', 'attendance/offWork', offWork, true);
                } else {
                    alert('올바른 요청이 아닙니다.');
                }
            } else {
                alert('요청하신 주소: ' + remoteIp + ' 에서는 출/퇴근 기록을 할 수 없습니다.');
            }
        }
    )
}

//출퇴근 기록 찍기 uuid - localStorage
function UUID_Check_localStorage() {
    if (window.localStorage) {
        let localUUID = localStorage.getItem("work_uuid");
        if (localUUID === null) {
            localUUID = createUUID();
        }
        localStorage.setItem("work_uuid", localUUID);
        return localUUID;
    } else {
        return "not_supported"
    }
}

//uuid
function createUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

//출근 기록 찍기
function onWork(res) {
    if (res.code === 'A5501') {
        alert("출근이 기록되었습니다.");
        location.reload();
    }
}

//퇴근 기록 찍기
function offWork(res) {
    if (res.code === 'A5502') {
        alert("퇴근이 기록되었습니다.");
        location.reload();
    }
}

//내 출퇴근 기록
function setWorkBoard(res) {
    if (res.code === 'A5509') {
        $("#onWorkTime").text(res.data.onWork);
        $("#offWorkTime").text(res.data.offWork);
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
                '<td class="board-no">' + data.board_idx + '</td>' +
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

// 매뉴얼 다운로드
function downloadManual() {
    location.href = '<%= fileApi %>' + 'user_manual.pdf';
}

let beforeFileList = []; //기존 수정 전, 파일 리스트
let fileList = [];
let newFileList = [];

// 정산해야 할 자재
request('GET', 'materials', setMaterialStatus);

function setMaterialStatus(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RMTR001') {
        let data = res.materials;

        if (data.length === 0 || isEmpty(data)) {
            let empty = '<div class="empty-tool"> 아직 업로드된 현황이 없습니다. </div>'
            $("#toolSlide").append(empty);
            return;
        }

        for (let i = 0; i < data.length; i++) {
            if (!isEmpty(data[i])) {
                let img = "<div>" +
                    "<a title='클릭해서 크게보기' href='<%= fileApi %>/board/" + data[i] + "'>" +
                    "<img src='<%= fileApi %>/board/" + data[i] + "'>" +
                    "</a>" +
                    "</div>"
                $("#toolSlide").append(img)

                let files = '<div id=beforeFile' + beforeFileList.length + '>' +
                    '<div class="upload-file"><img class="preview-file" src="<%= fileApi %>/board/' + data[i] + '">' +
                    '<span class="deleteBtn" onclick="deleteBeforeFileList(' + beforeFileList.length + ')"> 삭제</span></div></div>';
                $("#addFileNameList").append(files);
                beforeFileList.push(data[i]);
            } else {
                let empty = '<div class="empty-tool"> 아직 업로드된 현황이 없습니다. </div>'
                $("#toolSlide").append(empty);
            }
        }

        $('.carousel').slick({
            slidesToShow: 1,
            dots: true,
        });
    } else if (res.code === 'RMTR002') {
        console.log("장기자재 사진 읽기 실패");
    }
}

//기존 파일 리스트 - 삭제
function deleteBeforeFileList(index) {
    beforeFileList[index] = null;
    $("#beforeFile" + index).empty();
}

//자재 파일 선택
$("#toolFile").change(function () {
    let files = $("#toolFile")[0].files;
    for (let i = 0; i < files.length; i++) {
        if (!/\.(gif|jpg|jpeg|png)$/i.test(files[i].name)) {
            alert("지원되지 않는 형식의 이미지 파일을 제외합니다.\n" +
                "파일명 : " + files[i].name + "\n" +
                "* 지원되는 형식(jpg, jpeg, png)");
        } else {
            let reader = new FileReader();
            reader.onload = function (e) {
                let html = '<div id=addFile' + newFileList.length + '>' +
                    '<div class="upload-file"><img class="preview-file" src="' + e.target.result + '">' +
                    '<span class="deleteBtn" onclick="deleteNewFile(' + newFileList.length + ')"> 삭제</span>' +
                    '</div></div>';
                $("#addFileNameList").append(html);

                newFileList.push(files[i]);
            }
            reader.readAsDataURL(files[i]);
        }
    }
});

//불러온 파일 삭제
function deleteNewFile(index) {
    newFileList[index] = null;
    $("#addFile" + index).empty();
}

let fileUploadCount = 0;

//파일 유무에 따른 게시글 저장
function saveBoard() {
    newFileList = newFileList.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });

    // 새로운 파일 추가한 게시글 저장
    if (newFileList.length > 0) {
        for (let i = 0; i < newFileList.length; i++) {
            let sendFiles = new FormData();
            sendFiles.append('file', newFileList[i]);
            sendFiles.append('location', 'board');
            requestWithFile('POST', 'file/upload', sendFiles, saveFile, true);
        }
    } else {//새로 추가한 파일이 없을 경우
        uploadBeforeFileList();
    }
}

//파일 있는 게시글 저장
function saveFile(res) {
    if (res.code === 'A6001') {
        fileList.push(res.data);
        fileUploadCount += 1;
        if (fileUploadCount === newFileList.length) {
            uploadBeforeFileList();
        }
    }
}

//기존 파일 있는 게시글 저장 (글 수정)
function uploadBeforeFileList() {
    beforeFileList = beforeFileList.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });

    for (let i = 0; i < beforeFileList.length; i++) {
        fileList.push(beforeFileList[i]);
    }

    let saveData = {};
    saveData.materials = fileList;

    requestWithData('POST', 'materials', saveData, saveAlertBoard);
}

//게시글 저장 알림창
function saveAlertBoard(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CMTR001' || res.code === 'CEV001') {
        alert("업로드 되었습니다.")
        location.reload()
    } else if (res.code === 'CMTR002') {
        console.log("정산해야 할 자재 이미지 업로드 실패")
    } else if (res.code === 'CEV002') {
        console.log("지표 관리 이미지 업로드 실패")
    }
}

// 지표 관리 이미지
let evaluationFile = null

request('GET', 'evaluation', setEvaluationImage);

function setEvaluationImage(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'REV001') {
        if (res.evaluation != null) {
            evaluationFile = res.evaluation
            let url = '<%= fileApi %>/board/' + res.evaluation
            $("#imgEvaluation").parent().attr('href', url)
            $("#imgEvaluation").attr('src', url)
            let html = '<img id="evaluationSelectFile" src="' + url + '"/>' +
                '<button class="btn btn-sm btn-danger"' +
                'onclick="deleteEvaluationImage()">삭제</button>'
            $(".evaluation-file").html(html)
        } else {
            $(".evaluation-content").append("아직 업로드된 파일이 없습니다.")
            $(".evaluation-file").html("아직 선택 된 파일이 없습니다.")
        }
    } else if (res.code === 'REV002') {
        console.log("지표 관리 이미지 불러오기 실패");
    }
}

// 지표 관리 파일 선택
$("#evaluationFile").change(function () {
    let file = $("#evaluationFile")[0].files[0];

    if (!/\.(gif|jpg|jpeg|png)$/i.test(file.name)) {
        alert("지원되지 않는 형식의 이미지 파일을 제외합니다.\n" +
            "파일명 : " + file.name + "\n" +
            "* 지원되는 형식(jpg, jpeg, png)");
    } else {
        let reader = new FileReader()
        reader.onload = e => {
            $("#evaluationSelectFileName").text(file.name)

            let html = '<img id="evaluationSelectFile" src="' + e.target.result + '"/>' +
                '<button class="btn btn-sm btn-danger"' +
                'onclick="deleteEvaluationImage()">삭제</button>'
            $(".evaluation-file").html(html)
        }
        reader.readAsDataURL(file)

        evaluationFile = file
    }
});

function deleteEvaluationImage() {
    evaluationFile = null
    $(".evaluation-file").html("아직 선택된 파일이 없습니다.")
    $("#evaluationSelectFileName").text("")
}

//지표 관리 사진 저장
function saveEvaluation() {
    if (isEmpty(evaluationFile)) {
        let saveData = {};
        saveData.evaluation = null

        requestWithData('POST', 'evaluation', saveData, saveAlertBoard);
    } else {
        let sendFiles = new FormData();
        sendFiles.append('file', evaluationFile);
        sendFiles.append('location', 'board');
        requestWithFile('POST', 'file/upload', sendFiles, saveEvaluationFile, true);
    }
}

function saveEvaluationFile(res) {
    if (res.code === 'A6001') {
        let saveData = {};
        saveData.evaluation = res.data

        requestWithData('POST', 'evaluation', saveData, saveAlertBoard);
    }
}