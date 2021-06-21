request('GET', getURL('attendance/rectify', getQuery().id), detailAppliedAttendanceData);

//출퇴근 정정요청 상세보기
function detailAppliedAttendanceData(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RRA001') {
        $("#approver1").text(res.data.approver1);
        $("#approver2").text(res.data.approver2);
        $("#attendanceDate").text(getToday(res.data.attendanceDate));
        $("#onWork").text(res.data.onWork);
        $("#offWork").text(res.data.offWork);
        $("#memo").text(res.data.memo);
    } else if (res.code === 'RRA002') {
        console.log("출퇴근 기록 상세 조회 실패");
    }
}

//출퇴근 정정요청 승인
$("#approveBtn").click(function () {
    request('PUT', getURL('attendance/rectify/approve', getQuery().id), approveAttendance);
});

//출퇴근 정정요청 승인
function approveAttendance(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'ARA001') {
        alert("승인되었습니다.")
        location.href='/approve/attendance';
    } else if (res.code === 'ARA002') {
        console.log("출퇴근 정정요청 승인 실패");
    } else if (res.code === 'ARA003') {
        alert("권한이 없습니다.");
    } else if (res.code === 'ARA004') {
        alert("이미 승인된 요청입니다.");
    }
}