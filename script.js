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
    const w = 210;

    // 1. LOGO SECTION
    const topLogoFile = document.getElementById("topLogo").files[0];
    if (topLogoFile) {
        doc.addImage(await getBase64(topLogoFile), 'PNG', 85, 8, 40, 20);
    } else {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 35, 126);
        doc.setFontSize(20);
        doc.text("VIT", 105, 18, { align: "center" });
    }
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 30, 195, 30);

    // 2. DATA COLLECTION
    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "SUBTITLE";
    const desc = document.getElementById("description").value || "";
    const date = document.getElementById("date").value || "TBA";
    const venue = document.getElementById("venue").value || "TBA";

    // 3. DRAW TITLES & DESCRIPTION
    doc.setFontSize(22);
    doc.setTextColor(26, 35, 126);
    doc.text(title.toUpperCase(), 105, 42, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle.toUpperCase(), 105, 49, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitDesc = doc.splitTextToSize(desc, 160); 
    doc.text(splitDesc, 105, 60, { align: "center" });

    // 4. GUEST CARDS
    doc.setFillColor(30, 136, 229);
    doc.roundedRect(25, 95, 75, 95, 8, 8, 'F');
    doc.roundedRect(110, 95, 75, 95, 8, 8, 'F');

    const g1 = document.getElementById("guest1Photo").files[0];
    if (g1) { doc.addImage(await getBase64(g1), 'JPEG', 32.5, 100, 60, 55); }
    const g2 = document.getElementById("guest2Photo").files[0];
    if (g2) { doc.addImage(await getBase64(g2), 'JPEG', 117.5, 100, 60, 55); }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text((document.getElementById("guest1Name").value || "NAME").toUpperCase(), 62.5, 170, { align: "center" });
    doc.text((document.getElementById("guest2Name").value || "NAME").toUpperCase(), 147.5, 170, { align: "center" });

    // 5. EVENT DETAILS
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`DATE  : ${date}`, 25, 215);
    doc.text(`TIME  : ${document.getElementById("time").value || "TBA"}`, 25, 225);
    doc.text(`VENUE : ${venue}`, 25, 235);

    // 6. --- UPGRADED SMART QR CODE ---
    // Includes Description, Title, and Venue
    const qrData = `EVENT: ${title}\nABOUT: ${desc}\nWHERE: ${venue}\nWHEN: ${date}`;
    const qrDiv = document.createElement("div");
    
    new QRCode(qrDiv, { 
        text: qrData, 
        width: 256, 
        height: 256,
        correctLevel: QRCode.CorrectLevel.M 
    });

    setTimeout(() => {
        const canvas = qrDiv.querySelector("canvas");
        if (canvas) { doc.addImage(canvas.toDataURL("image/png"), 'PNG', 145, 205, 35, 35); }

        // 7. COORDINATORS
        doc.setFillColor(149, 117, 205);
        doc.roundedRect(25, 250, 75, 30, 10, 10, 'F');
        doc.roundedRect(110, 250, 75, 30, 10, 10, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text("FACULTY COORDINATOR", 62.5, 257, { align: "center" });
        doc.text("STUDENT COORDINATOR", 147.5, 257, { align: "center" });
        doc.setFontSize(10);
        doc.text((document.getElementById("facultyName").value || "NAME").toUpperCase(), 62.5, 266, { align: "center" });
        doc.text((document.getElementById("studentName").value || "NAME").toUpperCase(), 147.5, 266, { align: "center" });
        doc.setFontSize(8);
        doc.text(document.getElementById("facultyPhone").value || "", 62.5, 274, { align: "center" });
        doc.text(document.getElementById("studentPhone").value || "", 147.5, 274, { align: "center" });

        // 8. FOOTER
        doc.setFillColor(30, 136, 229);
        doc.rect(0, 288, 210, 9, 'F');

        doc.save("VIT_Smart_Invitation.pdf");
    }, 800); // Increased delay slightly to handle the larger QR data
};
