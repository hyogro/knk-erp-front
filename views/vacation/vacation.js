let vacationArr = [];

setBoardData();

function setBoardData() {
    //전체휴가 조회
    request('GET', 'vacation', setVacationList, false);
    request('GET', getURL('vacation/info', $.cookie("id")), setVacationInfo, false);
}

function setVacationInfo(res) {
    if (res.code === 'A5712') {
        let residue = (res.data.totalVacation + res.data.addVacation) - res.data.usedVacation;
        $("#residueVacation").text(makeDateForm(residue));
    }
}

// 초기 날짜 셋팅
function setVacationList(res) {
    if (res.code === 'A5712') {
        vacationArr = res.data;

        let dateSet = new Set();
        for (let i = 0; i < vacationArr.length; i++) {
            dateSet.add((vacationArr[i].startDate).toString().substring(0, 4));
            dateSet.add((vacationArr[i].endDate).toString().substring(0, 4));
        }
        let dateArr = Array.from(dateSet);
        for (let i = 0; i < dateArr.length; i++) {
            let date = dateArr[i].split("-");
            $("#year").append("<option>" + date[0] + "</option>");
        }

        searchVacationList();
    }
}

//내 휴가 검색(연도별)
function searchVacationList() {
    $("#confirmVacationList").empty();
    $("#beforeVacationList").empty();
    let year = $("#year").val();
    for (let i = 0; i < vacationArr.length; i++) {
        if ((vacationArr[i].startDate).substring(0, 4) === year ||
            (vacationArr[i].endDate).substring(0, 4) === year) {
            let html = '';
            html += '<tr id=\'' + vacationArr[i].id + '\' ' +
                'onclick="location.href = \'/vacation/view?id=\' + id">' +
                '<td>' + getToday(vacationArr[i].requestDate) + '</td>' +
                '<td>' + vacationArr[i].type + '</td>' +
                '<td>' + getToday(vacationArr[i].startDate) + '</td>' +
                '<td>' + getToday(vacationArr[i].endDate) + '</td>';

            if (vacationArr[i].reject || (vacationArr[i].approval1 && vacationArr[i].approval2)) {
                html += '<td>' + (vacationArr[i].reject ? '거절' : '승인') + '</td></tr>';
                $("#confirmVacationList").append(html);
            } else {
                $("#beforeVacationList").append(html);
            }
        }
    }

    if (isEmpty($("#confirmVacationList").text())) {
        let html = '<tr><td colspan="5">내역이 없습니다.</td></tr>'
        $("#confirmVacationList").append(html);
    }

    if (isEmpty($("#beforeVacationList").text())) {
        let html = '<tr><td colspan="4">내역이 없습니다.</td></tr>'
        $("#beforeVacationList").append(html);
    }
}