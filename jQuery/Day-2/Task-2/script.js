// Define mapping of states to their cities



const stateCityMap = {
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
    Gujarat: ["Ahmedabad", "Surat", "Anand"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
};

// Fill the state dropdown with options from the stateCityMap
const stateDropdown = document.getElementById("state");
const cityDropdown = document.getElementById("city");
Object.keys(stateCityMap).forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateDropdown.appendChild(option);
});

// Handle state selection and update city dropdown accordingly
stateDropdown.addEventListener("change", () => {
    const selectedState = stateDropdown.value;
    cityDropdown.innerHTML = '<option value="" disabled selected>Select City</option>';
    cityDropdown.disabled = false;

    // Add validation styling to state dropdown
    if (selectedState) {
        stateDropdown.classList.add('is-valid');
        stateDropdown.classList.remove('is-invalid');
    } else {
        stateDropdown.classList.add('is-invalid');
        stateDropdown.classList.remove('is-valid');
    }

    // Fill city dropdown with cities from selected state
    stateCityMap[selectedState].forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });

    // Reset city validation and selection
    cityDropdown.classList.remove('is-valid', 'is-invalid');
    cityDropdown.value = "";  
});

// Prevent city selection if no state is selected
// cityDropdown.addEventListener('click', function (event) {
//     const selectedState = stateDropdown.value;

//     // if (!selectedState) {
//     //     event.preventDefault();
//     //     alert('Please select a state first!');
//     //     cityDropdown.classList.add('is-invalid');
//     //     cityDropdown.classList.remove('is-valid');
//     // } else {
//     //     cityDropdown.classList.add('is-valid');
//     //     cityDropdown.classList.remove('is-invalid');
//     // }
// });

// Validate city selection
cityDropdown.addEventListener('change', function () {
    if (this.value && this.value !== 'default') {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});


// Handle date inputs and update study period field
document.getElementById('fromDate').addEventListener('input', updateStudyPeriod);
document.getElementById('tillDate').addEventListener('input', updateStudyPeriod);

function updateStudyPeriod() {
    const fromDate = document.getElementById('fromDate').value;
    const tillDate = document.getElementById('tillDate').value;
    const studyPeriodField = document.getElementById('studyPeriod');
    const invalidFeedback = document.querySelector('.invalid-feedback');

    // Validate dates and update study period field
    if (fromDate && tillDate) {
        if (new Date(fromDate) >= new Date(tillDate)) {
            invalidFeedback.textContent = 'Till date must be after the from date.';
            studyPeriodField.classList.add('is-invalid');
            studyPeriodField.classList.remove('is-valid');
        } else {
            const formattedStudyPeriod = `${fromDate} to ${tillDate}`;
            studyPeriodField.value = formattedStudyPeriod;
            invalidFeedback.textContent = '';
            studyPeriodField.classList.add('is-valid');
            studyPeriodField.classList.remove('is-invalid');
        }
    } else {
        studyPeriodField.value = '';
        studyPeriodField.classList.remove('is-valid', 'is-invalid');
    }
}

// Trigger file input when upload button is clicked
document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('imageUpload').click();
});

