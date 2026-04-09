window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get values from the form
    const title = document.getElementById("title").value || "Event Invitation";
    const subtitle = document.getElementById("subtitle").value || "";
    const date = document.getElementById("date").value || "";
    const venue = document.getElementById("venue").value || "";

    // Add text to PDF
    doc.setFontSize(22);
    doc.text(title, 105, 40, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(subtitle, 105, 55, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 20, 80);
    doc.text(`Venue: ${venue}`, 20, 90);

    // Save the PDF
    doc.save("VIT_Invitation.pdf");
};

// Guest logic
document.addEventListener("DOMContentLoaded", () => {
    const guestCount = document.getElementById("guestCount");
    const guestFields = document.getElementById("guestFields");
    
    const updateGuests = () => {
        guestFields.innerHTML = "";
        for (let i = 1; i <= guestCount.value; i++) {
            guestFields.innerHTML += `<input type="text" placeholder="Guest ${i} Name" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid #ccc;">`;
        }
    };

    guestCount.addEventListener("change", updateGuests);
    updateGuests();
});
