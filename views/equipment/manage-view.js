let authority = $.cookie('authority');
if (authority !== "MANAGE") {
    $("#comfirmBtns").show();
}

request('GET', getURL('fixtures', getQuery().id), detailEquipmentList, true);

let applyState = false;

function detailEquipmentList(res) {
    if (res.code === 'A4120') {
        $("#authorName").text(res.data.authorName);
        $("#authorId").text(res.data.authorId);

        $("#equipmentList").empty();
        let data = res.data.readDetailFixturesDTO;
        for (let i = 0; i < data.length; i++) {
            let html = ' <tr>' +
                '<td><input type="checkbox" name="equipment" ' +
                'value=' + data[i].fixturesId + ' data-state=' + data[i].confirm + '></td>' +
                '<td class="no">' + (i + 1) + '</td>' +
                '<td class="text-left">' + data[i].fixturesName + '</td>' +
                '<td>' + data[i].amount + '</td>' +
                '<td class="text-left memo">' + data[i].memo + '</td>';

            applyState = res.data.check;
            if (applyState) {
                if (data[i].confirm) {
                    html += '<td><span class="badge bg-primary">승인</span></td>';
                    html += '<td>' + (data[i].purchase ? '완료' : ' ') + '</td>';
                } else {
                    html += '<td><span class="badge bg-danger">거절</span></td>';
                    html += '<td> </td>';
                }
            } else {
                html += '<td> </td>';
                html += '<td> </td>';
            }

            html += '</tr>';
            $("#equipmentList").append(html);
        }
    }
}

$("#all").click(function () {
    if ($("#all").is(':checked')) {
        $("input:checkbox[name='equipment']").prop("checked", true);
    } else {
        $("input:checkbox[name='equipment']").prop("checked", false);
    }
});

//승인, 거절 처리
function updateConfirmState(state) {
    if ($("input:checkbox[name='equipment']:checked").length === 0) {
        let stateText = state ? '승인' : '거절';
        alert(stateText + "할 항목을 선택해주세요.");
        return;
    }

    let sendData = {};
    sendData.fixturesFormId = getQuery().id;
    sendData.fixturesId = selectItems();
    sendData.confirm = state;

    requestWithData('PUT',
        getURL('fixtures/confirm', getQuery().id), sendData, updateAlertConfirmState, true)
}

//비품 승인,거절
function updateAlertConfirmState(res) {
    if (res.code === 'A4140') {
        location.reload();
    }
}

//구매여부 변경
function updatePurchaseState(state) {
    if ($("input:checkbox[name='equipment']:checked").length === 0) {
        alert("구매여부를 변경할 항목을 선택해주세요.");
        return;
    }

    if (!applyState) {
        alert("선택한 품목의 상태가 승인인 경우만 변경가능합니다.");
        return;
    }

    let falseCount = 0;
    $("input[name='equipment']:checked").each(function () {
        let state = $(this).data("state");
        if (($(this).val() !== 'all') && (!state || state === "false")) {
            falseCount++;
        }
    });

    if (falseCount > 0) {
        alert("선택한 품목의 상태가 승인인 경우만 변경가능합니다.");
    } else {
        let sendData = {};
        sendData.fixturesFormId = getQuery().id;
        sendData.fixturesId = selectItems();
        sendData.purchase = state;

        requestWithData('PUT',
            getURL('fixtures/purchase', getQuery().id), sendData, updateAlertPurchaseState, true)
    }
}

function updateAlertPurchaseState(res) {
    if (res.code === 'A4141') {
        location.reload();
    }
}

function selectItems() {
    let fixturesId = [];

    $("input[name='equipment']:checked").each(function () {
        let value = $(this).val();
        if (value === 'all') {
            $("input:checkbox[name='equipment']").prop("checked", false);
        } else {
            fixturesId.push(value);
        }
    });

    return fixturesId;
}