request('GET', getURL('fixtures', getQuery().id), detailEquipmentList);

function detailEquipmentList(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDFF001') {
        if (!res.readDetailFixturesFormDTO.check) {
            $("#modifyBtn").show();
            $("#deleteBtn").show();
        } else {
            $("#modifyBtn").hide();
            $("#deleteBtn").hide();
        }

        $("#equipmentList").empty();
        let data = res.readDetailFixturesFormDTO.readDetailFixturesDTO;
        for (let i = 0; i < data.length; i++) {
            let html = ' <tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td class="text-left">' + data[i].fixturesName + '</td>' +
                '<td>' + data[i].amount + '</td>' +
                '<td class="text-left">' + data[i].memo + '</td>';

            if (res.readDetailFixturesFormDTO.check) {
                if (data[i].confirm) {
                    html += '<td>Y</td>';
                    html += '<td>' + (data[i].purchase ? '완료' : ' ') + '</td>';
                } else {
                    html += '<td>N</td>';
                    html += '<td> </td>';
                }
                // html += '<td>' + (data[i].confirm ? 'Y' : 'N') + '</td>';
            } else {
                html += '<td> </td>';
                html += '<td> </td>';
            }

            html += '</tr>';
            $("#equipmentList").append(html);
        }
    } else if (res.code === 'RDFF002') {
        console.log("비품 요청서 상세보기 실패\n해당 요청서가 존재하지 않습니다.");
    }
}

//상세보기 페이지 이동
function loadModifyPage() {
    location.href = '/equipment/apply/write?id=' + getQuery().id;
}

//일정 삭제
function deleteAlertMyApply() {
    if (confirm("비품 신청서를 삭제하시겠습니까?") === true) {
        let sendData = {};
        sendData.id = getQuery().id;
        requestWithData('DELETE', getURL('fixtures', getQuery().id),
            sendData, deleteMyApply);
    } else {
        return false;
    }
}

function deleteMyApply(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DFF001') {
        alert("삭제되었습니다.");
        location.href = '/equipment/apply';
    } else if (res.code === 'DFF002') {
        console.log("비품 요청서 삭제 실패");
    } else if (res.code === 'DFF003') {
        alert("비품 요청서 상세보기 실패\n작성자가 아닙니다.");
    } else if (res.code === 'DFF004') {
        alert("비품 요청서 상세보기 실패\n이미 처리된 비품 요청서입니다.");
    }
}