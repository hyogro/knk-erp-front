request('GET', 'vacation/approve', setAppliedVacationList);

//승인 해야 할 출,퇴근 휴가목록 셋팅
function setAppliedVacationList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        $("#vacationList").empty();

        if (res.data.length === 0) {
            let html = '<tr><td colspan="6" class="empty-tr">신청이 없습니다.</td></tr>'
            $("#vacationList").html(html);
            return false;
        }

        for (let i = 0; i < res.data.length; i++) {
            let html = ' <tr id=\'' + res.data[i].id + '\' ' +
                'onclick="location.href = \'/approve/vacation/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + res.data[i].type + '</td>' +
                '<td>' + getToday(res.data[i].startDate) + '</td>' +
                '<td>' + getToday(res.data[i].endDate) + '</td>' +
                '<td>' + res.data[i].memberName + '</td>' +
                '<td>' + getToday(res.data[i].requestDate) + '</td>' +
                '</tr>';
            $("#vacationList").append(html);
        }
    } else if (res.code === 'RVL002') {
        console.log("휴가 승인대기 목록 조회 실패");
    }
}