//조직도 조회
request('GET', 'department/readOrganizationChart', readOrganization, true);

let positionList = ['사장', '대표', '이사', '부장', '과장', '차장', '대리',
    '주임', '실장', '팀장', '센터장', '사원', '연구원'];

function readOrganization(res) {
    if (res.code === 'A1640') {
        let data = res.data;

        $("#organizationList").empty();
        setOrganization(data);
    }
}

function setOrganization(data) {
    for (let i = 0; i < data.length; i++) {
        let html = '';
        html += '<div class="organization-name">🔸 ' + data[i].departmentName + '</div>'
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
                '직위 : ' + member[j].position + '<br>' +
                '연락처 : ' + member[j].phone +
                '</div>' +
                '</div>'
        }
        html += '</div>';
        $("#organizationList").append(html);
    }
}