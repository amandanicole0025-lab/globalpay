import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ---------------- LOGIN ----------------

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const error = document.getElementById("error");

        if (error) error.textContent = "";

        try {

            await signInWithEmailAndPassword(auth, email, password);

            window.location.replace("admin-dashboard.html");

        } catch (err) {

            if (error) error.textContent = err.message;

        }

    });

}

// ---------------- PROTECT ADMIN PAGES ----------------

const protectedPages = [
    "admin-dashboard.html",
    "create_receipt.html",
    "customer_database.html",
    "payment_receipt_style.html",
    "cancel_receipt.html",
    "cancel_tracking.html",
    "all_receipts.html",
    "profile.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location.replace("admin-login.html");

        }

    });

}

// ---------------- LOGOUT ----------------

async function adminLogout() {

    try {

        await signOut(auth);

    } catch (e) {

        console.error(e);

    }

    window.location.replace("admin-login.html");

}

window.adminLogout = adminLogout;
