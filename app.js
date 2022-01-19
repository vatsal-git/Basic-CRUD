let empFormData = document.empForm;
let editId, editAt;
const dispErrors = document.querySelectorAll('.error');
let uuid = [];

//ON RELOAD
window.onload = (event) => {
    event.preventDefault();
    if (!isEmpData()) {
        updateTable();
    }
};
//ON SUBMIT
function onFormSubmit(event) {
    event.preventDefault();
    if (validate()) {
        if (isEmpData()) {
            setLocalStorage([getEmpForm()]);
            updateTable();
        } else if (editId !== undefined) {
            console.log(editId);
            let tmp = getLocalStorage();
            tmp.forEach((data, i) => {
                if (data.id == uuid) {
                    editAt = i;
                }
            });
            tmp[editAt] = getEmpForm();
            tmp[editAt].id = editId;
            setLocalStorage(tmp);

            let allData = getLocalStorage();
            //BASIC TABLE EDIT
            let basicEditRow = document.getElementById('tableRow' + editId);
            Object.keys(allData[editAt]).forEach((key, i) => {
                if (key != 'id') {
                    basicEditRow.childNodes[i - 1].textContent =
                        allData[editAt][`${key}`];
                }
            });
            //ADVANCE TABLE EDIT
            const dataKeys = Object.keys(allData[0]);
            dataKeys.forEach((key, i) => {
                if (key != 'id') {
                    document.getElementById('advanceTable').childNodes[
                        i
                    ].childNodes[editAt + 1].textContent =
                        allData[editAt][`${key}`];
                }
            });

            editId = undefined;
            empForm.reset();
        } else {
            setLocalStorage([...getLocalStorage(), getEmpForm()]);
            updateTable();
        }
    }
}
//UPDATE TABLE
function updateTable() {
    const arrOfData = getLocalStorage();
    arrOfData.forEach((data, index) => {
        uuid[index] = data.id;
    });
    const dataKeys = Object.keys(arrOfData[0]);
    dataKeys.push('ACTION');

    if (!document.getElementById('display-section')) {
        const displaySection = createEle('section', document.body, {
            id: 'display-section',
        });
        updateBasicTable(displaySection, 'first');
        updateAdvanceTable(displaySection, 'first');
    } else {
        updateBasicTable(document.getElementById('display-section'), '');
        updateAdvanceTable(document.getElementById('display-section'), '');
    }
    empForm.reset();
}

//BASIC TABLE
function updateBasicTable(displaySection, time) {
    const arrOfData = getLocalStorage();
    const dataKeys = Object.keys(arrOfData[0]);
    dataKeys.push('ACTION');
    if (time == 'first') {
        const basicTable = createEle('table', displaySection, {
            className: 'dispTable',
            id: 'basicTable',
        });
        createEle('h3', basicTable, {
            className: 'header',
            textContent: 'Basic table',
        });

        //TH
        const headRow = createEle('tr', basicTable, {});
        dataKeys.forEach((dataKey, i) => {
            if (i > 0)
                createEle('th', headRow, {
                    className: 'dispTableHead',
                    textContent: dataKey.toUpperCase(),
                });
        });

        arrOfData.forEach((data, index) => {
            const dataValues = Object.values(data);
            //TD
            const dataRow = createEle('tr', basicTable, {
                id: 'tableRow' + data.id,
            });
            dataValues.forEach((dataValue, i) => {
                if (i > 0)
                    createEle('td', dataRow, {
                        className: 'dispTableData',
                        textContent: dataValue,
                    });
            });
            //BTN
            const btnCell = createEle('td', dataRow, {
                className: 'dispTableData',
            });
            createEle('button', btnCell, {
                className: 'editBtn btn',
                textContent: 'Edit',
                onclick: () => {
                    editFromEmp(uuid[index]);
                },
            });
            createEle('button', btnCell, {
                className: 'deleteBtn btn',
                textContent: 'Delete',
                onclick: () => {
                    deleteFromEmpStorage(uuid[index], displaySection);
                },
            });
        });
    } else {
        const index = arrOfData.length - 1;
        const dataValues = Object.values(arrOfData[index]);
        let id = dataValues.splice(0, 1);
        //TD
        const dataRow = createEle('tr', basicTable, {
            id: 'tableRow' + arrOfData[index].id,
        });
        dataValues.forEach((dataValue) => {
            createEle('td', dataRow, {
                className: 'dispTableData',
                textContent: dataValue,
            });
        });
        //BTN
        const btnCell = createEle('td', dataRow, {
            className: 'dispTableData',
        });
        createEle('button', btnCell, {
            className: 'editBtn btn',
            textContent: 'Edit',
            onclick: () => {
                editFromEmp(uuid[index]);
            },
        });
        createEle('button', btnCell, {
            className: 'deleteBtn btn',
            textContent: 'Delete',
            onclick: () => {
                deleteFromEmpStorage(uuid[index], displaySection);
            },
        });
    }
}

