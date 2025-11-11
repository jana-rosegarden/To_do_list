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

//statistik

let folderOnTasks = ""; //???
let folderCompletedTasks = ""; ///??

let onTaskAmount = ""
let completedTaskAmount = ""

function countOnTask(e){
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
}

function countCompletedTask(e) {
    const targetFolderId = e.target.dataset.folder;
    
    const targetFolder = myFolders.find(item =>{
        return item.id === targetFolderId
    })
    completedTaskAmount = targetFolder.tasks.filter(task =>{
                return task.isCompleted === true
            }).length;

            document.querySelector(`.completed-statistik[data-id=${targetFolder.id}]`).innerHTML = `
                Completed: ${completedTaskAmount}
            `
            document.querySelector(`.folder-completed-stata[data-id=${targetFolderId}]`).innerHTML = `
            Completed: ${completedTaskAmount} tasks
    `
}

function countUrgentTask(e){
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

//handling Badges  function:
function addBadge(e){

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
                    

/*Events */

//Ordner erstellen oder mit Only-Task List erstellen:
if(addFolderBtn || addTaskOnlyBtn) {
    addFolderBtn.addEventListener("click", function(){
    renderingFolderDiv.classList.remove("hide")
    document.querySelector(".list-example-folder").classList.add("hide") //entfernt Example folder wenn btn klicked
});
    //Only-Task List initialisieren:
    addTaskOnlyBtn.addEventListener("click", function(){
        document.querySelector(".list-example-folder").classList.add("hide");

        
        //Show Task-Ordner:
        onlyTaskContainer.classList.remove("hide");
        addTaskOnlyBtn.classList.add("hide");
        
        //addTaskOnlyBtn.style.display = "none";
            //<ul class="only-task-list" data-id=""> </ul> -- hier neue Tasks platzieren
            
        onlyTaskContainer.addEventListener("click", function(e){

            //close container:
            if(e.target.classList.contains("close-btn-x") && e.target.dataset.id === "only-task-container"){
                onlyTaskContainer.classList.add("hide");
                myOnlyTaskList = [];
                document.querySelector(".list-example-folder").classList.remove("hide");
                 addTaskOnlyBtn.classList.remove("hide");
            }

            //Add Task in Only-Task-List:
            if(pushOnlyTaskBtn) {
                if(!inputOnlyTaskName.value) return
            
            let randomNumber = Math.floor((Math.random() * 10) + 1);
           
            const newOnlyTask = {
                id: inputOnlyTaskName.value.replace(/\s/g, "").slice(0,6) + randomNumber,
                name: inputOnlyTaskName.value,
                isOn: true,
                isCompleted: false,
                isUrgent: false,
                badges:[]
            };
            myOnlyTaskList.push(newOnlyTask);
            inputOnlyTaskName.value = "";

            const liTask = document.createElement("li");
            liTask.dataset.id = newOnlyTask.id;
            liTask.textContent = newOnlyTask.name;

            onlyTaskList.appendChild(liTask);
            //div for buttons:

            const liBtnDiv = document.createElement("div");
            liBtnDiv.dataset.id = newOnlyTask.id;
            liBtnDiv.classList.add("li-btn-div");

            //Buttons:
            const addTaskBadge = document.createElement("button");
            addTaskBadge.dataset.id = newOnlyTask.id;
            addTaskBadge.textContent = "Badge hinzufügen";
            addTaskBadge.classList.add("li-add-badge-btn");

            const completedTaskBtn = document.createElement("button");
            completedTaskBtn.dataset.id = newOnlyTask.id;
            completedTaskBtn.innerHTML = `&#10003;`;
            completedTaskBtn.classList.add("li-completed-btn");

            const delTaskBtn = document.createElement("button");
            delTaskBtn.dataset.id = newOnlyTask.id;
            delTaskBtn.textContent = "+";
            delTaskBtn.classList.add("close-btn-x");

            liTask.appendChild(liBtnDiv);
            
            liBtnDiv.appendChild(completedTaskBtn);
            liBtnDiv.appendChild(addTaskBadge);
            liBtnDiv.appendChild(delTaskBtn);
            }
            
            

            //HTML ergänzen:
            /*Struktur:
                ul 
                 li badge
                 li badge
                div statistik
                 h4 To Do:
                 h4 Urgent:
                 h4 Completed: 
            
            */ 



                })
            
            
            
        
        /* HTML Struktur:
        <section class="task-only-container hide"> 
            Input - Task-Name
            Btn - Add new Task
            Ul - wo die Tasks aufgelistet sind
             Tasks:
               Name + Badges + Remove Task
             Statistik:
               Completed:
               Urgent:
               Optional:
               Mit Datum
        </section>
        
        JS Logik: 
            taskOnly = []
            jede Task = {
                id:
                name:
                isOn:
                isUrgent:
                isCompleted: 
                badges: []
            }
        
        */
    });
};

if(closeAddFolder) {
    closeAddFolder.addEventListener("click", function(){
    renderingFolderDiv.classList.add("hide")
    foldersNameInput.value = ""

})
}


if (renderingFolderDiv) {
    createFolderBtn.addEventListener("click", function(){
        //usersFolderName.innerText = foldersNameInput.value
        const folderName = foldersNameInput.value.trim();
        if(!folderName) return;

        const newFolder = {
            name: folderName,
            id: foldersNameInput.value + myFolders.length,
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
        /*Diese Abschnitt rausgemonnem:

        <div class="folders-statistik" data-id=${newFolder.id}>
                            <h3 class="on-statistik" data-id=${newFolder.id}>To do: ${newFolder.onTasks}</h3>
                        </div> */

        workingFoldersContainer.appendChild(renderFolder) 
        foldersNameInput.value = ""
        
        //Stattistik Folder:

        const displayFolderEl = document.createElement("div");
        displayFolderEl.classList.add("display-folder-el");
        displayFolderEl.dataset.id = newFolder.id;

        //Bag hier? 31.10.25
        folderDisplayDiv.appendChild(displayFolderEl);

        const displayFolderHeader = document.createElement("h3");
        displayFolderHeader.classList.add("display-folder-header");
        displayFolderHeader.dataset.id = newFolder.id;
        displayFolderHeader.textContent = `${newFolder.name}`;
        
        displayFolderEl.appendChild(displayFolderHeader);

        //add Statistik Data:

        const folderUrgentStata = document.createElement("h4");
        folderUrgentStata.classList.add("folder-urgent-stata");
        folderUrgentStata.dataset.id = newFolder.id;
        folderUrgentStata.textContent = `Urgent task: `;

        const folderOnStata = document.createElement("h4");
        folderOnStata.classList.add("folder-on-stata");
        folderOnStata.dataset.id = newFolder.id;
        folderOnStata.textContent = `To do:  task`;

        const folderCompletedStata = document.createElement("h4");
        folderCompletedStata.classList.add("folder-completed-stata");
        folderCompletedStata.dataset.id = newFolder.id;
        folderCompletedStata.textContent = `Completed task: `;

        displayFolderEl.appendChild(folderUrgentStata);
        displayFolderEl.appendChild(folderOnStata);
        displayFolderEl.appendChild(folderCompletedStata);
        
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
        
        if(e.target.classList.contains("folder-add-task-btn")){
            document.querySelector(`.task-container[data-id=${folderId}]`).classList.remove("hide")
        }
        // Delete Folder
        if(e.target.classList.contains("folder-delete-btn")){

            //delete folder from myFolders
            myFolders = myFolders.filter(item =>{
                return (item.id !== folderId)
            })
            //delete Element from DOM
            document.querySelector(`div .folder-div[data-id=${folderId}]`).remove()          
        }

        // Add Task Btn
        if(e.target.classList.contains("add-task-btn")){
            
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
        if(e.target.classList.contains("badge-urgent")){
                    addBadge(e)
                   };
        if(e.target.classList.contains("badge-optional")){
                    addBadge(e)
                   };             
         if(e.target.classList.contains("badge-datum")){
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
    

