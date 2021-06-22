request('GET', 'my', setMemberInfo);

//내 정보 셋팅
function setMemberInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'GMI001') {
        let data = res.readMemberDTO;
        $("#memberId").text(data.memberId);
        $("#memberName").text(data.memberName);
        $("#departmentName").text(data.departmentName);
        let phone = (data.phone).split("-");
        $("#phone1").val(phone[0]);
        $("#phone2").val(phone[1]);
        $("#phone3").val(phone[2]);
        $("#email").val(data.email);
        $("#address").val(data.address);
    } else if (res.code === 'GMI002') {
        console.log("본인 정보 보기 실패");
    }
}

//내 휴가 정보
request('GET', getURL('vacation/info', $.cookie("id")), setVacationInfo);

function setVacationInfo(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVI001') {
        let hourMinutes = 480;
        $("#totalVacation").text(res.data.totalVacation / hourMinutes + "일");
        $("#addVacation").text(res.data.addVacation / hourMinutes + "일");
        $("#usedVacation").text(makeDateForm(res.data.usedVacation));
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + res.data.addVacation) - res.data.usedVacation));
    } else if (res.code === 'RVI002') {
        console.log("휴가 정보 조회 실패");
    }
}

//변경 사항 value 체크
function chkUpdateMyInfo() {
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

    requestWithData('PUT', 'my', saveData, updateMyInfo);
}

//변경 사항 저장
function updateMyInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'USM001') {
        alert("저장되었습니다. 다시 로그인 후, 이용해주세요.");
        logout();
    } else if (res.code === 'USM002') {
        console.log("본인 정보 수정 실패");
    }
}