// FIRST TIME AFTER RELOAD
let isFirstTime = true;

//ONLOAD
window.onload = (event) => {
  updateTable();
  event.preventDefault();
};

//INDEX OF ROW TO EDIT
let editIndex = -1;

// CHECK LOCAL STORAGE IS EMPTY
function isEmpty() {
  if (!JSON.parse(localStorage.getItem("Emp-Data"))) {
    return true;
  } else {
    if (JSON.parse(localStorage.getItem("Emp-Data")).length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

// ON FORM SUBMIT
function onFormSubmit(event) {
  // ARRAY OF HOBBIES
  let hobbies = new Array();
  document.querySelectorAll(".hobbies:checked").forEach((checkedHobby) => {
    hobbies.push(checkedHobby.value);
  });
  let phone = document.form.phone.value ? document.form.phone.value : "";

  //EMPLOYEE CLASS
  let Employee = {
    fname: document.form.name.value,
    gender: document.form.gender.value,
    dob: document.form.dob.value,
    email: document.form.email.value,
    phone: phone,
    hobbbies: hobbies,
  };

  const storageArr = JSON.parse(localStorage.getItem("Emp-Data"));

  //UPDATE TABLE CONDITIONALLY
  if (isEmpty()) {
    //EMPTY LOCAL STORAGE
    localStorage.setItem("Emp-Data", JSON.stringify([Employee]));
    updateTable();
    event.preventDefault();
  } else if (editIndex != -1) {
    //IF EDITING
    storageArr[editIndex] = Employee;
    localStorage.setItem("Emp-Data", JSON.stringify(storageArr));
    updateTable();
    event.preventDefault();
  } else {
    //NOT EMPTY LOCAL STORAGE
    const newArr = [...storageArr, Employee];
    localStorage.setItem("Emp-Data", JSON.stringify(newArr));
    updateTable();
    event.preventDefault();
  }
}

//UPDATE TABLE
function updateTable() {

  if (!isEmpty()) {
    const allData = JSON.parse(localStorage.getItem("Emp-Data")); //GET ALL DATA
    //BASIC TABLE

    //     //CREATING TABLE PARTS
    //     let table = document.createElement("table");
    //     let tableRow = new Array();
    //     let tableHeading = new Array();
    //     let tableData = new Array();

    //     // IS IT FIRST TIME MAKING TABLE?
    //     if (isFirstTime) {
    //       createTable();
    //     } else {
    //       document.getElementById("display-table").remove(); // DELETE EXISTING TABLE
    //       createTable();
    //     }

    //     // CREATE TABLE
    //     function createTable() {
    //       document.getElementById("show-data").appendChild(table); // MAKE A NEW TABLE
    //       table.id = "display-table";
    //       let tableHeader = document.createElement("h3");
    //       document.getElementById("display-table").appendChild(tableHeader);
    //       tableHeader.classList.add("header");
    //       tableHeader.innerHTML = "Display";

    //       //ADD TH
    //       const dataKeys = Object.keys(allData[0]);
    //       tableRow[0] = document.createElement("tr");
    //       dataKeys.forEach((dataKey, i) => {
    //         tableHeading[i] = document.createElement("th");
    //         tableHeading[i].innerHTML = dataKey.toUpperCase();
    //         tableRow[0].appendChild(tableHeading[i]);
    //       });
    //       tableHeading[dataKeys.length] = document.createElement("th");
    //       tableHeading[dataKeys.length].innerHTML = "ACTION";
    //       tableRow[0].appendChild(tableHeading[dataKeys.length]);
    //       table.appendChild(tableRow[0]);
    //       isFirstTime = false;
    //     }

    //     // ADD TD & BUTTONS
    //     allData.forEach((data, index) => {
    //       const dataValues = Object.values(data);

    //       // ADD TD
    //       tableRow[index] = document.createElement("tr");
    //       dataValues.forEach((dataValue, i) => {
    //         tableData[i] = document.createElement("td");
    //         tableData[i].innerHTML = dataValue;
    //         tableRow[index].appendChild(tableData[i]);
    //       });

    //       tableData[dataValues.length] = document.createElement("td");

    //       //CREATE EDIT BUTTON
    //       const editBtn = document.createElement("button");
    //       editBtn.classList.add("editBtn");
    //       editBtn.innerHTML = "Edit";
    //       editBtn.onclick = () => {
    //         document.form.name.focus();
    //         //ADDING THINGS IN FORM TO EDIT
    //         document.form.name.value = dataValues[0];
    //         document.form.gender.value = dataValues[1];
    //         document.form.dob.value = dataValues[2];
    //         document.form.email.value = dataValues[3];
    //         document.form.phone.value = dataValues[4];
    //         let hobbyList = document.form.hobbies; // HOBBY IS ARRAY SO...
    //         hobbyList.forEach((hobby) => {
    //           if (dataValues[5].includes(hobby.value)) {
    //             hobby.checked = true;
    //           } else {
    //             hobby.checked = false;
    //           }
    //         });
    //         editIndex = index;
    //         isFirstTime = false;
    //         console.log(editIndex);
    //       };

    //       //CREATE DELETE BUTTON
    //       tableRow[dataValues.length] = document.createElement("tr");
    //       const deleteBtn = document.createElement("button");
    //       deleteBtn.classList.add("deleteBtn");
    //       deleteBtn.innerHTML = "Delete";
    //       deleteBtn.onclick = () => {
    //         delIndex = index;
    //         deleteRow(delIndex);
    //       };

    //       tableData[dataValues.length].appendChild(editBtn);
    //       tableData[dataValues.length].appendChild(deleteBtn);
    //       tableRow[index].appendChild(tableData[dataValues.length]); //ADD BUTTONS TO TABLE ROW

    //       function deleteRow(delIndex) {
    //         tableRow[delIndex].remove();
    //         allData.splice(delIndex, 1);
    //         localStorage.setItem("Emp-Data", JSON.stringify(allData));
    //         if (isEmpty()) {
    //           isFirstTime = true;
    //           document.getElementById("display-table").remove(); // DELETE EXISTING TABLE
    //         }
    //       }

    //       table.appendChild(tableRow[index]);
    //     });
    //     document.form.reset(); // RESET FORM
    //     isFirstTime = false; // NOT FIRST TIME

    //ADVANCE TABLE

    //CREATING TABLE PARTS
    let tableHeight = JSON.parse(localStorage.getItem("Emp-Data")).length;
    let table = document.createElement("table");
    let tableRow = new Array();
    let tableHeading = new Array();
    let tableData = new Array();

    // IS IT FIRST TIME MAKING TABLE?
    if (isFirstTime) {
      createTable();
    } else {
      document.getElementById("display-table").remove(); // DELETE EXISTING TABLE
      createTable();
    }

    // CREATE TABLE
    function createTable() {
      document.getElementById("show-data").appendChild(table); // MAKE A NEW TABLE
      table.id = "advance-table";
      let tableHeader = document.createElement("h3");
      document.getElementById("display-table").appendChild(tableHeader);
      tableHeader.classList.add("header");
      tableHeader.innerHTML = "Advance";

      for(let i = 0; i< tableHeight; i++){        
        tableRow[0] = document.createElement("tr");
      }

      //ADD TH
      const dataKeys = Object.keys(allData[0]);
      tableRow[0] = document.createElement("tr");
      dataKeys.forEach((dataKey, i) => {
        tableHeading[i] = document.createElement("th");
        tableHeading[i].innerHTML = dataKey.toUpperCase();
        tableRow[0].appendChild(tableHeading[i]);
      });
      tableHeading[dataKeys.length] = document.createElement("th");
      tableHeading[dataKeys.length].innerHTML = "ACTION";
      tableRow[0].appendChild(tableHeading[dataKeys.length]);
      table.appendChild(tableRow[0]);
      isFirstTime = false;
    }
  }
  // NO DATA IN LOCAL STORAGE
  else {
    if (!isFirstTime) {
      document.getElementById("display-table").remove(); // DELETE EXISTING TABLE
    }
  }
}

// VALIDATE FUNCTIONS START //

//VALIDATE ON SUBMIT
function validate() {
  let nameValiRes = validateName(document.form.name);
  let dobValiRes = validateDOB(document.form.dob);
  let emailValiRes = validateEmail(document.form.email);

  if (nameValiRes && dobValiRes && emailValiRes) {
    // CHECK IF ALL IS GOOD
    return true;
  } else {
    return false;
  }
}

// VALIDATE ON INPUT
const inputFields = document.querySelectorAll("input");
inputFields.forEach((list) => {
  list.addEventListener("input", (ele) => {
    if (ele != undefined) {
      switch (ele.target.name) {
        case "name":
          validateName(document.form.name);
          break;
        case "dob":
          validateDOB(document.form.dob);
          break;
        case "email":
          validateEmail(document.form.email);
          break;
        case "phone":
          validatePhone(document.form.phone);
          break;
      }
    }
  });
});

// NAME VALIDATION
function validateName(inputText) {
  const showError = document.querySelector(".error-name");

  if (isInputEmpty(inputText)) {
    showError.innerHTML = "*Name required";
    disableSubmit();
    return false;
  } else if (inputText.value.length > 20 || inputText.value.length < 4) {
    showError.innerHTML = "*Name length should be 4 to 20 characters";
    disableSubmit();
    return false;
  } else {
    showError.innerHTML = "";
    enableSubmit();
    return true;
  }
}

// DOB VALIDATION
function validateDOB(inputText) {
  const showError = document.querySelector(".error-dob");
  var dateformat =
    /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;

  if (isInputEmpty(inputText)) {
    showError.innerHTML = "*Date required";
    disableSubmit();
    return false;
  } else if (!inputText.value.match(dateformat)) {
    showError.innerHTML = "*Invalid date";
    disableSubmit();
    return false;
  } else {
    showError.innerHTML = "";
    enableSubmit();
    return true;
  }
}

// EMAIL VALIDATION
function validateEmail(inputText) {
  const showError = document.querySelector(".error-email");
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (isInputEmpty(inputText)) {
    showError.innerHTML = "*Email required";
    disableSubmit();
    return false;
  } else if (!inputText.value.match(mailformat)) {
    showError.innerHTML = "*Invalid Email";
    disableSubmit();
    return false;
  } else {
    showError.innerHTML = "";
    enableSubmit();
    return true;
  }
}

// PHONE VALIDATION
function validatePhone(inputText) {
  const showError = document.querySelector(".error-phone");
  if (inputText.value.length != 10) {
    showError.innerHTML = "*Invalid Phone";
    disableSubmit();
  } else if (isEmpty(inputText) || inputText.value.length == 10) {
    showError.innerHTML = "";
    enableSubmit();
  }
}

// VALIDATE FUNCTIONS END //

// DISABLE/ENABLE SUBMIT
function disableSubmit() {
  document.getElementById("submit-btn").disabled = true;
}
function enableSubmit() {
  document.getElementById("submit-btn").disabled = false;
}

// IS INPUT EMPTY?
function isInputEmpty(inputText) {
  return inputText.value == "" || inputText.value == null;
}
