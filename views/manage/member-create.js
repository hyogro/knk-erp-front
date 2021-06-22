//부서 옵션 셋팅
request('GET', 'department', setDepartmentOption);

//부서 옵션 셋팅
function setDepartmentOption(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RD001') {
        let data = res.readDepartmentDTO.departmentName;
        $("#departmentName").empty();
        for (let i = 0; i < data.length; i++) {
            let html = '<option value=\'' + res.readDepartmentDTO.dep_id[i] + '\'>' +
                res.readDepartmentDTO.departmentName[i] + '</option>';
            $("#departmentName").append(html);
        }
    } else if (res.code === 'RD002') {
        console.log("부서 목록 읽기 실패");
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
    } else if (!checkId){
        alert("올바른 아이디를 입력해주세요.");
    }  else{
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

    console.log(saveData);
    requestWithData('POST', 'account/signup', saveData, createMemberInfo);
}

//회원가입
function createMemberInfo(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'SU001') {
        alert("회원가입에 성공하였습니다.");
        location.href = '/manage/member';
    } else if (res.code === 'SU002') {
        console.log("회원가입 실패");
    } else if (res.code === 'SU003') {
        alert("이미 존재하는 아이디입니다. 다시 입력해주세요.");
        $("#memberId").focus();
    }
}

//영어,
$("input[id=memberId]").keyup(function (event) {
    if (!(event.keyCode >=37 && event.keyCode<=40)) {
        var inputVal = $(this).val();
        $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
    }
});

//아이디 중복검사
function chkMemberId(id) {
    let sendData = {};
    sendData.memberId = id;

    if (!chkId(id)) {
        $("#chkID").text("아이디는 영어소문자로 시작하는 6~15자 영문자 또는 숫자이어야 합니다.(영어소문자/숫자,6~15자)");
        checkId = false;
        return;
    } else {
        requestWithData('POST', 'account/checkId', sendData, chkMemberIdText);
    }
}

//아이디 중복검사 결과
function chkMemberIdText(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CMI001') {
        if (res.check) {
            checkId = false;
            $("#chkID").text("이미 사용중인 아이디입니다.(영어소문자/숫자,6~15자)");
        } else {
            checkId = true;
            $("#chkID").text("사용 가능한 아이디입니다.(영어소문자/숫자,6~15자)");
        }
    } else if (res.code === 'CMI002') {
        console.log("중복 ID 체크 실패");
    }
}