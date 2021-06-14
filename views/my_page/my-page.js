//내 정보 셋팅
request('POST', 'my/myPage', setMemberInfo);

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
        $("#vacation").text(data.vacation);
        let phone = (data.phone).split("-");
        $("#phone1").val(phone[0]);
        $("#phone2").val(phone[1]);
        $("#phone3").val(phone[2]);
    } else if (res.code === 'GMI002') {
        console.log("본인 정보 보기 실패");
    }
}

//비밀번호 유효성 체크
function chkPW() {
    let pw = $("#password1").val();
    let num = pw.search(/[0-9]/g);
    let eng = pw.search(/[a-z]/ig);
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pw == "") {
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

    if (pw1 != pw2) {
        $("#matchPassword").text("비밀번호가 일치하지 않습니다.");
        return false;
    } else {
        $("#matchPassword").empty();
        return true;
    }
}

//변경 사항 value 체크
function chkUpdateMyInfo() {
    let password = $("#password1").val();
    if (password.length == 0) {
        password = null;
    }

    let phone1 = $("#phone1").val();
    let phone2 = $("#phone2").val();
    let phone3 = $("#phone3").val();

    if (!chkPW() || !matchPW()) {
        alert("비밀번호를 확인해주세요.");
        return false;
    } else if (isEmpty(phone2) || phone2.length < 4) {
        $("#phone2").focus();
        alert("올바른 연락처를 입력해주세요.");
        return false;
    } else if (isEmpty(phone3) || phone3.length < 4) {
        $("#phone3").focus();
        alert("올바른 연락처를 입력해주세요.");
        return false;
    } else {
        let saveData = {};
        saveData.password = password;
        saveData.phone = phone1 + '-' + phone2 + '-' + phone3;

        console.log(saveData);

        requestWithData('POST', 'my/updateSelf', saveData, updateMyInfo);
    }
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