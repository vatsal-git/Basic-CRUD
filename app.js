let empForm = document.empForm;
let editAt = -1;
const dispErrors = document.querySelectorAll(".error");
//ON RELOAD
window.onload = (event) => {
    if (!isStorageEmpty()) { updateTable() }
    event.preventDefault();
};
//ON SUBMIT
function onFormSubmit(event) {
    event.preventDefault();
    // if (validate()) {
    if (isStorageEmpty()) {
        setLocalStorage([getEmpForm()]);
    } else if (editAt != -1) {
        let tmp = getLocalStorage();
        tmp[editAt] = getEmpForm();
        setLocalStorage(tmp);
        editAt = -1;
    } else {
        setLocalStorage([...getLocalStorage(), getEmpForm()]);
    }
    updateTable();
    // }
}
//UPDATE TABLE
function updateTable() {
    const arrOfData = getLocalStorage();
    const dataKeys = Object.keys(arrOfData[0]);
    dataKeys.push("ACTION");
    dataKeys.splice(dataKeys.indexOf("id"), 1);

    //BASIC TABLE
    if (!document.getElementById('basicTable')) {
        const basicTable = createEle("table", document.body, { className: "dispTable", id: "basicTable" });
        createEle("h3", basicTable, { className: "header", textContent: "Basic table" });

        //TH
        const headRow = createEle("tr", basicTable, {});
        dataKeys.forEach((dataKey) => {
            createEle("th", headRow, { className: 'dispTableHead', textContent: dataKey.toUpperCase() });
        });

        arrOfData.forEach((data) => {
            const dataValues = Object.values(data);
            let id = dataValues.splice(0, 1);
            //TD
            const dataRow = createEle("tr", basicTable, { className: 'tableRow' });
            dataValues.forEach((dataValue) => {
                createEle("td", dataRow, { className: "dispTableData", textContent: dataValue });
            });

            //BTN
            const btnCell = createEle("td", dataRow, { className: "dispTableData" });
            createEle("button", btnCell, { className: "editBtn btn", textContent: "Edit", onclick: () => { onEditLogic(data); } });
            createEle("button", btnCell, { className: "deleteBtn btn", textContent: "Delete", onclick: () => { onDeleteLogic(data); } });
        });
    } else {
        const index = arrOfData.length - 1;
        const dataValues = Object.values(arrOfData[index]);
        let id = dataValues.splice(0, 1);
        //TD
        const dataRow = createEle("tr", basicTable, { className: 'tableRow' });
        dataValues.forEach((dataValue) => {
            createEle("td", dataRow, { className: "dispTableData", textContent: dataValue });
        });
        //BTN
        const btnCell = createEle("td", dataRow, { className: "dispTableData" });
        createEle("button", btnCell, { className: "editBtn btn", textContent: "Edit", onclick: () => { onEditLogic(data); } });
        createEle("button", btnCell, { className: "deleteBtn btn", textContent: "Delete", onclick: () => { onDeleteLogic(data); } });
    }

    //ADVANCE TABLE
    if (!document.getElementById('advanceTable')) {
        const advanceTable = createEle("table", document.body, { className: "dispTable", id: "advanceTable" });
        createEle("h3", advanceTable, { className: "header", textContent: "Advance table" });

        dataKeys.forEach((dataKey, rowNum) => {
            const tableRow = createEle("tr", advanceTable, { className: "tableRow" });
            arrOfData.forEach((data, columNum) => {
                //TH
                if (columNum == 0) {
                    createEle("th", tableRow, { className: 'dispTableHead', textContent: dataKey.toUpperCase() });
                }
                //TD
                if (rowNum != dataKeys.length - 1) {
                    createEle("td", tableRow, { className: "dispTableData", textContent: Object.values(arrOfData[columNum])[rowNum] });
                } else {
                    //BTN
                    const btnCell = createEle("td", tableRow, { className: "dispTableData" });
                    createEle("button", btnCell, { className: "editBtn btn", textContent: "Edit", onclick: () => { onEditLogic(data); } });
                    createEle("button", btnCell, { className: "deleteBtn btn", textContent: "Delete", onclick: () => { onDeleteLogic(data); } });
                }
            });
        });
    } else {
        dataKeys.forEach((dataKey, rowNum) => {
            const tableRow = createEle("tr", advanceTable, { className: "tableRow" });
            arrOfData.forEach((data, columNum) => {
                //TD
                if (rowNum != dataKeys.length - 1) {
                    createEle("td", tableRow, { className: "dispTableData", textContent: Object.values(arrOfData[columNum])[rowNum] });
                } else {
                    //BTN
                    const btnCell = createEle("td", tableRow, { className: "dispTableData" });
                    createEle("button", btnCell, { className: "editBtn btn", textContent: "Edit", onclick: () => { onEditLogic(data); } });
                    createEle("button", btnCell, { className: "deleteBtn btn", textContent: "Delete", onclick: () => { onDeleteLogic(data); } });
                }
            });
        });
    }

    empForm.reset();
}
//CREATE ELEMENT (HELPER)
function createEle(eleType, parent, properties) {
    const ele = document.createElement(eleType);
    parent.appendChild(ele);
    Object.keys(properties).forEach((key) => {
        ele[key] = properties[key]
    })
    return ele;
}
//REMOVE ELEMENT (HELPER)
function removeEle(ele) {
    ele.remove();
}
//GET EMPLOYEE OBJECT
function getEmpForm() {
    const Employee = {
        id: getUUID(),
        fname: empForm.name.value,
        gender: empForm.gender.value,
        dob: empForm.dob.value,
        email: empForm.email.value,
        phone: empForm.phone.value ? empForm.phone.value : "",
        hobbies: getHobbies(),
    };
    return Employee;
}
//SET FORM
function setForm(dataValues) {
    empForm.fname.focus();
    empForm.fname.value = dataValues[0];
    empForm.gender.value = dataValues[1];
    empForm.dob.value = dataValues[2];
    empForm.email.value = dataValues[3];
    empForm.phone.value = dataValues[4];
    document.getElementsByClassName(".hobbies").forEach((hobby) => {
        if (dataValues[5].includes(hobby.value)) {
            hobby.checked = true;
        } else {
            hobby.checked = false;
        }
    });
}
//IS LOCAL STORAGE EMPTY (HELPER)
function isStorageEmpty() {
    if (!getLocalStorage()) {
        return true;
    } else {
        if (getLocalStorage().length == 0) {
            return true;
        } else {
            return false;
        }
    }
}
//GET LOCAL STORAGE (HELPER)
function getLocalStorage() {
    return JSON.parse(localStorage.getItem("Employee"));
}
//SET LOCAL STORAGE (HELPER)
function setLocalStorage(item) {
    localStorage.setItem("Employee", JSON.stringify(item));
}
// RETURN HOBBIES (HELPER)
function getHobbies() {
    let hobbies = new Array();
    document.querySelectorAll(".hobbies:checked").forEach((checkedHobby) => {
        hobbies.push(checkedHobby.value);
    });
    return hobbies;
}
//UUID (HELPER)
function getUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
    return uuid;
}
//VALIDATE
function validate() {
    let validateRes = [
        validateName(empForm.name.value),
        validateDOB(empForm.dob.value),
        validateEmail(empForm.email.value),
        validatePhone(empForm.phone.value),
    ];
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.addEventListener("input", (ele) => {
            switch (ele.target.name) {
                case "fname":
                    validateRes[0] = validateName(ele.target.value);
                    break;
                case "dob":
                    validateRes[1] = validateDOB(ele.target.value);
                    break;
                case "email":
                    validateRes[2] = validateEmail(ele.target.value);
                    break;
                case "phone":
                    validateRes[3] = validatePhone(ele.target.value);
                    break;
            }
        });
    });

    return validateRes.every((res) => {
        return res == true;
    });
}

