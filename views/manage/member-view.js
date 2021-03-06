//부서 옵션 셋팅
request('GET', 'department', setDepartmentOption, false);

function setDepartmentOption(res) {
    if (res.code === 'A1610') {
        let data = res.data;
        $("#departmentName").empty();
        for (let i = 0; i < data.length; i++) {
            let html = '<option value=\'' + data[i].dep_id + '\'>' +
                data[i].departmentName + '</option>';
            $("#departmentName").append(html);
        }
        request('GET', getURL('account', getQuery().id), setMemberInfo, true);
    }
}

let memberName = '';

//직원 정보 셋팅
function setMemberInfo(res) {
    if (res.code === 'A1110') {
        let data = res.data;
        $("#memberId").text(data.memberId);
        $("#memberName").text(data.memberName);
        memberName = data.memberName;
        let phone = (data.phone).split("-");
        $("#phone1").val(phone[0]);
        $("#phone2").val(phone[1]);
        $("#phone3").val(phone[2]);
        $("#email").val(data.email);
        if (!isEmpty(data.birthDate)) {
            let birth = data.birthDate + " " + (data.birthDateSolar ? "(양력)" : "(음력)");
            $("#birthDate").text(birth);
        }
        $("#address").val(data.address);
        if (!isEmpty(data.images)) {
            $("#profileImg").attr("src", '<%= fileApi %>' + 'member/' + data.images);
        }
        $("#departmentName").val(data.dep_id);
        $("#authority").val(data.authority);
        $("#position").val(data.position);
        $("#joiningDate").val(data.joiningDate);

        //휴가 정보
        request('GET', getURL('vacation/info', data.memberId), setVacationInfo, false);
    }
}

//직원 휴가 정보
function setVacationInfo(res) {
    if (res.code === 'A5712') {
        let hourMinutes = 480;
        $("#totalVacation").text(res.data.totalVacation / hourMinutes + "일");
        $("#usedVacation").text(makeDateForm(res.data.usedVacation));
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + (res.data.addVacation * hourMinutes)) - res.data.usedVacation));
        $("#addVacation").text(res.data.addVacation + "일");
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

    //직위
    let position = $("#position").val();
    if (!isEmpty(position)) {
        saveData.position = position;
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

    requestWithData('PUT', getURL('account', $("#memberId").text()), saveData, updateMemberInfo, true);
}

//변경 사항 저장
function updateMemberInfo(res) {
    if (res.code === 'A1200') {
        alert("저장되었습니다.");
        location.reload();
    }
}

//멤버 삭제
function deleteAlertMember() {
    if (confirm("직원 정보를 삭제하시겠습니까?") === true) {
        request('DELETE', getURL('account', $("#memberId").text()), deleteMember, true);
    } else {
        return false;
    }
}

function deleteMember(res) {
    if (res.code === 'A1300') {
        alert("삭제되었습니다.");
        location.href = '/manage/member';
    }
}

function detailAddVacation() {
    location.href = '/manage/member/vacation?id=' + getQuery().id + '&name=' + memberName;
}