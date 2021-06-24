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

function setPageCount(total) {

}