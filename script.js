const foldersContainer = document.getElementById("folders-container");
const renderingFolderDiv = document.getElementById("rendering-folder-div");

const addFolderBtn = document.getElementById("add-folder-btn");
const closeAddFolder = document.getElementById("close-add-folder");
let foldersNameInput = document.getElementById("folders-name");
//let usersFolderName = document.getElementById("users-folder-name")
const createFolderBtn = document.getElementById("create-folder-btn");
const folderDisplayDiv = document.getElementById("folder-display-div");

//Only-Tasks Elenemte:
const addTaskOnlyBtn = document.getElementById("add-task-only-btn");
const onlyTaskContainer = document.getElementById("only-task-container");
const inputOnlyTaskName = document.getElementById("input-only-task-name");
const pushOnlyTaskBtn = document.getElementById("push-only-task-btn");
const onlyTaskList = document.getElementById("only-task-list");
const onlyTaskCompletedList = document.getElementById("only-task-completed-list");
const onlyTaskWorkDiv = document.getElementById("only-task-work-div");
const onlyTaskStataDiv = document.getElementById("only-task-stata-div");

//Removing white spaces from string for taskId:
/*let text = "Wash the dishes"
let output = text.replace(/\s/g, "").slice(0,6) */

let targetTaskObjekt = ""

/*Blue Working container */

const workingFoldersContainer = document.getElementById("working-folders-container");
let renderedFolder = document.getElementById("rendered-folder");

/* Saving data */

let myFolders = [];
let myOnlyTaskList = [];
//let targetFolder = ""
let newTaskInput = ""
let newTask = {}
let targetTaskBadge = ""

//STATISTIK

 //Only-Task:
 let onOnlyTaskAmount = 0;
 let completedOnlyTaskAmount = 0;
 let urgentOnlyTaskAmount = 0;
 //With folders:
let folderOnTasks = ""; //???
let folderCompletedTasks = ""; ///??

let onTaskAmount = ""
let completedTaskAmount = ""

//Functions:





function createBadges(e, parent){
    const taskId = e.target.dataset.id;
    const currentTask = myOnlyTaskList.filter(item=>{
        return item.id === taskId
    })[0];
    
    //create badge set on the target task:
    const badgeDiv = document.createElement("div");
    badgeDiv.dataset.id = taskId;
    badgeDiv.classList.add("badge-div-only-task");

    //append badge div:
                  
    //document.querySelector(`.li-btn-div[data-id=${taskId}]`).appendChild(badgeDiv);
    parent.appendChild(badgeDiv);
                  
    //create badges for div:
    //Urgent:
    const badgeUrgent = document.createElement("button");
    badgeUrgent.dataset.id = taskId;
    badgeUrgent.dataset.role = "badge-menu-btn";
    badgeUrgent.classList.add("badge-urgent");
    badgeUrgent.textContent = "Urgent";
    //Optional:
    const badgeOptional = document.createElement("button");
    badgeOptional.dataset.id = taskId;
    badgeOptional.dataset.role = "badge-menu-btn";
    badgeOptional.classList.add("badge-optional");
    badgeOptional.textContent = "Optional";
    //Datum:
    const badgeDatum = document.createElement("button");
    badgeDatum.dataset.id = taskId;
    badgeDatum.dataset.role = "badge-menu-btn";
    badgeDatum.classList.add("badge-datum");
    badgeDatum.textContent = "Datum";

    const closeBadgeDivBtn = document.createElement("button");
    closeBadgeDivBtn.dataset.id = taskId;
    closeBadgeDivBtn.dataset.role= "close-badge-div";
    closeBadgeDivBtn.classList.add("close-btn-x");
    closeBadgeDivBtn.textContent = "+";
                 
    badgeDiv.appendChild(closeBadgeDivBtn);
    badgeDiv.appendChild(badgeUrgent);
    badgeDiv.appendChild(badgeOptional);
    badgeDiv.appendChild(badgeDatum);
    
    //check if badges were already chosen:
    if(currentTask.badges.length >= 1){
        currentTask.badges.forEach(item=>{
            const currentBadge = item.toLowerCase();
            document.querySelector(`.badge-${currentBadge}[data-role="badge-menu-btn"]`).disabled = true;
        })
    };
    
                 
    };
//Funktion unter noch zu bearbeiten, 12.11.25


function countOnTask(e){
    //For only-task:
    if(!e.target.dataset.folder){
        
            onOnlyTaskAmount = myOnlyTaskList.filter(item=>{
                return item.isOn === true
            }).length
            document.querySelector(".only-task-stata-on").textContent = "Auf der Liste: " + onOnlyTaskAmount;
        }
        
    //for folders:
    else{
    const targetFolderId = e.target.dataset.folder;
    const targetFolder = myFolders.find(item =>{
    return item.id === targetFolderId
    });
    
    onTaskAmount = targetFolder.tasks.filter(task =>{
                return(task.isOn === true)
            }).length;

    document.querySelector(`.folder-on-stata[data-id=${targetFolderId}]`).innerHTML = `
            To do: ${onTaskAmount} tasks
    `
    };
    
}

