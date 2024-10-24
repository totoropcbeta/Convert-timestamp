let now;
let goStatus = true;
let interval;
let gap = localStorage.getItem("gapValue") === null ? 1000 : localStorage.getItem("gapValue");

let msgSpan = document.getElementById("msg");

let bjTimeInput = document.getElementById("bjTime");
let inputInput = document.getElementById("input");
let timestampNowInput = document.getElementById("timestamp-now");
let resultInput = document.getElementById("result");
let goonCheckBox = document.getElementById("goon");
let gapInput = document.getElementById("gap");
gapInput.value = gap;

let refreshButton = document.getElementById("refresh");
let changeButton = document.getElementById("change");
let nowButton = document.getElementById("now");
let pasteButton = document.getElementById("paste");
let exchangeEachOtherButton = document.getElementById("exchange-each-other");
let copyTimestampButton = document.getElementById("copy_timestamp");
let copyTimeButton = document.getElementById("copy_time");
let clearButton = document.getElementById("clear");
let copyResultButton = document.getElementById("copy_result");
let showAlertCheckbox = document.getElementById("show-alert-checkbox");

let only10Radio = document.getElementById("only-10-radio");
let only13Radio = document.getElementById("only-13-radio");
let both10_13 = document.getElementById("both-10-13-radio");

let timeFormatSelected = document.getElementById("time_format");

let datetimeoption = document.getElementById("datetime");
let dateoption = document.getElementById("date");
let datekeyoption = document.getElementById("datekey");

function getTimestamp13() {
    return now.getTime();
}

function refresh() {
    now = new Date();
    timestampNowInput.value = getTimestamp13();
    bjTimeInput.value = getTimeString(getTimestamp13(), localStorage.timestampJudgeType);
}

function refreshWithInterval() {
    window.clearInterval(interval);
    refresh();
    interval = getInterval();
}

function change() {
    let s = inputInput.value.trim().toString();
    resultInput.value = convert(s, localStorage.timestampJudgeType);
}

function paste(item) {
    item.select();
    document.execCommand('paste');
    msg("从剪切板获取！");
}

function exchangeEachOther() {
    sendStrToInput(resultInput.value);
}

function copy(item) {
    item.select();
    document.execCommand('copy');
    msg("已复制到剪切板");
}

function msg(m) {
    msgSpan.innerText = m;
    setTimeout(function () {
        msgSpan.innerText = "　";
    }, 1000);
}

function refreshGap() {
    let value = gapInput.value;
    if (!isNaN(value)) {
        gap = parseInt(value);
    } else {
        gap = 1000;
    }
}

function sendStrToInput(text) {
    inputInput.value = text;
    change();
}

refreshButton.onclick = function () {
    refreshWithInterval();
};

changeButton.onclick = function () {
    change();
};

inputInput.oninput = function () {
    change();
};

gapInput.addEventListener('change', function (event) {
    var gapValue = event.target.value;
    console.log("gapValue:", gapValue);
    localStorage.setItem("gapValue", gapValue);
    refreshGap();
    refreshWithInterval();
});

resultInput.oninput = function () {
    let value = resultInput.value;
    inputInput.value = formatTimeString(value);
};

inputInput.onmousedown = function (e) {
    if (e.button === 1) {
        paste(inputInput);
    }
};

resultInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(resultInput);
    }
};

timestampNowInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(timestampNowInput);
    }
};

bjTimeInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(bjTimeInput);
    }
};

nowButton.onclick = function () {
    sendStrToInput(new Date().getTime());
};

copyTimestampButton.onclick = function () {
    copy(timestampNowInput);
};

copyTimeButton.onclick = function () {
    copy(bjTimeInput);
};

pasteButton.onclick = function () {
    paste(inputInput);
};

exchangeEachOtherButton.onclick = function () {
    exchangeEachOther();
};

clearButton.onclick = function () {
    resultInput.value = "";
    inputInput.value = "";
};

function changeGoCheckBox() {
    goStatus = goonCheckBox.checked;
    if (goStatus) {
        refreshWithInterval();
    }
    localStorage.goStatus = goStatus;
}

goonCheckBox.onclick = changeGoCheckBox;

copyResultButton.onclick = function () {
    copy(resultInput);
};

showAlertCheckbox.onclick = function () {
    let checked = showAlertCheckbox.checked;
    if (checked) {
        localStorage.showAlert = "true";
    } else {
        localStorage.showAlert = "false";
    }
};

only10Radio.onclick = function () {
    localStorage.timestampJudgeType = "1";
};

only13Radio.onclick = function () {
    localStorage.timestampJudgeType = "2";
};

both10_13.onclick = function () {
    localStorage.timestampJudgeType = "3";
};

timeFormatSelected.addEventListener('change', function (event) {
    var format = event.target.value;
    console.log('转换时间格式选中的值:', format);
    localStorage.setItem("timeFormatSelected", format);
});

function loadTimestampJudgeType() {
    let timestampJudgeType = localStorage.timestampJudgeType;
    switch (timestampJudgeType) {
        case "1":
            only10Radio.checked = true;
            break;
        case "2":
            only13Radio.checked = true;
            break;
        case "3":
            both10_13.checked = true;
            break;
        default:
            both10_13.checked = true;
            break;
    }
}

function loadGoonStatus() {
    goStatus = !(localStorage.goStatus === "false");
    goonCheckBox.checked = goStatus;
    goonCheckBox.isChecked = goStatus;
}

function loadMenuRadioAction() {
    showAlertCheckbox.checked = !(localStorage.showAlert === "false");
}

function loadTimeFormatSelected() {
    var timeFormatSelected = localStorage.getItem("timeFormatSelected");
    console.log("timeFormatSelected:", timeFormatSelected);
    switch (timeFormatSelected) {
        case "yyyy-MM-dd HH:mm:ss":
            datetimeoption.selected = true;
            break;
        case "yyyy-MM-dd":
            dateoption.selected = true;
            break;
        case "yyyyMMdd":
            datekeyoption.selected = true;
            break;
        default:
            datetimeoption.selected = true;
            break;
    }
}

function getInterval() {
    return setInterval(function () {
        if (goStatus) {
            refresh();
        }
    }, gap);
}

refresh();
inputInput.focus();

resultInput.value = "";
inputInput.value = "";
change();

loadGoonStatus();

loadTimeFormatSelected();

loadMenuRadioAction();

loadTimestampJudgeType();

interval = getInterval();