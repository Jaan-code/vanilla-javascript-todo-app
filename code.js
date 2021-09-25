// SET THE TITLE
document.getElementById("title").textContent = `
  Tareas que completar hoy:  ${new Date().toDateString()} 📝
`;
// FUNTION TO CREATE ID
const createId = ()=> "id" + Math.random().toString(16).slice(2);

// INTERACTION WITH LOCALSTORAGE
const getTasks = ()=> JSON.parse(localStorage.getItem("tasks"));
const saveTasks = (tasks) => localStorage.setItem("tasks", JSON.stringify(tasks));

function saveTask({name, hours}) {
  const id = createId();
  let tasks = getTasks();
  if (tasks) {
    tasks.push({id, name, hours, checked: false});
    saveTasks(tasks);
  }else {
    tasks = [{id, name, hours}];
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }
}
function updateTask(newTask) {
  let tasks = getTasks();
  tasks = tasks.map(task=>{
    if (task.id === newTask.id) return newTask;
    return task;
  });
  saveTasks(tasks);
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.id != id);
  saveTasks(tasks);
  displayTasks();
}

function toogleTask(id) {
  let tasks = getTasks();
  let thisTask = tasks.filter(task=> task.id === id)[0];
  thisTask.checked = !thisTask.checked;
  updateTask(thisTask);
  displayTasks();
}

// DISPLAY TASKS
function displayTasks() {
  const tasksContainer = document.getElementById("tasks");
  const currentTasks = getTasks() || [];
  const tasksHtmlList = currentTasks.map(task=>`
    <div class="todo" style="background:${task.checked?"rgba(0,0,0,.05)":"#FFF"}">
      <input onchange="toogleTask('${task.id}')"
      type="checkbox" class="checkbox" ${task.checked && "checked"}>

      <p style="color:${task.checked?"rgba(0,0,0,.5)":"black"};
                text-decoration:${task.checked?"line-through":"none"};
                margin: auto;">
      ${task.name} | ${task.hours} hrs
      </p>

      <button type="button" class="edit" onclick="editTask('${task.id}')";>&#9998;</button>
      <button type="button" class="delete" onclick="deleteTask('${task.id}')";>&#x1f7ab;</button>
    </div>
    `).join("");
  tasksContainer.innerHTML = tasksHtmlList;
}
displayTasks();



// SAVE TASK FUNCTIONALITY
const input = document.getElementById("todo_input");
const hours = document.getElementById('time_input');
const saveButton = document.getElementById("save_todo");

function editTask(id) {
  let tasks = getTasks();
  const taskToEdit = tasks.filter(task => task.id === id)[0];

  input.value = taskToEdit?.name;
  hours.value = taskToEdit?.hours;

  tasks = tasks.filter(task => task.id != id);
  saveTasks(tasks);
  displayTasks();
}

saveButton.addEventListener("click", ()=>{
  input.value && saveTask({hours: hours.value, name: input.value});
  input.value = "";
  hours.value = 0;
  displayTasks();
})


// SECCION DE LAS NOTAS
function saveNotes(content) {
  localStorage.setItem("notes", JSON.stringify( {content} ));
}
function getNotes() {
  let content =  localStorage.getItem("notes");
  return content? JSON.parse(content) : {content: ""};
}
const buttonShowNotes = document.getElementById("shownotes");
const notes = document.getElementById("notes");

let show = false;
buttonShowNotes.addEventListener("click", ()=>{
    show = !show;
    notes.style.display = show? "block":"none";
    buttonShowNotes.textContent = show? "Guardar notas":"Mostrar notas";
    if (show) {
      notes.innerHTML = getNotes().content;
    }else {
      saveNotes(notes.innerHTML)
    }
})


// SECCION DEL HORARIO
function saveSchedule(content) {
  localStorage.setItem("schedule", JSON.stringify( {content} ));
}
function getSchedule() {
  let content =  localStorage.getItem("schedule");
  return content? JSON.parse(content) : {content: ""};
}

const buttonShowSchedule = document.getElementById("showschedule");

const schedule = document.getElementById("schedule");
const startSchedule = document.getElementById('startschedule');
const cleanSchedule = document.getElementById("cleanchedule");
const content = document.getElementById('content');

let showSchedule = false;
buttonShowSchedule.addEventListener("click", ()=>{
    showSchedule = !showSchedule;
    schedule.style.display = showSchedule? "block":"none";
    buttonShowSchedule.textContent = showSchedule? "Guardar horario":"Mostrar horario";
    if (showSchedule) {
      content.innerHTML = getSchedule().content;
    }else {
      saveSchedule(content.innerHTML)
    }
})

function formatMinutes(time) {

  let hours = Math.floor(time / 60);
  let minutes = Math.floor(((time / 60) - Math.floor(time / 60))*60);
  return `<span>${hours}:${(minutes > 10) ? minutes : "0"+minutes}</span>`;
}
startSchedule.addEventListener("click", ()=>{
    let rightNow = (new Date().getHours() * 60) + new Date().getMinutes();
    const allTasks = getTasks();
    let scheduleString = ``;
    allTasks.map(task=>{
        if (!task.checked) {
          let start = rightNow;
          let end = rightNow + (parseFloat(task.hours || 0) * 60);
          rightNow = end;
          scheduleString +=  `
            <p><i>${formatMinutes(start)} <span>-</span> ${formatMinutes(end)}</i>  ${task.name}</p>`;
        }
    });
    content.innerHTML = scheduleString;
});

cleanSchedule.addEventListener("click", ()=>{
  content.innerHTML = "";
})
