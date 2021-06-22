//부서 옵션 셋팅
request('GET', 'department', setDepartmentList);

//부서 옵션 셋팅
function setDepartmentList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RD001') {
        $("#departmentList").empty();
        let data = res.readDepartmentDTO;
        for (let i = 0; i < data.length; i++) {
            if (data[i].leaderName === "리더없음") {
                data[i].leaderName = "";
            }
            let html = '<tr id=\'' + data[i].dep_id + '\' ' +
                'onclick="location.href = \'/manage/department/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].departmentName + '</td>' +
                '<td>' + data[i].leaderName + '</td>' +
                '<td>' + data[i].headCount + '</td>' +
                '</tr>';
            $("#departmentList").append(html);
        }
    } else if (res.code === 'RD002') {
        console.log("부서 목록 읽기 실패");
    }
}

//부서생성
function createDepartment() {
    let saveData = {};
    saveData.departmentName = $("#createDep").val();
    requestWithData('POST', 'department', saveData, createAlertDepartment);
}

//부서생성 알림창
function createAlertDepartment(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CD001') {
        alert("부서가 생성되었습니다.");
        location.reload();
    } else if (res.code === 'CD002') {
        alert("부서 생성 실패");
    } else if (res.code === 'CD003') {
        alert("이미 존재하는 부서입니다.");
    }
}