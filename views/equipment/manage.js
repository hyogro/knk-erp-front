setSearchType();

function setSearchType() {
    $("#type").val(getQuery().searchType);
    searchPage();
}

//처리 상태 바꾸기
function changeSearchType(value) {
    location.href = returnPageUrl(value, 1);
}

//모든 비품 요청 목록 리스트
function searchPage() {
    let sendData = {};
    sendData.searchType = $("#type").val();
    sendData.page = parseInt(getQuery().page);
    request('GET', getURL('fixtures/listAll', sendData), setManageEquipmentList);
}

function setManageEquipmentList(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAFF001') {
        $("#manageEquipmentList").empty();
        let data = res.page.content;

        if (data.length === 0) {
            let html = '<tr><td colspan="4">요청이 없습니다.</td></tr>';
            $("#myEquipmentList").append(html);
        }

        for (let i = 0; i < data.length; i++) {
            let html = '<tr onclick="loadDetailPage(' + data[i].id + ')">' +
                '<td class="no">' + data[i].id + '</td>' +
                '<td>' + data[i].authorName + '</td>';
            if (data[i].check) {
                html += '<td>처리완료</td>';
            } else {
                html += '<td class="yet-state">미처리</td>';
            }
            html += '<td>' + getToday(data[i].createDate) + '</td>' +
                '</tr>';
            $("#manageEquipmentList").append(html);
        }
        setPageCount(res.pageSize);
    } else if (res.code === 'RAFF002') {
        console.log("전체 비품 요청 목록 읽기 실패");
    }
}

//페이징 셋팅
function setPageCount(total) {
    $("#paging").empty();

    if (total === 0) {
        return;
    }

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
        html += '<a class="arrow prev" href=' + returnPageUrl(urlParams.searchType, firstPage - 10) + '></a>';
    }

    for (let i = firstPage; i < (firstPage + 10); i++) {
        if (i === nowPage) {
            html += '<a class="active" href=' + returnPageUrl(urlParams.searchType, i) + '>' + i + '</a>';
        } else {
            html += '<a href=' + returnPageUrl(urlParams.searchType, i) + '>' + i + '</a>';
        }

        if (i === total) {
            break;
        }
    }

    //다음 버튼
    if ((nowPage / 10) < (total / 10)) {
        html += '<a class="arrow next" href=' + returnPageUrl(urlParams.searchType, firstPage + 10) + '></a>'
    }

    $("#paging").append(html);
}

//이동할 페이지 주소 리턴
function returnPageUrl(searchType, page) {
    searchType = searchType.replaceAll("'", "");
    return '/equipment/manage?searchType=' + searchType + '&page=' + page;
}

//상세보기 페이지 이동
function loadDetailPage(id) {
    location.href = '/equipment/manage/view?id=' + id;
}