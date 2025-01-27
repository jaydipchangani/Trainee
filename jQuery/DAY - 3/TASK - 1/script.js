    const projectOptions = [
        { value: 'JAVA Script Project', label: 'JAVA Script Project' },
        { value: 'React Project', label: 'React Project' },
        { value: 'Node.js Project', label: 'Node.js Project' }
    ];

    const phaseOptions = [
        { value: 'Communication', label: 'Communication' },
        { value: 'Analytics', label: 'Analytics' },
        { value: 'Development', label: 'Development' }
    ];

    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Working', label: 'Working' },
        { value: 'Solved', label: 'Solved' }
    ];

    let rowCounter = 0;

    function createRow() {
        rowCounter++;
        const row = document.createElement('tr');
        row.dataset.id = rowCounter;

        // Project Name
        const projectNameCell = document.createElement('td');
        const projectSelect = document.createElement('select');
        projectSelect.className = 'form-select';
        projectSelect.required = true;
        projectSelect.innerHTML = `
            <option value="">Select Project</option>
            ${projectOptions.map(option => `
                <option value="${option.value}">${option.label}</option>
            `).join('')}
        `;
        projectNameCell.appendChild(projectSelect);

        // TimeLog Date
        const dateCell = document.createElement('td');
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'form-control';
        dateInput.required = true;
        dateCell.appendChild(dateInput);

        // Phase
        const phaseCell = document.createElement('td');
        const phaseSelect = document.createElement('select');
        phaseSelect.className = 'form-select';
        phaseSelect.required = true;
        phaseSelect.innerHTML = `
            <option value="">Select Phase</option>
            ${phaseOptions.map(option => `
                <option value="${option.value}">${option.label}</option>
            `).join('')}
        `;
        phaseCell.appendChild(phaseSelect);

        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.className = 'form-select';
        statusSelect.required = true;
        statusSelect.innerHTML = `
            <option value="">Select Status</option>
            ${statusOptions.map(option => `
                <option value="${option.value}">${option.label}</option>
            `).join('')}
        `;
        statusCell.appendChild(statusSelect);

        // Logged Hours
        const loggedHoursCell = document.createElement('td');
        const loggedHoursInput = document.createElement('input');
        loggedHoursInput.type = 'time';
        loggedHoursInput.className = 'form-control';
        loggedHoursInput.required = true;
        loggedHoursCell.appendChild(loggedHoursInput);

        // Billable Hours
        const billableHoursCell = document.createElement('td');
        const billableHoursInput = document.createElement('input');
        billableHoursInput.type = 'time';
        billableHoursInput.className = 'form-control';
        billableHoursInput.required = true;
        billableHoursCell.appendChild(billableHoursInput);


        

        // Notes
        const notesCell = document.createElement('td');
        const notesInput = document.createElement('input');
        notesInput.type = 'text';
        notesInput.className = 'form-control';
        notesInput.required = true;
        notesCell.appendChild(notesInput);

        // Out of Stock
        const outOfStockCell = document.createElement('td');
        const outOfStockInput = document.createElement('input');
        outOfStockInput.type = 'checkbox';
        outOfStockInput.className = 'form-check-input';
        outOfStockCell.className = 'text-center';
        outOfStockCell.appendChild(outOfStockInput);

        // BC Link
        const bcLinkCell = document.createElement('td');
        const bcLinkInput = document.createElement('input');
        bcLinkInput.type = 'text';
        bcLinkInput.className = 'form-control';
        bcLinkCell.appendChild(bcLinkInput);

        // BC Description
        const bcDescriptionCell = document.createElement('td');
        const bcDescriptionInput = document.createElement('input');
        bcDescriptionInput.type = 'text';
        bcDescriptionInput.className = 'form-control';
        bcDescriptionCell.appendChild(bcDescriptionInput);

        row.append(
            projectNameCell,
            dateCell,
            phaseCell,
            statusCell,
            loggedHoursCell,
            billableHoursCell,
            notesCell,
            outOfStockCell,
            bcLinkCell,
            bcDescriptionCell
        );

        const requiredInputs = row.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('change', () => checkRowCompletion(row));
        });

        return row;
    }

    // checking if the all required fields are filled

    function checkRowCompletion(row) {
        const requiredInputs = row.querySelectorAll('input[required], select[required]');
        const isComplete = Array.from(requiredInputs).every(input => input.value.trim() !== '');
        
        if (isComplete) {
            addNewRow();
            showSucceesspopup();
        }
    }

    // Create a non-editable row to show the data

    function createRowtoShow(editableRow) {
        if (!editableRow) {
            console.error("Editable row is undefined or null", editableRow);
            return; 
        }
        const row = document.createElement('tr');
        Array.from(editableRow.children).forEach((cell, index) => {
            const newCell = document.createElement('td');
            if (index === 7 && cell.firstChild.type === 'checkbox') {
                newCell.textContent = cell.firstChild.checked ? 'Yes' : 'No';
            } 
            else if (cell.firstChild) {
                newCell.textContent = cell.firstChild.value || '';
            } 
            else {
                newCell.textContent = cell.textContent;
            }
            row.appendChild(newCell);
        });
        return row;
    }

    // Add a new row to the editable form table

    function addNewRow() {
        const newRow = createRow(); 
        tableBody.appendChild(newRow); 
    
        const newRowToShow = createRowtoShow(newRow);
        const tableBodyMain = document.getElementById('tablebodymain');
        tableBodyMain.appendChild(newRowToShow);
    
     

        syncRows(newRow, newRowToShow);
        
        
    }
    
    // Add a new row to the non-editable form table
    function addNewRowtoShow() {
        let tablebodymain = document.getElementById('tablebodymain');
        const newRow = createRowtoShow();
        tablebodymain.appendChild(newRow);
    }

    
    // Sync the data between editable and non-editable rows

    function syncRows(editableRow, nonEditableRow) {
 
        const inputs = editableRow.querySelectorAll('input, select');
    
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                const nonEditableCell = nonEditableRow.children[index];
    
      
                if (input.type === 'checkbox') {
                    nonEditableCell.textContent = input.checked ? 'Yes' : 'No';
                } 
                else {
                    nonEditableCell.textContent = input.value || '';
                }
            });
        });
    }
    
    

    
    // Delete the last row from the table
    function deleteLastRow() {
        const rows = tableBody.getElementsByTagName('tr');

        // if (rows.length > 1) {
           
        // }
        tableBody.removeChild(rows[rows.length - 1]);

        const tablebodymain = document.getElementById('tablebodymain');

        const rowsMain = tablebodymain.getElementsByTagName('tr');
        // if (rowsMain.length > 1) {
            
        // }
        tablebodymain.removeChild(rowsMain[rowsMain.length - 1]);
    }

    // Initialize table with first row
    



    // Add multiple rows
    function addMultipleRows(){
        const multiplerows = document.getElementById('multiplerowInput').value;
        console.log(multiplerows);
        for (let i = 0; i < multiplerows; i++) {
            addNewRow();
        }

    }

    // Show Success Popup

    function showSucceesspopup(){
        const popup = document.getElementById('success');
        popup.classList.remove("hide");
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide');
        }, 2000);

    }


    const tableBody = document.getElementById('tableBody');
    addNewRow();


   