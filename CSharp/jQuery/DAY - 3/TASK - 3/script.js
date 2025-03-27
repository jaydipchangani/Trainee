document.getElementById('taxForm').addEventListener('submit', (e) => {
    // Check if the form is valid using the browser's built-in validation
    if (!e.target.checkValidity()) {
        e.preventDefault(); // Prevent submission
        e.stopPropagation(); // Stop further event handling
        e.target.classList.add('was-validated'); // Add Bootstrap validation styling
        return;
    }

    e.preventDefault(); // Prevent actual form submission for custom handling

    // Calculate Age
    const birthdate = new Date(document.getElementById('birthdate').value);
    const age = new Date().getFullYear() - birthdate.getFullYear();
    console.log('Age: ', age); // Log age

    // Get Form Values
    const income = Number(document.getElementById('income').value);
    const loan = Number(document.getElementById('loan').value);
    const investment = Number(document.getElementById('investment').value);
    const gender = document.getElementById('gender').value;
    console.log('Income: ', income); // Log income
    console.log('Loan: ', loan); // Log loan amount
    console.log('Investment: ', investment); // Log investment amount
    console.log('Gender: ', gender); // Log gender

    // Tax Slabs
    let noTax, lowTax;
    if (age >= 60) {
        noTax = 300000;
        lowTax = 700000;
    } else if (gender === 'female') {
        noTax = 260000;
        lowTax = 700000;
    } else {
        noTax = 240000;
        lowTax = 600000;
    }
    console.log('No Tax Limit: ', noTax); // Log no tax limit
    console.log('Low Tax Limit: ', lowTax); // Log low tax limit

    // Calculate Exemptions
    const loanExemption = Math.min(0.8 * loan, 0.2 * income);
    console.log('Loan Exemption: ', loanExemption); // Log loan exemption
    const investmentExemption = Math.min(investment, 100000);
    console.log('Investment Exemption: ', investmentExemption); // Log investment exemption

    // Calculate Taxable Income
    const taxableIncome = income - loanExemption - investmentExemption;
    console.log('Taxable Income: ', taxableIncome); // Log taxable income

    // Calculate Tax
    let tax = 0;
    if (taxableIncome > noTax) {
        tax = taxableIncome <= lowTax
            ? (taxableIncome) * 0.1
            :  (taxableIncome) * 0.2;
    }
    console.log('Calculated Tax: ', tax); // Log calculated tax

    // Show Results
    const resultSection = document.getElementById('taxResult');
    resultSection.innerHTML = `
        <h4>Tax Calculation Results</h4>
        <p>Category: ${age >= 60 ? 'Senior Citizen' : gender === 'female' ? 'Woman' : 'Man'}</p>
        <p>Gross Income: ₹${income.toLocaleString()}</p>
        <p>Loan Exemption: ₹${loanExemption.toLocaleString()}</p>
        <p>Investment Exemption: ₹${investmentExemption.toLocaleString()}</p>
        <p><strong>Taxable Income: ₹${taxableIncome.toLocaleString()}</strong></p>
        <p><strong>Tax Payable: ₹${tax.toLocaleString()}</strong></p>
    `;
    resultSection.style.display = 'block'; // Display result section
});