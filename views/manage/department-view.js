//부서 정보 상세 보기
request('GET', getURL('department', getQuery().id), setDepartmentInfo, true);

function setDepartmentInfo(res) {
    if (res.code === 'A1611') {
        let data = res.data.readDetailDepartmentDTO;
        $("#departmentName").val(data.departmentName);
        if (data.leaderName === "파트장이 지정되지 않음") {
            $("#leaderName").text("");
        } else {
            $("#leaderName").text(data.leaderName);
        }
        $("#headCount").text(data.headCount);

        let member = res.data.readDepartmentMemberListDTO;
        setDepartmentMemberList(member, data.leaderId, data.leaderName)

        // 해당 부서 외 직원 리스트
        request('GET', getURL('department/readNotThisDepartmentMember', getQuery().id),
            setOtherMemberList, false);
    }
}

// 해당 부서원 리스트 셋팅
function setDepartmentMemberList(member, leaderId, leaderName) {
    $("#depMemberList").empty();
    $("#memberGroup").empty();
    $("#leaderAndMemberList").empty();

    if (member.length === 0) {
        let html = '<tr><td colspan="3">아직 추가된 부서원이 없습니다.</td></tr>'

        $("#depMemberList").append(html);
        $("#memberGroup").append(html);
        $("#leaderAndMemberList").append(html);

        return;
    }

    let count = 1

    if (leaderId !== '파트장이 지정되지 않음' && leaderName !== '파트장이 지정되지 않음') {
        let leader1 = '<tr class="leader"><td>' + count + '</td>'
        let leader2 = '<tr class="leader">' +
            '<td><input class="form-check-input" type="checkbox" ' +
            'name="depMember" value=\'' + leaderId + '\'></td>';

        let leader = '<td>* ' + leaderName + '</td>' +
            '<td>' + leaderId + '</td>' +
            '</tr>';

        $("#depMemberList").append(leader1 + leader);
        $("#memberGroup").append(leader2 + leader);
        $("#leaderAndMemberList").append(leader2 + leader);

        count += 1
    }

    for (let i = 0; i < member.length; i++) {
        if (member[i].memberId !== leaderId) {
            let html = '';
            html += '<td>' + member[i].memberName + '</td>';
            html += '<td>' + member[i].memberId + '</td>' + '</tr>';

            let html1 = '<tr>' + '<td>' + count + '</td>' + html;
            $("#depMemberList").append(html1);

            let html2 = '<tr>' +
                '<td><input class="form-check-input" type="checkbox" ' +
                'name="depMember" value=\'' + member[i].memberId + '\'></td>' + html;
            $("#memberGroup").append(html2);

            let html3 = '<tr>' +
                '<td><input class="form-check-input" type="checkbox" ' +
                'name="leader" value=\'' + member[i].memberId + '\'></td>' + html;
            $("#leaderAndMemberList").append(html3);

            count += 1
        }
    }
}

//부서 소속 외 직원 리스트
function setOtherMemberList(res) {
    if (res.code === 'A1612') {
        let member = res.data;
        $("#otherGroup").empty();
        for (let i = 0; i < member.length; i++) {
            let html = '<tr>' +
                '<td><input class="form-check-input" type="checkbox" ' +
                'name="otherMember" value=\'' + member[i].memberId + '\'></td>' +
                '<td>' + member[i].memberName + '</td>' +
                '<td>' + member[i].memberId + '</td>' +
                '</tr>'
            $("#otherGroup").append(html);
        }
    }
}

//부서 이름 수정
function modifyDepartmentName() {
    let saveData = {};
    saveData.dep_id = getQuery().id;
    saveData.departmentName = $("#departmentName").val();

    requestWithData('PUT', getURL('department', getQuery().id), saveData,
        modifyAlertDepartmentName, true);
}

function modifyAlertDepartmentName(res) {
    if (res.code === 'A1620') {
        alert("변경되었습니다.");
        location.reload();
    }
}

//리더는 한명만 선택 가능
$(document).on('click', 'input[name="leader"]', function () {
    if ($(this).prop('checked')) {
        $('input[type="checkbox"][name="leader"]').prop('checked', false);
        $(this).prop('checked', true);
    }
});

//리더 변경
function modifyLeader() {
    let sendData = {};
    sendData.dep_id = getQuery().id;
    sendData.memberId = $("input:checkbox[name='leader']:checked").val();
    requestWithData('PUT', getURL('department/updateLeader', getQuery().id),
        sendData, modifyAlertLeader, true);
}

function modifyAlertLeader(res) {
    if (res.code === 'A1621') {
        alert("파트장이 변경되었습니다.");
        location.reload();
    }
}

//부서원 삭제
function deleteDepartmentMember() {
    $("input[name='depMember']:checked").each(function () {
        request('DELETE', getURL('department/deleteMember', $(this).val()),
            deleteDepartmentMemberRefresh, true);
    });
}

function deleteDepartmentMemberRefresh(res) {
    if (res.code === 'A1631') {
        request('GET', getURL('department', getQuery().id), setDepartmentInfo);
    }
}

//부서원 추가
function addDepartmentMember() {
    $("input[name='otherMember']:checked").each(function () {
        let sendData = {};
        sendData.memberId = $(this).val();
        sendData.dep_id = getQuery().id;

        requestWithData('PUT', getURL('department/addMember', getQuery().id),
            sendData, addDepartmentMemberRefresh, true);
    });
}

function addDepartmentMemberRefresh(res) {
    if (res.code === 'A1622') {
        request('GET', getURL('department', getQuery().id), setDepartmentInfo);
    }
}

// 부서 삭제 경고창
function alertRemoveDepartment() {
    if (confirm("한 번 삭제한 부서 정보는 되돌릴 수 없습니다.\n부서를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('department', getQuery().id), removeDepartment, true)
    } else {
        return false;
    }
}

// 부서삭제
function removeDepartment(res) {
    if (res.code === 'A1630') {
        alert("부서가 삭제되었습니다.");
        history.back()
    }
}