document.addEventListener("DOMContentLoaded", function () {
    const sheetURL = "https://script.google.com/macros/s/AKfycbyipMMPg_DM2f6z_uxukDCFq2SLDebYTSZ-_QcjNDzfde67V--BXzGxS1ToeD7WyX3eUA/exec"; // Replace with your actual URL
    const container = document.getElementById("card-container");
    const loadingMessage = document.getElementById("loading");

    fetch(sheetURL)
        .then(response => response.json())
        .then(data => {
            loadingMessage.style.display = "none"; // Hide loading message when data loads

            data.forEach(entry => {
                const card = document.createElement("div");
                card.classList.add("card");

                card.innerHTML = `
                    <h3>${entry.Name || "No Name"}</h3>
                    <p><strong>Class:</strong> ${entry.Class || "N/A"}</p>
                    <p><strong>Mobile:</strong> ${entry.Mobile || "N/A"}</p>
                    <p><strong>Country:</strong> ${entry.Country || "N/A"}</p>
                    <p><strong>Course:</strong> ${entry.Course || "N/A"}</p>
                    <p><strong>Foundation Year:</strong> ${entry.FoundationYear || "N/A"}</p>
                    <p><strong>Subjects:</strong> ${entry.Subjects || "N/A"}</p>
                    <p><strong>Additional Info:</strong> ${entry.AdditionalInfo || "N/A"}</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            loadingMessage.textContent = "Failed to load appointments.";
            loadingMessage.style.color = "#e74c3c";
        });
});