//내 정보 셋팅
request('GET', 'my', setMemberInfo);

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

//비밀번호 유효성 체크
function chkPW() {
    let pw = $("#password1").val();
    let num = pw.search(/[0-9]/g);
    let eng = pw.search(/[a-z]/ig);
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pw === "") {
        return true;
    } else if (pw.length < 8 || pw.length > 16) {
        $("#chkPassword").text("8자리 ~ 16자리 이내로 입력해주세요.");
        return false;
    } else if (pw.search(/\s/) != -1) {
        $("#chkPassword").text("비밀번호는 공백 없이 입력해주세요.");
        return false;
    } else if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
        $("#chkPassword").text("영문, 숫자, 특수문자 중 2가지 이상을 조합하여 입력해주세요.");
        return false;
    } else {
        $("#chkPassword").empty();
        return true;
    }
}

//비밀번호 확인
function matchPW() {
    let pw1 = $("#password1").val();
    let pw2 = $("#password2").val();

    if (pw1 !== pw2) {
        $("#matchPassword").text("비밀번호가 일치하지 않습니다.");
        return false;
    } else {
        $("#matchPassword").empty();
        return true;
    }
}

//이메일 유효성 체크
function chkEmail(email) {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(email)) {
        return false;
    } else {
        return true;
    }
}

//변경 사항 value 체크
function chkUpdateMyInfo() {
    let saveData = {};

    //비밀번호
    let pass1 = $("#password1").val();
    let pass2 = $("#password2").val();
    if (!isEmpty(pass1) && !isEmpty(pass2)) {
        if (!chkPW() || !matchPW()) {
            alert("비밀번호를 확인해주세요.");
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
        return false;
    } else if (!isEmpty(phone3) && phone3.length < 4) {
        $("#phone3").focus();
        alert("올바른 연락처를 입력해주세요.");
        return false;
    } else {
        saveData.phone = phone1 + '-' + phone2 + '-' + phone3;
    }

    //이메일
    let email = $("#email").val();
    if (!chkEmail(email) && !isEmpty(email)) {
        $("#email").focus();
        alert("올바른 이메일 주소를 입력해주세요.");
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