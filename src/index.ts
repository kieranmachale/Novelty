import { v4 as uuidV4 } from "uuid"

type Task = {
  id: string
  title: string
  author: string
  ISBN: string
  pageCount: string,
  averageRating: string,
  imageLink: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")
const bookCover = document.getElementById("bookCover") as HTMLImageElement
const bookTitle = document.getElementById("title") as HTMLSpanElement
const author = document.getElementById("author") as HTMLSpanElement
const pageCount = document.getElementById("pageCount") as HTMLSpanElement
const ISBN = document.getElementById("ISBN") as HTMLSpanElement
const averageRating = document.getElementById("averageRating") as HTMLSpanElement
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

const clearBtn = document.querySelector("#clear")
clearBtn?.addEventListener("click", function(){
  clearTasks()
})

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  // Fetching book images
  var isbn = input.value
  var url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;


  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      const newTask: Task = {
        id: uuidV4(),
        title: data.items[0].volumeInfo.title,
        author: data.items[0].volumeInfo.authors[0],
        ISBN: input.value,
        pageCount: data.items[0].volumeInfo.pageCount,
        averageRating: data.items[0].volumeInfo.averageRating,
        imageLink: data.items[0].volumeInfo.imageLinks.thumbnail,
        completed: false,
        createdAt: new Date(),
      }
      tasks.push(newTask)
      saveTasks()
    
      addListItem(newTask)
      input.value = ""
        
    })
    .catch(err => {
        console.log(err.message || "Error occurred while fetching book info");
    });
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  const cover = document.createElement("img")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed

  cover.src = task.imageLink

  label.append(checkbox, task.title)
  /*item.append(label)*/
  item.append(cover)
  cover.addEventListener("click", () => {
    /*item.remove()
    var arr = JSON.parse(localStorage["TASKS"])
    var newArray = arr.filter((el: { ISBN: any }) => el.ISBN !== task.ISBN)
    localStorage.setItem('TASKS', JSON.stringify(newArray));*/
    bookCover.src = task.imageLink
    bookTitle.innerHTML = task.title
    author.innerHTML = task.author
    pageCount.innerHTML = `Pages: ${task.pageCount}`
    ISBN.innerHTML = `ISBN: ${task.ISBN}`
    if(!task.averageRating) {
      averageRating.innerHTML = `3.5`
    } else {
      if(task.averageRating.toString().length == 1) { averageRating.innerHTML = `${task.averageRating}.0`} else { averageRating.innerHTML = task.averageRating } 
    }
  })
  
  list?.append(item)
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}

function clearTasks() {
  localStorage.clear();
  list!.innerHTML = " "
}
