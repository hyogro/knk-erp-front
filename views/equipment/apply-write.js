let equipmentArr = [];

//글 수정일 때 셋팅
if (!isEmpty(getQuery().id)) {
    request('GET', getURL('fixtures', getQuery().id), detailEquipmentList);
} else {
    equipmentArr.push(1);
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
                '<td><input type="checkbox" name="equipment" ' +
                'value=' + equipmentArr.length + '></td>' +
                // '<td>' + (i + 1) + '</td>' +
                '<td>' + '<input type="text" id=' + equipmentArr.length + 'FixturesName' +
                ' value=\'' + data[i].fixturesName + '\'>' + '</td>' +
                '<td>' +
                '<input type="text" id=' + equipmentArr.length + 'Amount' +
                ' value=\'' + data[i].amount + '\' ' +
                'oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');">' +
                '</td>' +
                '<td>' + '<input type="text" id=' + equipmentArr.length + 'Memo' +
                ' value=\'' + data[i].memo + '\'>' + '</td>' +
                '</tr>';
            $("#applyMyEquipmentList").append(html);
            equipmentArr.push(1);
        }
    } else if (res.code === 'RDFF002') {
        console.log("비품 요청서 상세보기 실패\n해당 요청서가 존재하지 않습니다.");
    }
}

$("#all").click(function (){
    if ($("#all").is(':checked')) {
        $("input:checkbox[name='equipment']").prop("checked", true);
    } else {
        $("input:checkbox[name='equipment']").prop("checked", false);
    }
});

//항목추가
function addRow() {
    let html = '<tr>' +
        '<td><input type="checkbox" name="equipment" value=' + equipmentArr.length + '></td>' +
        // '<td>' + trCount + '</td>' +
        '<td>' + '<input type="text" id=' + equipmentArr.length + 'FixturesName' + '>' + '</td>' +
        '<td>' +
        '<input type="text" id=' + equipmentArr.length + 'Amount' +
        ' oninput="this.value = this.value.replace(/[^0-9.]/g, \'\').replace(/(\\..*)\\./g, \'$1\');">' +
        '</td>' +
        '<td>' + '<input type="text" id=' + equipmentArr.length + 'Memo' + '>' + '</td>' +
        '</tr>';
    $("#applyMyEquipmentList:last").append(html);
    equipmentArr.push(1);
}


//항목 삭제
function deleteRow() {
    if ($("input:checkbox[name='equipment']:checked").length === 0) {
        alert("삭제할 항목을 선택해주세요.");
    }

    $("input[name='equipment']:checked").each(function () {
        let index = $(this).val();
        $("#applyMyEquipmentList").find("tr:eq(" + index + ")").remove();
        equipmentArr[index] = 0;
    });
}

//비품 빈 값 체크
function chkEquipmentEmpty() {
    for (let i = 0; i < equipmentArr.length; i++) {
        if (equipmentArr[i] === 1) {
            let fixturesName = $("#" + i + 'FixturesName').val();
            let amount = $("#" + i + 'Amount').val();
            if (isEmpty(fixturesName) || isEmpty(amount)) {
                return false;
                break;
            }
        }
    }
}

//비품 신청
function applyEquipment() {
    if ($("#applyMyEquipmentList tr").length === 0) {
        alert("비품 신청 항목은 최소 1개 이상이어야 합니다.");
        return;
    }

    if (chkEquipmentEmpty() === false) {
        alert("품명과 수량은 반드시 입력해야합니다.");
        return;
    }

    let saveData = {};
    let fixturesDTOReq = [];

    for (let i = 0; i < equipmentArr.length; i++) {
        if (equipmentArr[i] === 1) {
            let fixturesName = $("#" + i + 'FixturesName').val();
            let amount = $("#" + i + 'Amount').val();
            let memo = $("#" + i + 'Memo').val();

            let data = {};
            data.fixturesName = fixturesName;
            data.amount = parseInt(amount);
            data.memo = memo;
            fixturesDTOReq.push(data);
        }
    }

    console.log(saveData);
    if (!isEmpty(getQuery().id)) {
        saveData.fixturesFormId = getQuery().id;
        saveData.updateFixturesDTOReq  = fixturesDTOReq;
        console.log(saveData);
        requestWithData('PUT',
            getURL('fixtures', getQuery().id), saveData, applyModifyAlertEquipment);
    } else {
        saveData.fixturesDTOReq = fixturesDTOReq;
        requestWithData('POST', 'fixtures', saveData, applyAlertEquipment);
    }
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

function applyModifyAlertEquipment(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'UFF001') {
        // alert("신청되었습니다.")
        // location.href = "/equipment/apply";
    } else if (res.code === 'UFF002') {
        console.log("비품 요청 수정 실패");
    } else if (res.code === 'UFF003') {
        alert("비품 요청 수정 실패\n비품 요청서 작성자가 아닙니다.");
    } else if (res.code === 'UFF004') {
        alert("비품 요청 생성 실패\n이미 처리된 비품 요청서입니다.");
    }
}