request('GET', getURL('department', getQuery().id), setDepartmentInfo);

function setDepartmentInfo(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDD001') {
        let data = res.readDetailDepartmentDTO;
        $("#departmentName").val(data.departmentName);
        $("#leaderName").text(data.leaderName);
        $("#headCount").text(data.headCount);
    } else if (res.code === 'RDD002') {
        alert("부서 상세 보기 실패");
    }
}