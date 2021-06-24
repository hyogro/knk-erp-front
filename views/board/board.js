//조건 검색
function searchPage(type) {
    let urlParams = getQuery();

    let sendData = {};
    sendData.searchType = urlParams.searchType;
    sendData.keyword = urlParams.keyword;
    sendData.page = parseInt(urlParams.page);

    console.log(sendData);

    request('GET', getURL('board/' + type + 'BoardList', sendData), setBoardList);
}

//게시판 상세보기
function setBoardList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RNB001') {
        $("#noticeList").empty();
        let data = res.page.content;
        for (let i = 0; i < data.length; i++) {
            let html = '<tr>' +
                '<td>' + data[i].board_idx + '</td>' +
                '<td class="board-title" id=\'' + data[i].board_idx + '\' ' +
                'onclick="loadDetailPage(id)">' + data[i].title + '</td>' +
                '<td>' + data[i].writerMemberName + '</td>' +
                '<td>' + getToday(data[i].createDate) + '</td>' +
                '</tr>';
            $("#noticeList").append(html);
        }
        setPageCount(res.totalPage);
    } else if (res.code === 'RNB002') {
        console.log("공지사항 목록 불러오기 실패");
    }
}

function loadDetailPage(id) {
    location.href = '/board/notice/view?id=' + id;
}

//페이지 셋팅
function setPageCount(total) {
    $("#paging").empty();

    let html = '';
    let urlParams = getQuery();
    let nowPage = parseInt(urlParams.page);

    let firstPage = Math.floor(nowPage / 10) * 10 + 1;
    if (nowPage % 10 === 0) {
        firstPage = Math.floor(nowPage / 10);
    }

    //이전 버튼
    if (firstPage - 10 > 0) {
        html += ' <li class="page-item">' +
            '<a class="page-link"' +
            'href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, firstPage - 10) + '>' +
            '이전</a></li>';
    }

    for (let i = firstPage; i < (firstPage + 10); i++) {
        if (i > total) {
            break;
        } else if (i === nowPage) {
            html += '<li class="page-item active">';
        } else {
            html += '<li class="page-item">';
        }
        html += '<a class="page-link" ' +
            'href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, i) + '>' +
            i + '</a></li>';
    }

    //다음 버튼
    if ((nowPage / 10) < (total / 10)) {
        html += '<li class="page-item">' +
            '<a class="page-link" ' +
            'href=' + returnPageUrl(urlParams.searchType, urlParams.keyword, firstPage + 10) + '>' +
            '다음</a></li>';
    }

    $("#paging").append(html);
}

function returnPageUrl(searchType, keyword, page) {
    searchType = searchType.replaceAll("'", "");
    keyword = keyword.replaceAll("'", "");
    return '/board/notice?searchType=' + searchType + '&keyword=' + keyword + '&page=' + page;
}