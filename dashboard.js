document.addEventListener("DOMContentLoaded", function () {
    const sheetURL = "https://script.google.com/macros/s/AKfycbyipMMPg_DM2f6z_uxukDCFq2SLDebYTSZ-_QcjNDzfde67V--BXzGxS1ToeD7WyX3eUA/exec";
    const container = document.getElementById("card-container");
    const loadingMessage = document.getElementById("loading");
    const popup = document.getElementById("confirmation-popup");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    let currentCard = null;
    let appointments = [];

    // Load appointments from local storage on page load
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Fetch appointments from Google Sheets
    fetch(sheetURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            loadingMessage.style.display = "none"; 

            const fetchedAppointments = data.map(entry => {
                if (!entry.Status) {
                    entry.Status = "pending"; 
                }
                return entry;
            });

            appointments = mergeAppointments(storedAppointments, fetchedAppointments);
            renderCards(appointments, "all");
            saveAppointmentsToLocalStorage(appointments);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            loadingMessage.textContent = "Failed to load appointments.";
            loadingMessage.style.color = "#e74c3c";
        });

    function mergeAppointments(stored, fetched) {
        const merged = [...stored];

        fetched.forEach(newEntry => {
            const exists = merged.some(storedEntry => 
                storedEntry.Mobile === newEntry.Mobile 
            );
            if (!exists) {
                merged.push(newEntry);
            }
        });

        return merged;
    }

    function renderCards(filteredAppointments, activeStatus) {
        container.innerHTML = ""; // Clear existing cards
        const appointmentsToRender = filteredAppointments.filter(entry => {
            if (activeStatus === "all") {
                return entry.Status !== "deleted"; // Exclude deleted cards from "All" tab
            }
            return entry.Status === activeStatus; // Filter by active status
        });
    
        appointmentsToRender.forEach(entry => {
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
                <select class="status-dropdown" data-id="${entry.id}">
                    <option value="pending" ${entry.Status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="scheduled" ${entry.Status === "scheduled" ? "selected" : ""}>Scheduled</option>
                    <option value="follow-on" ${entry.Status === "follow-on" ? "selected" : ""}>Follow-On</option>
                    <option value="completed" ${entry.Status === "completed" ? "selected" : ""}>Completed</option>
                    <option value="deleted" ${entry.Status === "deleted" ? "selected" : ""}>Deleted</option>
                </select>
                <i class="fas fa-trash delete-icon" data-id="${entry.id}" style="cursor: pointer; color: red;"></i>
            `;
    
            // Append the card to the container
            container.appendChild(card);
    
            // Add event listener for the status dropdown
            card.querySelector('.status-dropdown').addEventListener('change', function (event) {
                entry.Status = event.target.value; // Update the status in local data
                saveAppointmentsToLocalStorage(appointments); // Save updated appointments to local storage
                renderCards(appointments, "all"); // Re-render cards to reflect changes
            });

            // Add event listener for the delete icon
            card.querySelector('.delete-icon').addEventListener('click', function () {
                currentCard = entry; // Store the current card for deletion confirmation
                popup.style.display = "flex"; // Show the confirmation popup
            });
        });
    }

    function saveAppointmentsToLocalStorage(appointments) {
        localStorage.setItem("appointments", JSON.stringify(appointments)); // Save appointments to local storage
    }

    // Render cards based on stored data if available
    if (storedAppointments.length > 0) {
        appointments = storedAppointments; // Use stored appointments if available
        renderCards(appointments, "all"); // Render cards based on stored data
    }

    // Tab functionality
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            tabButtons.forEach(btn => btn.classList.remove("active")); // Remove active class from all tabs
            button.classList.add("active"); // Add active class to the selected tab
            const status = button.getAttribute("data-status"); // Get status from button attribute
            renderCards(appointments, status); // Render cards based on selected tab
        });
    });

    confirmYes.addEventListener("click", function () {
        if (currentCard) {
            currentCard.Status = "deleted"; // Change the status to deleted
            saveAppointmentsToLocalStorage(appointments); // Save updated appointments to local storage
            renderCards(appointments, "all"); // Re-render cards to reflect changes
            popup.style.display = "none"; // Hide the confirmation popup
        }
    });

    confirmNo.addEventListener("click", function () {
        popup.style.display = "none"; // Hide the confirmation popup
    });

    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none"; // Hide the popup if clicked outside
        }
    });
});