function countCompletedTask(e) {
    if(!e.target.dataset.folder){
        const taskId = e.target.dataset.id;
        completedOnlyTaskAmount = myOnlyTaskList.filter(item=>{
            return item.isCompleted
        }).length;
        document.querySelector(".only-task-stata-done").innerHTML = `
        Erledigt! &#127882;: ${completedOnlyTaskAmount}`;
        console.log(completedOnlyTaskAmount)
    } else{
    const targetFolderId = e.target.dataset.folder;
    const targetFolder = myFolders.find(item =>{
        return item.id === targetFolderId
    });
    completedTaskAmount = targetFolder.tasks.filter(task =>{
                return task.isCompleted === true
            }).length;
    document.querySelector(`.completed-statistik[data-id=${targetFolder.id}]`).innerHTML = `
                Completed: ${completedTaskAmount}
            `;
    document.querySelector(`.folder-completed-stata[data-id=${targetFolderId}]`).innerHTML = `
            Completed: ${completedTaskAmount} tasks
    `
    }
    
};

function countUrgentTask(e){
    if(!e.target.dataset.folder){
        //checking array for urgent task:
        
        urgentOnlyTaskAmount = myOnlyTaskList.filter(item=>{
            return item.isUrgent === true
        }).length;
        
        //updating DOM:
        document.querySelector(".only-task-stata-urgent").textContent = 
            `Drinnend zu erledigen: ${urgentOnlyTaskAmount}`;
    } else {
    const targetFolderId = e.target.dataset.folder;
    const targetTaskId = e.target.dataset.id;
    const targetFolder = myFolders.find(item=>{
        return item.id === targetFolderId
    });
    let urgentTaskAmount = 0;
    urgentTaskAmount = myFolders.filter(item=>{
        return item.isUrgent === true
    }).length;
    document.querySelector(`.folder-urgent-stata[data-id=${targetFolderId}]`).innerHTML = `
            Urgent: ${urgentTaskAmount} tasks
    `;
    }
};

//handling Badges  function:
function addBadge(e){
    if(!e.target.dataset.folder){
        const taskId = e.target.dataset.id;         
        const currentTask = myOnlyTaskList.find(item =>{
            return item.id === taskId;
        });
        let badgeName = e.target.textContent.trim();
        
        //Updating array:
        currentTask.badges.push(badgeName);
        if(badgeName === "Urgent"){
            currentTask.isUrgent = true;
            urgentOnlyTaskAmount += 1;
            /*
            document.querySelector(`.only-task-stata-urgent`).textContent = `Drinnend zu erledigen: ${urgentOnlyTaskAmount}`*/
            countUrgentTask(e);
        };

        //container for a badge:
        const badgeContainer = document.createElement("div");
        badgeContainer.dataset.id = taskId;
        badgeContainer.dataset.content = badgeName;
        badgeContainer.classList.add("badge-container");

        //badge-span - name of the badge:
        const badgeSpan = document.createElement("span");
        badgeSpan.dataset.id = taskId;
        badgeSpan.dataset.content = badgeName;
        badgeSpan.textContent = badgeName;
        badgeSpan.classList.add(`badge-${badgeName.toLowerCase()}`);
        badgeSpan.classList.add("chosen-badge-span");
                
        //close badge btn:
        const badgeCloseBtn = document.createElement("button");
        badgeCloseBtn.dataset.id = taskId;
        badgeCloseBtn.dataset.role ="close-badge";
        badgeCloseBtn.dataset.content = badgeName;
        badgeCloseBtn.textContent = "+";
        badgeCloseBtn.classList.add("close-btn-x");
        badgeCloseBtn.classList.add("chosen-badge-span");

        document.querySelector(`.chosen-badges-div-only-task[data-id=${taskId}]`).appendChild(badgeContainer);
        badgeContainer.appendChild(badgeSpan);
        badgeContainer.appendChild(badgeCloseBtn);

        //diasble choosing the same badge:
        const badgeFromMenu = document.querySelector(`.badge-${badgeName.toLowerCase()}[data-role="badge-menu-btn"]`).disabled = true;
        
        //close badge menu when choosing a badge: 

        document.querySelector(`.badge-div-only-task[data-id=${taskId}]`).remove();

    } else {
    const folderId = e.target.dataset.folder;   
    const taskId   = e.target.dataset.id;
    let chosenBadgeContainer = document.querySelector(`.chosen-badge-container[data-id=${taskId}]`);
    let urgentTaskAmount = 0;
    // richtigen Folder aus myFolders finden
    const currentFolder = myFolders.find(f => f.id === folderId);
    // richtigen Task in diesem Folder finden
    const currentTask = currentFolder.tasks.find(t => t.id === taskId);
    const newBadge = e.target.textContent.trim();

    if (!currentTask.badge.includes(newBadge)) {
                    currentTask.badge.push(newBadge);
                    if (newBadge === "Urgent"){
                        currentTask.isUrgent = true
                        urgentTaskAmount = currentFolder.tasks.filter(item=>{
                            return item.isUrgent === true
                        }).length
                        
                        //Testen: 
                        document.querySelector(`.folder-urgent-stata[data-id=${folderId}]`).innerHTML = 
                        `Urgent task: ${urgentTaskAmount}  `

                    }
                };

    const spanBadge = document.createElement("span");
    spanBadge.dataset.id = taskId;
    spanBadge.classList.add("spanBadge");
    spanBadge.textContent = newBadge;

    chosenBadgeContainer.appendChild(spanBadge);
    let classPart = newBadge.toLowerCase().trim();
    document.querySelector(`.badge-${classPart}[data-id=${taskId}]`).disabled = true;
    spanBadge.classList.add("spanBadge", `badge-${classPart}`);

    //remove badge Option:
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-badge-btn");
    removeBtn.type = "button";
    removeBtn.dataset.id= newBadge;
    removeBtn.textContent = "*";

    spanBadge.appendChild(removeBtn);

    removeBtn.addEventListener("click", function(e){
        if(newBadge === "Urgent"){
            currentTask.isUrgent = false
            console.log(currentTask)
        }
        currentTask.badge = currentTask.badge.filter(item =>{
            return item !== newBadge
        })
        
        e.target.parentNode.remove()
        document.querySelector(`.badge-${classPart}[data-id=${taskId}]`).disabled = false;
    })
    /*
    // Badge im DOM anzeigen
                document.querySelector(`.chosen-badge-container[data-id=${taskId}]`).innerHTML +=
                    `<span data-id=${taskId}>${newBadge}</span>`;

                    
                    let classPart = newBadge.toLowerCase().trim();
                    document.querySelector(`.badge-${classPart}[data-id=${taskId}]`).disabled = true;
     */
      
     };
    }
