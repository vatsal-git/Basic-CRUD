let empForm = document.empForm;
let editAt = -1;
const dispErrors = document.querySelectorAll(".error");
//ON RELOAD
window.onload = (event) => {
    isStorageEmpty() ? "" : updateTable();
    event.preventDefault();
};
//ON SUBMIT
function onFormSubmit(event) {
    event.preventDefault();
    if (validate()) {
        if (isStorageEmpty()) {
            setLocalStorage([getEmployee()]);
        } else if (editAt != -1) {
            let tmp = getLocalStorage();
            tmp[editAt] = getEmployee();
            setLocalStorage(tmp);
            editAt = -1;
        } else {
            setLocalStorage([...getLocalStorage(), getEmployee()]);
        }
        updateTable();
    }

}
//UPDATE TABLE
function updateTable() {
    !document.querySelector("table") ? "" : removeEle("table");

    createEle("table", "#show-data", "table");
    const arrOfData = getLocalStorage();
    createEle("h3", ".table", "header", "Display")

    const dataKeys = Object.keys(arrOfData[0]);
    dataKeys.push("ACTION");

    // //BASIC FORM
    // //TH
    // createEle("tr", "table", "tr" + -1);
    // dataKeys.forEach((dataKey) => {
    //     createEle("th", ".tr" + -1, "th", dataKey.toUpperCase());
    // });

    // arrOfData.forEach((data, index) => {
    //     //TD
    //     createEle("tr", "table", "tr" + index);
    //     const dataValues = Object.values(data);
    //     dataValues.forEach((dataValue) => {
    //         createEle("td", ".tr" + index, "td", dataValue);
    //     });
    //     //BTN
    //     createEle("td", ".tr" + index, "td" + index);
    //     setEditBtn(index, dataValues);
    //     setDeleteBtn(index);
    // });

    //ADVANCE FORM
    dataKeys.forEach((dataKey, i) => {
        createEle("tr", "table", "tr" + i);
        arrOfData.forEach((data, j) => {
            //TH
            if (j == 0) {
                createEle("th", ".tr" + i, "th", dataKeys[i].toUpperCase());
            }
            //TD
            if (i != dataKeys.length - 1) {
                createEle("td", ".tr" + i, "td", Object.values(arrOfData[j])[i]);
            } else {
                createEle("td", ".tr" + i, "td" + j);
                setEditBtn(j, Object.values(arrOfData[j]));
                setDeleteBtn(j);
            }
        });
    });

    empForm.reset();
}
//MAKE EDIT BTN
function setEditBtn(editIndex, dataValues) {
    createEle("button", ".td" + editIndex, "editBtn" + editIndex, "Edit");
    document.querySelector(".editBtn" + editIndex).addEventListener("click", () => {
        editAt = editIndex;
        setForm(dataValues);
    });
}
//MAKE DELETE BTN
function setDeleteBtn(deleteIndex) {
    createEle("button", ".td" + deleteIndex, "deleteBtn" + deleteIndex, "Delete");
    document.querySelector(".deleteBtn" + deleteIndex).addEventListener("click", () => {
        let tmp = getLocalStorage();
        tmp.splice(deleteIndex, 1);
        setLocalStorage(tmp);
        isStorageEmpty() ? removeEle('table') : updateTable();
    });
}
//CREATE ELEMENT (HELPER)
function createEle(element, parent, eleClass, innerHTML = "") {
    element = document.createElement(element);
    document.querySelector(parent).appendChild(element);
    element.classList.add(eleClass);
    element.id = getUUID();
    element.innerHTML = innerHTML;
}
//REMOVE ELEMENT (HELPER)
function removeEle(element) {
    document.querySelector(element).remove();
}
//GET EMPLOYEE OBJECT 
function getEmployee() {
    const Employee = {
        fname: empForm.fname.value,
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
    document.querySelectorAll('.hobbies').forEach((hobby) => {
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
    let validateRes = [validateName(empForm.fname.value), validateDOB(empForm.dob.value), validateEmail(empForm.email.value), validatePhone(empForm.phone.value)];
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.addEventListener("blur", (ele) => {
            switch (ele.target.name) {
                case "fname": validateRes[0] = validateName(ele.target.value);
                    break;
                case "dob": validateRes[1] = validateDOB(ele.target.value);
                    break;
                case "email": validateRes[2] = validateEmail(ele.target.value);
                    break;
                case "phone": validateRes[3] = validatePhone(ele.target.value);
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
        dispErrors[0].innerHTML = "*Required";
    } else if (inputText.length > 20 || inputText.length < 4) {
        dispErrors[0].innerHTML = "*Name length should be 4 to 20 characters";
    } else {
        dispErrors[0].innerHTML = "";
    }
    return handleError(isLength(dispErrors[0].innerHTML));
}
// DOB VALIDATION
function validateDOB(inputText) {
    const dateformat = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/;
    if (isLength(inputText)) {
        console.log('here');
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