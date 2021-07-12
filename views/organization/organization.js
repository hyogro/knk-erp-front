//조직도 조회
request('GET', 'department/readOrganizationChart', readOrganization);

function readOrganization(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'ROC001') {
        let data = res.organizationChartDTO;
        setOrganization(data);
    } else if (res.code === 'ROC002') {
        console.log("조직도 조회 실패");
    }
}

function setOrganization(data) {
    let positionList = ['사장', '대표', '이사', '부장', '과장', '차장', '대리',
        '주임', '실장', '팀장', '센터장', '사원', '연구원'];
    console.log(data);
    $("#organizationList").empty();
    for (let i = 0; i < data.length; i++) {
        let html = '';
        html += '<div class="organization-name">🔹 ' + data[i].departmentName + '</div>'
        html += '<div class="organization-content">'
        let member = data[i].organizationChartMemberInfoDTO;
        member.sort(function (a, b) {
            let x = a.position;
            let y = b.position;

            if (positionList.indexOf(x) > positionList.indexOf(y)) return 1;
            else if (positionList.indexOf(x) === positionList.indexOf(y)) return 0;
            else if (positionList.indexOf(x) < positionList.indexOf(y)) return -1;
        });
        for (let j = 0; j < member.length; j++) {
            member[j].position = member[j].position === null ? '' : member[j].position;
            member[j].phone = member[j].phone === null ? '' : member[j].phone;
            html += ' <div class="card border-secondary mb-3">' +
                '<div class="card-header">' + member[j].memberName + '</div>' +
                '<div class="card-body text-secondary">' +
                '직급 : ' + member[j].position + '<br>' +
                '연락처 : ' + member[j].phone +
                '</div>' +
                '</div>'
        }
        html += '</div>';
        $("#organizationList").append(html);
    }
}