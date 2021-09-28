//부서 정보 상세 보기
request('GET', getURL('department', getQuery().id), setDepartmentInfo);

function setDepartmentInfo(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDD001') {
        let data = res.readDetailDepartmentDTO;
        $("#departmentName").val(data.departmentName);
        if (data.leaderName === "파트장이 지정되지 않음") {
            data.leaderName = "";
        }
        $("#leaderName").text(data.leaderName);
        $("#headCount").text(data.headCount);

        let member = res.readDepartmentMemberListDTO;
        $("#depMemberList").empty();
        $("#memberGroup").empty();
        $("#leaderAndMemberList").empty();

        let leader1 = '<tr class="leader"><td>1</td>'
        let leader2 = '<tr class="leader">' +
            '<td><input class="form-check-input" type="checkbox" ' +
            'name="depMember" value=\'' + data.leaderId + '\'></td>';

        let leader = '<td>* ' + data.leaderName + '</td>' +
            '<td>' + data.leaderId + '</td>' +
            '</tr>';
        $("#depMemberList").append(leader1 + leader);
        $("#memberGroup").append(leader2 + leader);

        for (let i = 0; i < member.length; i++) {
            if (member[i].memberId != data.leaderId) {
                let html = '';
                html += '<td>' + member[i].memberName + '</td>';
                html += '<td>' + member[i].memberId + '</td>' + '</tr>';

                let html1 = '<tr>' + '<td>' + (i + 2) + '</td>' + html;
                $("#depMemberList").append(html1);

                let html2 = '<tr>' +
                    '<td><input class="form-check-input" type="checkbox" ' +
                    'name="depMember" value=\'' + member[i].memberId + '\'></td>' + html;
                $("#memberGroup").append(html2);

                let html3 = '<tr>' +
                    '<td><input class="form-check-input" type="checkbox" ' +
                    'name="leader" value=\'' + member[i].memberId + '\'></td>' + html;
                $("#leaderAndMemberList").append(html3);
            }
        }

        request('GET', getURL('department/readNotThisDepartmentMember', getQuery().id), setOtherMemberList);
    } else if (res.code === 'RDD002') {
        console.log("부서 상세 보기 실패");
    }
}

//부서 소속 외 직원 리스트
function setOtherMemberList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RNDM001') {
        let member = res.readDepartmentMemberListDTO;
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
    } else if (res.code === 'RNDM002') {
        console.log("부서원 제외 직원 리스트 보기 실패");
    }
}

//부서 이름 수정
function modifyDepartmentName() {
    let saveData = {};
    saveData.dep_id = getQuery().id;
    saveData.departmentName = $("#departmentName").val();
    requestWithData('PUT', getURL('department', getQuery().id), saveData, modifyAlertDepartmentName);
}

function modifyAlertDepartmentName(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'UD001') {
        alert("변경되었습니다.");
        location.reload();
    } else if (res.code === 'UD002') {
        alert("부서 수정 실패");
    } else if (res.code === 'UD003') {
        alert("이미 존재하는 부서입니다.");
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
        sendData, modifyAlertLeader);
}

function modifyAlertLeader(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'ULD001') {
        alert("파트장이 변경되었습니다.");
        location.reload();
    } else if (res.code === 'ULD002') {
        alert("부서 팀장 수정 실패");
    } else if (res.code === 'ULD003') {
        alert("부서 팀장 수정 실패\n 지정한 멤버가 해당 부서가 아닙니다.");
    } else if (res.code === 'ULD004') {
        alert("부서 멤버 추가 실패\n 존재하지 않은 멤버입니다.");
    }
}

//부서원 삭제
function deleteDepartmentMember() {
    $("input[name='depMember']:checked").each(function () {
        request('DELETE', getURL('department/deleteMember', $(this).val()), deleteDepartmentMemberRefresh);
    });
}

function deleteDepartmentMemberRefresh(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DDM001') {
        request('GET', getURL('department', getQuery().id), setDepartmentInfo);
    } else if (res.code === 'DDM002') {
        alert("부서 멤버 삭제 실패");
    } else if (res.code === 'DDM003') {
        alert("해당 부서의 파트장이므로 제외할 수 없습니다.");
    }
}

//부서원 추가
function addDepartmentMember() {
    $("input[name='otherMember']:checked").each(function () {
        let sendData = {};
        sendData.memberId = $(this).val();
        sendData.dep_id = getQuery().id;

        requestWithData('PUT', getURL('department/addMember', getQuery().id),
            sendData, addDepartmentMemberRefresh);
    });
}

function addDepartmentMemberRefresh(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'ADM001') {
        request('GET', getURL('department', getQuery().id), setDepartmentInfo);
    } else if (res.code === 'ADM002') {
        alert("부서 멤버 추가 실패");
    } else if (res.code === 'ADM003') {
        alert("다른 부서의 파트장이므로 추가할 수 없습니다.");
    }
}

function alertRemoveDepartment() {
    if (confirm("한 번 삭제한 부서 정보는 되돌릴 수 없습니다.\n부서를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('department', getQuery().id), removeDepartment)
    } else {
        return false;
    }
}

function removeDepartment(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DD001') {
        alert("부서가 삭제되었습니다.");
        history.back()
    } else if (res.code === 'DD002') {
        alert("부서 삭제를 실패하였습니다.")
    }
}