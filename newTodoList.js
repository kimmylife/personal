let todoList = [];
let todoListNum = [];

//날짜 선택 Api
$(function () {
    $(".datepicker").datepicker();
});

//------------------------------------------------------------------------------
//항목 추가하기
//------------------------------------------------------------------------------
addList = () => {
    let date = document.getElementById("getDateBox").value;
    let contents = document.getElementById("setTodoText").value;
    let table = document.getElementById("listBody");

    //날짜정보 확인해줘
    if (date == "") {
        alert("날짜 칸을 채워죠");
        return false;
    }

    //내용정보 확인해줘
    if (contents == "" || contents === false) {
        alert("내용 칸을 채워죠");
        return false;
    }

    const data = {
        rowId: "",
        date: date,
        contents: contents,
        complete: "none",
    };

    todoList.push(data);
    //console.log(todoList);

    //항목 불러오기 후 추가된 내용을 하나씩 넣으려고... 초기화 안해주면 항목이 다시 불러와짐
    table.innerHTML = "";
    addHtml(todoList);
};




//------------------------------------------------------------------------------
//로우 추가
//------------------------------------------------------------------------------
addHtml = (todoList) => {
    let table = document.getElementById("listBody");
    let newRow = 1;

    for (let items of todoList) {
        var row = `<tr name="trContent" rowId="${newRow}", date="${items.date}", content="${items.contents}", complete="none" id="tableRow_${newRow}" style="text-align: center;">
                <td class="checkBox"><input type="checkbox" name="checkTodo" id="check_${newRow}" value="${newRow}"></td>
                <td><a href="javascript:checkComplete(${newRow})" style="text-decoration: none; color:black;">${items.date}</a></td>
                <td id="contents_${newRow}"><a href="javascript:checkComplete(${newRow})" style="text-decoration: none; color:black;">${items.contents}</a></td>
                <td><button type="button" class="deleteOneList" onclick="delOne(${newRow})">삭제</button></td>
                <td id="updateBtn_${newRow}"><button type="button" class="editOneList" onclick="openPopOne('${newRow}', '${items.contents}');">수정</button></td>
            </tr>`;
        table.innerHTML += row;
        if(items.complete == "done"){
            document.getElementById("tableRow_"+newRow).style.backgroundColor = '#FFA07A';
        }
        newRow++;
    }
    ;
}






//------------------------------------------------------------------------------
//팝업열기
//------------------------------------------------------------------------------
openPopOne = (newRow, preContents) => {
    //값 초기화
        document.getElementById("BeforeTransOne").value = "";
        document.getElementById("newRowId").value = "";
        document.getElementById("layerTitle").innerHTML = "";
        document.getElementById("btnArea").innerHTML = "";

    //벨류값에 해당 줄의 정보를 가져와서 넣어주고 디스에이블 처리
        document.getElementById("BeforeTransOne").value = preContents;
        document.getElementById("BeforeTransOne").disabled = true;
        document.getElementById("newRowId").value = newRow;

        document.getElementById("layerTitle").innerHTML = " &lt; 단건수정  &gt;";
        document.getElementById("btnArea").innerHTML = " <button type='button' class='editConfirm' value='editConfirm' onclick='updateOne()'>단건수정</button>";
    //팝업열기
        document.getElementById("layerWarp2").style.display = "block";
};




//------------------------------------------------------------------------------
//팝업 닫기
//------------------------------------------------------------------------------
closePopOne = () => {
    document.getElementById("layerTitle").innerHTML = "";
    document.getElementById("btnArea").innerHTML = "";
    document.getElementById("layerWarp2").style.display = "none";
};








//------------------------------------------------------------------------------
//단건수정
//------------------------------------------------------------------------------
updateOne = () => {

    //폼에 있는 데이터 한번에 가져오기
    let frm = document.writeForm;

    if (!frm.newRowId.value) {
        alert("잘못된 접근입니다. ");
        return false;
    }


    if (frm.AfterTransOne.value.trim() === "") {
        alert("바꾸실 내용을 입력해주세요");
        return false;
    }

    
    //폼에 있는 로우아이디를 가지고 바꾸고자 하는 테이블의 로우아이디 찾기
        let contentsId = "contents_" + frm.newRowId.value;
        let btnId = "updateBtn_" + frm.newRowId.value;
        let todoListArrNum = frm.newRowId.value - 1;


    //테이블에 들어 있는 값을 frm의 AfterTransOne로 바꿔줌
        document.getElementById(contentsId).innerHTML = frm.AfterTransOne.value;
        document.getElementById(btnId).innerHTML = "<button type='button' class='editOneList' onclick=\"openPopOne('" + frm.newRowId.value + "', '" + frm.AfterTransOne.value + "');\">수정</button>";


    todoList[todoListArrNum]["contents"] = frm.AfterTransOne.value;
    //console.log(todoList);


    //원하는 거 다 하고나면 폼에 있는 데이터 초기화
    // document.getElementById("BeforeTransOne").disabled = false;
        frm.BeforeTransOne.value = "";
        frm.newRowId.value = "";
        frm.AfterTransOne.value = "";
        document.getElementById("layerTitle").innerHTML = "";

    //모달 닫음
    closePopOne();
};









