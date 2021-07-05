request('GET', 'vacation/approve', setAppliedVacationList);
request('GET', 'vacation/approve/history', setHistoryVacationList);

//승인 해야 할 출,퇴근 휴가목록 셋팅
function setAppliedVacationList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        setTable('vacationList', res);
    } else if (res.code === 'RVL002') {
        console.log("휴가 승인대기 목록 조회 실패");
    }
}
function setHistoryVacationList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        setTable('vacationHistoryList', res);
    } else if (res.code === 'RVL002') {
        console.log("휴가 승인대기 목록 조회 실패");
    }
}

function setTable(table, res){
    $("#"+table).empty();

    if (res.data.length === 0) {
        let html = '<tr><td colspan="6" class="empty-tr">신청이 없습니다.</td></tr>'
        $("#"+table).html(html);
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
        $("#"+table).append(html);
    }
}