// NAME VALIDATION
function validateName(inputText) {
    if (isLength(inputText)) {
    } else if (inputText.length > 20 || inputText.length < 4) {
        dispErrors[0].innerHTML = "*Name length should be 4 to 20 characters";
    } else {
        dispErrors[0].innerHTML = "";
    }
    return handleError(isLength(dispErrors[0].innerHTML));
}
// DOB VALIDATION
function validateDOB(inputText) {
    const dateformat =
        /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/;
    if (isLength(inputText)) {
        console.log("here");
        dispErrors[1].innerHTML = "*Required";
    } else if (!inputText.match(dateformat)) {
        dispErrors[1].innerHTML = "*Invalid date (MM/DD/YY)";
    } else {
        dispErrors[1].innerHTML = "";
    }
    return handleError(isLength(dispErrors[1].innerHTML));
}
// EMAIL VALIDATION
function validateEmail(inputText) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (isLength(inputText)) {
        dispErrors[2].innerHTML = "*Required";
    } else if (!inputText.match(mailformat)) {
        dispErrors[2].innerHTML = "*Invalid Email (eg. work@email.com)";
    } else {
        dispErrors[2].innerHTML = "";
    }
    return handleError(isLength(dispErrors[2].innerHTML));
}
// PHONE VALIDATION
function validatePhone(inputText) {
    if (isLength(inputText) || isLength(inputText, 10)) {
        dispErrors[3].innerHTML = "";
    } else if (!isLength(inputText, 10)) {
        dispErrors[3].innerHTML = "*Phone number should be of 10 digits";
    }
    return handleError(isLength(dispErrors[3].innerHTML));
}
// HANDLE ERROR (HELPER)
function handleError(isGood) {
    document.getElementById("submit-btn").disabled = !isGood;
    return isGood;
}
// IS INPUT LENGTH (HELPER)
function isLength(inputText, length = 0) {
    return inputText.length == length;
}
