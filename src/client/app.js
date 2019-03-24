import getTemplate from './Layout';

let root = document.querySelector("#root");
let empFrame = document.querySelector("#empData");
let depFrame = document.querySelector("#depData");
let postFrame = document.querySelector("#postData");
let assignFrame = document.querySelector("#assignData");
let addEmpForm = getTemplate("addEmpForm");
let addDepForm = getTemplate("addDepForm");
let assignForm = getTemplate("assignForm");
let empData, depData, assignData;

function main() {
    let content = this.contentWindow.document.querySelector("pre");
    let dbSource = (content == null) ? "[]" : content.textContent;
    dbSource = JSON.parse(dbSource);
    console.log(dbSource);
    if (this.id.indexOf("emp") != -1) {
        initEmp(dbSource);
    } else if (this.id.indexOf("dep") != -1) {
        initDep(dbSource);
    } else {
        initAssign(dbSource);
    }
}

function formSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let postData = {},
        this_form_fields,
        form_id = this.getAttribute("id");
    console.log(form_id);
    console.log(this);

    function formatParams(params) {
        return "?" + Object.keys(params).map(function (key) {
            return key + "=" + params[key];
        }).join("&");
    }
    
    let _gntrd_id = 0;
    if (form_id.indexOf("Emp") != -1 || form_id.indexOf("Dep") != -1) {
        if (form_id.indexOf("Emp") != -1) {
            _gntrd_id = Number(empData[empData.length - 1].id);
        } else {
            _gntrd_id = Number(depData[depData.length - 1].id);
        }
        _gntrd_id+=1;
    }
    this_form_fields = this.querySelectorAll('input[name],select');
    this_form_fields.forEach(function (field) {
        postData[field.name] = field.value;
        if (field.name == "id") {
            postData[field.name] = _gntrd_id;
        }
    });

    postFrame.src = "/update" + formatParams(postData);
    postFrame.onload = function () {
        let content = this.contentWindow.document.querySelector("body");
        let data = (content != null) ? "[]" : content.innerHTML;
        console.log(data);
        empFrame.contentWindow.location.reload();
        depFrame.contentWindow.location.reload();
        assignFrame.contentWindow.location.reload();
    };
}

empFrame.onload = main;
depFrame.onload = main;
assignFrame.onload = main;
addEmpForm.onsubmit = formSubmit;
addDepForm.onsubmit = formSubmit;
assignForm.onsubmit = formSubmit;

function initEmp(dbs) {
    empData = dbs;
    root.querySelectorAll("div.container")[0].append(addEmpForm);
    dbs.forEach(emp => {
        let {
            id
        } = emp;
        Object.keys(emp).map(key => {
            let value = emp[key];
            let input = addEmpForm.querySelector("input[name=" + key + "]");
            if (key != "id") {
                input.value = value;
                // input.setAttribute("value", value);
            }
        });
    });

}

function initDep(dbs) {
    depData = dbs;
    root.querySelectorAll("div.container")[1].append(addDepForm);
    dbs.forEach(dep => {
        let {
            id
        } = dep;
        Object.keys(dep).map(key => {
            let value = dep[key];
            let input = addDepForm.querySelector("input[name=" + key + "]");
            if (key != "id") {
                input.value = value;
                // input.setAttribute("value", value);
            }
        });
    });
}

function initAssign(dbs) {
    assignData = dbs;
    root.querySelectorAll("div.container")[2].append(assignForm);

    function createOptionData(dbs) {
        let data = [];
        dbs.forEach(db => {
            if (Object.keys(db).length > 2) {
                let {
                    id,
                    ename,
                    fname
                } = db;
                data.push({
                    value: id,
                    text: ename + ", " + fname
                });
            } else {
                let {
                    id,
                    dname
                } = db;
                data.push({
                    value: id,
                    text: dname
                });
            }
        });
        return data;
    }

    let enameData = createOptionData(empData);
    let dnameData = createOptionData(depData);
    let enameSelect = assignForm.querySelector("[name=ename]");
    let dnameSelect = assignForm.querySelector("[name=dname]");

    function createOption(optionData, select) {

        optionData.forEach((source) => {
            let {
                value,
                text
            } = source;
            let opt = document.createElement('option');
            opt.value = value;
            opt.textContent = text;
            select.append(opt);
        });
    }

    function resetOptions(select){
        select.innerHTML = "";
    }
    
    resetOptions(enameSelect);
    resetOptions(dnameSelect);
    createOption(enameData, enameSelect);
    createOption(dnameData, dnameSelect);
}