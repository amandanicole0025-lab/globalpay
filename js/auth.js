import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try{

        await signInWithEmailAndPassword(auth,email,password);

        window.location="admin-dashboard.html";

    }catch(err){

        document.getElementById("error").innerText=err.message;

    }

});