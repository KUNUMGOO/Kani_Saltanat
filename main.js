const API = "  http://localhost:8000/todos";

// !======================TODO LIST ==========================================
// ? получаем елементы из html и сохраняем в переменных
const inpAdd = document.querySelector(".add-todo");
const addBtn = document.querySelector(".add-btn");
const list = document.querySelector(".list-group");
// console.log(inpAdd, addBtn, list);

// создаем обьект, который будет хранить данные нового todo
let newTodo = {};

// вешаем слушатель событий на инпут, для получения данных из него

inpAdd.addEventListener("input", (e) => {
  // перезаписываем обьект newTodo и под ключом todo помещаем содержимое из инпута
  newTodo = { todo: e.target.value };
  console.log(newTodo); //отображается в консоли и в db.json информация копируется с браузера
});

// функция добавления
async function addTodo() {
  // оборачиваем в try ...catch для отлавливания ошибок
  try {
    // отправляем POST запрос, в который поместили обьект
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(newTodo), //тело запроса, конкретно то, что отправляется
    });
  } catch (error) {
    console.log(error);
  }
  //   очищаем инпут
  inpAdd.value = "";
  //   вызываем данную функцию, для отображения актуальных данных, после добавления
  getTodos(); //получаем данные из json в браузер
}

// навешиваем слушатель событий на кнопку добавления
addBtn.addEventListener("click", addTodo);

// read

// функция для стягивания данных с json-server
async function getTodos() {
  try {
    // получаем данные с бека
    let res = await fetch(API);
    // обрабатываем ответ от сервера
    let todos = await res.json();
    // вызываем функцию для отображения
    render(todos);
  } catch (error) {
    console.log(error);
  }
}

// функция отображения
function render(todos) {
  // очищаем все что было в list, для того, чтобы не было дубликатов
  list.innerHTML = "";
  //   перебираем данные полученные из сервера и на каждый обьект отрисовываем елемент li
  todos.forEach((item) => {
    list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
    <p>${item.todo}</p>
    <div>
    <button onclick="deleteTodo(${item.id})" class="btn btn-danger">delete</button>
    <button onclick = "editTodo(${item.id})"class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">edit</button></div>
    </li> 
    `; //добавили модальное окно
  });
}
getTodos(); //чтобы отобразить при первой загрузке страницы

// удаление todo
async function deleteTodo(id) {
  try {
    await fetch(`${API}/${id}`, { method: "Delete" });
    getTodos();
  } catch (error) {
    console.log(error);
  }
}

// редактирование todo
let inpEdit = document.querySelector(".inp-edit");
let saveBtn = document.querySelector(".save-btn");
let editModal = document.querySelector("#exampleModal");
// console.log(inpEdit, saveBtn, editModal);

let editedObj = {};

inpEdit.addEventListener("input", (e) => {
  editedObj = { todo: e.target.value };
  console.log(editedObj);
});

async function editTodo(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let objToEdit = await res.json();
    inpEdit.value = objToEdit.todo;
    saveBtn.setAttribute("id", `${id}`);
  } catch (error) {
    console.log(error);
  }
}

// save changes
saveBtn.addEventListener("click", async (e) => {
  let id = e.target.id;
  // console.log(e.target);
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset = utf-8",
      },
      body: JSON.stringify(editedObj),
    });
  } catch (error) {
    console.log(error);
  }
  getTodos(); //ЧТОБЫ ОТОБРАЗИЛСЯ БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide;
});

// !=================ASYNC/WAIT================================
// ? - ключевое слово await заставляет javascript ждать до тех пор,
// ?  пока промис правую часть от await не выполнится. После чего оно его вернет результат,
// ?  и выполнение кода продолжится.
// async function func() {
//   let res = await fetch(API);
//   let data = await res.json();
//   console.log(data);
//   console.log(res);
// }
// func();
// !=============================try...catch=========================
// let a = 2;
// let b = 3;

// try {
//   console.log(a + b);
// } catch (error) {
//   console.log("Error", error);
// } finally {
//   console.log("конструктор закончил работу");
// }

// let t = 10;
// let f = 3;

// try {
//   console.log(t - f);
// } catch (error) {
//   console.log("Error", error);
// } finally {
//   console.log("конструктор закончил работу");
// }
// ? - конструкция try...catch пытается выполнить блок кода внутри try,
// ? в случае возникновения ошибки, отрабатывает блок catch, блок finally (не обьязательный)
// ? срабатывает в любом случае
