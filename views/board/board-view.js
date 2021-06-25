//게시글 조회
request('GET', getURL('board', getQuery().id), setBoardContent);

function setBoardContent(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RB001') {
        let data = res.readBoardDTO;
        $("#title").text(data.title);
        $("#writerMember").text(data.writerMemberName + "(" + data.writerMemberId + ")");
        $("#writerDepartment").text(data.writer_department);
        $("#creatDate").text(getToday(data.create_date));
        $("#count").text(data.count);
        $("#content").html(data.content);

        if (!isEmpty(data.referenceMemberId)) {
            $("#reference").text(data.referenceMemberId.join(", "));
        }

        let file = '';
        for (let i = 0; i < data.file.length; i++) {
            file += '<a class="file" href="<%= fileApi %>' + data.file[i] + '">' + data.file[i] + '</a><br>';
        }
        $("#file").html(file);

        if (data.writerMemberId === $.cookie("id")) {
            $("#controlBtn").show();
        } else {
            $("#controlBtn").hide();
        }
    } else if (res.code === 'RB002') {
        alert("해당 게시글이 존재하지 않습니다.");
        history.back();
    }
}

//게시글 삭제
function deleteAlertBoard() {
    if (confirm("게시글을 삭제하시겠습니까?") === true) {
        let sendData = {};
        sendData.board_idx = getQuery().id;
        requestWithData('DELETE', getURL('board', getQuery().id),
            sendData, deleteBoard);
    } else {
        return false;
    }
}

function deleteBoard(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'DB001') {
        alert("삭제되었습니다.");
        history.back();
    } else if (res.code === 'DB002') {
        console.log("게시글 삭제 실패");
    } else if (res.code === 'DB002') {
        console.log("게시글 삭제 실패\n권한이 없습니다.");
    }
}