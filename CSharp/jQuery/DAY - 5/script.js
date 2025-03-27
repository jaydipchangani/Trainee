toastr.options = {
    "timeOut": "1000",
    "progressBar": true,
    "newestOnTop": true,
    "positionClass": "toast-top-right" 
};

const API_URL = 'https://dotnet9api.azurewebsites.net/todos';

const AUTH_TOKEN = 'Bearer 2810raj';

const todoModal = new bootstrap.Modal(document.getElementById('todoModal'));

const themeToggle = document.getElementById('themeToggle');

const themeicon = document.getElementById('themeIcon');

themeToggle.addEventListener('click',() =>{
    const modalHeader = document.getElementById('modalHeader');
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
    const todoTable = document.getElementById('todoTable');
    todoTable.classList.toggle('table-dark');

    modalHeader.classList.toggle('bg-light');
    modalHeader.classList.toggle('bg-dark');
    modalHeader.classList.toggle('text-light');
    modalHeader.classList.toggle('text-dark');

    if (document.body.classList.contains('bg-dark')) {
        themeicon.classList.remove('bi-moon-fill');
        themeicon.classList.add('bi-sun-fill');
    } else {
        themeicon.classList.remove('bi-sun-fill');
        themeicon.classList.add('bi-moon-fill');
    }
});


function getRequestOption(method, body = null){
    const options = {
        method:method,
        headers:{
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'application/json'
        }
    };

    if(body){
        options.body = JSON.stringify(body);
    }

    return options;
}

