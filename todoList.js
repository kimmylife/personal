let todoList = [];

//팝업 띄우기
openPop = (type) => {
    if (type == "일괄") {
        //일괄일때
        document.getElementById("layerWarp").style.display = "block";
    }
    else {
        //단건수정
        //.value붙여서
        document.getElementById("layerWarp").value = "";
    }

};

//팝업 닫기
closePop = () => {
    document.getElementById("layerWarp").style.display = "none";
};

//팝업 띄우기
openPopOne = () => {
    document.getElementById("layerWarp2").style.display = "block";
};

//팝업 닫기
closePopOne = () => {
    document.getElementById("layerWarp2").style.display = "none";
};

//

//날짜 선택 Api
$(function () {
    $(".datepicker").datepicker();
});

//전체선택
selectAll = (selectAll) => {
    const checkboxes = document.getElementsByName("checkbox");

    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    });
};

//바꾼 제이슨 데이터를 다시 그리는
$("#tableRow").on("click", "tr", function (e) {
    if ($(e.target).is("input:checkbox")) return;
    var chkbox = $(this).find("checkbox");
    chkbox.prop("checked", !chkbox.prop("checked"));
});


forCheck = () => {
    $("#tableRow tr").on("mousedown", function (e) {
        let checkbox = $(this).find("input[type='checkbox']");
        if (e.target.tagName != "input") {
            //3번 항목에 해당하는 조건문이 추가되었다.
            if ($(checkbox).prop("checked") == false) {
                $(checkbox).prop("checked", true);
            }
        }

    });
}

//항목 추가하기
addList = () => {
    let date = document.getElementById("getDateBox").value;
    let contents = document.getElementById("setTodoText").value;
    let table = document.getElementById("listBody");
    const data = {
        rowId: rowId(),
        date: date,
        contents: contents,
        compelte: "N",
    };

    todoList.push(data);

    //항목 불러오기 후 추가된 내용을 하나씩 넣으려고... 초기화 안해주면 항목이 다시 불러와짐
    table.innerHTML = "";
    addHtml(todoList);

};

addHtml = (todoList) => {
    let table = document.getElementById("listBody");

    for (let items of todoList) {
        var row = `<tr name="trContent" rowId="${items.rowId}", date="${items.date}", content="${items.contents}", compelte="none" id="tableRow" style="text-align: center;" onclick="forCheck()">
                <td class="checkBox"><input type="checkbox" name="checkbox" value="${items.rowId}"></td>
                <td>${items.date}</td>
                <td>${items.contents}</td>
                <td><button type="button" class="deleteOneList" onclick="delOne(${items.rowId})">삭제</button></td>
                <td><button type="button" class="editOneList" onclick="openPopOne('단건')">수정</button></td>
            </tr>`;
        table.innerHTML += row;
    }
}


//rowId 증가를 위함
rowId = () => {
    var table = document.getElementById("table");
    return table.rows.length;
    //마지막 로우 아이디에 플러스 1되게끔 수정
};

//항목 JSON반환
//jsonMethod로 받은 Object형식을 JSON문자열 형태로 변환
callJson = () => {
    alert(JSON.stringify(jsonMethod()));
};

//JSON형태로 반환해주는 메소드
jsonMethod = () => {
    let jsonData = document.getElementById("listBody").children;
    //console.log(jsonData);
    let date = document.getElementById("getDateBox").value;
    let contents = document.getElementById("setTodoText").value;
    todoList = [];

    for (let item of jsonData) {
        let data = {
            rowId: item.getAttribute("rowId"),
            date: item.children[1].textContent,
            contents: item.children[2].textContent,
            compelte: item.getAttribute("compelte"),
        };

        todoList.push(data);
    }
    return todoList;
};

//선택삭제
delSelected = () => {
    //name이 checkbox인 것들 중 체크된 input요소를 가져오기
    let chkbox = document.querySelectorAll("input[name=checkbox]:checked");

    //가져온 인풋 요소의 벨류값(rowId)을 가져와서 delOne()함수에 넣어주기
    chkbox.forEach(function (ch) {
        //console.log(ch.value);
        delOne(ch.value);
    });
};

//단건삭제
delOne = (rowId) => {
    //jsonMethod 가져오기
    let jsonmethod = jsonMethod();

    //반복문으로 jsonmethod의 길이만큼 반복을 돌리고, 하나씩 삭제
    for (let i = 0; i < jsonmethod.length; i++) {
        //console.log(jsonmethod[i]);
        //rowId의 길이가
        if (rowId == jsonmethod[i].rowId) {
            //i의 값 삭제
            jsonmethod.splice(i, 1);
        }
    }

    //console.log(jsonmethod);

    //html로 다시 그려주는 작업
    let table = document.getElementById("listBody");
    let row = "";
    for (let items of jsonmethod) {
        row += `<tr name="trContent" rowId="${items.rowId}", date="${items.date}", content="${items.contents}", compelte="none" id="tableRow" style="text-align: center;">
            <td class="checkBox"><input type="checkbox" name="checkbox" value="${items.rowId}"></td>
            <td>${items.date}</td>
            <td>${items.contents}</td>
            <td><button type="button" class="deleteOneList" onclick="delOne(${items.rowId})">삭제</button></td>
            <td><button type="button" class="editOneList" onclick="openPopOne(${items.rowId})">수정</button></td>
        </tr>`;
    }
    table.innerHTML = row;
};
//이너 HTML을 안으로 넣어서 맞춰주기


