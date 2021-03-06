request('GET', 'account', setMemberList, false);

//직원 리스트 셋팅
function setMemberList(res) {
    if (res.code === 'A1100') {
        $("#memberList").empty();
        let data = res.data;

        if (data.length === 0) {
            let html = '<tr><td colspan="6">아직 추가된 계정이 없습니다.</td></tr>'
            $("#memberList").append(html);
        }

        for (let i = 0; i < data.length; i++) {
            let html = '<tr id=\'' + data[i].memberId + '\' ' +
                'onclick="location.href = \'/manage/member/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].memberName + '</td>' +
                '<td>' + data[i].memberId + '</td>' +
                '<td>' + data[i].departmentName + '</td>' +
                '<td>' + data[i].phone + '</td>' +
                '<td>' + getToday(data[i].joiningDate) + '</td>' +
                '</tr>';
            $("#memberList").append(html);
        }
    }
}

//출퇴근 관리 다운로드
function downloadAttendance() {
    let sendData = {};
    sendData.startDate = $("#attendanceExcelStartDate").val();
    sendData.endDate = $("#attendanceExcelEndDate").val();

    if (isEmpty(sendData.startDate)) {
        alert("기간 시작일을 선택해주세요.");
    } else if (isEmpty(sendData.endDate)) {
        alert("기간 종료일을 선택해주세요.");
    } else if (chkDate(sendData.startDate, sendData.endDate)) {
        alert("올바른 기간이 아닙니다. 다시 선택해주세요.");
    } else {
        request('GET', getURL('file/download/excel/attendance', sendData), downloadExcel, true);
    }
}

//엑셀 관리 다운로드
function downloadVacation() {
    let sendData = {};
    sendData.startDate = $("#vacationExcelStartDate").val();
    sendData.endDate = $("#vacationExcelEndDate").val();

    if (isEmpty(sendData.startDate)) {
        alert("기간 시작일을 선택해주세요.");
    } else if (isEmpty(sendData.endDate)) {
        alert("기간 종료일을 선택해주세요.");
    } else if (chkDate(sendData.startDate, sendData.endDate)) {
        alert("올바른 기간이 아닙니다. 다시 선택해주세요.");
    } else {
        request('GET', getURL('file/download/excel/vacation', sendData), downloadExcel);
    }
}


function downloadExcel(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'ES001') {
        location.href = '<%= fileApi %>' + "excel/" + res.message;
    } else {
        alert("출퇴근 기록 다운로드 실패");
    }
}