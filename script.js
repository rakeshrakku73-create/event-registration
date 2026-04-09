document.addEventListener("DOMContentLoaded", function () {
    const guestCount = document.getElementById("guestCount");
    const guestFields = document.getElementById("guestFields");
    function generateFields(count) {
        guestFields.innerHTML = "";
        for (let i = 1; i <= count; i++) {
            guestFields.innerHTML += `<input type="text" class="guestName" placeholder="Guest ${i} Name">`;
        }
    }
    generateFields(parseInt(guestCount.value));
    guestCount.addEventListener("change", function () { generateFields(parseInt(this.value)); });
});

window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(22);
    pdf.text(document.getElementById("title").value, 105, 40, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(document.getElementById("subtitle").value, 105, 50, { align: "center" });
    pdf.save("Invitation.pdf");
};
