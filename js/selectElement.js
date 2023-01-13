const creationInfo = document.getElementById("creationInfo");
const modifiedInfo = document.getElementById("modifiedInfo");
const extensioinInfo = document.getElementById("extensioinInfo");
const sizeInfo = document.getElementById("sizeInfo");
const pathInfo = document.getElementById("pathInfo");
const pathSecondFolderTitle = document.querySelector("#pathSecondFolderTitle");
const filesListSecondChild = document.querySelector("#filesListSecondChild");
const sizeListSecondChild = document.querySelector("#sizeListSecondChild");
const modificationListSecondChild = document.querySelector("#modificationListSecondChild");
const arrowLeft = document.querySelector("#arrowLeft");
let dataPath = "";


folderFilesContainer.addEventListener("dblclick", selectElementChildren);
filesPath.addEventListener("click", selectElementChildren);
arrowLeft.addEventListener("click", goBackDirectory);

function selectElementChildren(event) {
    let parentNode = event.target.parentNode;
    let currentNode = event.target;
    let secondChild = event.target.lastChild;
    let nextChild = event.target.nextElementSibling;
  
    if (parentNode.classList.contains("first-list")) {
        let firstList = parentNode;
        firstList.style.backgroundColor = "yellow";
        printFolderTitleName(parentNode);
        dataPath = parentNode.getAttribute('data-path');
    } else if (currentNode.classList.contains("first-list")) {
        let firstList = currentNode;
        firstList.style.backgroundColor = "yellow";
        printFolderTitleName(currentNode);
        dataPath = currentNode.getAttribute('data-path');
    }

    if (parentNode.classList.contains("text-list")){
        textValue = parentNode;
        padre = textValue.parentNode;
    } else if (currentNode.classList.contains("text-list")){
        textValue = currentNode;
        padre = textValue.parentNode;
    } else if (secondChild.classList.contains("text-list")){
        textValue = secondChild;
        padre = textValue.parentNode;
    } else if (nextChild.classList.contains("text-list")){
        textValue = nextChild;
        padre = textValue.parentNode;
    }

    printFilesSecondChild();
}


function printFolderTitleName(selectedElement) {
    getInfoFiles();
    if (selectedElement.getAttribute('type') == "folder") {
        pathSecondFolderTitle.textContent = "files/" + dataPath;
    }
}

function printFilesSecondChild() {
    let dataPathWithoutSlash = dataPath.substring(0, dataPath.length - 1);
    filesListSecondChild.innerHTML = "";
    fetch("modules/printFilesSecondChild.php" + "?" + "dataPathSecond=" + dataPathWithoutSlash, {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            data.forEach(element =>
                filesListSecondChild.innerHTML += element);
        })
        .catch((err) => console.log("Request failed: ", err));
}

function getInfoFiles() {
    let dataPathWithoutSlash = dataPath.substring(0, dataPath.length - 1);
    fetch("modules/fileInfo.php" + "?" + "path=" + dataPathWithoutSlash, {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            renderFileInfo(data);
        })
        .catch((err) => console.log("Request failed: ", err));
}

function renderFileInfo(data) {
    sizeListSecondChild.innerHTML = "";
    modificationListSecondChild.innerHTML = "";
    if (data["size"] > 1000) {
        sizeInfo.innerHTML = "Size: " + Math.round(data["size"] / 1024) + "Mb";
    } else {
        sizeInfo.innerHTML = "Size: " + data["size"] + "Kb";
    }
    creationInfo.innerHTML = "Creation date: " + data["creationDate"];
    modifiedInfo.innerHTML = "Last modificaton: " + data["modificationDate"];
    pathInfo.innerHTML = "Path: " + "files/" + dataPath;
    extensioinInfo.innerHTML = "Extension: " + data["extension"];
    console.log(data);
    let dataLength = Object.keys(data).length;
    for (let i = 0; i < dataLength; i++) {
        if ("size" + `${i}` in data) {
            let sizeVariable = "size" + i;
            let modificationVariable = "modificationDate" + i;
            let foundSize = data[sizeVariable];
            let foundModificationDate = data[modificationVariable];
            sizeListSecondChild.innerHTML += "<li>" + foundSize + "</li>";
            modificationListSecondChild.innerHTML += "<li>" + foundModificationDate + "</li>";
        }
    }
    /* fileContent.innerHTML = "Content: " + data["content"]; */
}

function goBackDirectory() {
    dataPath = dataPath.split("/");
    dataPath.pop();
    dataPath.pop();
    dataPath = dataPath.join("/");
    dataPath = dataPath + "/";
    if (dataPath == "/") {
        dataPath = "";
    } else {
        printFilesSecondChild();
    }
    pathSecondFolderTitle.textContent = "files/" + dataPath;
}