// Handle image upload and carousel creation
document.getElementById('imageUpload').addEventListener('change', function (event) {
    const files = event.target.files;
    const carouselImages = document.getElementById('carouselImages');

    // Limit maximum images to 3
    if (carouselImages.children.length >= 3) {
        alert('You can upload a maximum of 3 images.');
        return;
    }

    const remainingImages = 3 - carouselImages.children.length;
    const imagesToAdd = files.length > remainingImages ? remainingImages : files.length;

    // Add images to carousel
    for (let i = 0; i < imagesToAdd; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('d-block', 'w-100', 'carousel-image');
            img.style.height = '400px';
            img.style.objectFit = 'cover';
            img.style.width = '100%';

            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (carouselImages.children.length === 0) {
                carouselItem.classList.add('active');
            }
            carouselItem.appendChild(img);
            carouselImages.appendChild(carouselItem);
        };
        reader.readAsDataURL(file);
    }

    if (files.length > 3) {
        alert('You selected more than 3 images. Only the first 3 images will be added.');
    }
});
document.getElementById('addRowBtn').addEventListener('click', function () {
    // Get all form values
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const college = document.getElementById('college').value;
    const cgpa = document.getElementById('cgpa').value;
    const branch = document.getElementById('branch').value;
    const studyPeriod = document.getElementById('studyPeriod').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const fromDate = document.getElementById('fromDate').value;
    const tillDate = document.getElementById('tillDate').value;

    let isValid = true;

    // Validate each field and apply Bootstrap's validation class
    if (!name) {
        document.getElementById('name').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('name').classList.add('is-valid');
        document.getElementById('name').classList.remove('is-invalid');
    }

    if (!mobile) {
        document.getElementById('mobile').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('mobile').classList.add('is-valid');
        document.getElementById('mobile').classList.remove('is-invalid');
    }

    if (!email) {
        document.getElementById('email').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('email').classList.add('is-valid');
        document.getElementById('email').classList.remove('is-invalid');
    }

    if (!college) {
        document.getElementById('college').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('college').classList.add('is-valid');
        document.getElementById('college').classList.remove('is-invalid');
    }

    if (!cgpa) {
        document.getElementById('cgpa').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('cgpa').classList.add('is-valid');
        document.getElementById('cgpa').classList.remove('is-invalid');
    }

    if (!branch) {
        document.getElementById('branch').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('branch').classList.add('is-valid');
        document.getElementById('branch').classList.remove('is-invalid');
    }

    if (!fromDate) {
        document.getElementById('fromDate').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('fromDate').classList.add('is-valid');
        document.getElementById('fromDate').classList.remove('is-invalid');
    }

    if (!tillDate) {
        document.getElementById('tillDate').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('tillDate').classList.add('is-valid');
        document.getElementById('tillDate').classList.remove('is-invalid');
    }

    if (!state) {
        document.getElementById('state').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('state').classList.add('is-valid');
        document.getElementById('state').classList.remove('is-invalid');
    }

    if (!city) {
        document.getElementById('city').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('city').classList.add('is-valid');
        document.getElementById('city').classList.remove('is-invalid');
    }

    if (!zip) {
        document.getElementById('zip').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('zip').classList.add('is-valid');
        document.getElementById('zip').classList.remove('is-invalid');
    }

    // Validate date range (tillDate must be after fromDate)
    if (new Date(tillDate) < new Date(fromDate)) {
        alert('Till date must be after the from date.');
        isValid = false;
    }

    if (!isValid) {
        return; // If any field is invalid, don't proceed with the form submission
    }

    // Create and save new record if all fields are valid
    const studyPeriodFormatted = `${fromDate} to ${tillDate}`;
    const records = JSON.parse(localStorage.getItem('records')) || [];
    const id = generateId();

    const newRecord = {
        id,
        name,
        mobile,
        email,
        college,
        cgpa,
        branch,
        studyPeriod: studyPeriodFormatted,
        state,
        city,
        zip
    };

    records.push(newRecord);
    localStorage.setItem('records', JSON.stringify(records));
    loadTableData();

    // Reset form and validation states
    document.querySelector('form').reset();
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
    document.querySelectorAll('.form-control').forEach(option => {
        if (option.tagName === "SELECT") {
            option.classList.remove('is-valid', 'is-invalid');
        }
    });
});

// Load saved records into table on page load
window.addEventListener('DOMContentLoaded', loadTableData);

function loadTableData() {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    // Create table rows for each record
    records.forEach((record) => {
        const newRow = tableBody.insertRow();

        // Add data cells
        newRow.insertCell(0).textContent = record.name;
        newRow.insertCell(1).textContent = record.mobile;
        newRow.insertCell(2).textContent = record.email;
        newRow.insertCell(3).textContent = record.college;
        newRow.insertCell(4).textContent = record.cgpa;
        newRow.insertCell(5).textContent = record.branch;
        newRow.insertCell(6).textContent = record.studyPeriod;
        newRow.insertCell(7).textContent = record.state;
        newRow.insertCell(8).textContent = record.city;
        newRow.insertCell(9).textContent = record.zip;

        // Add action buttons (Remove and Edit)
        const actionCell = newRow.insertCell(10);

        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.innerHTML = `<i class="bi bi-archive-fill"></i>`;
       
        removeButton.onclick = function () {
            const updatedRecords = JSON.parse(localStorage.getItem('records')) || [];
            const index = updatedRecords.findIndex((r) => r.id === record.id);
            updatedRecords.splice(index, 1);
            localStorage.setItem('records', JSON.stringify(updatedRecords));
            loadTableData();
        };
        actionCell.appendChild(removeButton);

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-warning', 'mt-1');
        editButton.innerHTML = `<i class="bi bi-pencil-fill"></i>`;
        
        editButton.onclick = function () {
            // Populate form with record data for editing
            document.getElementById('name').value = record.name;
            document.getElementById('mobile').value = record.mobile;
            document.getElementById('email').value = record.email;
            document.getElementById('college').value = record.college;
            document.getElementById('cgpa').value = record.cgpa;
            document.getElementById('branch').value = record.branch;
            document.getElementById('studyPeriod').value = record.studyPeriod;
            document.getElementById('state').value = record.state;
            document.getElementById('city').value = record.city;
            document.getElementById('zip').value = record.zip;
            document.getElementById('fromDate').value = record.studyPeriod.split(' to ')[0];
            document.getElementById('tillDate').value = record.studyPeriod.split(' to ')[1];

            // Switch buttons for edit mode
            const addRowBtn = document.getElementById('addRowBtn');
            addRowBtn.style.display = 'none';
            const saveChangesBtn = document.getElementById('saveChangesBtn');
            saveChangesBtn.style.display = 'inline-block';

            document.getElementById('editRecordId').value = record.id;
        };
        actionCell.appendChild(editButton);
    });
}

