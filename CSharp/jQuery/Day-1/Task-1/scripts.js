document.getElementById("calculateButton").addEventListener("click", function (e) {

    e.preventDefault();

    const t1 = document.getElementById("input1").value;
    const t2 = document.getElementById("input2").value;
    const t3 = document.getElementById("input3").value;


    if (isNaN(t1) || isNaN(t2) || isNaN(t3) || t1 === "" || t2 === "" || t3 === "" || t1 <= 0 || t2 <= 0 || t3 <= 0 || t1.length > 9 || t2.length > 9 || t3.length > 9) {
        document.getElementById("input4").value = "Inputs T1, T2, T3 should be a valid number between 1 and 999999999 and cannot be empty or zero.";
    } else {


        if (t1 < 1 || t1 > 999999999 || t2 < 1 || t2 > 999999999 || t3 < 1 || t3 > 999999999) {
            document.getElementById("input4").value = "Please Enter Numbers Between 1 - 999999999 for T1, T2, and T3.";
        } else {

            const mid = parseFloat(t1) + parseFloat(t2);
            const result = (parseFloat(t1) + parseFloat(t2)) + "|" + t3 + "|" + mid + t3;

            document.getElementById("input4").value = result;
        }
    }
});
