//글 수정일 때 셋팅
if (!isEmpty(getQuery().id)) {
    request('GET', getURL('fixtures', getQuery().id), detailEquipmentList);
}

function detailEquipmentList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDFF001') {
        $("#applyMyEquipmentList").empty();
        let data = res.readDetailFixturesFormDTO.readDetailFixturesDTO;
        for (let i = 0; i < data.length; i++) {
            let html = '<tr>' +
                '<td><input type="checkbox" name="equipment" value=' + i + '></td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + '<input type="text" id=' + (i + 1) + 'FixturesName' + ' value=\'' + data[i].fixturesName + '\'>' + '</td>' +
                '<td>' +
                '<input type="text" id=' + (i + 1) + 'Amount' + ' value=\'' + data[i].amount + '\' ' +
                'oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');">' +
                '</td>' +
                '<td>' + '<input type="text" id=' + (i + 1) + 'Memo' + ' value=\'' + data[i].memo + '\'>' + '</td>' +
                '</tr>';
            $("#applyMyEquipmentList").append(html);
        }
    } else if (res.code === 'RDFF002') {
        console.log("비품 요청서 상세보기 실패\n해당 요청서가 존재하지 않습니다.");
    }
}

//항목추가
function addRow() {
    let trCount = $("#applyMyEquipmentList tr").length + 1;
    let html = '<tr>' +
        '<td><input type="checkbox" name="equipment" value=' + (trCount - 1) + '></td>' +
        '<td>' + trCount + '</td>' +
        '<td>' + '<input type="text" id=' + trCount + 'FixturesName' + '>' + '</td>' +
        '<td>' +
        '<input type="text" id=' + trCount + 'Amount' +
        ' oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');">' +
        '</td>' +
        '<td>' + '<input type="text" id=' + trCount + 'Memo' + '>' + '</td>' +
        '</tr>';
    $("#applyMyEquipmentList:last").append(html);
}

//항목 삭제
function deleteRow() {
    $("input[name=equipment]:checked").each(function(){
        let index = $(this).val();
        $("#applyMyEquipmentList").find("tr:eq("+ index +")").remove();
    });

    // let trCount = $("#applyMyEquipmentList tr").length;
    // if (trCount > 1) {
    //     $("#applyMyEquipmentList tr:last").remove();
    // } else {
    //     alert("비품 신청 항목은 최소 1개 이상이어야 합니다.")
    // }
}

//비품 빈 값 체크
function chkEquipmentEmpty() {
    let trCount = $("#applyMyEquipmentList tr").length;
    for (let i = 1; i <= trCount; i++) {
        let fixturesName = $("#" + i + 'FixturesName').val();
        let amount = $("#" + i + 'Amount').val();
        if (isEmpty(fixturesName) || isEmpty(amount)) {
            return false;
            break;
        }
    }
}

//비품 신청
function applyEquipment() {
    if (chkEquipmentEmpty() === false) {
        alert("품명과 수량은 반드시 입력해야합니다.");
        return;
    }

    let saveData = {};
    let fixturesDTOReq = [];

    let trCount = $("#applyMyEquipmentList tr").length;
    for (let i = 1; i <= trCount; i++) {
        let fixturesName = $("#" + i + 'FixturesName').val();
        let amount = $("#" + i + 'Amount').val();
        let memo = $("#" + i + 'Memo').val();

        let data = {};
        data.fixturesName = fixturesName;
        data.amount = parseInt(amount);
        data.memo = memo;
        fixturesDTOReq.push(data);
    }

    saveData.fixturesDTOReq = fixturesDTOReq;
    requestWithData('POST', 'fixtures', saveData, applyAlertEquipment);
}

function applyAlertEquipment(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CFF001') {
        alert("신청되었습니다.")
        location.href = "/equipment/apply";
    } else if (res.code === 'CFF002') {
        console.log("비품 요청 생성 실패");
    }
}