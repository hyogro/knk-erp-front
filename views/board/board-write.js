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
        request('GET', 'board/memberIdList', setSelectOptionMemberList, false);

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
    if (res.code === 'A4550') {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
            let html = '<option value=\'' + data[i].memberId + '\'>' +
                data[i].memberName + '(' + data[i].memberId + ')</option>'
            $("#reference").append(html);
        }

        //글 수정일 때 셋팅
        if (!isEmpty(getQuery().id)) {
            request('GET', getURL('board', getQuery().id), setModifyBoardContent, true);
        }
    }
}

let beforeFileList = []; //기존 수정 전, 파일 리스트
//글 수정
function setModifyBoardContent(res) {
    if (res.code === 'A4510') {
        let data = res.data.readBoardDTO;
        $("#title").val(data.title);
        contentText.innerHTML = data.content;
        for (let i = 0; i < data.file.length; i++) {
            let html = '<div class="upload-file" id=beforeFile' + beforeFileList.length + '>' + data.file[i].originalFileName +
                '<span class="deleteBtn" onclick="deleteBeforeFileList(' + beforeFileList.length + ')"> 삭제</span></div>';
            $("#addFileNameList").append(html);
            beforeFileList.push(data.file[i].fileName);
        }

        //참조 리스트
        let reference = res.data.readReferenceMemberDTO;
        let referenceData = [];
        for (let i = 0; i < reference.length; i++) {
            referenceData.push(reference[i].referenceMemberId);
        }
        $("#reference").select2().val(referenceData).trigger("change");
    }
}

//기존 파일 리스트 - 삭제
function deleteBeforeFileList(index) {
    beforeFileList[index] = null;
    $("#beforeFile" + index).empty();
}

//빈값 체크
function chkEmpty() {
    if (isEmpty($("#title").val())) {
        alert("제목을 입력해주세요.");
        $("#title").focus();
        return false;
    } else if (isEmpty(contentText.innerText) || contentText.innerText === ' ' ||
        contentText.innerText === '\n' || contentText.innerText === '\t') {
        alert("내용을 입력해주세요.");
        return false;
    } else {
        return true;
    }
}

let fileList = [];
let newFileList = []; //현재 게시판에서 추가한 파일 리스트

//파일 선택
$("#file").change(function () {
    let files = $("#file")[0].files;
    for (let i = 0; i < files.length; i++) {
        let html = '<div class="upload-file" id=addFile' + newFileList.length + '>' + files[i].name +
            '<span class="deleteBtn" onclick="deleteNewFile(' + newFileList.length + ')"> 삭제</span></div>';
        $("#addFileNameList").append(html);
        newFileList.push(files[i]);
    }
});

//불러온 파일 삭제
function deleteNewFile(index) {
    newFileList[index] = null;
    $("#addFile" + index).empty();
}


let fileUploadCount = 0;

//파일 유무에 따른 게시글 저장
function saveBoard() {
    if (!chkEmpty()) {
        return;
    }

    newFileList = newFileList.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });

    // 새로운 파일 추가한 게시글 저장
    if (newFileList.length > 0) {
        for (let i = 0; i < newFileList.length; i++) {
            let sendFiles = new FormData();
            sendFiles.append('file', newFileList[i]);
            sendFiles.append('location', 'board');
            requestWithFile('POST', 'file/upload', sendFiles, saveFile, true);
        }
    } else {//새로 추가한 파일이 없을 경우
        uploadBeforeFileList();
    }
}


//파일 있는 게시글 저장
function saveFile(res) {
    if (res.code === 'A6001') {
        fileList.push(res.data);
        fileUploadCount += 1;
        if (fileUploadCount === newFileList.length) {
            uploadBeforeFileList();
        }
    }
}

//기존 파일 있는 게시글 저장 (글 수정)
function uploadBeforeFileList() {
    beforeFileList = beforeFileList.filter(function (item) {
        return item !== null && item !== undefined && item !== '';
    });

    for (let i = 0; i < beforeFileList.length; i++) {
        fileList.push(beforeFileList[i]);
    }

    uploadBoard();
}

//게시글 업로드
function uploadBoard() {
    let saveData = saveBoardData();

    if (fileList.length > 0) {
        saveData.fileName = fileList;
    } else if (fileList.length === 0) {
        saveData.fileName = [""];
    }

    if (isEmpty(getQuery().id)) {
        //글 생성
        requestWithData('POST', 'board', saveData, saveAlertBoard, true);
    } else {
        //글 수정
        requestWithData('PUT', getURL('board', getQuery().id),
            saveData, saveAlertBoard, true);
    }
}

//저장할 게시글 정보
function saveBoardData() {
    let saveData = {};
    if (!isEmpty(getQuery().id)) {
        saveData.board_idx = getQuery().id;
    }

    saveData.title = $("#title").val();
    saveData.content = contentText.innerHTML;

    if ($("#reference").val().length > 0) {
        saveData.referenceMemberId = $("#reference").val();
    }

    if (boardType === 'notice') {
        saveData.boardType = '공지사항';
    } else if (boardType === 'work') {
        saveData.boardType = '업무게시판';
    } else if (boardType === 'fieldTeam') {
        saveData.boardType = '현장팀게시판'
    }

    return saveData;
}

//게시글 저장 알림창
function saveAlertBoard(res) {
    if (res.code === 'A4500') {
        if (boardType === 'fieldTeam') {
            location.href = '/manage/safe?searchType=&keyword=&page=1';
        } else {
            location.href = '/board/' + boardType + '?searchType=&keyword=&page=1';
        }
    } else if (res.code === 'A4520') {
        if (boardType === 'fieldTeam') {
            location.href = "/manage/safe/view?id=" + getQuery().id;
        } else {
            location.href = "/board/" + boardType + "/view?id=" + getQuery().id;
        }
    }
}