//------------------------------------------------------------------------------
//일괄수정
//------------------------------------------------------------------------------
openPopMany = () => {
    document.getElementById("BeforeTransOne").value = "";
    document.getElementById("newRowId").value = "";
    document.getElementById("layerTitle").innerHTML = "";
    document.getElementById("btnArea").innerHTML = "";

    document.getElementById("BeforeTransOne").disabled = false;
    document.getElementById("layerTitle").innerHTML = "&lt; 일괄수정  &gt;";
    document.getElementById("btnArea").innerHTML = " <button type='button' class='editConfirm' value='editConfirm' onclick='updateMany()'>일괄수정</button>";

    document.getElementById("layerWarp2").style.display = "block";
};


updateMany = () => {
    //폼에 있는 데이터 한번에 가져오기
    let frm = document.writeForm;

    if (frm.BeforeTransOne.value.trim() === "") {
        alert("찾으실 내용을 입력해주세요");
        return false;
    }
    if (frm.AfterTransOne.value.trim() === "") {
        alert("바꾸실 내용을 입력해주세요");
        return false;
    }

    //todoLIst가 배열인지 true false로 확인 후 맞거나, 배열의 길이가 0보다 크다면
        if (Array.isArray(todoList) && todoList.length > 0) {
            //todoList 인덱스 재설정(DB에서 불러온다면 할 필요 없지만)
            for (let i = 0; i < todoList.length; i++) {

                //수정할 html컨텐츠의 id값 찾기
                let contentsId = "contents_" + (i + 1);
                //해당 컨텐츠의 찾고자 하는 문자열이 있는지 확인
                if (todoList[i]["contents"].includes(frm.BeforeTransOne.value)) {
                    //있으면 html수정 + 배열 수정
                    document.getElementById(contentsId).innerHTML = frm.AfterTransOne.value;
                    todoList[i]["contents"] = frm.AfterTransOne.value;
                }
            }
        } else {
            alert("할일을 작성해주세요");
        }
    //console.log(todoList);
        frm.BeforeTransOne.value = "";
        frm.newRowId.value = "";
        frm.AfterTransOne.value = "";
        document.getElementById("layerTitle").innerHTML = "";
        closePopOne();
};






//------------------------------------------------------------------------------
//단건삭제
//------------------------------------------------------------------------------
delOne = (newRow) => {
    let delRowId = "tableRow_" + newRow;
    let todoListArrNum = newRow - 1;

    //html을 삭제
        document.getElementById(delRowId).remove();
        //console.log(delRowId);

    //실제 json배열을 삭제해주는
        todoList.splice(todoListArrNum, 1);
        //console.log(todoList);

    //삭제했을 떄 todoList 다시 써주기
        document.getElementById("listBody").innerHTML = "";
        addHtml(todoList);

    return true;
}






//------------------------------------------------------------------------------
//선택삭제
//------------------------------------------------------------------------------
delSelected = () => {
    //name이 checkbox인 것들 중 체크된 input요소를 가져오기(chkbox에 둘어있는건 ID값)
    let chkbox = document.querySelectorAll("input[name=checkTodo]:checked");

    //체크여부 확인
    if(chkbox.length > 0) {
        //체크된 것들을 제외한 데이터를 담아줄 배열을 선언
        newTodoList = [];
            
        for(let i=0;i<todoList.length;i++) {
            //todoList를 돌면서 체크된 요소의 배열의 넘버를 있는지 없는지 확인
            let checkTodo = false;
            //ch에는 아이디값까지만 적혀있어서 -1
            chkbox.forEach(function(ch) {        
                if(i == ch.value-1) {
                    checkTodo = true;        
                }   
            });
            //checkTodo에 체크된 요소가 있는지 확인
            if(!checkTodo) {
                //체크되지 않은 애들만 새로운 배열에 담아줌
                newTodoList.push(todoList[i]);    
            }
        }

        todoList = [];
        todoList = newTodoList;
        document.getElementById("listBody").innerHTML = "";
        addHtml(todoList);

        return true;
    
    } else {
        alert("삭제할 데이터를 선택해주세요.");
        return false;
    }
};





