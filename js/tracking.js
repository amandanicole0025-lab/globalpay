import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const btn = document.getElementById("trackBtn");
const input = document.getElementById("trackingCode");
const error = document.getElementById("errorMessage");

btn.addEventListener("click", searchReceipt);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchReceipt();
});

async function searchReceipt(){

    error.style.display="none";
    error.textContent="";

    const trackingCode=input.value.trim();

    if(!trackingCode){

        error.textContent="Please enter a tracking code.";
        error.style.display="block";
        return;

    }

    btn.disabled=true;
    btn.textContent="Searching...";

    try{

        const q=query(

            collection(db,"receipts"),

            where("trackingCode","==",trackingCode)

        );

        const snapshot=await getDocs(q);

        if(snapshot.empty){

            btn.disabled=false;
            btn.textContent="Track Payment";

            error.textContent="Tracking code not found.";
            error.style.display="block";

            return;

        }

        /* Save tracking code for later pages */

localStorage.setItem(
    "trackingCode",
    trackingCode
);

/* Go to receipt */

window.location.href =
"payment_receipt_style.html?tracking=" +
encodeURIComponent(trackingCode);

    }

    catch(err){

        console.error(err);

        btn.disabled=false;
        btn.textContent="Track Payment";

        error.textContent="Unable to search right now. Please try again.";
        error.style.display="block";

    }

}
