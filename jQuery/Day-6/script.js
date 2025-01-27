function validateAllFields() {
    let allFieldsFilled = true;
    const requiredFields = document.querySelectorAll("input, select");
  
    requiredFields.forEach((field) => {
      if (field.type !== "button" && field.value.trim() === "") {
        allFieldsFilled = false;
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
      } else {
        field.classList.add("is-valid");
        field.classList.remove("is-invalid");
      }
    });
  
    return allFieldsFilled;
  }
  
  function toggleButtons() {
    const previewButton = document.querySelector(".btn-secondary");
    const submitButton = document.querySelector(".btn-success");
  
    if (validateAllFields()) {
      previewButton.disabled = false;
      submitButton.disabled = false;
    } else {
      previewButton.disabled = true;
      submitButton.disabled = true;
    }
  }
  
  document.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", toggleButtons);
  });
  
  toggleButtons();
  
  function generatePDF() {
    if (!validateAllFields()) {
      alert("Please fill in all fields before previewing the PDF.");
      return;
    }
  
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const name = document.getElementById("name").value;
    const country = document.getElementById("country").value;
    const address1 = document.getElementById("address1").value;
    const address2 = document.getElementById("address2").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;
    const taxnum = document.getElementById("taxnum").value;
    const refnum = document.getElementById("refnum").value;
    const dob = document.getElementById("dob").value;
  
    doc.setFont("helvetica");
    doc.setFontSize(12);
  
    doc.text("Certificate of Foreign Status of Beneficial Owner", 20, 20);
  
    doc.text(`1. Name: ${name}`, 20, 30);
    doc.text(`2. Country of Citizenship: ${country}`, 20, 40);
    doc.text(`3. Permanent Address: ${address1} ${address2}`, 20, 50);
    doc.text(`   City: ${city}, State: ${state}, Zip: ${zip}`, 20, 60);
    doc.text(`6. Foreign Tax Identifying Number: ${taxnum}`, 20, 70);
    doc.text(`7. Reference Number(s): ${refnum}`, 20, 80);
    doc.text(`8. Date of Birth: ${dob}`, 20, 90);
  
    doc.text("Part II: Claim of Tax Treaty Benefits", 20, 100);
    doc.text("Part III: Certification", 20, 110);
  
    doc.save("form_preview.pdf");
  }
  
  document.querySelector(".btn-secondary").addEventListener("click", generatePDF);
  
  const canvas = document.getElementById("sign-pad");
  const signaturePad = new SignaturePad(canvas);
  
  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear();
  }
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  
  document.getElementById("clear-btn").addEventListener("click", () => {
    signaturePad.clear();
  });
  
  function validateField(field) {
    if (field.value.trim() === "") {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
    } else {
      field.classList.add("is-valid");
      field.classList.remove("is-invalid");
    }
  }
  
  document.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });
  
  document.querySelector(".btn-success").addEventListener("click", function () {
    if (!validateAllFields()) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    alert("Form submitted successfully!");
    document.getElementById("myForm").reset();
  });
  
  function copyAddress() {
    const isChecked = document.getElementById("sameAsAbove").checked;
  
    if (isChecked) {
      document.getElementById("address1Copy").value =
        document.getElementById("address1").value;
      document.getElementById("address2Copy").value =
        document.getElementById("address2").value;
      document.getElementById("cityCopy").value =
        document.getElementById("city").value;
      document.getElementById("stateCopy").value =
        document.getElementById("state").value;
      document.getElementById("zipCopy").value =
        document.getElementById("zip").value;
  
      document.getElementById("address1Copy").disabled = true;
      document.getElementById("address2Copy").disabled = true;
      document.getElementById("cityCopy").disabled = true;
      document.getElementById("stateCopy").disabled = true;
      document.getElementById("zipCopy").disabled = true;
      // document.getElementById('countryCopy').disabled = true;
    } else {
      document.getElementById("address1Copy").value = "";
      document.getElementById("address2Copy").value = "";
      document.getElementById("cityCopy").value = "";
      document.getElementById("stateCopy").value = "";
      document.getElementById("zipCopy").value = "";
      document.getElementById("countryCopy").value = "";
  
      document.getElementById("address1Copy").disabled = false;
      document.getElementById("address2Copy").disabled = false;
      document.getElementById("cityCopy").disabled = false;
      document.getElementById("stateCopy").disabled = false;
      document.getElementById("zipCopy").disabled = false;
      document.getElementById("countryCopy").disabled = false;
    }
  }
  