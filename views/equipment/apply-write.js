//항목추가
function addRow() {
    let trCount = $("#applyMyEquipmentList tr").length + 1;
    let html = ' <tr>' +
        '<td>' + trCount + '</td>' +
        '<td>' + '<input type="text" id=' + trCount + 'FixturesName' + '>' + '</td>' +
        '<td>' +
        '<input type="text" id=' + trCount + 'Amount' + ' oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');">' +
        '</td>' +
        '<td>' + '<input type="text" id=' + trCount + 'Memo' + '>' + '</td>' +
        '</tr>';
    $("#applyMyEquipmentList:last").append(html);
}

//항목 삭제
function deleteRow() {
    let trCount = $("#applyMyEquipmentList tr").length;
    if (trCount > 1) {
        $("#applyMyEquipmentList tr:last").remove();
    } else {
        alert("비품 신청 항목은 최소 1개 이상이어야 합니다.")
    }
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
    requestWithData('POST', 'fixtures', saveData, applyAlertEquipment)
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