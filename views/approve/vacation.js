setTodayMonth();

// 오늘날짜 ~ 한달후날짜 셋팅
function setTodayMonth() {
    let today = getTodayArr(new Date());
    let after = getTodayArr(new Date(new Date().setMonth(new Date().getMonth() + 1)));

    $("#searchStartDate").val(today[0] + "-" + today[1] + "-01");
    $("#searchEndDate").val(after[0] + "-" + after[1] + "-01");

    readVacation();
}

//날짜 검색
function readVacation() {
    let sendData = {};
    sendData.startDate = $("#searchStartDate").val();
    sendData.endDate = $("#searchEndDate").val();

    if (chkDate(sendData.startDate, sendData.endDate)) {
        alert("올바른 기간을 선택해주세요.");
        return;
    }

    request('GET', getURL('vacation/approve', sendData), setAppliedVacationList);
    request('GET', getURL('vacation/approve/history', sendData), setHistoryVacationList);
}

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

function setTable(table, res) {
    $("#" + table).empty();

    if (res.data.length === 0) {
        let html = '<tr><td colspan="6" class="empty-tr">신청이 없습니다.</td></tr>'
        $("#" + table).html(html);
        return false;
    }

    res.data = res.data.sort(function (a, b) {
        let x = new Date(a.startDate.toLowerCase()).getTime();
        let y = new Date(b.startDate.toLowerCase()).getTime();
        if (x > y) {
            return -1;
        }
        if (x < y) {
            return 1;
        }
        return 0;
    });

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
        $("#" + table).append(html);
    }
}