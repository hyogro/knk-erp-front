request('GET', 'my', setMemberInfo);

let profileFile = {};

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
        $("#position").text(data.position);
        if (!isEmpty(data.phone)) {
            let phone = (data.phone).split("-");
            $("#phone1").val(phone[0]);
            $("#phone2").val(phone[1]);
            $("#phone3").val(phone[2]);
        }
        $("#email").val(data.email);
        $("#address").val(data.address);
        if (!isEmpty(data.birthDate)) {
            let birth = (data.birthDate).split("-");
            $("#birth1").val(birth[0]);
            $("#birth2").val(birth[1]);
            $("#birth3").val(birth[2]);
        }
        if (!isEmpty(data.images)) {
            profileFile.src = '<%= fileApi %>' + 'member/' + data.images;
            $("#profileImg").attr("src", profileFile.src);
            $("#profileDelBtn").show();
        }
        if (data.birthDateSolar) {
            $("input:radio[name='birthDateType']:radio[value='true']").prop('checked', true);
        } else {
            $("input:radio[name='birthDateType']:radio[value='false']").prop('checked', true);
        }

    } else if (res.code === 'GMI002') {
        console.log("본인 정보 보기 실패");
    }
}

//내 휴가 정보
request('GET', getURL('vacation/info', $.cookie("id")), setVacationInfo);

function setVacationInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RVI001') {
        let hourMinutes = 480;
        $("#totalVacation").text(res.data.totalVacation / hourMinutes + "일");
        $("#addVacation").text(res.data.addVacation + "일");
        $("#usedVacation").text(makeDateForm(res.data.usedVacation));
        $("#residueVacation").text(makeDateForm((res.data.totalVacation + (res.data.addVacation * hourMinutes)) - res.data.usedVacation));
    } else if (res.code === 'RVI002') {
        console.log("휴가 정보 조회 실패");
    }
}

//프로필 사진 바꾸기
function changeProfileImg(input) {
    if (isEmpty(input.files[0])) {
        $("#profileImg").attr("src", profileFile.src);
        input.files[0] = profileFile.file;
    } else {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#profileImg').attr('src', e.target.result);
            profileFile.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
        profileFile.file = input.files[0];
    }
}

$(":input[name='file']").change(function () {
    if (isEmpty($(":input[name='file']").val())) {
        $('#profileImg').attr('src', '');
    }
    $("#profileDelBtn").show();
    changeProfileImg(this);
});

//프로필 이미지 삭제
function deleteProfileImg() {
    profileFile.file = null;
    profileFile.src = "/images/img-profile-default.png";
    $("#profileImg").attr("src", profileFile.src);
    $("#profileDelBtn").hide();
}

let myInfo = {};

let isLogout = false;

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
            isLogout = true;
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

    //생년월일
    if (!isEmpty($("#birth1").val()) ||
        !isEmpty($("#birth2").val()) || !isEmpty($("#birth3").val())) {
        let month = ("0" + $("#birth2").val()).slice(-2);
        let day = ("0" + $("#birth3").val()).slice(-2);
        let birthDate = $("#birth1").val() + "-" + month + "-" + day;
        if (!checkValidDate(birthDate)) {
            alert("올바른 날짜를 입력해주세요.");
            return;
        } else {
            saveData.birthDate = birthDate;
            saveData.birthDateSolar = $('input[name="birthDateType"]:checked').val();
        }
    }

    myInfo = saveData;
    saveProfileImage();
}


//프로필 이미지 먼저 저장 -> 나머지 내 정보 저장
function saveProfileImage() {
    if (!isEmpty(profileFile.file)) {
        let saveFiles = new FormData();
        saveFiles.append('file', profileFile.file);
        saveFiles.append('location', 'member');
        requestWithFile('POST', 'file/upload', saveFiles, sendProfileImage);
    } else {
        if (profileFile.src === "/images/img-profile-default.png" ||
            isEmpty(profileFile.src)) {
            myInfo.images = null;
        } else {
            let image = profileFile.src.split("/");
            myInfo.images = image[image.length - 1];
        }
        requestWithData('PUT', 'my', myInfo, updateMyInfo);
    }
}

function sendProfileImage(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'FS001') {
        myInfo.images = res.message;
        requestWithData('PUT', 'my', myInfo, updateMyInfo);
    } else if (res.code === 'FS002') {
        console.log("파일 저장 실패");
    }
}

//변경 사항 저장
function updateMyInfo(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'USM001') {
        if (isLogout) {
            alert("저장되었습니다. 다시 로그인 후, 이용해주세요.");
            logout();
        } else {
            alert("변경사항이 저장되었습니다.");
            location.reload();
        }
    } else if (res.code === 'USM002') {
        console.log("본인 정보 수정 실패");
    }
}

function detailAddVacation() {
    location.href = '/my-page/my-vacation?id=' + $.cookie("id") + '&name=' + $.cookie("name");
}