//ADVANCE TABLE
function updateAdvanceTable(displaySection, time) {
    const arrOfData = getLocalStorage();
    const dataKeys = Object.keys(arrOfData[0]);
    dataKeys.push('ACTION');
    const allTd = new Array(arrOfData.length);
    for (let i = 0; i < allTd.length; i++) {
        allTd[i] = new Array(dataKeys.length);
    }
    if (time == 'first') {
        const advanceTable = createEle('table', displaySection, {
            className: 'dispTable',
            id: 'advanceTable',
        });
        createEle('h3', advanceTable, {
            className: 'header',
            textContent: 'Advance table',
        });

        dataKeys.forEach((dataKey, rowNum) => {
            const tableRow = createEle('tr', advanceTable, {
                id: 'advRow' + rowNum,
            });
            arrOfData.forEach((data, columNum) => {
                //TH
                if (columNum == 0) {
                    createEle('th', tableRow, {
                        className: 'dispTableHead',
                        textContent: dataKey.toUpperCase(),
                    });
                }
                //TD
                if (rowNum != dataKeys.length - 1) {
                    allTd[columNum][rowNum] = createEle('td', tableRow, {
                        className: 'dispTableData tableData' + data.id,
                        id: 'tableData',
                        textContent: Object.values(arrOfData[columNum])[rowNum],
                    });
                } else {
                    //BTN
                    const btnCell = createEle('td', tableRow, {
                        className: 'dispTableData',
                    });
                    allTd[columNum][rowNum] = btnCell;
                    createEle('button', btnCell, {
                        className: 'btn editBtn' + data.id,
                        textContent: 'Edit',
                        onclick: () => {
                            editFromEmp(uuid[columNum]);
                        },
                    });
                    createEle('button', btnCell, {
                        className: 'btn deleteBtn' + data.id,
                        textContent: 'Delete',
                        onclick: () => {
                            deleteFromEmpStorage(
                                uuid[columNum],
                                displaySection,
                                allTd
                            );
                        },
                    });
                }
            });
            if (rowNum == 0) tableRow.remove();
        });
    } else {
        dataKeys.forEach((dataKey, rowNum) => {
            columNum = arrOfData.length - 1;
            if (rowNum == 0) {
            }
            //TD
            else if (rowNum != dataKeys.length - 1) {
                allTd[columNum][rowNum] = createEle(
                    'td',
                    document.getElementById('advRow' + rowNum),
                    {
                        className:
                            'dispTableData tableData' + arrOfData[columNum].id,
                        textContent: Object.values(arrOfData[columNum])[rowNum],
                    }
                );
            } else {
                //BTN
                const btnCell = createEle(
                    'td',
                    document.getElementById('advRow' + rowNum),
                    {
                        className:
                            'dispTableData tableData' + arrOfData[columNum].id,
                    }
                );
                allTd[columNum][rowNum] = btnCell;
                createEle('button', btnCell, {
                    className: 'btn editBtn' + arrOfData[columNum].id,
                    textContent: 'Edit',
                    onclick: () => {
                        editFromEmp(uuid[arrOfData.length - 1]);
                    },
                });
                createEle('button', btnCell, {
                    className: 'btn deleteBtn' + arrOfData[columNum].id,
                    textContent: 'Delete',
                    onclick: () => {
                        deleteFromEmpStorage(
                            uuid[arrOfData.length - 1],
                            displaySection,
                            allTd
                        );
                    },
                });
            }
        });
    }
}

//CREATE ELEMENT (HELPER)
function createEle(eleType, parent, properties) {
    const ele = document.createElement(eleType);
    parent.appendChild(ele);
    Object.keys(properties).forEach((key) => {
        ele[key] = properties[key];
    });
    return ele;
}

//EDIT
function editFromEmp(uuid) {
    editId = uuid;
    allData = getLocalStorage();
    allData.forEach((data, i) => {
        if (data.id == uuid) {
            editAt = i;
            setForm(data);
        }
    });
}

