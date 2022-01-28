request('GET', getURL('vacation', getQuery().id), detailAppliedVacation, false);

//휴가 상세보기
function detailAppliedVacation(res) {
    if (res.code === 'A5712') {
        $("#member").text(res.data.memberName);

        $("#memo").text(res.data.memo);
        $("#type").text(res.data.type);

        let start = res.data.startDate.split("T");
        let end = res.data.endDate.split("T");

        if (res.data.type === "시간제") {
            $("#date").text(getToday(start[0]) + " 🕒 " +
                start[1].substring(0, 5) + " ~ " + end[1].substring(0, 5));
        } else {
            if (start[0] === end[0]) {
                $("#date").text(getToday(start[0]));
            } else {
                $("#date").text(getToday(start[0])+" ~ "+getToday(end[0]));
            }
        }

        $("#approver1").text(res.data.approver1);
        $("#approver2").text(res.data.approver2);

        //내 휴가 정보
        request('GET', getURL('vacation/info', res.data.memberId), setVacationInfo, false);
    }
}

//잔여휴가 정보
function setVacationInfo(res) {
    if (res.code === 'A5712') {
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + res.data.addVacation) - res.data.usedVacation));
    }
}

//휴가 승인
$("#approveBtn").click(function () {
    request('PUT', getURL('vacation/approve', getQuery().id), approveVacation, true);
});

//휴가 승인
function approveVacation(res) {
    if (res.code === 'A5715') {
        alert("승인되었습니다.")
        location.href = '/approve/vacation';
    }
}

//휴가 거절
$("#rejectBtn").click(function () {
    let sendData = {};
    sendData.rejectMemo = $("#reject").val();
    requestWithData('PUT', getURL('vacation/reject', getQuery().id), sendData, rejectVacation, true);
});

//휴가 승인
function rejectVacation(res) {
    if (res.code === 'A5716') {
        alert("거절 처리되었습니다.")
        location.href = '/approve/vacation';
    }
}

//신청한 휴가 삭제 경고창
function deleteAlertVacation() {
    if (confirm("신청한 휴가를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('vacation', getQuery().id), deleteSchedule, true);
    } else {
        return false;
    }
}

//신청한 휴가 삭제
function deleteSchedule(res) {
    if (res.code === 'A5714') {
        alert("삭제되었습니다.");
        location.href = '/vacation';
    }
}
