import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ================= ADMIN LOGIN =================

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

            const credential = await signInWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "pendingLogins", credential.user.uid), {
                uid: credential.user.uid,
                email: credential.user.email,
                status: "pending",
                createdAt: serverTimestamp()
            });

            // DO NOT REDIRECT YET.
            // Next step will show the loading spinner on this same page.

        } catch (e) {
            error.textContent = e.message;
        }

    });

}


// ================= PAGE PROTECTION =================

// Hide page until authentication check finishes
document.documentElement.style.visibility = "hidden";

const protectedPages = [
    "admin-dashboard",
    "admin-dashboard.html",
    "create_receipt",
    "create_receipt.html",
    "customer_database",
    "customer_database.html",
    "all-receipts",
    "all-receipts.html",
    "profile",
    "profile.html"
];

const currentPage = window.location.pathname.toLowerCase();

const requiresLogin = protectedPages.some(page =>
    currentPage.endsWith(page)
);

if (requiresLogin) {

    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.replace("admin-login.html");
            return;
        }

        // Authenticated
        document.documentElement.style.visibility = "visible";

    });

} else {

    document.documentElement.style.visibility = "visible";

}


// ================= LOGOUT =================

async function adminLogout() {

    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }

    window.location.replace("admin-login.html");

}

window.adminLogout = adminLogout;
