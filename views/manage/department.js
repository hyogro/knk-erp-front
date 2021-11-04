request('GET', 'department', setDepartmentList, false);

function setDepartmentList(res) {
    if (res.code === 'A1610') {
        $("#departmentList").empty();
        let data = res.data;

        if (data.length === 0) {
            let html = '<tr><td colspan="4">아직 추가된 부서가 없습니다.</td></tr>'
            $("#departmentList").append(html);
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].leaderName === "리더없음") {
                data[i].leaderName = "";
            }
            let html = '<tr id=\'' + data[i].dep_id + '\' ' +
                'onclick="location.href = \'/manage/department/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].departmentName + '</td>' +
                '<td>' + (isEmpty(data[i].leaderName) ? "-" : data[i].leaderName) + '</td>' +
                '<td>' + data[i].headCount + '</td>' +
                '</tr>';
            $("#departmentList").append(html);
        }
    }
}

//부서생성
function createDepartment() {
    let saveData = {};
    saveData.departmentName = $("#createDep").val();
    requestWithData('POST', 'department', saveData, createAlertDepartment, true);
}

//부서생성 알림창
function createAlertDepartment(res) {
    if (res.code === 'A1600') {
        let departmentName = $("#createDep").val();
        alert("[" + departmentName + "] 부서가 생성되었습니다.");
        location.reload();
    }
}