function badgeDatumAdd(e){
                
    const taskId = e.target.dataset.id;
    const currentTask = myOnlyTaskList.find(item=>{
        return item.id === taskId
    });
    //update array:
    currentTask.badges.push("Datum");
    document.querySelector(`.badge-datum[data-id=${taskId}][data-role="badge-menu-btn"]`).disabled = true;
    
    //create form element for datum-badge:
    const datumForm = document.createElement("form");
    datumForm.classList.add("datum-form");
    datumForm.dataset.id = taskId;

    const datumLabel = document.createElement("label");
    datumLabel.classList.add("datum-label");
    datumLabel.dataset.id = taskId;
    datumLabel.htmlFor = taskId;
    datumLabel.textContent = "Choose date:";

    const datumInput = document.createElement("input");
    datumInput.type = "date";
    datumInput.classList.add("datum-input");
    datumInput.dataset.id = taskId;
                    
    const datumSubmitBtn = document.createElement("input");
    datumSubmitBtn.type = "submit";
    datumSubmitBtn.classList.add("datum-submit-btn");
    datumSubmitBtn.value = "OK";
    datumSubmitBtn.dataset.id = taskId;

    const formDeleteBtn = document.createElement("button");
    formDeleteBtn.dataset.id = taskId;
    formDeleteBtn.dataset.role = "close-form-btn-only-task";
    formDeleteBtn.classList.add("close-btn-x");
    formDeleteBtn.textContent = "+";
    formDeleteBtn.type = "button";
                    
    const usersDatumDivShow = document.createElement("div");
    usersDatumDivShow.classList.add("users-datum-el");
    usersDatumDivShow.dataset.id = taskId;
    usersDatumDivShow.dataset.content = "Datum";
                    
    datumForm.appendChild(datumLabel);
    datumForm.appendChild(datumInput);
    datumForm.appendChild(datumSubmitBtn);
    datumForm.appendChild(formDeleteBtn);

    const parentDivForm = document.querySelector(`.chosen-badges-div-only-task[data-id=${taskId}]`);
    
    parentDivForm.appendChild(datumForm);
    parentDivForm.appendChild(usersDatumDivShow);

    //add users data in form:
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const currentDay = date.getDate()
    const dayToday= `${currentYear}-0${currentMonth}-${currentDay}`
    datumInput.setAttribute("min", `${dayToday}`)

    const removeDatumBtn = document.createElement("button");
    //removeDatumBtn.dataset.id= "Datum".trim(); //?? vielleicht umschreiben
    removeDatumBtn.dataset.id = taskId;
    removeDatumBtn.dataset.role= "close-badge";
    removeDatumBtn.dataset.content = "Datum";
    removeDatumBtn.classList.add("close-btn-x");
    removeDatumBtn.type = "button";
    removeDatumBtn.textContent = "+";
                
    //getting users data:
    let chosenDate = "";
    datumForm.addEventListener("submit", function(e){
    e.preventDefault()

    chosenDate = datumInput.value;
    if(!chosenDate) return;
    const usersDay = new Date(`${chosenDate}`)
    const milisec = usersDay.getTime() - date.getTime()
    const dayTill = Math.ceil(milisec / 86400000)

    const chosenUsersDatumShow = document.createElement("h3");
    chosenUsersDatumShow.classList.add("chosen-user-datum");
    chosenUsersDatumShow.textContent = `Datum: ${chosenDate}`;

    const datumLeftShow = document.createElement("h4");
    datumLeftShow.classList.add("datum-left-show");
    datumLeftShow.textContent = `${dayTill} days left`;

    usersDatumDivShow.appendChild(chosenUsersDatumShow);
    usersDatumDivShow.appendChild(datumLeftShow);
    usersDatumDivShow.appendChild(removeDatumBtn);
                
    datumForm.remove()

                });
                         
    //Close badge menu when choosing a badge:
     document.querySelector(`.badge-div-only-task[data-id=${taskId}]`).remove();  
                 }
                    

/*Events */

