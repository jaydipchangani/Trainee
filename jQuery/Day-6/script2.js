
$("#submit-btn").on("click", function (event) {
    // Validate the form before proceeding
    if (validateForm(event)) {
        // If form is valid, show success alert
        alert("Form submitted successfully!");

       
    }
});

       document.getElementById("preview-btn").addEventListener("click", (event) => {
    if (!validateForm(event)) {
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Retrieve form values
    const entityName = $("#entityName").val();
    const businessName = $("#businessName").val();
    const taxClassification = $("input[name='taxClassification']:checked").map(function () {
        return $(this).val();
    }).get().join(", ");
    const address = $("#address").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const zipCode = $("#zipCode").val();
    const requesterFirstName = $("#requesterFirstName").val();
    const requesterLastName = $("#requesterLastName").val();
    const requesterAddress = $("#requesterAddress").val();
    const requesterCity = $("#requesterCity").val();
    const requesterState = $("#requesterState").val();
    const submissionDate = $("#submissionDate").val();

    // Collect SSN and EIN
    const ssn = [
        $("input[name='ssn1']").val(),
        $("input[name='ssn2']").val(),
        $("input[name='ssn3']").val(),
        $("input[name='ssn4']").val(),
        $("input[name='ssn5']").val(),
        $("input[name='ssn6']").val(),
        $("input[name='ssn7']").val(),
        $("input[name='ssn8']").val(),
        $("input[name='ssn9']").val()
    ].join('');

    const ein = [
        $("input[name='ein1']").val(),
        $("input[name='ein2']").val(),
        $("input[name='ein3']").val(),
        $("input[name='ein4']").val(),
        $("input[name='ein5']").val(),
        $("input[name='ein6']").val(),
        $("input[name='ein7']").val(),
        $("input[name='ein8']").val(),
        $("input[name='ein9']").val()
    ].join('');

    // Include signature if available
    const signatureData = signaturePad.isEmpty() ? "No signature provided" : "Signature included";

    // Add content to the PDF
    pdf.setFontSize(12);
    pdf.text("Form Preview", 10, 10);
    pdf.text(`Entity Name: ${entityName}`, 10, 20);
    pdf.text(`Business Name: ${businessName}`, 10, 30);
    pdf.text(`Tax Classification: ${taxClassification}`, 10, 40);
    pdf.text(`Address: ${address}`, 10, 50);
    pdf.text(`City: ${city}`, 10, 60);
    pdf.text(`State: ${state}`, 10, 70);
    pdf.text(`ZIP Code: ${zipCode}`, 10, 80);
    pdf.text(`Requester First Name: ${requesterFirstName}`, 10, 90);
    pdf.text(`Requester Last Name: ${requesterLastName}`, 10, 100);
    pdf.text(`Requester Address: ${requesterAddress}`, 10, 110);
    pdf.text(`Requester City: ${requesterCity}`, 10, 120);
    pdf.text(`Requester State: ${requesterState}`, 10, 130);
    pdf.text(`Submission Date: ${submissionDate}`, 10, 140);
    pdf.text(`SSN: ${ssn}`, 10, 150);
    pdf.text(`EIN: ${ein}`, 10, 160);
    pdf.text(`Signature: ${signatureData}`, 10, 170);

    // Add signature image if available
    if (!signaturePad.isEmpty()) {
        const imgData = signaturePad.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 180, 50, 20); // Adjust position and size
    }

    // Preview the PDF in a new window or download
    window.open(pdf.output("bloburl"));
});

const canvas = document.getElementById("signature-pad");
const signaturePad = new SignaturePad(canvas);

// Clear signature pad
document.getElementById("clear").addEventListener("click", () => {
    signaturePad.clear();
});

// Form submission with validation
$("#signatureForm").on("submit", validateForm);

