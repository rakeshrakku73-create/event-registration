window.downloadPDF = async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const w = 210; // Page width

    // 1. Get Form Values
    const title = document.getElementById("title").value || "EVENT TITLE";
    const subtitle = document.getElementById("subtitle").value || "SUBTITLE HERE";
    const desc = document.getElementById("description").value || "";
    const date = document.getElementById("date").value || "Date";
    const time = document.getElementById("time").value || "Time";
    const venue = document.getElementById("venue").value || "Venue";
    const faculty = document.getElementById("facultyName").value || "Faculty Name";
    const student = document.getElementById("studentName").value || "Student Name";
    const qrLink = document.getElementById("eventLink").value || "https://vit.ac.in";

    // 2. Top Banner / Logo Area (Placeholder for VIT Logo)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 126);
    doc.setFontSize(22);
    doc.text(title, w / 2, 45, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(subtitle, w / 2, 55, { align: "center" });

    // 3. Description Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitDesc = doc.splitTextToSize(desc, 150);
    doc.text(splitDesc, w / 2, 70, { align: "center" });

    // 4. Coordinator Boxes (Purple/Blue rounded rectangles)
    doc.setFillColor(149, 117, 205); // Purple-ish blue
    doc.roundedRect(25, 230, 75, 25, 10, 10, 'F'); // Faculty box
    doc.roundedRect(110, 230, 75, 25, 10, 10, 'F'); // Student box

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("FACULTY COORDINATOR", 62.5, 238, { align: "center" });
    doc.text("STUDENT COORDINATOR", 147.5, 238, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(faculty, 62.5, 248, { align: "center" });
    doc.text(student, 147.5, 248, { align: "center" });

    // 5. Event Info (Icons & Text)
    doc.setTextColor(0, 0, 0);
    doc.text(`📅  ${date}`, 30, 200);
    doc.text(`🕒  ${time}`, 30, 210);
    doc.text(`📍  ${venue}`, 30, 220);

    // 6. QR Code Section
    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, qrLink);
    
    setTimeout(() => {
        const qrCanvas = qrDiv.querySelector("canvas");
        if (qrCanvas) {
            const qrData = qrCanvas.toDataURL("image/png");
            doc.addImage(qrData, 'PNG', 130, 195, 30, 30);
            doc.setFontSize(8);
            doc.text("Scan for Event Details", 145, 190, { align: "center" });
        }

        // 7. Social Media Footer (Blue Bar)
        doc.setFillColor(30, 136, 229);
        doc.rect(0, 280, 210, 17, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text("Instagram: @vit_event", 15, 290);
        doc.text("Email: events@vit.ac.in", 90, 290);
        doc.text("LinkedIn: VIT University", 160, 290);

        doc.save("VIT_Professional_Invitation.pdf");
    }, 500);
};
