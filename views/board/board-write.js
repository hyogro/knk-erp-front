let EDITORS = [];
let contentText;

window.onload = function () {
    // smartEditor 세팅
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: EDITORS,
        elPlaceHolder: "content",	// textarea id
        sSkinURI: "/smartEditor/SmartEditor2Skin.html",	// 경로
        fCreator: "createSEditor2",
        htParams: {
            fOnBeforeUnload: function () {
            }
        }
    });

    setTimeout(function () {
        contentText = document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector(".se2_inputarea");

        //참조 대상 - 전체 멤버 셋팅
        $('#reference').select2({
            placeholder: '참조시킬 대상의 이름이나 아이디를 선택(입력)해주세요.'
        });
        request('GET', 'board/memberIdList', setSelectOptionMemberList);

        contentText.addEventListener("keyup", function (e) {
            let text = this.innerHTML;
            text = text.replace(/<br>/ig, "");	// br 제거
            text = text.replace(/&nbsp;/ig, "");// 공백 제거
            text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");	// html 제거

            let len = text.length;
            document.querySelector(".count span").innerHTML = len;

            if (len > 40000) {
                alert("최대 40000 byte까지 입력 가능합니다.");
            }
        });
    }, 1000)
}

//참조 대상 - 전체 멤버 셋팅
function setSelectOptionMemberList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'MIL001') {
        let data = res.memberList;
        for (let i = 0; i < data.length; i++) {
            let html = '<option value=\'' + data[i].memberId + '\'>' +
                data[i].memberName + '(' + data[i].memberId + ')</option>'
            $("#reference").append(html);
        }

        //글 수정일 때 셋팅
        if (!isEmpty(getQuery().id)) {
            request('GET', getURL('board', getQuery().id), setModifyBoardContent);
        }

    } else if (res.code === 'MIL002') {
        console.log("멤버 id, 이름 목록 불러오기 실패");
    }
}

//글 수정
function setModifyBoardContent(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RB001') {
        let data = res.readBoardDTO;
        $("#title").val(data.title);
        contentText.innerHTML = data.content;

        //참조 리스트
        let reference = res.readReferenceMemberDTO;
        let referenceData = [];
        for (let i = 0; i < reference.length; i++) {
            referenceData.push(reference[i].referenceMemberId);
        }
        $("#reference").select2().val(referenceData).trigger("change");
    } else if (res.code === 'RB002') {
        alert("해당 게시글이 존재하지 않습니다.");
        history.back();
    }
}

//빈값 체크
function chkEmpty() {
    if (isEmpty($("#title").val())) {
        alert("제목을 입력해주세요.");
        $("#title").focus();
        return false;
    } else if (isEmpty(contentText.innerHTML)) {
        alert("내용을 입력해주세요.");
        return false;
    } else {
        return true;
    }
}

//파일 유무에 따른 게시글 저장
function saveBoard() {
    if (!chkEmpty()) {
        return;
    }

    var files = $('input[name="file"]')[0].files;
    // for(var i= 0; i<files.length; i++){
    //     alert('file_name :'+files[i].name);
    // }
    if (files.length > 0) {
        let sendFiles = new FormData($('#fileForm')[0]);
        requestWithFile('POST', 'file/upload', sendFiles, saveFile);
    } else { //파일 없는 게시글 저장
        let saveData = saveBoardData();
        requestWithData('POST', 'board', saveData, saveAlertBoard);
    }
}

//파일 있는 게시글 저장
function saveFile(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RA001') {
        let saveData = saveBoardData();
        saveData.fileName = res.message;
        requestWithData('POST', 'board', saveData, saveAlertBoard);
    } else if (res.code === 'RA002') {
        console.log("파일 저장 실패");
    }
}

//저장할 게시글 정보
function saveBoardData() {
    let saveData = {};
    saveData.title = $("#title").val();
    saveData.content = contentText.innerHTML;
    saveData.referenceMemberId = $("#reference").val();
    if (boardType === 'notice') {
        saveData.boardType = '공지사항';
    } else if (boardType === 'work') {
        saveData.boardType = '업무게시판';
    }

    return saveData;
}

//게시글 저장 알림창
function saveAlertBoard(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'CB001') {
        location.href = "/board/" + boardType + "?searchType=&keyword=&page=1";
    } else if (res.code === 'CB002') {
        console.log("파일 저장 실패");
    } else if (res.code === 'CB003') {
        alert("게시글 생성 실패 - 권한 부족");
    } else if (res.code === 'CB004') {
        alert("게시글 생성 실패 - 작성자와 다른 부서 태그");
    }
}