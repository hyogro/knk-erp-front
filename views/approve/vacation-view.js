request('GET', getURL('vacation', getQuery().id), detailAppliedVacation);

//휴가 상세보기
function detailAppliedVacation(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVD001') {
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
        request('GET', getURL('vacation/info', res.data.memberId), setVacationInfo);
    } else if (res.code === 'RVD002') {
        console.log("휴가상세 조회 실패");
    } else if (res.code === 'RVD003') {
        console.log("휴가상세 조회 실패\n권한이 없습니다.");
    }
}

//잔여휴가 정보
function setVacationInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVI001') {
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + res.data.addVacation) - res.data.usedVacation));
    } else if (res.code === 'RVI002') {
        console.log("휴가 정보 조회 실패");
    }
}


//휴가 승인
$("#approveBtn").click(function () {
    request('PUT', getURL('vacation/approve', getQuery().id), approveVacation);
});

//휴가 승인
function approveVacation(res) {
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