//Ordner erstellen oder mit Only-Task List erstellen:
if(addFolderBtn || addTaskOnlyBtn) {
    addFolderBtn.addEventListener("click", function(){
    renderingFolderDiv.classList.remove("hide");

    //hide #add-folder-btn and #add-only-folder-btn:

    document.querySelector("#add-folder-btn").classList.add("hide");
    document.querySelector("#add-task-only-btn").classList.add("hide");
    document.querySelector(".list-example-folder").classList.add("hide"); //entfernt Example folder wenn btn klicked
});
    //Only-Task List initialisieren:
    addTaskOnlyBtn.addEventListener("click", function(){
        document.querySelector(".list-example-folder").classList.add("hide");

        
        //Show Task-Ordner:
        onlyTaskContainer.classList.remove("hide");
        addTaskOnlyBtn.classList.add("hide");
        
        onlyTaskContainer.addEventListener("click", function(e){

            //close container:
            if(e.target.classList.contains("close-btn-x") && e.target.dataset.id === "only-task-container"){
                onlyTaskContainer.classList.add("hide");
                myOnlyTaskList = [];
                document.querySelector(".list-example-folder").classList.remove("hide");
                 addTaskOnlyBtn.classList.remove("hide");
            }
            
            //Add Task in Only-Task-List:
            if(e.target.id === "push-only-task-btn") {
                if(!inputOnlyTaskName.value) return

            //Update only-task array:
            let randomNumber = Math.floor((Math.random() * 10) + 1);
            const newOnlyTask = {
                id: inputOnlyTaskName.value.replace(/\s/g, "").slice(0,6) + (randomNumber * inputOnlyTaskName.value.length),
                name: inputOnlyTaskName.value,
                isOn: true,
                isCompleted: false,
                isUrgent: false,
                badges:[]
            };
            
            myOnlyTaskList.push(newOnlyTask);
            inputOnlyTaskName.value = "";

            //create new HTML-elements:
            const liTask = document.createElement("li");
            liTask.dataset.id = newOnlyTask.id;
            liTask.dataset.role ="li-only-task";
            //liTask.textContent = newOnlyTask.name;

            const liTaskNameH4 = document.createElement("h4");
            liTaskNameH4.textContent = newOnlyTask.name;
            liTaskNameH4.classList.add("li-task-name-h4");
            
            onlyTaskList.appendChild(liTask);
            liTask.appendChild(liTaskNameH4);

            //div for buttons:
            const liBtnDiv = document.createElement("div");
            liBtnDiv.dataset.id = newOnlyTask.id;
            liBtnDiv.classList.add("li-btn-div");

            //div for chosen badges:
            const chosenBadgesDivOnlyTask = document.createElement("div");
            chosenBadgesDivOnlyTask.dataset.id = newOnlyTask.id;
            chosenBadgesDivOnlyTask.classList.add("chosen-badges-div-only-task");

            //Buttons:
            const addTaskBadge = document.createElement("button");
            addTaskBadge.dataset.id = newOnlyTask.id;
            addTaskBadge.textContent = "Badge hinzufügen";
            addTaskBadge.classList.add("li-add-badge-btn");

            const completedTaskBtn = document.createElement("button");
            completedTaskBtn.dataset.id = newOnlyTask.id;
            completedTaskBtn.dataset.role = "completedOnlyTask"
            completedTaskBtn.innerHTML = `&#10003;`;
            completedTaskBtn.classList.add("li-completed-btn");

            const delTaskBtn = document.createElement("button");
            delTaskBtn.dataset.id = newOnlyTask.id;
            delTaskBtn.dataset.role = "closeLi";
            delTaskBtn.textContent = "+";
            delTaskBtn.classList.add("close-btn-x");

            liTask.appendChild(liBtnDiv);
            liTask.appendChild(chosenBadgesDivOnlyTask);

            liBtnDiv.appendChild(completedTaskBtn);
            liBtnDiv.appendChild(addTaskBadge);
            liBtnDiv.appendChild(delTaskBtn);

            countOnTask(e);
            };
            
            //showing badges:
            if(e.target.classList.contains("li-add-badge-btn")){
               const taskId = e.target.dataset.id;
               const parentBadge = document.querySelector(`.li-btn-div[data-id=${taskId}]`);
               createBadges(e, parentBadge);
            };

            //WORK with badges:
            //closing badge menu div:
            if (e.target.matches('.close-btn-x[data-role="close-badge-div"]')) {
              const taskId = e.target.dataset.id;
              e.target.parentNode.remove();
              document.querySelector(`.li-add-badge-btn[data-id=${taskId}]`).disabled = false;
              };
              
             //adding different badges - will be executed below with addBadge();??
            if(e.target.matches(".badge-urgent")){
                addBadge(e);
            };
            if(e.target.matches(".badge-optional")){
                addBadge(e);
            };
            if(e.target.matches(".badge-datum")){
                badgeDatumAdd(e);
            };
             //closing differnet badges:
             if(e.target.matches(`.close-btn-x[data-role="close-badge"]`)){
                
                const taskId = e.target.dataset.id; //works
                const currentBadge = e.target.dataset.content; // works, returns string, "Urgent"/"Optional"
                

                const currentTask = myOnlyTaskList.find(item =>{
                    return item.id === taskId;
                }); 
                currentTask.badges = currentTask.badges.filter(item=>{
                    return item !== currentBadge
                }); 
                //Updating array and stata info:
                if(currentBadge === "Urgent"){
                    currentTask.isUrgent = false;
                    countUrgentTask(e);
                };
                

                //disable buttons in btn menu:
                if(document.querySelector(`.badge-div-only-task`)){
                    document.querySelector(`.badge-${currentBadge.toLowerCase()}[data-id=${taskId}][data-role="badge-menu-btn"]`).disabled = false;
                };

                const targetBadgeDiv = document.querySelector(`div[data-id=${taskId}][data-content=${currentBadge}]`);
                
                targetBadgeDiv.remove(); 

                console.log(myOnlyTaskList);
                };
             if(e.target.matches(`.close-btn-x[data-role="close-form-btn-only-task"]`)){
                const taskId = e.target.dataset.id;
                document.querySelector(`.datum-form[data-id=${taskId}]`).remove();
             }

            //WORK with tasks
            //mark task as completed and update array:
            if(e.target.matches(`.li-completed-btn[data-role="completedOnlyTask"]`)){
            const taskId = e.target.dataset.id;
            const currentTask = myOnlyTaskList.find(item=>{
                    return item.id === taskId
                });
            myOnlyTaskList.forEach(item =>{
                    if(item.id === taskId)
                    {item.isCompleted = true;
                     item.isOn = false;
                     item.isUrgent = false;
                    }
                });

            onlyTaskCompletedList.classList.remove("hide");
            const completedOnlyTaskLi = document.createElement("li");
            completedOnlyTaskLi.dataset.id = taskId;
            completedOnlyTaskLi.classList.add("completed-only-task-li");
            completedOnlyTaskLi.innerHTML = `${currentTask.name} - erledigt! &#127881;`;
            onlyTaskCompletedList.appendChild(completedOnlyTaskLi);

            document.querySelector(`li[data-role="li-only-task"][data-id=${taskId}]`).remove();
            
            countOnTask(e);
            countCompletedTask(e); 
            countUrgentTask(e);
            };
            //deleting task fron onlyTask array:
            if(e.target.matches(`.close-btn-x[data-role="closeLi"]`)){
                const taskId = e.target.dataset.id;
                //updating array:
                const currentTask = myOnlyTaskList.find(item =>{
                    return item.id === taskId;
                });
                myOnlyTaskList = myOnlyTaskList.filter(item =>{
                    return item.id !== currentTask.id
                });
                //updating DOM:
                document.querySelector(`li[data-id=${taskId}]`).remove();
                countOnTask(e);
                countUrgentTask(e);
               }
           
                })
            
    });
};

