var EDITORS = [];
window.onload = function () {
    // smartEditor 세팅
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: EDITORS,
        elPlaceHolder: "content",	// textarea id
        sSkinURI: "/smartEditor/SmartEditor2Skin.html",	// 경로
        fCreator: "createSEditor2",
    });

    setTimeout(function () {
        let ctntarea = document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector(".se2_inputarea");
        ctntarea.addEventListener("keyup", function (e) {
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
$('#reference').select2({
    placeholder: '참조시킬 대상의 이름이나 아이디를 선택(입력)해주세요.'
});

request('GET', 'board/memberIdList', setSelectOptionMemberList);

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
    } else if (res.code === 'MIL002') {
        console.log("멤버 id, 이름 목록 불러오기 실패");
    }
}

function saveBoard() {

    console.log(ctntarea.innerHTML);
    // let files = new FormData($('#fileForm')[0]);
    // requestWithFile('POST', 'file/upload', files, saveFile);
}

function saveFile(res) {
    console.log(res);
    if (res.code === null) {
        return;
    }
    if (res.code === 'RA001') {
        let saveData = {};
        saveData.title = $("#title").val();
        let ctntarea = document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector(".se2_inputarea");
        saveData.content = ctntarea.innerHTML;
    } else if (res.code === 'RA002') {
        console.log("파일 저장 실패");
    }
}