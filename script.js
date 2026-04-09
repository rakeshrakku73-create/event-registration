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

    // 1. TOP LOGO GENERATOR LOGIC
    const topLogoFile = document.getElementById("topLogo").files[0];
    if (topLogoFile) {
        const logoBase64 = await getBase64(topLogoFile);
        // Places logo at the top center
        doc.addImage(logoBase64, 'PNG', 85, 10, 40, 20); 
    } else {
        // Fallback text if no logo is uploaded
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 35, 126);
        doc.setFontSize(20);
        doc.text("VIT", 105, 20, { align: "center" });
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 32, 195, 32);

    // 2. EVENT TITLES
    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "SUBTITLE";

    doc.setFontSize(24);
    doc.setTextColor(26, 35, 126);
    doc.text(title.toUpperCase(), 105, 45, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 105, 55, { align: "center" });

    // 3. GUEST CARDS
    doc.setFillColor(30, 136, 229);
    doc.roundedRect(25, 95, 75, 95, 8, 8, 'F');
    doc.roundedRect(110, 95, 75, 95, 8, 8, 'F');

    const g1 = document.getElementById("guest1Photo").files[0];
    if (g1) { doc.addImage(await getBase64(g1), 'JPEG', 32.5, 100, 60, 55); }
    const g2 = document.getElementById("guest2Photo").files[0];
    if (g2) { doc.addImage(await getBase64(g2), 'JPEG', 117.5, 100, 60, 55); }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text((document.getElementById("guest1Name").value || "GUEST 1").toUpperCase(), 62.5, 170, { align: "center" });
    doc.text((document.getElementById("guest2Name").value || "GUEST 2").toUpperCase(), 147.5, 170, { align: "center" });

    // 4. EVENT DETAILS
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`DATE  : ${document.getElementById("date").value || "TBA"}`, 25, 215);
    doc.text(`TIME  : ${document.getElementById("time").value || "TBA"}`, 25, 225);
    doc.text(`VENUE : ${document.getElementById("venue").value || "TBA"}`, 25, 235);

    // 5. QR CODE
    const qrData = `EVENT: ${title}\nVENUE: ${document.getElementById("venue").value}`;
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, { text: qrData, width: 128, height: 128 });

    setTimeout(() => {
        const canvas = qrDiv.querySelector("canvas");
        if (canvas) { doc.addImage(canvas.toDataURL("image/png"), 'PNG', 145, 205, 35, 35); }

        // 6. COORDINATORS (FIXED LABELS + NAMES)
        doc.setFillColor(149, 117, 205);
        doc.roundedRect(25, 250, 75, 28, 10, 10, 'F');
        doc.roundedRect(110, 250, 75, 28, 10, 10, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("FACULTY COORDINATOR", 62.5, 258, { align: "center" });
        doc.text("STUDENT COORDINATOR", 147.5, 258, { align: "center" });
        
        doc.setFontSize(11);
        doc.text((document.getElementById("facultyName").value || "NAME").toUpperCase(), 62.5, 268, { align: "center" });
        doc.text((document.getElementById("studentName").value || "NAME").toUpperCase(), 147.5, 268, { align: "center" });

        // 7. FOOTER
        doc.setFillColor(30, 136, 229);
        doc.rect(0, 288, 210, 9, 'F');
        doc.setFontSize(8);
        doc.text("instagram: @vit_university", 20, 294);
        doc.text("email: events@vit.ac.in", 105, 294, { align: "center" });

        doc.save("VIT_Official_Invitation.pdf");
    }, 600);
};
