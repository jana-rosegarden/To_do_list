const foldersContainer = document.getElementById("folders-container")
const renderingFolderDiv = document.getElementById("rendering-folder-div")

const addFolderBtn = document.getElementById("add-folder-btn")

const closeAddFolder = document.getElementById("close-add-folder")

let foldersNameInput = document.getElementById("folders-name")
//let usersFolderName = document.getElementById("users-folder-name")
const createFolderBtn = document.getElementById("create-folder-btn")

//Removing white spaces from string for taskId:
/*let text = "Wash the dishes"
let output = text.replace(/\s/g, "").slice(0,6) */

// testing von Date :
const testDate = document.getElementById("test-date")
const usersDate = document.getElementById("users-date")

//getting today data:

const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;


const date = new Date()
const dayToday = date.getDate()
const month = date.getMonth() + 1
testDate.innerHTML = dayToday + " " + month

//getting users data:
const usersDay = new Date("2025-11-09")
const milisec = usersDay.getTime() - date.getTime()
const dayTill = Math.ceil(milisec / 86400000)



usersDate.innerHTML = dayTill
//input date benutzen!

/*Blue Working container */

const workingFoldersContainer = document.getElementById("working-folders-container")
let renderedFolder = document.getElementById("rendered-folder")

/* Saving data */

let myFolders = []
let targetFolder = ""
let newTaskInput = ""
let newTask = {}
let targetTaskBadge = ""

//statistik

let folderOnTasks = ""; //???
let folderCompletedTasks = ""; ///??

let onTaskAmount = ""
let completedTaskAmount = ""

function countOnTask(){
    onTaskAmount = targetFolder.tasks.filter(task =>{
                return(task.isOn === true)
            }).length;

    document.querySelector(`.on-statistik[data-id=${targetFolder.id}]`).innerHTML=`
                To do: ${onTaskAmount}
            `
}

function countCompletedTask() {
    completedTaskAmount = targetFolder.tasks.filter(task =>{
                return task.isCompleted === true
            }).length;

            document.querySelector(`.completed-statistik[data-id=${targetFolder.id}]`).innerHTML = `
                Completed: ${completedTaskAmount}
            `
}

/*Events */

addFolderBtn.addEventListener("click", function(){
    renderingFolderDiv.classList.remove("hide")
})

closeAddFolder.addEventListener("click", function(){
    renderingFolderDiv.classList.add("hide")
    foldersNameInput.value = ""
    
})

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
                        <button type="button" class="add-task-btn" data-id=${newFolder.id}> add </button> 
                        <ul class="task-list" data-id=${newFolder.id}> </ul>

                    </div>
                        <ul class="completed-task-ul" data-id=${newFolder.id}> </ul>
                        <div class="folders-statistik" data-id=${newFolder.id}>
                            <h3 class="completed-statistik" data-id=${newFolder.id}>Completed: ${newFolder.completedTasks}</h3>
                        </div>

                        <div class="folders-statistik" data-id=${newFolder.id}>
                            <h3 class="on-statistik" data-id=${newFolder.id}>To do: ${newFolder.onTasks}</h3>
                        </div>
                
                    </div>
          
        `

        workingFoldersContainer.appendChild(renderFolder) 
        foldersNameInput.value = ""
        //console.log(myFolders)
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

            targetFolder = myFolders.filter(item => {
                return item.id === folderId
            })[0];

            newTask = {
                name: newTaskInput,
                folder: targetFolder.name,
                id: newTaskInput.replace(/\s/g, "").slice(0,6) + targetFolder.tasks.length,
                isOn: true,
                isCompleted: false,
                badge:[]
            }
            console.log(newTask.id)
            //update tasks array:
            targetFolder.tasks.push(newTask);
            
            //how many on tasks?:
               countOnTask()
            
            //create new task element:
            let newTaskElement= document.createElement("li");
            newTaskElement.classList.add(".task-li")
            newTaskElement.dataset.id = folderId
            newTaskElement.innerHTML = `
                    <h5 class="task-name" data-id=${newTask.id}> ${newTask.name}</h5>
                    <div class="chosen-badge-container" data-id=${newTask.id}> </div> 
                    <button type="button" class="done-task-btn" data-id=${newTask.id}> Done </button> 
                    <button type="button" class="delete-task-btn" data-id=${newTask.id}> Delete </button>
                    <button type="button" class="add-badge-btn" data-id=${newTask.id}> Add badge </button>

                    <div class="task-badge-container hide" data-id=${newTask.id}> 
                        <button type="button" class="badge-urgent" data-id=${newTask.id}> Urgent </button>
                        <button type="button" data-id=${newTask.id}> Datum  </button>
                        <button type="button" data-id=${newTask.id}> Optional </button>
                    </div>
            `;

            document.querySelector(`.task-list[data-id=${folderId}]`).appendChild(newTaskElement)
            //clear the input
            document.querySelector(`.input-task[data-id=${folderId}]`).value = ""
        }

        //show badges container:
        if(e.target.classList.contains("add-badge-btn")){
            document.querySelector(`.task-badge-container[data-id=${e.target.dataset.id}]`).classList.remove("hide");
        }
        //handling Urgent badge
        if(e.target.classList.contains("badge-urgent")){
                    
                    let targetTaskObjekt = targetFolder.tasks.find(item=>{
                        return item.id === e.target.dataset.id
                    });
                    
                    targetTaskObjekt.badge.push(e.target.innerHTML);
                    
                    //show badge near the task, create Element with the badge:
                    document.querySelector(`.chosen-badge-container[data-id=${targetTaskObjekt.id}]`).innerHTML = `
                        <span> ${e.target.innerHTML} </span>
                    `
                } 

        //delete the task
        if(e.target.classList.contains("delete-task-btn")){
            
            let targetTaskId = e.target.dataset.id;
            let targetFolderId = e.target.parentNode.dataset.id;
            
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
            
            countOnTask();
            countCompletedTask();
            
        }

        //mark the task as "Done"
        if(e.target.classList.contains("done-task-btn")){
            
            //update myFolders arr:
            targetFolder.tasks.forEach(item =>{
                if(item.id === e.target.dataset.id) {
                        item.isCompleted = true
                        item.isOn = false
                }
            });


            countOnTask();
            countCompletedTask();

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


export default myFolders