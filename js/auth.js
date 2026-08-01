import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ---------------- ADMIN LOGIN ----------------

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const error = document.getElementById("error");

        error.textContent = "";

        if (!email || !password) {

            error.textContent = "Please enter your email and password.";
            return;

        }

        try {

            await signInWithEmailAndPassword(auth, email, password);

            window.location.href = "admin-dashboard.html";

        } catch (e) {

            error.textContent = e.message;

        }

    });

}

// ---------------- PROTECT ADMIN PAGES ----------------

const protectedPages = [
    "admin-dashboard.html",
    "create-receipt.html",
    "customer_database.html",
    "all-receipts.html",
    "profile.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location.href = "admin-login.html";

        }

    });

}

// ---------------- LOGOUT ----------------

async function adminLogout() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout Error:", error);

    }

    window.location.href = "admin-login.html";

}

// Make available to onclick=""
window.adminLogout = adminLogout;