//------------------------------------------------------------------------------
//전체선택
//------------------------------------------------------------------------------
selectAll = (selectAll) => {
    const checkboxes = document.getElementsByName("checkTodo");

    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    });
};










//------------------------------------------------------------------------------
//항목 JSON반환
//------------------------------------------------------------------------------


//jsonMethod로 받은 Object형식을 JSON문자열 형태로 변환
callJson = () => {
    //todoLIst가 배열인지 true false로 확인 후 맞거나, 배열의 길이가 0보다 크다면
    if (Array.isArray(todoList) && todoList.length > 0) {
        //todoList 인덱스 재설정(DB에서 불러온다면 할 필요 없지만)
        for (let i = 0; i < todoList.length; i++) {
            let newRowId = i + 1;
            //배열 안에 들어와서, 0번째 rowId부터 아이디값을 새로 넣어주기
            todoList[i]["rowId"] = newRowId;
        }
        let todoListJson = JSON.stringify(todoList);
        alert(todoListJson);
    } else {
        alert("할일 목록을 작성해 주세요.");
        return false;
    }
};












//------------------------------------------------------------------------------
//항목 불러오기
//------------------------------------------------------------------------------
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

            if (Array.isArray(todoList) && todoList.length == 0) {
                todoList = [];
            }

            for (var value of todoJson) {
                todoList.push({
                    // rowId: value.rowId,
                    rowId: "",
                    date: value.date,
                    contents: value.contents,
                    complete: value.complete
                });
            }
            //JSON 가져왔을 때 todoList 다시 써주기
            document.getElementById("listBody").innerHTML = "";
            addHtml(todoList);
            console.log(todoList);
            console.log("일단 성공");
        })
        .catch(function (error) {
            //code if error
            console.log("일단 실패");
        });
};





//------------------------------------------------------------------------------
//검색
//------------------------------------------------------------------------------
searchDate = () => {
    let searchDate = document.getElementById("getDateBox").value;
    //찾는 날짜가 없으면 실행하지않음
    if(!searchDate){
        alert("날짜를 선택해주세요");
        return false;
    }
    
    //todoLIst가 배열인지 true false로 확인 후 맞거나, 배열의 길이가 0보다 크다면
    if (Array.isArray(todoList) && todoList.length > 0) {
        //새로 담을 리스트 만들어주고
        newTodoList = [];
        //찾는 데이터가 있는지 확인
        checkSearchDate = false;

        
        for (let i = 0; i < todoList.length; i++) {

            //해당 데이터의 찾는 날짜가 있는지 확인
            if (todoList[i]["date"].includes(searchDate)) {
                //한건이라고 있다면 트루
                checkSearchDate = true;

                //새로운 배열에 찾는 데이터만 담아주고
                newTodoList.push({
                    rowId: "",
                    date: todoList[i]["date"],
                    contents: todoList[i]["contents"],
                    complete: todoList[i]["complete"]
                });
            }
        }

        //만약 찾는 데이터가 하나라도 있다면 
        if(checkSearchDate) {
            //기존 todoList를 초기화해주고
            todoList = [];
            //교체
            todoList = newTodoList;
            
            //다시 html작성
            document.getElementById("listBody").innerHTML = "";
            addHtml(todoList);

        } else {
            //찾는 데이터가 하나도없다면 종료
            alert("찾는 날짜가 없습니다.");
            return false;
        }
    } else {
        alert("할일을 작성해주세요");
    }
}




//------------------------------------------------------------------------------
//상태완료 클릭
//------------------------------------------------------------------------------
checkComplete = (newRowNum) => {
    let todoListIndex = newRowNum-1;

    todoList[todoListIndex]["complete"] = "done";
    document.getElementById("tableRow_"+newRowNum).style.backgroundColor = '#FFA07A';
    return true;
}






//------------------------------------------------------------------------------
//초기화
//------------------------------------------------------------------------------
reset = () => {
    //전역변수로 선언해줬던 todoList를 초기화 해줘야함.. 안그럼 다시 돌아감
    todoList = [];
    let table = document.getElementById("listBody");
    table.innerHTML = "";
};




