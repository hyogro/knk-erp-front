request('GET', 'attendance/rectify/approve', setAppliedAttendanceList, false);

//승인 해야 할 출,퇴근 정정요청목록 셋팅
function setAppliedAttendanceList(res) {
    if (res.code === 'A5505') {
        $("#attendanceList").empty();

        if (res.data.length === 0) {
            let html = '<tr><td colspan="4" class="empty-tr">요청이 없습니다.</td></tr>'
            $("#attendanceList").html(html);
            return false;
        }

        for (let i = 0; i < res.data.length; i++) {
            let html = ' <tr id=\'' + res.data[i].id + '\' ' +
                'onclick="location.href = \'/approve/attendance/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + getToday(res.data[i].attendanceDate) + '</td>' +
                '<td>' + res.data[i].memberName + '</td>' +
                '<td>' + getToday(res.data[i].createDate) + '</td>' +
                '</tr>';
            $("#attendanceList").append(html);
        }
    }
}