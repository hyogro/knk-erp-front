let vacationArr = [];

setBoardData();

function setBoardData() {
    //전체휴가 조회
    request('GET', 'vacation', setVacationList);
}

function setVacationList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVL001') {
        vacationArr = res.data;
        setDateSelector();
    } else if (res.code === 'RVL002') {
        alert("휴가목록 조회 실패");
    }
}

// 초기 날짜 셋팅
function setDateSelector() {
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

//내 휴가 검색(연도별)
function searchVacationList() {
    $("#confirmVacationList").empty();
    $("#beforeVacationList").empty();
    let year = $("#year").val();
    for (let i = 0; i < vacationArr.length; i++) {
        if ((vacationArr[i].startDate).substring(0, 4) === year ||
            (vacationArr[i].endDate).substring(0, 4) === year) {
            let html = '';
            html += '<tr id=\'' + vacationArr[i].id + '\'>' +
                // '<td>' + (i + 1) + '</td>' +
                '<td>' + getToday(vacationArr[i].requestDate) + '</td>' +
                '<td>' + vacationArr[i].title.split("-")[1] + '</td>' +
                '<td>' + getToday(vacationArr[i].startDate) + '</td>' +
                '<td>' + getToday(vacationArr[i].endDate) + '</td>' +
                '<td>' + (vacationArr[i].reject ? '거절' : '승인') + '</td>' +
                '<td>' + vacationArr[i].memo + '</td>' +
                '</tr>';

            if(vacationArr[i].reject || (vacationArr[i].approval1 && vacationArr[i].approval2)){
                $("#confirmVacationList").append(html);
            }
            else{
                $("#beforeVacationList").append(html);
            }
        }
    }
}