function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    // Clear previous error messages and validation classes
    $(".text-danger").text("");
    $(".form-control").removeClass("is-valid is-invalid");

    // Validation regex patterns
    const namePattern = /^[a-zA-Z\s]+$/; // Letters and spaces only
    const addressPattern = /^[a-zA-Z0-9\s,.-]+$/; // Alphanumeric, spaces, and common special characters
    const cityStatePattern = /^[a-zA-Z\s]+$/; // Letters and spaces only
    const zipPattern = /^\d{5}(-\d{4})?$/; // US ZIP code: 12345 or 12345-6789
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Date in YYYY-MM-DD format
    const ssnPattern = /^\d{3}\d{2}\d{4}$/; // SSN format: 123-45-6789
    const einPattern = /^\d{2}\d{7}$/; // EIN format: 12-3456789

    // Validate Entity Name
    const entityName = $("#entityName").val();
    if (!namePattern.test(entityName)) {
        $("#entityNameError").text("Entity name must contain only letters and spaces.");
        $("#entityName").addClass("is-invalid");
        isValid = false;
    } else {
        $("#entityName").addClass("is-valid");
    }

    // Validate Business Name
    const businessName = $("#businessName").val();
    if (businessName && !namePattern.test(businessName)) {
        $("#businessNameError").text("Business name must contain only letters and spaces.");
        $("#businessName").addClass("is-invalid");
        isValid = false;
    } else {
        $("#businessName").addClass("is-valid");
    }

    // Validate Tax Classification
    const taxClassificationChecked = $("input[name='taxClassification']:checked").length > 0;
    if (!taxClassificationChecked) {
        $("#taxClassificationError").text("Please select at least one tax classification.");
        isValid = false;
    } else {
        $("#taxClassificationError").text(""); // Clear error if valid
    }

    // Validate Address
    const address = $("#address").val();
    if (!addressPattern.test(address)) {
        $("#addressError").text("Address can include letters, numbers, spaces, commas, periods, and hyphens.");
        $("#address").addClass("is-invalid");
        isValid = false;
    } else {
        $("#address").addClass("is-valid");
    }

    // Validate City
    const city = $("#city").val();
    if (!cityStatePattern.test(city)) {
        $("#cityError").text("City must contain only letters and spaces.");
        $("#city").addClass("is-invalid");
        isValid = false;
    } else {
        $("#city").addClass("is-valid");
    }

    // Validate State
    const state = $("#state").val();
    if (!cityStatePattern.test(state)) {
        $("#stateError").text("State must contain only letters and spaces.");
        $("#state").addClass("is-invalid");
        isValid = false;
    } else {
        $("#state").addClass("is-valid");
    }

    // Validate ZIP Code
    const zipCode = $("#zipCode").val();
    if (!zipPattern.test(zipCode)) {
        $("#zipCodeError").text("ZIP code must be in the format 12345 or 12345-6789.");
        $("#zipCode").addClass("is-invalid");
        isValid = false;
    } else {
        $("#zipCode").addClass("is-valid");
    }

    // Validate Requester First Name
    const requesterFirstName = $("#requesterFirstName").val();
    if (!namePattern.test(requesterFirstName)) {
        $("#requesterFirstNameError").text("First name must contain only letters and spaces.");
        $("#requesterFirstName").addClass("is-invalid");
        isValid = false;
    } else {
        $("#requesterFirstName").addClass("is-valid");
    }

    // Validate Requester Last Name
    const requesterLastName = $("#requesterLastName").val();
    if (!namePattern.test(requesterLastName)) {
        $("#requesterLastNameError").text("Last name must contain only letters and spaces.");
        $("#requesterLastName").addClass("is-invalid");
        isValid = false;
    } else {
        $("#requesterLastName").addClass("is-valid");
    }

    // Validate Requester Address
    const requesterAddress = $("#requesterAddress").val();
    if (!addressPattern.test(requesterAddress)) {
        $("#requesterAddressError").text("Requester address can include letters, numbers, spaces, commas, periods, and hyphens.");
        $("#requesterAddress").addClass("is-invalid");
        isValid = false;
    } else {
        $("#requesterAddress").addClass("is-valid");
    }

    // Validate Requester City
    const requesterCity = $("#requesterCity").val();
    if (!cityStatePattern.test(requesterCity)) {
        $("#requesterCityError").text("Requester city must contain only letters and spaces.");
        $("#requesterCity").addClass("is-invalid");
        isValid = false;
    } else {
        $("#requesterCity").addClass("is-valid");
    }

    // Validate Requester State
    const requesterState = $("#requesterState").val();
    if (!cityStatePattern.test(requesterState)) {
        $("#requesterStateError").text("Requester state must contain only letters and spaces.");
        $("#requesterState").addClass("is-invalid");
        isValid = false;
    } else {
        $("#requesterState").addClass("is-valid");
    }

    // Validate Submission Date
    const submissionDate = $("#submissionDate").val();
    if (!datePattern.test(submissionDate)) {
        $("#submissionDateError").text("Submission date must be in YYYY-MM-DD format.");
        $("#submissionDate").addClass("is-invalid");
        isValid = false;
    } else {
        $("#submissionDate").addClass("is-valid");
    }

    // Validate SSN
    const ssn = [
        $("input[name='ssn1']").val(),
        $("input[name='ssn2']").val(),
        $("input[name='ssn3']").val(),
        $("input[name='ssn4']").val(),
        $("input[name='ssn5']").val(),
        $("input[name='ssn6']").val(),
        $("input[name='ssn7']").val(),
        $("input[name='ssn8']").val(),
        $("input[name='ssn9']").val()
    ].join('');

    if (!ssnPattern.test(ssn)) {
        $("#ssnError").text("SSN must be in the format 123-45-6789.");
        isValid = false;
    }

    // Validate EIN
    const ein = [
        $("input[name='ein1']").val(),
        $("input[name='ein2']").val(),
        $("input[name='ein3']").val(),
        $("input[name='ein4']").val(),
        $("input[name='ein5']").val(),
        $("input[name='ein6']").val(),
        $("input[name='ein7']").val(),
        $("input[name='ein8']").val(),
        $("input[name='ein9']").val()
    ].join('');

    if (!einPattern.test(ein)) {
        $("#einError").text("EIN must be in the format 12-3456789.");
        isValid = false;
    }

    // Validate Signature
    if (signaturePad.isEmpty()) {
        alert("Please provide a signature first.");
        isValid = false;
    }

    return isValid;
}
