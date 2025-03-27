document.addEventListener("DOMContentLoaded", () => {
    let currentTab = 0; // Pehla tab dikhana hai
    showTab(currentTab); // Current tab dikhana hai

    // Tabs ko dikhana/hidden karne ki function
    function showTab(n) {
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach((tab, index) => (tab.style.display = index === n ? "block" : "none")); // Current tab ko dikhana aur baaki ko hide karna
        document.getElementById("prevBtn").style.display = n === 0 ? "none" : "inline"; // Previous button ko show ya hide karna
        document.getElementById("nextBtn").innerHTML = n === (tabs.length - 1) ? "Submit" : "Next"; // Last tab pe Submit button dikhana
        fixStepIndicator(n);
    }

    // Agle ya pichhle step pe move karne ka function
    function nextPrev(n) {
        const tabs = document.querySelectorAll(".tab");
        if (n === 1 && !validateForm()) {
            console.log("Validation failed. Current tab pe hi raho.");
            return false; // Agar form valid nahi hai to wapas current tab pe raho
        }
        currentTab += n; // Tab index ko increment ya decrement karna

        if (currentTab === tabs.length - 1) {
            console.log("User details generate ho rahe hain...");
            generateSummary(); // User details generate karna
        }

        if (currentTab >= tabs.length) {
            console.log("Form submit ho gaya.");
            document.getElementById("regForm").submit(); // Form ko submit karna
            return false;
        }

        showTab(currentTab);
    }

    // Har field pe live validation karna
    function validateForm() {
        const currentInputs = document.querySelectorAll(".tab")[currentTab].querySelectorAll("input, select");
        let valid = true;

        currentInputs.forEach(input => {
            console.log(`Validating input: ${input.id}, value: ${input.value}`);
            if (!input.checkValidity()) {
                input.classList.add("is-invalid");
                input.classList.remove("is-valid");
                console.log(`Invalid input: ${input.id}`);
                valid = false;
            } else {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            }
        });

        if (currentTab === 1) { // Password match validation
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            console.log(`Password: ${password}, Confirm Password: ${confirmPassword}`);

            if (password !== confirmPassword) {
                document.getElementById("confirmPassword").classList.add("is-invalid");
                console.log("Passwords match nahi karte.");
                valid = false;
            } else {
                document.getElementById("confirmPassword").classList.remove("is-invalid");
                console.log("Passwords match karte hain.");
            }
        }

        return valid; // Agar form valid hai to true return karo
    }

    // Step indicator ko update karna
    function fixStepIndicator(n) {
        const steps = document.querySelectorAll(".step");
        steps.forEach((step, index) => {
            step.classList.remove("active");
            if (index === n) step.classList.add("active");
        });

        console.log(`Step indicator ko update kiya gaya hai: ${n}`);
    }

    // User input ka summary generate karna
    function generateSummary() {
        const userDetailsTable = document.getElementById("userDetails");
        if (!userDetailsTable) {
            console.error("User details table nahi mila!");
            return;
        }

        // userDetailsTable.innerHTML = ""; // Purani rows ko clear karna

        const formData = {
            "First Name": document.getElementById("firstName").value,
            "Last Name": document.getElementById("lastName").value,
            "Gender": document.getElementById("gender").value,
            "Zip Code": document.getElementById("zipCode").value,
            "Email": document.getElementById("email").value,
            "Phone": document.getElementById("phone").value,
            "Username": document.getElementById("username").value,
            "Bank": document.getElementById("bank").value,
            "Branch": document.getElementById("branch").value,
            "Account Number": document.getElementById("accountNumber").value,
            "Card Type": document.getElementById("cardType").value,
            "Cardholder Name": document.getElementById("cardHolder").value,
            "Card Number": document.getElementById("cardNumber").value,
            "CVV": document.getElementById("cvv").value,
            "Expiry Date": document.getElementById("expiryDate").value
        };

        console.log("Form Data Collected:", formData);

        for (const [key, value] of Object.entries(formData)) {
            const row = `<tr>
                            <td><strong>${key}</strong></td>
                            <td>${value}</td>
                         </tr>`;
            userDetailsTable.innerHTML += row;

            console.log(`Row added for ${key}: ${value}`);
        }
    }

    // Button ke events ko attach karna
    document.getElementById("prevBtn").addEventListener("click", () => {
        console.log("Previous button clicked.");
        nextPrev(-1);
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
        console.log("Next button clicked.");
        nextPrev(1);
    });

    // Input fields pe live validation event listener lagaana
    document.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", () => {
            validateForm();
        });
    });
});


