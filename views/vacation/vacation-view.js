request('GET', getURL('vacation', getQuery().id), detailVacation);

//휴가 상세보기
function detailVacation(res) {
    if (res.code === 'A5712') {
        $("#type").text(res.data.type);
        $("#memo").text(res.data.memo);

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
        if (res.data.reject || (res.data.approval1 && res.data.approval2)) {
            $("#deleteBtn").css("display", "none");
        } else {
            $("#deleteBtn").css("display", "inline-block");
        }
        if (res.data.reject) {
            $("#reject").text(enterToBr(res.data.rejectMemo));
            $("#rejectRow").show();
        }
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
    }else if (res.code === 'DV003') {
        alert("이미 승인된 휴가이므로 삭제가 불가능합니다.");
    }
}
