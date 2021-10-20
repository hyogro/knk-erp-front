request('GET', getURL('attendance/rectify', getQuery().id), detailAppliedAttendanceData, false);

//출퇴근 정정요청 상세보기
function detailAppliedAttendanceData(res) {
    if (res.code === 'A5505') {
        $("#approver1").text(res.data.approver1);
        $("#approver2").text(res.data.approver2);
        $("#attendanceDate").text(getToday(res.data.attendanceDate));
        $("#onWork").text(res.data.onWork);
        $("#offWork").text(res.data.offWork);
        $("#memo").text(enterToBr(res.data.memo));
    }
}

//출퇴근 정정요청 승인
$("#approveBtn").click(function () {
    request('PUT', getURL('attendance/rectify/approve', getQuery().id), approveAttendance, true);
});

//TODO: 출퇴근 정정요청 승인
//출퇴근 정정요청 승인
function approveAttendance(res) {
    if (res.code === 'A5507') {
        alert("승인되었습니다.")
        location.href = '/approve/attendance';
    } else if (res.code === 'ARA004') {
        alert("이미 승인된 요청입니다.");
    }
}