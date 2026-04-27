document.addEventListener('DOMContentLoaded', () => {
    let mockUsers = {
        'admin': { username: 'admin', role: 'admin', password: 'adminpassword' },
        'premium': { username: 'premium', role: 'premium', password: 'premiumpassword' },
        'free': { username: 'free', role: 'user', password: 'freepassword' }
    };

    let mockBooks = [
        { id: 1, title: 'Enduring Love', author: 'Ian McEwan', section: 'Novels' },
        { id: 2, title: 'The Ruins', author: 'Scott Smith', section: 'Novels' },
        { id: 3, title: 'The Dreadfuls', author: 'A. Rae Dunlap', section: 'Novels' },
        { id: 4, title: 'Heart of Darkness', author: 'Joseph Conrad', section: 'Novels' },
        { id: 5, title: 'Fundamentals of Physics', author: 'Jearl Walker', section: 'Scientific Books' },
        { id: 6, title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', section: 'Scientific Books' },
        { id: 7, title: 'Atomic Habits', author: 'James Clear', section: 'Personal Development' },
        { id: 8, title: 'Pharaohs of Ancient Egypt', author: 'Billy Wellman', section: 'History' },
        { id: 9, title: 'History of Greece', author: 'Billy Wellman', section: 'History' },
        { id: 10, title: 'History of Iran', author: 'Billy Wellman', section: 'History' }
    ];
    let nextBookId = 11;

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            console.error("Error reading user data from localStorage", e);
            return null;
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = window.location.pathname.includes('/admin/') ? '../index.html' : 'index.html';
    }

    function updateNavbar() {
        const navAuth = document.querySelector('.nav-auth');
        if (!navAuth) return;

        const currentUser = getCurrentUser();

        if (currentUser) {
            navAuth.innerHTML = `
                <span style="color: var(--text-secondary); margin-right: 15px;">Welcome, ${currentUser.username}</span>
                <a href="#" id="logoutBtn" class="btn-login">Logout</a>
            `;
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            navAuth.innerHTML = `
                <a href="login.html" class="btn-login">Login</a>
            `;
        }
    }

    const currentPagePath = window.location.pathname;

    if (currentPagePath.endsWith('/login.html') && !currentPagePath.includes('/admin/')) {
        const loginForm = document.querySelector('form.lr-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const usernameInput = document.getElementById('user-log');
                const username = usernameInput ? usernameInput.value : '';
                
                const user = Object.values(mockUsers).find(u => u.username === username && u.role !== 'admin');

                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert(`Welcome, ${user.username}!`);

                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectUrl = urlParams.get('redirect');

                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        window.location.href = 'books.html';
                    }
                } else {
                    alert('Invalid credentials. Please try again. (Note: Admins cannot log in here)');
                }
            });
        }
    }

    if (currentPagePath.includes('/admin/login.html')) {
        const adminLoginForm = document.querySelector('form.admin-form');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const usernameInput = document.getElementById('user-logadmin');
                const username = usernameInput ? usernameInput.value : '';
                const user = mockUsers[username];

                if (user && user.role === 'admin') {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'admin_dashboard.html';
                } else {
                    alert('Invalid admin credentials.');
                }
            });
        }
    }

    if (currentPagePath.endsWith('/register.html')) {
        const registerForm = document.querySelector('form.lr-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const usernameInput = document.getElementById('user-reg');
                const username = usernameInput ? usernameInput.value : '';

                if (!username) {
                    alert('Username cannot be empty.');
                    return;
                }

                if (mockUsers[username]) {
                    alert('Username already exists! Please choose another name.');
                    return;
                }
                
                const newUser = { username: username, role: 'user', password: 'password' };
                mockUsers[username] = newUser;
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                
                alert('Registration successful! You are now registered as a free user.');
                window.location.href = 'books.html';
            });
        }
    }

    if (currentPagePath.endsWith('/books.html')) {
        const currentUser = getCurrentUser();
        const booksList = document.getElementById('booksList');
        const accessDeniedContainer = document.getElementById('accessDeniedContainer');

        if (booksList && accessDeniedContainer) {
            if (currentUser && currentUser.role === 'premium') {
                booksList.style.display = 'block';
                accessDeniedContainer.style.display = 'none';
            } else {
                booksList.style.display = 'none';
                accessDeniedContainer.style.display = 'block';

                let messageHTML = '';
                if (currentUser) {
                    messageHTML = `<h2 style="margin-bottom: 16px;">Upgrade to Premium to Access Books</h2><p style="max-width: 600px; margin: 0 auto 24px;">Your current plan does not allow access to the book library. Please upgrade to enjoy unlimited reading.</p><a href="pricing.html" class="btn" style="background: var(--accent); color: #fff;">View Pricing Plans</a>`;
                } else {
                    messageHTML = `<h2 style="margin-bottom: 16px;">Please Log In to Access Books</h2><p style="max-width: 600px; margin: 0 auto 24px;">You must have a Premium account to view our library. Please log in or create an account.</p><a href="login.html" class="btn" style="background: var(--accent); color: #fff;">Login Now</a>`;
                }
                accessDeniedContainer.innerHTML = `<div style="text-align: center; padding: 50px 20px; background: var(--bg-card); border-radius: var(--radius); margin: 40px 0; border: 1px solid var(--border);">${messageHTML}</div>`;
            }
        }
    }
    
    if (currentPagePath.includes('/admin/admin_dashboard.html')) {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Access denied. You must be logged in as an admin to view this page.');
            window.location.href = '../index.html'; // Redirect to the main homepage
        }
    }

    if (currentPagePath.includes('/admin/users.html')) {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Access denied. You must be logged in as an admin to view this page.');
            window.location.href = '../login.html';
            return;
        }

        const usersTableBody = document.getElementById('usersTableBody');
        if (usersTableBody) {
            usersTableBody.innerHTML = '';
            for (const key in mockUsers) {
                const user = mockUsers[key];
                const row = `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>${user.password}</td>
                    </tr>
                `;
                usersTableBody.innerHTML += row;
            }
        }
    }

    if (currentPagePath.includes('/admin/admin_dashboard.html')) {
        const bookTableBody = document.querySelector('.admin-table tbody');
        const addBookForm = document.querySelector('.add-book-section form');

        function renderBooksTable() {
            bookTableBody.innerHTML = '';
            mockBooks.forEach(book => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', book.id);
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.section}</td>
                    <td>
                        <button class="btn-delete">Delete</button>
                    </td>
                `;
                bookTableBody.appendChild(row);
            });
        }

        addBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newBook = {
                id: nextBookId++,
                title: document.getElementById('book-name').value,
                author: document.getElementById('book-author').value,
                section: document.getElementById('book-Section').value,
            };
            mockBooks.push(newBook);
            renderBooksTable();
            addBookForm.reset();
            alert('Book added successfully!');
        });

        bookTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('Are you sure you want to delete this book?')) {
                    const row = e.target.closest('tr');
                    const bookId = parseInt(row.getAttribute('data-id'));
                    mockBooks = mockBooks.filter(book => book.id !== bookId);
                    renderBooksTable();
                    alert('Book deleted successfully!');
                }
            }
        });

        renderBooksTable();
    }

    updateNavbar();

    if (currentPagePath.endsWith('/pricing.html')) {
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentUser = getCurrentUser();

                if (currentUser) {
                    if (currentUser.role === 'premium') {
                        alert('You are already a premium member!');
                    } else {
                        window.location.href = 'checkout.html';
                    }
                } else {
                    alert('Please log in to proceed to checkout.');
                    window.location.href = `login.html?redirect=checkout.html`;
                }
            });
        }
    }

    if (currentPagePath.endsWith('/checkout.html')) {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            alert('You must log in to view this page.');
            window.location.href = 'login.html?redirect=checkout.html';
            return;
        }

        if (currentUser.role === 'premium') {
            alert('You are already a premium member.');
            window.location.href = 'books.html';
            return;
        }

        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your purchase! Your account has been upgraded to Premium.');

                const updatedUser = { ...currentUser, role: 'premium' };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                window.location.href = 'books.html';
            });
        }
    }

    if (currentPagePath.endsWith('/request-book.html')) {
        const requestForm = document.getElementById('requestForm');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Your book request has been submitted successfully. We will review it shortly.');
                requestForm.reset();
            });
        }
    }

    if (currentPagePath.endsWith('/support.html')) {
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Your support ticket has been sent. Our team will get back to you soon.');
                supportForm.reset();
            });
        }
    }

    function highlightActiveNav() {
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '') {
            currentPage = 'index.html';
        }

        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    updateNavbar();
    highlightActiveNav();
});