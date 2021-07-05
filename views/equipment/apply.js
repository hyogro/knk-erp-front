//내 비품 요청 목록 리스트
request('GET', 'fixtures', setMyEquipmentList);

function setMyEquipmentList(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RFF001') {
        $("#myEquipmentList").empty();
        let data = res.readFixturesFormDTO;
        for (let i = 0; i < data.length; i++) {
            let html = '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + getToday(data[i].createDate) + '</td>' +
                '<td>' + (data[i].check ? '처리완료' : '처리전') + '</td>' +
                '</tr>';
            $("#myEquipmentList").append(html);
        }
    } else if (res.code === 'RFF002') {
        console.log("내 비품 요청 목록 읽기 실패");
    }
}