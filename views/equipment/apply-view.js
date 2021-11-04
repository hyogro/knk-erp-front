request('GET', getURL('fixtures', getQuery().id), detailEquipmentList, true);

function detailEquipmentList(res) {
    if (res.code === 'A4120') {
        if (!res.data.check) {
            $("#controlBtn").show();
        } else {
            $("#controlBtn").hide();
        }

        $("#equipmentList").empty();
        let data = res.data.readDetailFixturesDTO;
        for (let i = 0; i < data.length; i++) {
            let html = ' <tr>' +
                '<td class="no">' + (i + 1) + '</td>' +
                '<td class="text-left">' + data[i].fixturesName + '</td>' +
                '<td>' + data[i].amount + '</td>' +
                '<td class="text-left memo">' + data[i].memo + '</td>';

            if (res.data.check) {
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

//수정 페이지 이동
function loadModifyPage() {
    location.href = '/equipment/apply/write?id=' + getQuery().id;
}

//비품 신청서 삭제
function deleteAlertMyApply() {
    if (confirm("비품 신청서를 삭제하시겠습니까?") === true) {
        let sendData = {};
        sendData.id = getQuery().id;
        requestWithData('DELETE', getURL('fixtures', getQuery().id),
            sendData, deleteMyApply, true);
    } else {
        return false;
    }
}

function deleteMyApply(res) {
    if (res.code === 'A4112') {
        alert("삭제되었습니다.");
        location.href = '/equipment/apply';
    }
}