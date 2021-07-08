//내 비품 요청 목록 리스트
request('GET', 'fixtures', setMyEquipmentList);

function setMyEquipmentList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RFF001') {
        $("#myEquipmentList").empty();
        let data = res.readFixturesFormDTO;

        if (data.length === 0) {
            let html = '<tr><td colspan="3">신청이 없습니다.</td></tr>';
            $("#myEquipmentList").append(html);
        }

        for (let i = 0; i < data.length; i++) {
            let html = '<tr onclick="loadDetailPage(' + data[i].fixturesFormId + ')">' +
                '<td class="no">' + (i + 1) + '</td>' +
                '<td>' + getToday(data[i].createDate) + '</td>';
            if (data[i].check) {
                html += '<td>처리완료</td>';
            } else {
                html += '<td class="yet-state">미처리</td>';
            }
            html += '</tr>';
            $("#myEquipmentList").append(html);
        }
    } else if (res.code === 'RFF002') {
        console.log("내 비품 요청 목록 읽기 실패");
    }
}

//상세보기 페이지 이동
function loadDetailPage(id) {
    location.href = '/equipment/apply/view?id=' + id;
}