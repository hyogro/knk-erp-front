var EDITORS = [];
window.onload = function() {
    // smartEditor 세팅
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: EDITORS,
        elPlaceHolder: "content",	// textarea id
        sSkinURI: "/smartEditor/SmartEditor2Skin.html",	// 경로
        fCreator: "createSEditor2",
    });

    setTimeout(function() {
        var ctntarea = document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector(".se2_inputarea");
        ctntarea.addEventListener("keyup", function(e) {
            var text = this.innerHTML;
            text = text.replace(/<br>/ig, "");	// br 제거
            text = text.replace(/&nbsp;/ig, "");// 공백 제거
            text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");	// html 제거

            var len = text.length;
            document.querySelector(".count span").innerHTML = len;

            if(len > 40000) {
                alert("최대 40000 byte까지 입력 가능합니다.");
            }
        });
    }, 1000)
}

$('#reference').select2({
    placeholder: '참조시킬 대상의 이름이나 아이디를 선택(입력)해주세요.'
});