async function fetchTodos(){
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    try{
        const response = await fetch(API_URL , getRequestOption('GET'));

        const todos = await response.json();
        console.log(todos);

        $("#todoTableBody").empty();

        todos.forEach((todo,index) => {

            const statusButton = todo.isCompleted ?
             `<button class="btn btn-warning toggle-status" data-id="${todo.id}">Mark as Incomplete</button>`
             : `<button class="btn btn-success toggle-status" data-id="${todo.id}">Mark Completed</button>`;

             const row = `
                        <tr data-id="${todo.id}">
                            <td>${index + 1}</td>
                            <td>${todo.title}</td>
                            <td>${todo.description}</td>
                            <td>${statusButton}</td>
                            <td>
                                <button class="btn btn-info edit-todo" data-id="${todo.id}">Edit</button>
                                <button class="btn btn-danger delete-todo" data-id="${todo.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    $('#todoTableBody').append(row);
            
        });
    } catch(error){
        toastr.error('Failed to fetch Todos');
    } finally{
        loader.style.display = 'none';
    }
    
}

document.getElementById('addTodoBtn').addEventListener('click',() =>{
    document.getElementById('todoId').value = '';
    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
    todoModal.show();
});

const todoForm = document.getElementById('todoForm');

todoForm.addEventListener('submit',async (e) =>{
    e.preventDefault();
    const loader = document.getElementById('loader');
    const loaderBox = document.getElementById('loader_box');
    const saveButton = document.getElementById('saving_button');

    loader.style.display = 'flex';
    loaderBox.style.display = 'flex';
    loaderBox.style.position = 'relative';
    loaderBox.style.width = '100vw';
    loaderBox.style.height = '100vh';
    loaderBox.style.backgroundColor = 'rgba(255,255,255,0.5)';

    // const todoId = document.getElementById('todoId').value;
    // console.log(todoId);

    const todoData = {
        title: document.getElementById('todoTitle').value,
        description: document.getElementById('todoDescription').value
    };

    try{
        saveButton.textContent = 'loading.....';
        saveButton.disabled = true;

       

        // if(todoId){
        //     response = await fetch(`${API_URL}/${todoId}`, getRequestOption('PATCH', todoData));
        //     console.log(todoData);
        // } else{
            
        // }


        let response = await fetch(API_URL, getRequestOption('POST', todoData));

        await response.json();

        console.log(response.body);

        toastr.success(todoId ? 'Todo Updated' : 'Todo Created');

        fetchTodos();

        todoModal.hide();

        saveButton.textContent = 'Save Todo';
        saveButton.disabled = false;



    } catch{
        toastr.error('Failed to save todo');
    } finally{
        loader.style.display = 'none';
        loader.style.display = 'none';
        loaderBox.style.display = 'none';
        loaderBox.style.backgroundColor = 'none';

    }


});


document.addEventListener('click',async (e) =>{
    if(e.target.classList.contains('edit-todo')){

        const todoId = e.target.getAttribute('data-id');
        const loader = document.getElementById('loader');
        const loaderBox = document.getElementById('loader_box');
        // const todoTable = document.getElementById('todoTable');
        const saveButton = document.getElementById('saving_button');
        loader.style.display = 'flex';
        loaderBox.style.display = 'flex';
        loaderBox.style.position = 'fixed';
        loaderBox.style.width = '90vw';
        loaderBox.style.height = '100vh';
        loaderBox.style.backgroundColor = 'rgba(255,255,255,0.5)';


        try{
            saveButton.textContent = 'loading.....';
            saveButton.disabled = true;

            const response = await fetch(`${API_URL}/${todoId}`,getRequestOption('GET'));

            const todo = await response.json();

            document.getElementById('todoId').value = todo.id;
            document.getElementById('todoTitle').value = todo.title;
            document.getElementById('todoDescription').value = todo.description;
            
            
            
            document.getElementById('form-tittle').textContent = 'Edit Todo'
            todoModal.show();
            saveButton.textContent = 'Edit Todo';
            saveButton.disabled = false;
        } catch(error){
            toastr.error('Failed to fetch todo details');

        } finally{
            loader.style.display = 'none';
            loaderBox.style.display = 'none';
            loaderBox.style.backgroundColor = 'none';

        }

    }
});

document.addEventListener('click', async (e) =>{
    if (e.target.classList.contains('toggle-status')){

        const loaderBox = document.getElementById('loader_box');
        const todoId = e.target.getAttribute('data-id');
        const loader = document.getElementById('loader');

        loader.style.display = 'flex';
        loaderBox.style.display = 'flex';
        loaderBox.style.position = 'fixed';
        loaderBox.style.width = '90vw';
        loaderBox.style.height = '100vh';
        loaderBox.style.backgroundColor = 'rgba(255,255,255,0.5)';

        const isCurrentlyCompleted = e.target.textContent.trim() === 'Mark as Incomplete';

        try{
            const response = await fetch(`${API_URL}/${todoId}`, getRequestOption('PATCH', {
                isCompleted: !isCurrentlyCompleted
            }));

            const updatedTodo = await response.json();

            e.target.textContent = updatedTodo.isCompleted
            ? 'Mark as Incomplete'
            : 'Mark Completed';

            e.target.classList.toggle('btn-success', !updatedTodo.isCompleted);
            e.target.classList.toggle('btn-warning', updatedTodo.isCompleted);

            toastr.success(`Todo marked as ${updatedTodo.isCompleted ? 'Completed' : 'Incomplete'}`);



            

        } catch(error){
            toastr.error('Failed to update todo status');


        } finally{
            loader.style.display = 'none';
            loaderBox.style.display = 'none';
            loaderBox.style.backgroundColor = 'none';
        }



    }
});


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-todo')) {
        const todoId = e.target.getAttribute('data-id');

        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loaderBox = document.getElementById('loader_box');
                const loader = document.getElementById('loader');
                loader.style.display = 'flex';
                loaderBox.style.display = 'flex';
                loaderBox.style.position = 'fixed';
                loaderBox.style.width = '90vw';
                loaderBox.style.height = '100vh';
                loaderBox.style.backgroundColor = 'rgba(255,255,255,0.5)';

                try {
                    await fetch(`${API_URL}/${todoId}`, getRequestOption('DELETE'));
                    toastr.success('Todo Deleted');
                    fetchTodos();
                } catch (error) {
                    toastr.error('Failed to delete todo');
                } finally {
                    loader.style.display = 'none';
                    loaderBox.style.display = 'none';
                    loaderBox.style.backgroundColor = 'none';
                }
            }
        });
    }
});

fetchTodos();
