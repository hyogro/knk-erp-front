request('GET', getURL('department', getQuery().id), setDepartmentInfo);

function setDepartmentInfo(res) {
    console.log(res);
}