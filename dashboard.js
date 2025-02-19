document.addEventListener("DOMContentLoaded", function () {
    const sheetURL = "https://script.google.com/macros/s/AKfycbyipMMPg_DM2f6z_uxukDCFq2SLDebYTSZ-_QcjNDzfde67V--BXzGxS1ToeD7WyX3eUA/exec";
    const container = document.getElementById("card-container");
    const loadingMessage = document.getElementById("loading");
    const popup = document.getElementById("confirmation-popup");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    let currentCard = null;

    fetch(sheetURL)
        .then(response => response.json())
        .then(data => {
            loadingMessage.style.display = "none";

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
                    <select class="status-dropdown">
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="follow-on">Follow-On</option>
                        <option value="completed">Completed</option>
                    </select>
                `;

                const dropdown = card.querySelector(".status-dropdown");
                dropdown.value = entry.Status || "pending";

                dropdown.addEventListener("change", function (event) {
                    if (event.target.value === "completed") {
                        currentCard = card;
                        popup.style.display = "flex";
                    }
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            loadingMessage.textContent = "Failed to load appointments.";
            loadingMessage.style.color = "#e74c3c";
        });

    confirmYes.addEventListener("click", function () {
        if (currentCard) {
            const dropdown = currentCard.querySelector(".status-dropdown");
            dropdown.value = "completed";
            popup.style.display = "none";
            currentCard = null;
        }
    });

    confirmNo.addEventListener("click", function () {
        if (currentCard) {
            const dropdown = currentCard.querySelector(".status-dropdown");
            dropdown.value = "pending";
            popup.style.display = "none";
            currentCard = null;
        }
    });
});