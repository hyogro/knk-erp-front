//부서 옵션 셋팅
request('GET', 'department', setDepartmentOption);
function setDepartmentOption(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RD001') {
        console.log(res)
        let data = res.readDepartmentDTO;
        $("#departmentName").empty();
        for (let i = 0; i < data.length; i++) {
            let html = '<option value=\'' + data[i].dep_id + '\'>' +
                data[i].departmentName + '</option>';
            $("#departmentName").append(html);
        }
        request('GET', getURL('account', getQuery().id), setMemberInfo);
    } else if (res.code === 'RD002') {
        console.log("부서 목록 읽기 실패");
    }
}

//직원 정보 셋팅
function setMemberInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RDA001') {
        console.log(res)
        let data = res.readDetailAccountDTO;
        $("#memberId").text(data.memberId);
        $("#memberName").text(data.memberName);
        let phone = (data.phone).split("-");
        $("#phone1").val(phone[0]);
        $("#phone2").val(phone[1]);
        $("#phone3").val(phone[2]);
        $("#email").val(data.email);
        $("#address").val(data.address);
        $("#departmentName").val(data.dep_id);
        $("#authority").val(data.authority);
        $("#joiningDate").val(data.joiningDate);
        $("#addVacation").val(data.vacation/480);

        //휴가 정보
        request('GET', getURL('vacation/info', data.memberId), setVacationInfo);
    } else if (res.code === 'RDA002') {
        console.log("회원정보 상세보기 실패");
    }
}

//직원 휴가 정보
function setVacationInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVI001') {
        let hourMinutes = 480;
        $("#totalVacation").text(res.data.totalVacation / hourMinutes + "일");
        $("#usedVacation").text(makeDateForm(res.data.usedVacation));
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + res.data.addVacation) - res.data.usedVacation));
    } else if (res.code === 'RVI002') {
        console.log("휴가 정보 조회 실패");
    }
}

//변경 사항 value 체크
function chkUpdateMemberInfo() {
    let saveData = {};

    //비밀번호
    let pass1 = $("#password1").val();
    let pass2 = $("#password2").val();
    if (!isEmpty(pass1) && !isEmpty(pass2)) {
        if (!chkPW(pass1, 'chkPassword') || !matchPW(pass1, pass2, 'matchPassword')) {
            alert("비밀번호를 확인해주세요.");
            return;
        } else {
            saveData.password = pass1;
        }
    }

    //폰번호
    let phone1 = $("#phone1").val();
    let phone2 = $("#phone2").val();
    let phone3 = $("#phone3").val();
    if (!isEmpty(phone2) && phone2.length < 4) {
        $("#phone2").focus();
        alert("올바른 연락처를 입력해주세요.");
        return;
    } else if (!isEmpty(phone3) && phone3.length < 4) {
        $("#phone3").focus();
        alert("올바른 연락처를 입력해주세요.");
        return;
    } else {
        saveData.phone = phone1 + '-' + phone2 + '-' + phone3;
    }

    //이메일
    let email = $("#email").val();
    if (!chkEmail(email) && !isEmpty(email)) {
        $("#email").focus();
        alert("올바른 이메일 주소를 입력해주세요.");
        return;
    } else {
        saveData.email = email;
    }

    //주소
    let address = $("#address").val();
    if (!isEmpty(address)) {
        saveData.address = address;
    }

    //부서
    let department = $("#departmentName").val();
    if (!isEmpty(department)) {
        saveData.dep_id = department;
    }

    //권한
    let authority = $("#authority").val();
    if (!isEmpty(authority)) {
        saveData.authority = authority;
    }

    //입사일
    let joiningDate = $("#joiningDate").val();
    if (isEmpty(joiningDate)) {
        alert("입사일을 선택해주세요.");
        return;
    } else {
        saveData.joiningDate = joiningDate;
    }

    //추가휴가
    let vacation = $("#addVacation").val();
    if (!isEmpty(vacation)) {
        saveData.vacation = vacation;
    }

    requestWithData('PUT', getURL('account', $("#memberId").text()), saveData, updateMemberInfo);
}

//변경 사항 저장
function updateMemberInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'UA001') {
        alert("저장되었습니다.");
        location.reload();
    } else if (res.code === 'UA002') {
        console.log("회원정보 수정 실패");
    } else if (res.code === 'UA003') {
        alert("권한이 없습니다.");
    } else if (res.code === 'UA004') {
        alert("파트장은 부서 수정이 불가능합니다.");
    }
}

//TODO:계정생성 하고 나서 테스트해보기
//멤버 삭제
function deleteAlertMember() {
    if (confirm("직원 정보를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('account', $("#memberId").text()), deleteMember);
    } else {
        return false;
    }
}

//일정 삭제
function deleteMember(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'DA001') {
        alert("삭제되었습니다.");
        location.href='/manage/member';
    } else if (res.code === 'DA002') {
        alert("삭제 실패");
    } else if (res.code === 'DA003') {
        alert("삭제 실패.\n 권한이 없습니다.");
    } else if (res.code === 'DA004') {
        alert("삭제 실패.\n 대상이 존재하지 않습니다.");
    }
}