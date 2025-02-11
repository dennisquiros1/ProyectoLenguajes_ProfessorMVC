$(document).ready(function () {
const modals = document.querySelectorAll('.custom-modal');
const closeButtons = document.querySelectorAll('.custom-modal-close');
const navigationBar = document.getElementById('navBar');
const profileNav = document.getElementById('profileNav');
const profileModal = document.getElementById('profileModal');
const newsModal = document.getElementById('newsModal');
const mailNav = document.getElementById('emailNav');
const mailModal = document.getElementById('emailModal');
const discussionButton = document.getElementById('discussionButton');
const courseModal = document.getElementById('courseModal');

function openModal(modal) {
    modal.style.display = 'flex';
    navigationBar.style.display = 'none';
}

function closeModal(modal) {
    modal.style.display = 'none';
    navigationBar.style.display = 'block';
}

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.custom-modal');
        closeModal(modal);
    });
});

window.addEventListener('click', (event) => {
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

profileNav.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(profileModal);
});

const moreAboutLinks = document.querySelectorAll(".more-about-link");
moreAboutLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(newsModal);
    });
});

mailNav.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(mailModal);
});

discussionButton.addEventListener('click', () => {
    openModal(courseModal);
});
});