let index;

//단건수정 하기
updateOne = (rowId) => {
    //단건수정할 행을 보내줘야 하고
    //행을 가지고 와서 행에 있는 컨텐츠

    let BeforeTransOne = document.getElementById("BeforeTransOne").value;

    let AfterTransOne = document.getElementById("AfterTransOne").value;
    let table = document.getElementById("listBody");
    const json_data = jsonMethod();
    let a = json_data;

    console.log(a);


    let map = new Map(Object.entries(a));
    for (let mapObject of map) {
        if (mapObject[1].contents == BeforeTransOne)
            mapObject[1].contents = AfterTransOne;
    }
    console.log(AfterTransOne.value);

    table.innerHTML = "";
    for (let items of todoList) {
        var row = `<tr name="trContent" rowId="${items.rowId}", date="${items.date}", content="${items.contents}", compelte="none" id="tableRow" style="text-align: center;">
            <td class="checkBox"><input type="checkbox" name="checkbox" value="${items.rowId}"></td>
            <td><a href="javascript:checkComplete">${items.date}</a></td>
            <td><a href="">${items.contents}</a></td>
            <td><button type="button" class="deleteOneList" onclick="delOne(${items.rowId})">삭제</button></td>
            <td><button type="button" class="editOneList" onclick="openPopOne(${items.rowId})">수정</button></td>
        </tr>`;
        table.innerHTML += row;
    }
    //데이터 전달할때는 히든 말고 보이게 하고 먼저 작업, 나중에 수정


    closePopOne();
};

//일괄일 때는 함수 만들어서 히든의 벨류값에 따라 일괄할건지 하나 할건지 분기 쳐주기
//로우 아이디, 필터로 데이터 , MAP함수

//일괄수정
//로우아이디 비교 안하고 컨텐츠만 비교, 문자열 비교로 일부수정도 되게끔
//REPLACEALL로 바꾸기
updateMany = () => {
    todoList.rowId;
    let BeforeTransMany = document.getElementById("BeforeTransMany").value;
    let AfterTrans1Many = document.getElementById("AfterTrans1Many").value;
    let table = document.getElementById("listBody");
    const json_data = jsonMethod();
    let a = json_data;
    console.log(a);
    let map = new Map(Object.entries(a));
    for (let mapObject of map) {
        if (mapObject[1].contents == BeforeTransMany)
            mapObject[1].contents = AfterTrans1Many;
    }
    //console.log(AfterTrans1Many.value);

    table.innerHTML = "";
    for (let items of todoList) {
        var row = `<tr name="trContent" rowId="${items.rowId}", date="${items.date}", content="${items.contents}", compelte="none" id="tableRow" style="text-align: center;">
            <td class="checkBox"><input type="checkbox" name="checkbox" value="${items.rowId}"></td>
            <td>${items.date}</td>
            <td>${items.contents}</td>
            <td><button type="button" class="deleteOneList" onclick="delOne(${items.rowId})">삭제</button></td>
            <td><button type="button" class="editOneList" onclick="openPopOne(${items.rowId})">수정</button></td>
        </tr>`;
        table.innerHTML += row;
    }


    closePop();
};

//항목 불러오기
getJsonData = () => {
    let jsonPromise = new Promise(function (resolve, reject) {
        $.ajax({
            // type : "get",
            //async : false,
            method: "GET",
            url: "/todoList.json",
            dataType: "json",
            contentType: "application/json",
            success: function (todoJson) {
                console.log("통신성공");
                resolve(todoJson);
            },
            error: function (todoJson) {
                reject(todoJson);
            },
        });
    });


    //전역변수에 있는 todoList에다가 푸시해서 넣으면 html 다시 그릴 수 있음
    jsonPromise
        .then((todoJson) => {
            //code if success

            let table = document.getElementById("listBody");
            let row = "";

            todoList = [];

            for (var value of todoJson) {
                todoList.push({
                    // rowId: value.rowId,
                    rowId: "",
                    date: value.date,
                    contents: value.contents,
                    compelte: value.Complete,
                });
            }

            for (let items of todoJson) {
                row += `<tr name="trContent" rowId="${items.rowId}", date="${items.date}", content="${items.contents}", compelte="none" id="tableRow" style="text-align: center;">
                <td class="checkBox"><input type="checkbox" name="checkbox" value="${items.rowId}"></td>
                <td>${items.date}</td>
                <td>${items.contents}</td>
                <td><button type="button" class="deleteOneList" onclick="delOne(${items.rowId})">삭제</button></td>
                <td><button type="button" class="editOneList" onclick="openPopOne(${items.rowId})">수정</button></td>
            </tr>`;
            }
            table.innerHTML += row;

            console.log("일단 성공");
        })
        .catch(function (error) {
            //code if error
            console.log("일단 실패");
        });
};

//초기화
reset = () => {
    //전역변수로 선언해줬던 todoList를 초기화 해줘야함.. 안그럼 다시 돌아감
    todoList = [];
    let table = document.getElementById("listBody");
    table.innerHTML = "";
};

    //검색은 json데이터로 가져올 수 있게끔만..날짜랑 같은 데이터만 alert에 찍도록, JSON STRINGFY사용해서 
