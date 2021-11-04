//게시글 조회
request('GET', getURL('board', getQuery().id), setBoardContent, true);

function setBoardContent(res) {
    if (res.code === 'A4510') {
        let boardData = res.data.readBoardDTO;
        $("#title").text(boardData.title);
        $("#writerMember").text(boardData.writerMemberName + "(" + boardData.writerMemberId + ")");
        $("#writerDepartment").text(boardData.writer_department);
        $("#creatDate").text(getToday(boardData.create_date));
        $("#count").text(boardData.count);
        $("#content").html(boardData.content);

        let reference = res.data.readReferenceMemberDTO
        if (reference.length > 0) {
            setReferenceMemberList(reference);
        }
        if (boardData.file.length > 0) {
            setFileList(boardData.file);
        }

        if (boardData.writerMemberId === $.cookie("id")) {
            $("#controlBtn").show();
        } else {
            $("#controlBtn").hide();
        }
    }
}

//파일 리스트 셋팅
function setFileList(data) {
    $("#downLoadFileList").empty();
    for (let i = 0; i < data.length; i++) {
        let file = '<a class="file download-file" ' +
            'href="<%= fileApi %>' + 'board/' + data[i].fileName + '" ' +
            'download="' + data[i].originalFileName + '">' +
            data[i].originalFileName + '</a><br>';
        $("#downLoadFileList").append(file);
    }
}

//참조 대상 출력
function setReferenceMemberList(data) {
    let member = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].referenceMemberId !== null && data[i].referenceMemberName !== null) {
            member.push(data[i].referenceMemberId + "(" + data[i].referenceMemberName + ")");
        }
    }
    $("#reference").text(member.join(", "));
}

//글 수정 이동
function modifyBoard() {
    if (boardType === 'fieldTeam') {
        location.href = '/manage/safe/write?id=' + getQuery().id;
    } else {
        location.href = '/board/' + boardType + '/write?id=' + getQuery().id;
    }
}

//게시글 삭제
function deleteAlertBoard() {
    if (confirm("게시글을 삭제하시겠습니까?") === true) {
        let sendData = {};
        sendData.board_idx = getQuery().id;
        requestWithData('DELETE', getURL('board', getQuery().id),
            sendData, deleteBoard, true);
    } else {
        return false;
    }
}

function deleteBoard(res) {
    if (res.code === 'A4530') {
        alert("삭제되었습니다.");
        if (boardType === 'fieldTeam') {
            location.href = '/manage/safe?searchType=&keyword=&page=1';
        } else {
            location.href = '/board/' + boardType + '?searchType=&keyword=&page=1';
        }
    }
}