// Handle saving changes to edited record
function saveChanges() {
    console.log("Saving changes...");

    const recordId = document.getElementById('editRecordId').value;

    if (!recordId) {
        console.error("No record ID found for editing.");
        return;
    }

    // Create updated record object
    const updatedRecord = {
        id: recordId,
        name: document.getElementById('name').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        college: document.getElementById('college').value,
        cgpa: document.getElementById('cgpa').value,
        branch: document.getElementById('branch').value,
        studyPeriod: document.getElementById('studyPeriod').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value
    };

    console.log("Updated Record: ", updatedRecord);

    // Get and update records in localStorage
    const records = JSON.parse(localStorage.getItem('records')) || [];
    console.log("Records from localStorage: ", records);

    const index = records.findIndex((record) => record.id === updatedRecord.id);
    console.log("Index found: ", index);

    if (index !== -1) {
        console.log("Old record: ", records[index]);
        records[index] = updatedRecord;
        console.log("Updated record at index: ", records[index]);
        localStorage.setItem('records', JSON.stringify(records));
        console.log("Updated records saved to localStorage");
    } else {
        console.log("Record with ID " + updatedRecord.id + " not found.");
    }

    // Reset form and validation states
    document.getElementById('name').value = '';
    document.getElementById('mobile').value = '';
    document.getElementById('email').value = '';
    document.getElementById('college').value = '';
    document.getElementById('cgpa').value = '';
    document.getElementById('branch').value = '';
    document.getElementById('studyPeriod').value = '';
    document.getElementById('state').value = '';
    document.getElementById('city').value = ''; // Reset the value
    document.getElementById('city').disabled = true; // Disable the field
    document.getElementById('zip').value = '';

    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });

    document.querySelectorAll('.form-control').forEach(option => {
        if (option.tagName === "SELECT") {
            option.classList.remove('is-valid', 'is-invalid');
        } else {
            option.classList.remove('is-valid', 'is-invalid');
        }
    });

    // Switch back to add mode
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.style.display = 'none';
    const addRowBtn = document.getElementById('addRowBtn');
    addRowBtn.style.display = 'inline-block';

    loadTableData();
}

// Handle exporting data to Excel
document.getElementById('exportBtn').addEventListener('click', function () {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    if (records.length === 0) {
        alert('No records to export.');
        return;
    }

    // Format data for Excel export
    const data = records.map(record => ({
        Name: record.name,
        Mobile: record.mobile,
        Email: record.email,
        'College Name': record.college,
        CGPA: record.cgpa,
        'Branch Name': record.branch,
        'Study Period': record.studyPeriod,
        State: record.state,
        City: record.city,
        Zip: record.zip
    }));

    // Create and download Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Records');
    XLSX.writeFile(wb, 'records.xlsx');
});
// Form Validation Handlers
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function () {
        if (this.checkValidity()) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });
});

// Mobile Validation
document.getElementById('mobile').addEventListener('input', function () {
    const regex = /^[6-9][0-9]{9}$/;
    if (regex.test(this.value)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});

// CGPA Validation
document.getElementById('cgpa').addEventListener('input', function () {
    let cgpa = this.value;
    if (cgpa.includes('.') && cgpa.split('.')[1].length > 3) {
        cgpa = parseFloat(cgpa).toFixed(3);
        this.value = cgpa;
    }
    if (cgpa >= 0 && cgpa <= 10 && /^[0-9]+(\.[0-9]{1,3})?$/.test(cgpa)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});

// Zip Code Validation
document.getElementById('zip').addEventListener('input', function () {
    const regex = /^[0-9]{6}$/;
    if (regex.test(this.value)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});


function generateId() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomValue = Math.random().toString(36).substr(2, 9); // Generate a random string
    return timestamp + '_' + randomValue; // Combine both parts to form a unique ID
}