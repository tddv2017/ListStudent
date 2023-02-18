"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
const gARRAY_STUDENT = ["id", "name", "birthday", "email", "phone", "action"];
  const gSTT_COL = 0;
  const gNAME_COL = 1;
  const gBIRTHDAY_COL = 2;
  const gEMAIL_COL = 3;
  const gPHONE_COL = 4;
  const gACTION_COL = 5;
  const gURL_BASE = "https://devcamp-student-datatables.herokuapp.com/users/";
  const gCONTENT_TYPE = "application/json;charset=UTF-8";
  var gId;
  $(document).ready(function() {
    //2.---R---
  $("#id-table-users").DataTable({
    columns: [
        { data: gARRAY_STUDENT[gSTT_COL] },
        { data: gARRAY_STUDENT[gNAME_COL] },
        { data: gARRAY_STUDENT[gBIRTHDAY_COL] },
        { data: gARRAY_STUDENT[gEMAIL_COL] },
        { data: gARRAY_STUDENT[gPHONE_COL] },
        { data: gARRAY_STUDENT[gACTION_COL] }
    ],
    columnDefs: [
        {
          targets:gACTION_COL,
          defaultContent:`
          <button class="btn btn-primary btn-edit"><i title="Edit" style="cursor:pointer" class="fas fa-edit fa-lg" aria-hidden="true"></i>&nbsp;Sửa</button>
          <button class="btn btn-danger btn-delete"><i title="Delete" style= "cursor:pointer" class="fa fa-trash fa-lg" aria-hidden="true"></i>&nbsp;Xóa</button>
          `
        },
        {
            targets:gSTT_COL, 
            width: 20,
            targets:gBIRTHDAY_COL,
            width: 40,
        }
    ]    
  })
  /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
  onPageLoad();  
    //1.---C---
    $("#btn-add-student").on("click", function(){
        $("#add-user-modal").modal('show');
    });
    $("#btn-insert-user").on("click", function(){
        onBtnAddStudentClick();
    });
    //3.---U---
    $("#id-table-users").on('click', '.btn-edit', function(){
        onBtnEditDataStudent(this);
    });
    $("#btn-update-user").on("click", function(){
        onBtnUpdateStudentClick();
    });
    //4.---D---
    $("#id-table-users").on('click', '.btn-delete', function(){
        onBtnDeleteDataStudent(this);
    });
    $("#btn-delete-user").on("click", function(){
        onBtnConfirmDeleteStudentClick();
    });

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */ 
function onPageLoad() {
loadListStudent();
}
function onBtnEditDataStudent(paramSuaButton) {
    var gListStudentTable = $("#id-table-users").DataTable();
    //Xác định thẻ tr là cha của nút được chọn
    var vRowSelected = $(paramSuaButton).parents('tr');
    //Lấy datatable row
    var vDatatableRow = gListStudentTable.row(vRowSelected); 
    //Lấy data của dòng 
    var vStudentData = vDatatableRow.data();
    gId = vStudentData.id;              
    console.log(gId);
    $("#edit-user-modal").modal('show');
    getDataStudentById(gId);
    
}
function onBtnDeleteDataStudent(paramDelete) {
var gListStudentTable = $("#id-table-users").DataTable();
//Xác định thẻ tr là cha của nút được chọn
var vRowSelected = $(paramDelete).parents('tr');
//Lấy datatable row
var vDatatableRow = gListStudentTable.row(vRowSelected); 
//Lấy data của dòng 
var vStudentData = vDatatableRow.data();
gId = vStudentData.id;              
console.log(gId);
$("#delete-user-modal").modal('show')
getDataStudentById(gId);
}
function onBtnAddStudentClick() {
    $("#add-user-modal").modal('show');
    //B1 Khai báo đối tượng chứa và thu thập dữ liệu
    var vStudentObject = {
        name:"",
        birthday:"",
        email:"",
        phone:""
    };
    getDataStudentModalAdd(vStudentObject);
    //B2 Validate data student input modal add
    var vDuLieuHopLe = validateStudentModalAdd(vStudentObject);
    if(vDuLieuHopLe){
        console.log("Dữ liệu dợp lệ");
        //B3 call ajax post request để add new student
        callAjaxPostStudent(vStudentObject);
    }
}
function onBtnUpdateStudentClick() {
    //B1 Khai báo đối tượng chứa và thu thập dữ liệu
    var vStudentObject = {
        id:"",
        name:"",
        birthday:"",
        email:"",
        phone:""
    };
    getDataStudentModalEdit(vStudentObject);
    //B2 Validate data student input modal add
    var vDuLieuHopLe = validateStudentModalAdd(vStudentObject);
    if(vDuLieuHopLe){
        console.log("Dữ liệu dợp lệ");
        //B3 call ajax post request để add new student
        callAjaxUpdateStudent(vStudentObject);
    }
}
function onBtnConfirmDeleteStudentClick() {
    //B1 thu thập dữ liệu
    var vStudentIdObj = {
        id: gId
    }
    //B2 validate (không cần)
    //B3 call ajax delete student
    callAjaxDeleteStudent(vStudentIdObj)
}
  /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
//Hàm call ajax delete student
function callAjaxDeleteStudent(paramStudent) {
    $.ajax({
        url: gURL_BASE + paramStudent.id,
        contentType: gCONTENT_TYPE,
        method:"DELETE",
        success:function(data) {
            console.log(data);
            //B4 hiển thị font-end đã sửa
            alert("Id: " + paramStudent.id + ", đã xáo thành công")
            $("#delete-user-modal").modal('hide');
            window.location.reload();
        },
        error:function(error) {
            console.assert(false, "Error " + error);
        }
    })
 }
//Hàm call ajax update student
function callAjaxUpdateStudent(paramStudent) {
    $.ajax({
        url: gURL_BASE + paramStudent.id,
        contentType: gCONTENT_TYPE,
        data: JSON.stringify(paramStudent),
        method:"PUT",
        success:function(data) {
            console.log(data);
            //B4 hiển thị font-end đã sửa
            alert("Id: " + paramStudent.id + ", đã cập nhật thành công")
            $("#edit-user-modal").modal('hide');
            window.location.reload();
        },
        error:function(error) {
            console.assert(false, "Error " + error);
        }
    })
 }
//Hàm getdata Edit modal
function getDataStudentModalEdit(paramObjStudent) {
    paramObjStudent.name = $("#input-edit-user-name").val();
    paramObjStudent.birthday = $("#input-edit-user-birthday").val();
    paramObjStudent.email = $("#input-edit-user-email").val();
    paramObjStudent.phone = $("#input-edit-user-phone").val();
    paramObjStudent.id = gId;
}
//Hàm call Ajax theo Id 
function getDataStudentById(paramIdStudent) {
    $.ajax({
        url: gURL_BASE + paramIdStudent,
        contentType: gCONTENT_TYPE,
        method:"GET",
        success:function(data) {
            console.log(data);
            pushDataStudentModalEdit(data);
        },
        error:function(error) {
            console.assert(false, "Error " + error);
        }
    })
}
function pushDataStudentModalEdit(paramObjStudent) {
    $("#input-edit-user-name").val(paramObjStudent.name);
    $("#input-edit-user-birthday").val(paramObjStudent.birthday);
    $("#input-edit-user-email").val(paramObjStudent.email);
    $("#input-edit-user-phone").val(paramObjStudent.phone);
}
//Hàm call Ajax post request
function callAjaxPostStudent(paramStudent) {
    $.ajax({
        url: gURL_BASE,
        data:JSON.stringify(paramStudent),
        contentType: gCONTENT_TYPE,
        method:"POST",
        success:function(data) {
            console.log(data);
            //B4 hiẻn thị xử lý lên font-ent
            alert("Đã thêm student thành công")
            $("#add-user-modal").modal('hide');
            window.location.reload();
        },
        error:function(error) {
            console.assert(false, "Error " + error);
        }
    })
}
//Hàm getdataStudent form Modal Add
function getDataStudentModalAdd(paramStudent) {
    paramStudent.name = $("#input-add-user-name").val();
    paramStudent.birthday = $("#input-add-user-birthday").val();
    paramStudent.email = $("#input-add-user-email").val();
    paramStudent.phone = $("#input-add-user-phone").val();
}
//Hàm kiểm tra input modal add
function validateStudentModalAdd(paramStudent) {
    if(paramStudent.name == '') {
        alert("Chưa nhập name");
        return false;
    } 
    if(paramStudent.birthday == '') {
        alert("Chưa nhập birthday");
        return false;
    } 
    if(paramStudent.email == '') {
        alert("Chưa nhập email");
        return false;
    } 
    if(paramStudent.phone == '') {
        alert("Chưa nhập phone");
        return false;
    }
    return true;
}
//Hàm call Ajax List Student
function loadListStudent () {
    $.ajax({
        url: gURL_BASE,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            loadListStudentToTable(data);
        },
        error: function (error) {
            console.log(error.status);
        }
    })
}
//Hàm loadListStudentToTable
function loadListStudentToTable(paramObjStudent) {
    "use strict";
    var vTable = $("#id-table-users").DataTable(); //truy xuất datatable
    vTable.clear();//Xóa dữ liệu data table
    vTable.rows.add(paramObjStudent);//thêm các dòng vào table
    vTable.draw(); //Vẽ lại bảng
}
});