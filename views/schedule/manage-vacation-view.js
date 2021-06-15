request('GET', getURL('vacation', getQuery().id), setDetailVacation);

//휴가 상세보기
function setDetailVacation(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RV001') {
        if (res.data.type === "연차") {
            $('input:checkbox[id="full"]').attr("checked", true);
        } else if (res.data.type === "오전반차") {
            $('input:checkbox[id="halfAM"]').attr("checked", true);
        } else if (res.data.type === "오후반차") {
            $('input:checkbox[id="halfPM"]').attr("checked", true);
        }
        $('input:checkbox[id=' + res.data.type + ']').attr("checked", true);
        $("#memo").text(res.data.memo);
        $("#startDate").text(res.data.startDate.split("T")[0]);
        $("#endDate").text(res.data.endDate.split("T")[0]);
        if (res.data.reject || (res.data.approval1 && res.data.approval2)) {
            $("#deleteBtn").css("display", "none");
        } else {
            $("#deleteBtn").css("display", "inline-block");
        }
        $("#approver1").text(res.data.approver1);
        $("#approver2").text(res.data.approver2);

        if (res.data.reject) {
            $("#rejectRow").show();
            $("#reject").text(res.data.rejectMemo);
        }
    } else if (res.code === 'RV002') {
        console.log("휴가상세 조회 실패");
    } else if (res.code === 'RV003') {
        alert("휴가상세 조회 실패\n권한이 없습니다.");
    }
}

function deleteAlertVacation() {
    if (confirm("신청한 휴가를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('vacation', getQuery().id), deleteSchedule);
    } else {
        return false;
    }
}

function deleteSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DV001') {
        alert("삭제되었습니다.");
        location.href = '/schedule/manage-vacation';
    } else if (res.code === 'DV002') {
        console.log("휴가삭제 실패");
    } else if (res.code === 'DV003') {
        alert("이미 승인된 휴가이므로 삭제가 불가능합니다.");
    } else if (res.code === 'DV004') {
        alert("삭제 권한이 없습니다.");
    }
}
