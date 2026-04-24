# Campus Connect — Setup Guide (XAMPP)

## Prerequisites
- XAMPP installed (https://www.apachefriends.org/)
- All files placed in: `C:\xampp\htdocs\campus-connect\`

---

## Step 1 — Import the Database

1. Open XAMPP Control Panel → Start **Apache** and **MySQL**
2. Open your browser → go to: `http://localhost/phpmyadmin`
3. Click **Import** (top menu)
4. Click **Choose File** → select `campus-connect/db/campus_connect.sql`
5. Click **Go** — the `campus_connect` database and `users` table will be created

---

## Step 2 — Configure Database (if needed)

Open `db/config.php` and update if your XAMPP uses a different username/password:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');   // change if different
define('DB_PASS', '');       // change if you set a password
define('DB_NAME', 'campus_connect');
```

---

## Step 3 — Access the Site

Open your browser and go to:

```
http://localhost/campus-connect/
```

---

## Default Admin Account

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@campusconnect.com      |
| Password | Admin@1234                   |
| Role     | Admin                        |

> **Change this password after first login** (via phpMyAdmin → users table).

---

## Pages Added

| Page            | URL                                      | Description                  |
|-----------------|------------------------------------------|------------------------------|
| Login           | `/login.html`                            | Email + password login       |
| Sign Up         | `/signup.html`                           | Register a student account   |
| Profile         | `/profile.html`                          | View name, strand, role      |
| Admin Panel     | `/admin/index.html`                      | Protected — admin only       |

---

## File Structure

```
campus-connect/
├── db/
│   ├── campus_connect.sql   ← Import this into phpMyAdmin
│   └── config.php           ← DB credentials
├── php/
│   ├── login.php            ← POST: email, password
│   ├── signup.php           ← POST: name, email, strand, password, password2
│   ├── logout.php           ← Destroys session, redirects to login
│   └── profile.php          ← GET: returns logged-in user JSON
├── js/
│   └── auth-nav.js          ← Injects Login/Profile button in navbar
├── login.html
├── signup.html
├── profile.html
├── index.html               ← Updated navbar with auth button
└── admin/
    └── index.html           ← Protected — redirects to login if not admin
```

---

## How It Works

- **Signup** → creates a `student` account in the `users` table (bcrypt hashed password)
- **Login** → PHP verifies credentials, starts a server session, stores lightweight user info in `localStorage` for the navbar
- **Profile page** → shows Name, Email, Strand, Account Type (Admin or Student), and join date
- **Admin panel** → guarded by a JS check on `localStorage`; if not admin, redirects to login
- **Logout** → clears both the PHP session and `localStorage`