if(closeAddFolder) {
    closeAddFolder.addEventListener("click", function(e){
    const folderId = e.target.dataset.id;
    renderingFolderDiv.classList.add("hide")
    foldersNameInput.value = ""
    document.querySelector("#add-folder-btn").classList.remove("hide");
    document.querySelector(`#add-folder-btn`).classList.add("margin-top-bottom-reduce")
    
})
}


if (renderingFolderDiv) {
    createFolderBtn.addEventListener("click", function(){
        //usersFolderName.innerText = foldersNameInput.value
        const folderName = foldersNameInput.value.trim();
        if(!folderName) return;

        const newFolder = {
            name: folderName,
            id: foldersNameInput.value.replace(/\s/g, "").slice(0,6) + myFolders.length,
            isOn: true,
            isCancelled: false,
            isCompleted: false,
            onTasks: 0,
            completedTasks: 0,
            tasks: []
        };

        myFolders.push(newFolder);

        const renderFolder = document.createElement("div");
        renderFolder.classList.add("folder-div");
        renderFolder.dataset.id = newFolder.id;

        /*
        renderFolder.innerHTML = `
            
                    <h2>${newFolder.name}</h2>
                    <button type="button" data-id=${newFolder.id} class="folder-delete-btn"> Delete Folder </button>
                    <button type="button" data-id=${newFolder.id} class="folder-add-task-btn"> Create task </button>

                    <div class="task-container hide" data-id=${newFolder.id}> 

                        <input type="text" class="input-task" data-id=${newFolder.id} required>
                        <button type="button" class="add-task-btn" data-id=${newFolder.id} data-folder=${newFolder.id}> add </button> 
                        <ul class="task-list" data-id=${newFolder.id}> </ul>

                    </div>
                        <ul class="completed-task-ul" data-id=${newFolder.id}> </ul>
                        <div class="folders-statistik" data-id=${newFolder.id}>
                            <h3 class="completed-statistik" data-id=${newFolder.id}>Completed: ${newFolder.completedTasks}</h3>
                        </div>
                        
                    </div>
          
        `
        //Diese Abschnitt rausgemonnem:

        //<div class="folders-statistik" data-id=${newFolder.id}>
          //                  <h3 class="on-statistik" data-id=${newFolder.id}>To do: ${newFolder.onTasks}</h3>
                       // </div> 

        workingFoldersContainer.appendChild(renderFolder) */
        
        foldersNameInput.value = ""
        
        //Folder und Task Struktur:

        //folder-wrapper for each new folder -> displayFolderEl + displayTaskBoardEl

        const folderWrapper = document.createElement("div");
        folderWrapper.dataset.id = newFolder.id;
        folderWrapper.classList.add("folder-wrapper");

        const displayFolderEl = document.createElement("div");
        displayFolderEl.classList.add("display-folder-el");
        displayFolderEl.dataset.id = newFolder.id;

        const displayTaskBoardEl = document.createElement("div");
        displayTaskBoardEl.dataset.id = newFolder.id;
        displayTaskBoardEl.classList.add("display-task-board-el");
        displayTaskBoardEl.classList.add("hide"); //wird nur mit Klick geöffnet
        
        folderDisplayDiv.appendChild(folderWrapper);
        folderWrapper.appendChild(displayFolderEl);
        folderWrapper.appendChild(displayTaskBoardEl);

        //Structure of displayFolderEl:

        const displayFolderHeader = document.createElement("h2");
        displayFolderHeader.classList.add("display-folder-header");
        displayFolderHeader.dataset.id = newFolder.id;
        displayFolderHeader.textContent = `Folder: "${newFolder.name}"`;

        //buttons in displayFolderEl:

        const openFolderBtn = document.createElement("button");
        openFolderBtn.dataset.id = newFolder.id;
        openFolderBtn.type = "button";
        openFolderBtn.classList.add("folder-btn");
        openFolderBtn.dataset.role = "folder-öffnen";
        openFolderBtn.textContent = "öffnen";

        const closeFolderBtn = document.createElement("button");
        closeFolderBtn.dataset.id = newFolder.id;
        closeFolderBtn.dataset.role = "folder-schließen"; //taskBoard vom Folder schließen
        closeFolderBtn.type = "button";
        closeFolderBtn.classList.add("folder-btn");
        closeFolderBtn.textContent = "schließen";

        const removeFolderBtn = document.createElement("button");
        removeFolderBtn.dataset.id = newFolder.id;
        removeFolderBtn.type = "button";
        removeFolderBtn.classList.add("close-btn-x");
        removeFolderBtn.dataset.role = "remove-folder";
        removeFolderBtn.textContent = "+";

        //div for buttons:

        const displayFolderBtnDiv = document.createElement("div");
        displayFolderBtnDiv.dataset.id = newFolder.id;
        displayFolderBtnDiv.classList.add("display-folder-btn-div");

        displayFolderBtnDiv.appendChild(openFolderBtn);
        displayFolderBtnDiv.appendChild(closeFolderBtn);
        displayFolderBtnDiv.appendChild(removeFolderBtn);

        displayFolderEl.appendChild(displayFolderHeader);
        displayFolderEl.appendChild(displayFolderBtnDiv);
        

        //add Statistik Data:

        const folderUrgentStata = document.createElement("h4");
        folderUrgentStata.classList.add("folder-urgent-stata");
        folderUrgentStata.dataset.id = newFolder.id;
        folderUrgentStata.textContent = `Drinned: 0`;

        const folderOnStata = document.createElement("h4");
        folderOnStata.classList.add("folder-on-stata");
        folderOnStata.dataset.id = newFolder.id;
        folderOnStata.textContent = `Zu erledigen:  0`;

        const folderCompletedStata = document.createElement("h4");
        folderCompletedStata.classList.add("folder-completed-stata");
        folderCompletedStata.dataset.id = newFolder.id;
        folderCompletedStata.textContent = `Erledigt!: 0`;

        displayFolderEl.appendChild(folderUrgentStata);
        displayFolderEl.appendChild(folderOnStata);
        displayFolderEl.appendChild(folderCompletedStata);

        //displayTaskBoardEl -> STRUCTURE:
        
        /* 12.12 dieser div entfernen - testen 
        const taskBoardBtnDiv = document.createElement("div");
        taskBoardBtnDiv.classList.add("task-board-btn-div");

        displayTaskBoardEl.appendChild(taskBoardBtnDiv);

        
        //taskBoardBtnDiv with two buttons:
        const addTaskBtn = document.createElement("button");
        addTaskBtn.dataset.id = newFolder.id;
        addTaskBtn.type = "button";
        addTaskBtn.classList.add("folder-add-task-btn");
        addTaskBtn.textContent = "Aufgabe hinzufügen";

        const closeTaskBoardBtn = document.createElement("button");
        closeTaskBoardBtn.dataset.id = newFolder.id;
        closeTaskBoardBtn.type = "button";
        closeTaskBoardBtn.classList.add("close-task-board-btn");
        closeTaskBoardBtn.textContent = "schließen";

        taskBoardBtnDiv.appendChild(addTaskBtn);
        taskBoardBtnDiv.appendChild(closeTaskBoardBtn); */

        //structure von task-input-board: div -> label + input + button:
        const taskInputBoardDiv = document.createElement("div");
        taskInputBoardDiv.dataset.id = newFolder.id;
        taskInputBoardDiv.classList.add("task-input-board-div");
        taskInputBoardDiv.classList.add("hide");

        const labelTaskInput = document.createElement("label");
        labelTaskInput.dataset.id = newFolder.id;
        labelTaskInput.classList.add("label-task-input");
        labelTaskInput.textContent = "Name der Aufgabe";
        labelTaskInput.setAttribute("for", newFolder.id);

        const taskInput = document.createElement("input");
        taskInput.setAttribute("type", "text");
        taskInput.setAttribute("required", true);
        taskInput.classList.add("input-task");
        taskInput.dataset.id = newFolder.id;

        const newTaskBtn = document.createElement("button");
        newTaskBtn.type = "button";
        newTaskBtn.dataset.id = newFolder.id;
        newTaskBtn.classList.add("new-task-btn");
        newTaskBtn.textContent = "+";

        taskInputBoardDiv.appendChild(labelTaskInput);
        taskInputBoardDiv.appendChild(taskInput);
        taskInputBoardDiv.appendChild(newTaskBtn);

        displayTaskBoardEl.appendChild(taskInputBoardDiv);


        /*
        <h2>${newFolder.name}</h2>
                    <button type="button" data-id=${newFolder.id} class="folder-delete-btn"> Delete Folder </button>
                    <button type="button" data-id=${newFolder.id} class="folder-add-task-btn"> Create task </button>

                    <div class="task-container hide" data-id=${newFolder.id}> 

                        <input type="text" class="input-task" data-id=${newFolder.id} required>
                        <button type="button" class="add-task-btn" data-id=${newFolder.id} data-folder=${newFolder.id}> add </button> 
                        <ul class="task-list" data-id=${newFolder.id}> </ul>

                    </div>
                        <ul class="completed-task-ul" data-id=${newFolder.id}> </ul>
                        <div class="folders-statistik" data-id=${newFolder.id}>
                            <h3 class="completed-statistik" data-id=${newFolder.id}>Completed: ${newFolder.completedTasks}</h3>
                        </div>
                        
                    </div> */

        //append displayFolderEl and displayTaskBoardEl to folderWrapper:
        
        
        /*
            div
              h3 Folder Name
              h4 Urgent task: ...
              h4 To do: ... task
              h4 Completed task: ...
        */ 
    })

    
}



