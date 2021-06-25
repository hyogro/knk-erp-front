request('GET', 'board/noticeLatest', setNoticeList);

function setNoticeList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'NBL001') {
        if (getQuery().searchType !== "참조") {
            setBoardInfo(res.page.content, 'important');
        }
        searchPage();
    } else if (res.code === 'NBL002') {
        console.log("공지사항 조회 실패");
    }
}

function enterKey() {
    if (window.event.keyCode === 13) {
        search();
    }
}

//게시물 검색
function search() {
    let keyword = $('#keyword').val();
    if (keyword.length < 2) {
        alert("키워드는 최소 두 글자 이상이어야 합니다.\n다시 입력해주세요.");
        $('#keyword').focus();
    } else {
        location.href = returnPageUrl($('#searchType').val(), keyword, 1);
    }
}

//조건 검색
function searchPage() {
    let urlParams = getQuery();

    let sendData = {};
    sendData.searchType = urlParams.searchType;
    sendData.keyword = urlParams.keyword;
    sendData.page = parseInt(urlParams.page);

    if (sendData.searchType === "참조") {
        $('input[type="checkbox"][id="referenceChk"]').prop('checked', true);
    }

    request('GET', getURL('board/' + boardType + 'BoardList', sendData), setBoardList);
}

//게시판 상세보기
function setBoardList(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'RNB001') {
        setBoardInfo(res.page.content);
        setPageCount(res.totalPage);
    } else if (res.code === 'RNB002') {
        console.log("공지사항 목록 불러오기 실패");
    }
}

//게시판 리스트
function setBoardInfo(data, type) {
    if (data.length === 0) {
        let html = '<tr><td colspan="4">해당 게시물이 없습니다.</td></tr>';
        $("#" + boardType + "List").append(html);
        return;
    }

    for (let i = 0; i < data.length; i++) {
        let html = '';

        if (type === 'important') {
            html += '<tr class="important">' +
                '<td><span class="badge bg-danger">공지</span></td>';
        } else {
            html += '<tr><td class="board-no">' + data[i].board_idx + '</td>';
        }

        html += '<td class="board-title" data-id=\'' + data[i].board_idx + '\' ' +
            'onclick="loadDetailPage(\'' + data[i].board_idx + '\')">'
            + data[i].title + '</td>' +
            '<td>' + data[i].writerMemberName + '</td>' +
            '<td>' + getToday(data[i].createDate) + '</td>' +
            '</tr>';

        $("#" + boardType + "List").append(html);

        //읽은 글 표시
        if (!isEmpty(data[i].visitors)) {
            for (let j = 0; j < data[i].visitors.length; j++) {
                if (data[i].visitors[j] === $.cookie("id")) {
                    $("[data-id=" + data[i].board_idx + "]").addClass("read");
                    break;
                }
            }
        }
    }
}

//상세보기 페이지 이동
function loadDetailPage(id) {
    location.href = '/board/' + boardType + '/view?id=' + id;
}

//페이징 셋팅
function setPageCount(total) {
    $("#paging").empty();

    let html = '';
    let urlParams = getQuery();
    let nowPage = parseInt(urlParams.page);

    let firstPage = Math.floor(nowPage / 10) * 10 + 1;
    //다음 직전 페이지
    if (nowPage % 10 === 0) {
        firstPage = Math.floor(nowPage / 10);
    }

    //이전 버튼
    if ((firstPage - 10) > 0) {
        html += '<a class="arrow prev" href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, firstPage - 10) + '></a>';
    }

    for (let i = firstPage; i < (firstPage + 10); i++) {
        if (i > total) {
            break;
        } else if (i === nowPage) {
            html += '<a class="active" href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, i) + '>' + i + '</a>';
        } else {
            html += '<a href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, i) + '>' + i + '</a>';
        }
    }

    //다음 버튼
    if ((nowPage / 10) < (total / 10)) {
        html += '<a class="arrow next" href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, firstPage + 10) + '></a>'
    }

    $("#paging").append(html);
}

//이동할 페이지 주소 리턴
function returnPageUrl(searchType, keyword, page) {
    searchType = searchType.replaceAll("'", "");
    keyword = keyword.replaceAll("'", "");
    return '/board/' + boardType + '?searchType=' +
        searchType + '&keyword=' + keyword + '&page=' + page;
}

//참조 페이지 로드
function LoadReferencePage(val) {
    if ($('input:checkbox[id="referenceChk"]').is(":checked") === true) {
        location.href = returnPageUrl(val, '', 1);
    } else {
        location.href = returnPageUrl('', '', 1);
    }
}