import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ---------- ADMIN LOGIN ----------

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const error = document.getElementById("error");

        error.textContent = "";

        if (!email || !password) {

            error.textContent = "Enter email and password.";
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

// ---------- PAGE PROTECTION ----------

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

            window.location.replace("admin-login.html");

        }

    });

}

// ---------- LOGOUT ----------

window.adminLogout = async function () {

    await signOut(auth);

    window.location.replace("admin-login.html");

};
