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
    }
}

let checkId = false;

//변경 사항 value 체크
function chkCreateMemberInfo() {
    let saveData = {};

    //아이디
    let memberId = $("#memberId").val();
    if (isEmpty(memberId)) {
        alert("아이디를 입력해주세요");
        return;
    } else if (!checkId) {
        alert("올바른 아이디를 입력해주세요.");
        return;
    } else {
        saveData.memberId = memberId;
    }

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

    //이름
    let memberName = $("#memberName").val();
    if (!isEmpty(memberName)) {
        saveData.memberName = memberName;
    } else {
        return;
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
        saveData.departmentId = department;
    }

    //입사일
    let joiningDate = $("#joiningDate").val();
    if (isEmpty(joiningDate)) {
        alert("입사일을 선택해주세요.");
        return;
    } else {
        saveData.joiningDate = joiningDate;
    }

    requestWithData('POST', 'account/signup', saveData, createMemberInfo, true);
}

//회원가입
function createMemberInfo(res) {
    if (res.code === 'A1000') {
        alert("회원가입에 성공하였습니다.");
        location.href = '/manage/member';
    }
}

// 멤버 아이디 영어로만
$("input[id=memberId]").keyup(function (event) {
    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
        let inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^a-z0-9]/gi, ''));
    }
});

$('#memberId').focusout(function () {
    let id = $('#memberId').val()

    if (!chkId(id)) {
        $("#chkID").text("아이디는 영어소문자로 시작하는 6~15자 영문자 또는 숫자이어야 합니다.(영어소문자/숫자,6~15자)");
        checkId = false;
    } else {
        let sendData = {};
        sendData.memberId = id;
        requestWithData('POST', 'account/checkId', sendData, chkMemberIdText, false);
    }
});


//아이디 중복검사 결과
function chkMemberIdText(res) {
    if (res.code === 'A1400') {
        if (res.data) {
            checkId = false;
            $("#chkID").text("이미 사용중인 아이디입니다. (영어소문자/숫자, 6~15자)");
            $("#chkID").css('color', 'red');
        } else {
            checkId = true;
            $("#chkID").text("사용 가능한 아이디입니다. (영어소문자/숫자, 6~15자)");
            $("#chkID").css('color', 'black');
        }
    }
}