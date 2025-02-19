const scriptURL = 'https://script.google.com/macros/s/AKfycbxDg-yF6EL23L3EgHF3JgLzeu-RIlfEo9qoFMzswsLQDz9J1wEu-r5m9iZDUkm14gGXDw/exec';
const form = document.forms['booking-form'];
const submitButton = form.querySelector('button[type="submit"]'); 


document.getElementById('bookNowBtn').addEventListener('click', function () {
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
});


const successPopup = document.getElementById('successPopup');
const closeBtn = document.querySelector('.close-btn');


function showPopup() {
    successPopup.style.display = 'flex'; 
}


function hidePopup() {
    successPopup.style.display = 'none'; 
}


closeBtn.addEventListener('click', hidePopup);


window.addEventListener('click', function (event) {
    if (event.target === successPopup) {
        hidePopup();
    }
});

form.addEventListener('submit', e => {
    e.preventDefault();

    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            showPopup();
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('There was an error submitting your form. Please try again.');
        })
        .finally(() => {
            
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit';
        });
});
