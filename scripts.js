document.addEventListener('DOMContentLoaded', function () {
    // Show/hide navigation links based on login status
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loginLink.classList.add('hidden');
        registerLink.classList.add('hidden');
        logoutLink.classList.remove('hidden');
    } else {
        loginLink.classList.remove('hidden');
        registerLink.classList.remove('hidden');
        logoutLink.classList.add('hidden');
    }

    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html'; // Redirect to main page
        });
    }
});

// Profile Page Script
if (document.body.classList.contains('profile-page')) {
    function displayProfile() {
        let user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            document.getElementById('profile-name').textContent = `Name: ${user.name}`;
            document.getElementById('profile-email').textContent = `Email: ${user.email}`;
            document.getElementById('profile-phone').textContent = `Phone: ${user.phone || 'N/A'}`;
        } else {
            alert('You need to be logged in to view this page.');
            window.location.href = 'login.html'; // Redirect to login page if not logged in
        }
    }

    function displayAppointments() {
        let user = JSON.parse(localStorage.getItem('loggedInUser'));
        let appointmentsContainer = document.getElementById('appointments-container');
        appointmentsContainer.innerHTML = ''; // Clear previous content

        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        let userBookings = bookings.filter(booking => booking.email === user.email);

        if (userBookings.length === 0) {
            appointmentsContainer.innerHTML = '<p>You have no upcoming bookings.</p>';
            return;
        }

        userBookings.forEach(booking => {
            let div = document.createElement('div');
            div.classList.add('booking-item');
            div.innerHTML = `
                <p>Date: ${booking.date}</p>
                <p>Time: ${booking.time}</p>
                <p>Service: ${booking.service}</p>
                <button class="delete-booking-btn" data-date="${booking.date}" data-time="${booking.time}">Cancel</button>
            `;
            appointmentsContainer.appendChild(div);
        });
    }

    document.getElementById('appointments-container').addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-booking-btn')) {
            let date = e.target.getAttribute('data-date');
            let time = e.target.getAttribute('data-time');
            let user = JSON.parse(localStorage.getItem('loggedInUser'));

            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings = bookings.filter(booking => !(booking.email === user.email && booking.date === date && booking.time === time));
            localStorage.setItem('bookings', JSON.stringify(bookings));

            displayAppointments(); // Refresh the appointments display
        }
    });

    window.addEventListener('load', function () {
        displayProfile();
        displayAppointments();
    });
}

// Login Page Script
if (document.body.classList.contains('login-page')) {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            let user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'profile.html'; // Redirect to profile page on successful login
            } else {
                alert('Invalid email or password.');
            }
        });
    }
}

// Register Page Script
if (document.body.classList.contains('register-page')) {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            let existingUser = users.find(u => u.email === email);

            if (existingUser) {
                alert('User already exists.');
            } else {
                users.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful!');
                window.location.href = 'login.html'; // Redirect to login page after successful registration
            }
        });
    }
}