//Aufgabe erteilen und mit Folder verknüpfen

if(workingFoldersContainer) {
    
    workingFoldersContainer.addEventListener("click", function(e){
        let folderId = e.target.dataset.id

        let folderAddTaskBtn = document.querySelector(`.folder-add-task-btn[data-id=${folderId}]`)

        //taskBoardEl öffnen:
        if(e.target.matches(`.folder-btn[data-role="folder-öffnen"]`)){
            const folderId = e.target.dataset.id;
            document.querySelector(`.display-task-board-el[data-id=${folderId}]`).classList.remove("hide");
        };

        //taskBoardEl schließen aber Folder nicht entfernen:
        if(e.target.matches(`.folder-btn[data-role="folder-schließen"]`)){
            const folderId = e.target.dataset.id;
            document.querySelector(`.display-task-board-el[data-id=${folderId}]`).classList.add("hide");
            
        };

        
        /*12.12 - element vom DOM entfernt - testen 
        if(e.target.classList.contains("folder-add-task-btn")){
            //document.querySelector(`.task-container[data-id=${folderId}]`).classList.remove("hide")
            document.querySelector(`.task-input-board-div[data-id=${folderId}]`).classList.remove("hide");
            
        } */

        // Delete Folder
        if(e.target.matches(`.close-btn-x[data-role="remove-folder"]`)){
            const folderId = e.target.dataset.id;
            //delete folder from myFolders
            myFolders = myFolders.filter(item =>{
                return (item.id !== folderId)
            })
            //delete Element from DOM
            document.querySelector(`div .folder-wrapper[data-id=${folderId}]`).remove()     
        };

        // Add Task Btn
        if(e.target.matches(".new-task-btn")){

            /*
            const newTaskBtn = document.createElement("button");
           newTaskBtn.type = "button";
           newTaskBtn.dataset.id = newFolder.id;
           newTaskBtn.classList.add("new-task-btn");
            newTaskBtn.textContent = "+";  */
            console.log("Task")
            const folderId = e.target.dataset.id;
            console.log(folderId)
            newTaskInput = document.querySelector(`.input-task[data-id=${folderId}]`).value.trim();
            if(!newTaskInput) return

            const targetFolder = myFolders.filter(item => {
                return item.id === folderId
            })[0];

            newTask = {
                name: newTaskInput,
                folder: targetFolder.name,
                id: newTaskInput.replace(/\s/g, "").slice(0,6) + targetFolder.tasks.length,
                isOn: true,
                isCompleted: false,
                isUrgent: false,
                badge:[]
            };
            
            const targetTaskId = newTask.id;

            //update tasks array:
            targetFolder.tasks.push(newTask);
             
            //create new task element:
            let newTaskElement= document.createElement("li");
            newTaskElement.classList.add(".task-li")
            newTaskElement.dataset.id = folderId
            newTaskElement.innerHTML = `
                    <h5 class="task-name" data-id=${newTask.id}> ${newTask.name}</h5>
                    <div class="chosen-badge-container" data-id=${newTask.id}> </div> 
                    <button type="button" class="done-task-btn" data-folder=${targetFolder.id} data-id=${newTask.id}> Done </button> 
                    <button type="button" class="delete-task-btn" data-folder=${targetFolder.id} data-id=${newTask.id}> Delete </button>
                    <button type="button" class="add-badge-btn" data-folder=${targetFolder.id} data-id=${newTask.id}> Add badge </button>

                    <div class="task-badge-container hide" data-id=${newTask.id}> 
                        <button type="button" class="badge-urgent" data-id=${newTask.id} data-folder=${folderId}> Urgent </button>
                        <button type="button" class="badge-datum" data-id=${newTask.id} data-folder=${folderId}> Datum  </button>
                        <button type="button" class="badge-optional" data-id=${newTask.id} data-folder=${folderId}> Optional </button>
                    </div>
            `;
            //how many on tasks?:
            countOnTask(e)
            document.querySelector(`.task-list[data-id=${folderId}]`).appendChild(newTaskElement)
            //clear the input
            document.querySelector(`.input-task[data-id=${folderId}]`).value = ""
        }

        //show badges container:
        if(e.target.classList.contains("add-badge-btn")){
            document.querySelector(`.task-badge-container[data-id=${e.target.dataset.id}]`).classList.remove("hide");
        }
        //handling Badges
        if(e.target.classList.contains("badge-urgent") && !e.target.parentNode.classList.contains("badge-div-only-task")){
                    addBadge(e)
                   };
        if(e.target.classList.contains("badge-optional") && !e.target.parentNode.classList.contains("badge-div-only-task")){
                    addBadge(e)
                   };             
         if(e.target.classList.contains("badge-datum") && !e.target.parentNode.classList.contains("badge-div-only-task")){
                    addBadge(e)
                    
                    const currentFolderId = e.target.dataset.folder;
                    const currentFolder = myFolders.find(item =>{
                        return item.id === currentFolderId
                    });
                    const taskId = e.target.dataset.id;
                    const currentTask = currentFolder.tasks.find(item =>{
                        return item.id === taskId
                    });

                    document.querySelector(`.badge-datum[data-id=${taskId}]`).remove();

                    const chosenBadgeContainer = document.querySelector(`.chosen-badge-container[data-id=${taskId}]`);

                    const datumForm = document.createElement("form");
                    datumForm.classList.add("datum-form");
                    datumForm.dataset.id = taskId;

                    const datumLabel = document.createElement("label");
                    datumLabel.classList.add("datum-label");
                    datumLabel.dataset.id = taskId;
                    datumLabel.htmlFor = taskId;
                    datumLabel.textContent = "Choose date:";

                    const datumInput = document.createElement("input");
                    datumInput.type = "date";
                    datumInput.classList.add("datum-input");
                    datumInput.dataset.id = taskId;
                    
                    const datumSubmitBtn = document.createElement("input");
                    datumSubmitBtn.type = "submit";
                    datumSubmitBtn.classList.add("datum-submit-btn");
                    datumSubmitBtn.value = "OK";
                    datumSubmitBtn.dataset.id = taskId;
                    
                    const userDate = document.createElement("h4");
                    userDate.classList.add("users-datum-el");
                    userDate.dataset.id = taskId;
                    
                    datumForm.appendChild(datumLabel);
                    datumForm.appendChild(datumInput);
                    datumForm.appendChild(datumSubmitBtn);

                    chosenBadgeContainer.appendChild(datumForm);
                    chosenBadgeContainer.appendChild(userDate);

                    const date = new Date()
                    const currentYear = date.getFullYear()
                    const currentMonth = date.getMonth() + 1
                    const currentDay = date.getDate()
                    const dayToday= `${currentYear}-0${currentMonth}-${currentDay}`
                    datumInput.setAttribute("min", `${dayToday}`)

                    const removeBtn = document.createElement("button");
                        removeBtn.classList.add("remove-badge-btn");
                        removeBtn.type = "button";
                        removeBtn.dataset.id= "Datum".trim();
                        removeBtn.textContent = "*";
                        

                        //getting users data:
                    
                    let chosenDate = "";
                    
                    datumForm.addEventListener("submit", function(e){
                        e.preventDefault()

                        chosenDate = datumInput.value;
                        if(!chosenDate) return;
                        const usersDay = new Date(`${chosenDate}`)
                        const milisec = usersDay.getTime() - date.getTime()
                        const dayTill = Math.ceil(milisec / 86400000)

                        const datumH3 = document.createElement("h3");
                        datumH3.textContent = `Datum: ${chosenDate}`;

                        const datumH4 = document.createElement("h4");
                        datumH4.textContent = `${dayTill} days left`;

                        userDate.appendChild(datumH3);
                        userDate.appendChild(datumH4);
                        userDate.appendChild(removeBtn);
                        
                        datumForm.remove()
                         });
                         
                         
                         removeBtn.addEventListener("click", ()=>{
                            currentTask.badge = currentTask.badge.filter(item =>{
                                return item !== removeBtn.dataset.id
                            });
                            console.log(currentTask.badge)
                            document.querySelector(`.badge-datum[data-id=${taskId}]`).disabled = false;
                            removeBtn.parentNode.remove();
                         })
                         
                        
                   };          
        

                    /*
                    document.querySelector(`.chosen-badge-container[data-id=${taskId}]`).innerHTML += 
                    `
                    <form action="" class="datum-form" data-id=${taskId}>
                        <label for=${taskId} class="datum-label" data-id=${taskId}>Choose date: </label>

                        <input type="date" class="datum-input" data-id=${taskId} min="">
                        <input type="submit" class="datum-submit-btn" data-id=${taskId} >
                    </form>
                     <h4 class="users-datum-el" data-id=${taskId}></h4>
                    ` ;
                    */


        //delete the task
        if(e.target.classList.contains("delete-task-btn")){
            
            let targetTaskId = e.target.dataset.id;
            let targetFolderId = e.target.parentNode.dataset.id;
            let targetFolder = myFolders.find(item=>{
                return item.id === targetFolderId
            })
            
            //find in myFolders targetFolder:
            targetFolder = myFolders.filter(item => {
                return item.id === targetFolderId
            })[0];
            
            //delete task in targetFolder
            targetFolder.tasks = targetFolder.tasks.filter(task =>{
                return task.id !== targetTaskId
            });

            //delete li element from the DOM:
            e.target.parentNode.remove();

            countOnTask(e);
            countCompletedTask(e);
            countUrgentTask(e);
        }

        //mark the task as "Done"
        if(e.target.classList.contains("done-task-btn")){
            console.log(e.target.dataset.folder);

            const targetFolder = myFolders.find(item =>{
                return item.id === e.target.dataset.folder
            });
            
            //update myFolders arr:
            targetFolder.tasks.forEach(item =>{
                if(item.id === e.target.dataset.id) {
                        item.isCompleted = true
                        item.isOn = false
                }
            });


            countOnTask(e);
            countCompletedTask(e);

            let newCompletedTaskLi = document.createElement("li");
            newCompletedTaskLi.dataset.id = targetFolder.id;
            newCompletedTaskLi.innerHTML = `
                ${document.querySelector(`.task-name[data-id=${e.target.dataset.id}]`).innerHTML}
            `
            document.querySelector(`.completed-task-ul[data-id=${targetFolder.id}]`).appendChild(newCompletedTaskLi);
            document.querySelector(`.task-name[data-id=${e.target.dataset.id}]`).parentNode.remove();
        }
      
    })
        
}

/*Test Taschenlicht */
    const overlay = document.querySelector('.overlay-desktop');
    const wrapperDesktop = document.querySelector('.wrapper-desktop');

    if(wrapperDesktop) {
        wrapperDesktop.addEventListener('mousemove', (e) => {
      const rect = wrapperDesktop.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      overlay.style.background = `
        radial-gradient(circle clamp(80px, 9.8vw, 100px) at ${x}px ${y}px,
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) 40%,
          rgb(33, 84, 67, 1) 100%)
      `;
    });
    }
    

