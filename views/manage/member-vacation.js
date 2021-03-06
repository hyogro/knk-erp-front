$("#memberName").text(getQuery().name);

request('GET', getURL('vacation/add/list', getQuery().id), setAddVacationList, false);

function setAddVacationList(res) {
    if (res.code === 'A5702') {
        let authority = $.cookie('authority');
        if (authority !== "LVL1" && authority !== "LVL2" && authority !== "MANAGE") {
            $("#addBtn").show();
        } else {
            $("#addBtn").hide();
        }

        $("#addVacationList").empty();

        if (res.data.length === 0) {
            let html = '<tr><td colspan="5">내역이 없습니다.</td></tr>';
            $("#addVacationList").append(html);
        }

        for (let i = 0; i < res.data.length; i++) {
            let html = '<tr data-bs-toggle="modal" data-bs-target="#detailAddVacationModal"' +
                'onclick="request(\'GET\', getURL(\'vacation/add\', ' + res.data[i].id + '), detailAddVacationModal, false)">' +
                '<td>' + res.data[i].id + '</td>' +
                '<td>' + (res.data[i].increase === true ? "추가" : "차감") + '</td>' +
                '<td>' + res.data[i].date + '일</td>' +
                '<td>' + res.data[i].giverName + '(' + res.data[i].giverId + ')</td>' +
                '<td>' + getToday(res.data[i].createDate) + '</td>' +
                '</tr>';
            $("#addVacationList").append(html);
        }
    }
}

function setMark(value) {
    if (value === "true" || value === true) {
        $("#addMark").text('');
    } else {
        $("#addMark").text('-');
    }
}

//추가 휴가 생성
function saveAddVacation() {
    let saveData = {};
    saveData.increase = $("#addIncrease").val();
    saveData.date = $("#addDate").val();
    if (saveData.increase !== 'true' && saveData.increase !== true) {
        saveData.date = saveData.date * (-1);
    }
    saveData.memo = $("#addMemo").val();
    saveData.receiverId = getQuery().id;

    if (isEmpty(saveData.date)) {
        alert("일수를 입력해주세요.");
        return;
    } else if (isEmpty(saveData.memo)) {
        alert("사유를 입력해주세요.");
        return;
    }

    requestWithData('POST', 'vacation/add', saveData, saveAlertAddVacation, true);
}

function saveAlertAddVacation(res) {
    if (res.code === 'A5701') {
        alert("저장되었습니다.");
        location.reload();
    }
}

//추가 휴가 자세히 보기
function detailAddVacationModal(res) {
    if (res.code === 'A5702') {
        let data = res.data;
        $("#increase").text((data.increase === true ? '추가' : '차감'));
        $("#date").text(data.date + "일");
        $("#giver").text(data.giverName + "(" + data.giverId + ")");
        $("#createDate").text(getToday(data.createDate));
        $("#memo").text(data.memo);

        $("#deleteBtn").empty();
        if (data.giverId === $.cookie('id')) {
            let html = '<button type="button" class="btn btn-danger" ' +
                'onclick="request(\'DELETE\', getURL(\'vacation/add\',' + data.id + '), ' +
                'deleteAddVacation, true)">삭제</button>';
            $("#deleteBtn").html(html);
        }
    }
}

function deleteAddVacation(res) {
    if (res.code === 'A5704') {
        alert("부여한 휴가가 삭제되었습니다.");
        location.reload();
    }
}