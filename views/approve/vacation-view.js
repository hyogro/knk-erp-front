request('GET', getURL('vacation', getQuery().id), detailAppliedVacation);

//휴가 상세보기
function detailAppliedVacation(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVD001') {
        let start = res.data.startDate.split("T");
        let end = res.data.endDate.split("T");
        $("#type").text(res.data.type);
        if (res.data.type === "기타") {
            $("#type").text("기타 (" + start[1] + " ~ " + end[1] + ")");
        }
        $("#memo").text(res.data.memo);
        $("#startDate").text(start[0]);
        $("#endDate").text(end[0]);
        $("#approver1").text(res.data.approver1);
        $("#approver2").text(res.data.approver2);
    } else if (res.code === 'RVD002') {
        console.log("휴가상세 조회 실패");
    } else if (res.code === 'RVD003') {
        alert("휴가상세 조회 실패\n권한이 없습니다.");
    }
}

//휴가 승인
$("#approveBtn").click(function () {
    request('PUT', getURL('vacation/approve', getQuery().id), approveVacation);
});

//휴가 승인
function approveVacation(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'AV001') {
        alert("승인되었습니다.")
        location.href = '/approve/vacation';
    } else if (res.code === 'AV002') {
        console.log("휴가 승인 실패");
    } else if (res.code === 'AV003') {
        alert("권한이 없습니다.");
    }
}

//휴가 승인
$("#rejectBtn").click(function () {
    let sendData = {};
    sendData.rejectMemo = $("#reject").val();
    requestWithData('PUT', getURL('vacation/reject', getQuery().id), sendData, rejectVacation);
});

//휴가 승인
function rejectVacation(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RV001') {
        alert("거절 처리되었습니다.")
        location.href = '/approve/vacation';
    } else if (res.code === 'RV002') {
        console.log("휴가 거절 실패");
    } else if (res.code === 'RV003') {
        alert("권한이 없습니다.");
    } else if (res.code === 'RV003') {
        alert("이미 승인된 휴가입니다.");
    }
}