import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const button = document.getElementById("cancelTrackBtn");

button.addEventListener("click", async () => {

    const trackingCode = document
        .getElementById("trackingCode")
        .value
        .trim();

    if (!trackingCode) {

        alert("Please enter a tracking code.");

        return;

    }

    try {

        const q = query(

            collection(db, "receipts"),

            where("trackingCode", "==", trackingCode)

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("Tracking code not found.");

            return;

        }

        window.location.href =
            "cancel_receipt.html?tracking=" +
            encodeURIComponent(trackingCode);

    }

    catch (error) {

        console.error(error);

        alert("Error: " + error.message);

    }

});