//DELETE
function deleteFromEmpStorage(uuid, displaySection, allTd) {
    let columNum;
    //FROM STORAGE
    let allData = getLocalStorage();
    allData.forEach((data, i) => {
        if (data.id == uuid) {
            columNum = i;
            allData.splice(i, 1);
            setLocalStorage(allData);
        }
    });

    if (isEmpData()) {
        displaySection.remove();
    } else {
        //FROM BASIC TABLE
        document.getElementById('tableRow' + uuid).remove();

        // FROM ADVANCE TABLE
        for (let i = 1; i < allTd[columNum].length; ++i) {
            allTd[columNum][i].remove();
        }
    }
}

//GET EMPLOYEE OBJECT
function getEmpForm() {
    const Employee = {
        id: getUUID(),
        fname: empForm.name.value,
        gender: empForm.gender.value,
        dob: empForm.dob.value,
        email: empForm.email.value,
        phone: empForm.phone.value ? empForm.phone.value : '',
        hobbies: getHobbies(),
    };
    return Employee;
}
//SET FORM
function setForm(dataValues) {
    empForm.name.focus();
    empForm.name.value = dataValues.fname;
    empForm.gender.value = dataValues.gender;
    empForm.dob.value = dataValues.dob;
    empForm.email.value = dataValues.email;
    empForm.phone.value = dataValues.phone;
    let hobbyEles = document.getElementsByClassName('hobby');
    [...hobbyEles].forEach((hobby) => {
        if (dataValues.hobbies.includes(hobby.value)) {
            hobby.checked = true;
        } else {
            hobby.checked = false;
        }
    });
}
//IS LOCAL STORAGE EMPTY (HELPER)
function isEmpData() {
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
    return JSON.parse(localStorage.getItem('Employee'));
}
//SET LOCAL STORAGE (HELPER)
function setLocalStorage(item) {
    localStorage.setItem('Employee', JSON.stringify(item));
}
// RETURN HOBBIES (HELPER)
function getHobbies() {
    let hobbies = new Array();
    document.querySelectorAll('.hobby:checked').forEach((checkedHobby) => {
        hobbies.push(checkedHobby.value);
    });
    return hobbies;
}
//UUID (HELPER)
function getUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
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
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('input', (ele) => {
            switch (ele.target.name) {
                case 'name':
                    validateRes[0] = validateName(ele.target.value);
                    break;
                case 'dob':
                    validateRes[1] = validateDOB(ele.target.value);
                    break;
                case 'email':
                    validateRes[2] = validateEmail(ele.target.value);
                    break;
                case 'phone':
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
        dispErrors[0].innerHTML = '*Required';
    } else if (inputText.length > 20 || inputText.length < 4) {
        dispErrors[0].innerHTML = '*Name length should be 4 to 20 characters';
    } else {
        dispErrors[0].innerHTML = '';
    }
    return handleError(isLength(dispErrors[0].innerHTML));
}
// DOB VALIDATION
function validateDOB(inputText) {
    const dateformat =
        /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/;
    if (isLength(inputText)) {
        dispErrors[1].innerHTML = '*Required';
    } else if (!inputText.match(dateformat)) {
        dispErrors[1].innerHTML = '*Invalid date (MM/DD/YY)';
    } else {
        dispErrors[1].innerHTML = '';
    }
    return handleError(isLength(dispErrors[1].innerHTML));
}
// EMAIL VALIDATION
function validateEmail(inputText) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (isLength(inputText)) {
        dispErrors[2].innerHTML = '*Required';
    } else if (!inputText.match(mailFormat)) {
        dispErrors[2].innerHTML = '*Invalid Email (eg. work@email.com)';
    } else {
        dispErrors[2].innerHTML = '';
    }
    return handleError(isLength(dispErrors[2].innerHTML));
}
// PHONE VALIDATION
function validatePhone(inputText) {
    if (!isLength(inputText)) {
        if (/^\d+$/.test(inputText)) {
            if (isLength(inputText, 10)) {
                dispErrors[3].innerHTML = '';
            }
        } else {
            dispErrors[3].innerHTML = '*Invalid phone number';
        }
    } else {
        dispErrors[3].innerHTML = '';
    }
    return handleError(isLength(dispErrors[3].innerHTML));
}
// HANDLE ERROR (HELPER)
function handleError(isGood) {
    document.getElementById('submitBtn').disabled = !isGood;
    return isGood;
}
// IS INPUT LENGTH (HELPER)
function isLength(inputText, length = 0) {
    return inputText.length == length;
}
