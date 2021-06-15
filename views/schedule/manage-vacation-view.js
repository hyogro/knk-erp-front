// request('GET', getURL('vacation', (getQuery().id)), setDetailVacation);

//휴가 상세보기
function setDetailVacation(res) {
    $('input:checkbox[id=' + res.data.title + ']').attr("checked", true);
    $("#memo").val(res.data.memo);
    $("#startDate").val(res.data.startDate);
    $("#endDate").val(res.data.endDate);

    if (res.data.reject || (res.data.approval1 && res.data.approval2)) {
        $("#deleteBtn").css("display", "inline-block");
    } else {
        $("#deleteBtn").css("display", "none");
    }
}

function deleteAlertVacation() {
    if (confirm("신청한 휴가를 삭제하시겠습니까??") === true) {
        let sendData = {};
        let id = getQuery().id;
        requestWithData('DELETE', getURL('vacation', id), sendData, deleteSchedule);
    } else {
        return false;
    }
}

function deleteSchedule(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        alert("삭제되었습니다.");
        history.back();
    } else if (res.code === 'RVL002') {
        console.log("요청 휴가 삭제 실패");
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