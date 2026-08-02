import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const button = document.getElementById("cancelTrackBtn");
const input = document.getElementById("trackingCode");
const error = document.getElementById("errorMessage");

button.addEventListener("click", searchReceipt);

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        searchReceipt();

    }

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

    button.disabled=true;
    button.textContent="Searching...";

    try{

        const q=query(

            collection(db,"receipts"),

            where("trackingCode","==",trackingCode)

        );

        const snapshot=await getDocs(q);

        if(snapshot.empty){

            button.disabled=false;
            button.textContent="Search Payment";

            error.textContent="Tracking code not found.";
            error.style.display="block";

            return;

        }

        window.location.href=
        "cancel_receipt.html?tracking="+
        encodeURIComponent(trackingCode);

    }

    catch(err){

        console.error(err);

        button.disabled=false;
        button.textContent="Search Payment";

        error.textContent="Unable to search right now. Please try again.";
        error.style.display="block";

    }

}
