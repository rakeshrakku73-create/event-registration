const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Show an alert so you know the button was clicked
    alert("Generating Invitation... Please wait a few seconds.");

    try {
        const title = document.getElementById("title").value || "EVENT TITLE";
        const subtitle = document.getElementById("subtitle").value || "";
        const desc = document.getElementById("description").value || "";
        const date = document.getElementById("date").value || "";
        const time = document.getElementById("time").value || "";
        const venue = document.getElementById("venue").value || "";
        const faculty = document.getElementById("facultyName").value || "Faculty";
        const student = document.getElementById("studentName").value || "Student";

        // Background & Borders
        doc.setFillColor(252, 252, 255);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setDrawColor(26, 35, 126);
        doc.setLineWidth(1);
        doc.rect(5, 5, 200, 287);

        // Header
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 35, 126);
        doc.setFontSize(24);
        doc.text(title.toUpperCase(), 105, 30, { align: "center" });

        // Guest Photos (The main reason for crashes)
        doc.setFillColor(30, 136, 229);
        doc.roundedRect(25, 80, 75, 90, 5, 5, 'F');
        doc.roundedRect(110, 80, 75, 90, 5, 5, 'F');

        const g1 = document.getElementById("guest1Photo").files[0];
        if (g1) {
            const b1 = await getBase64(g1);
            doc.addImage(b1, 'JPEG', 35, 85, 55, 50);
        }

        const g2 = document.getElementById("guest2Photo").files[0];
        if (g2) {
            const b2 = await getBase64(g2);
            doc.addImage(b2, 'JPEG', 120, 85, 55, 50);
        }

        // Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 30, 200);
        doc.text(`Time: ${time}`, 30, 210);
        doc.text(`Venue: ${venue}`, 30, 220);

        // QR Code
        const qrData = `Event: ${title}\nVenue: ${venue}`;
        const qrDiv = document.createElement("div");
        new QRCode(qrDiv, { text: qrData, width: 100, height: 100 });

        setTimeout(() => {
            const canvas = qrDiv.querySelector("canvas");
            if (canvas) {
                const img = canvas.toDataURL("image/png");
                doc.addImage(img, 'PNG', 140, 190, 40, 40);
            }
            
            // Bottom Boxes
            doc.setFillColor(149, 117, 205);
            doc.roundedRect(25, 250, 75, 20, 5, 5, 'F');
            doc.roundedRect(110, 250, 75, 20, 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text(faculty, 62.5, 263, { align: "center" });
            doc.text(student, 147.5, 263, { align: "center" });

            doc.save("Final_Invitation.pdf");
        }, 1000);

    } catch (err) {
        alert("Error: " + err.message);
    }
};
