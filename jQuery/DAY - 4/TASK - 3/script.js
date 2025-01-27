document.getElementById('method').addEventListener('change', () =>{
    const method = document.getElementById('method').value;

    const bodyField = document.getElementById('bodyfield');
    const headersField = document.getElementById('headersField');

    const bodyInput = document.getElementById('body');
    const headersInput = document.getElementById('headers');

    if(method === 'GET' || method === 'DELETE'){
        bodyInput.value = '';
        headersInput.value = '';
        bodyField.classList.remove('show');
        bodyField.classList.add('hide');
        headersField.classList.remove('show');
        headersField.classList.add('hide');
    } else{
        bodyField.classList.add('show');
        headersField.classList.add('show');

    }
})

function makeRequest() {
    const url = document.getElementById('url').value;
    const method = document.getElementById('method').value;
    const bodyText = document.getElementById('body').value;
    const headersText = document.getElementById('headers').value;

    if (!url || !method) {
        alert('field is required!');
        return;
    }

    if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && !bodyText) {
        alert('Body is required for POST, PUT, and PATCH methods!');
        return;
    }

    // if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && !headersText) {
    //     alert('Headers are required for POST, PUT, and PATCH methods!');
    //     return;
    // }

    let body = null;
    let headers = {"Content-Type":"application/json"};

    if(bodyText){
        try{
            body = JSON.parse(bodyText);
        } catch{
            document.getElementById('response').textContent = 'Invalid JSON in Body';
            return;
        }
    }

    if (headersText) {
        try {
          headers = JSON.parse(headersText);
        } catch (error) {
          document.getElementById('response').textContent = 'Invalid JSON in Headers';
          return;
        }
      }

      fetch(url,{
        method : method,
        headers : headers,
        body:body?JSON.stringify(body):null
      }).then((response) =>{
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then((data) =>{
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
      }).catch((error) =>{
        document.getElementById('response').textContent = 'Error: ' + error.message;
      })

}

