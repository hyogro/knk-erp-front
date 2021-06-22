request('GET', 'account', setMemberList);

//직원 리스트 셋팅
function setMemberList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RA001') {
        $("#memberList").empty();
        let data = res.readAccountDTO;
        for (let i = 0; i < data.length; i++) {
            let html = '<tr id=\'' + data[i].memberId + '\' ' +
                'onclick="location.href = \'/manage/member/view?id=\' + id">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].memberName + '</td>' +
                '<td>' + data[i].memberId + '</td>' +
                '<td>' + data[i].departmentName + '</td>' +
                '<td>' + data[i].phone + '</td>' +
                '<td>' + getToday(data[i].joiningDate) + '</td>' +
                '</tr>';
            $("#memberList").append(html);
        }
    } else if (res.code === 'RA002') {
        console.log("회원정보 목록 읽어오기 실패");
    }
}