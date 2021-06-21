request('GET', 'attendance/rectify/approve', setAppliedAttendanceList);

//승인 해야 할 출,퇴근 정정요청목록 셋팅
function setAppliedAttendanceList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RRAL001') {
        $("#confirmVacationList").empty();

        if (res.data.length === 0) {
            let html = '<tr><td colspan="4">요청이 없습니다.</td></tr>'
            $("#confirmVacationList").html(html);
        }

        for (let i = 0; i < res.data.length; i++) {
            let html = ' <tr id=\'' + res.data[i].id + '\' ' +
                'onclick="location.href = \'/approve/attendance/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + getToday(res.data[i].attendanceDate) + '</td>' +
                '<td>' + res.data[i].memberName + '</td>' +
                '<td>' + getToday(res.data[i].createDate) + '</td>' +
                '</tr>';
            $("#confirmVacationList").append(html);
        }
    } else if (res.code === 'RRAL002') {
        console.log("출퇴근 정정요청 목록 조회 실패");
    }
}