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
}