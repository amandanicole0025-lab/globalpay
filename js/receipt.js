import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ---------- Generate Random String ----------
function randomString(length) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// ---------- Tracking Code ----------
function generateTrackingCode() {
  const d = new Date();

  return `GP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${randomString(6)}`;
}

// ---------- Transaction ID ----------
function generateTransactionID() {
  return "TX-" + randomString(10);
}

// ---------- Elements ----------
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const paymentMethod = document.getElementById("paymentMethod");
const status = document.getElementById("status");
const receiverName = document.getElementById("receiverName");
const accountNumber = document.getElementById("accountNumber");
const actionText = document.getElementById("actionText");
const buttonLink = document.getElementById("buttonLink");

const pAmount = document.getElementById("pAmount");
const pMethod = document.getElementById("pMethod");
const pStatus = document.getElementById("pStatus");
const pReceiver = document.getElementById("pReceiver");
const pAccount = document.getElementById("pAccount");
const pAction = document.getElementById("pAction");

// ---------- Live Preview ----------
function updatePreview() {

  if (pAmount)
    pAmount.textContent =
      currency.value + " " + (amount.value || "0.00");

  if (pMethod)
    pMethod.textContent = paymentMethod.value;

  if (pStatus)
    pStatus.textContent = status.value;

  if (pReceiver)
    pReceiver.textContent =
      receiverName.value || "-";

  if (pAccount)
    pAccount.textContent =
      accountNumber.value || "-";

  if (pAction)
    pAction.textContent =
      actionText.value || "-";

}

[
  amount,
  currency,
  paymentMethod,
  status,
  receiverName,
  accountNumber,
  actionText
].forEach(el => {

  if (!el) return;

  el.addEventListener(
    el.tagName === "SELECT" ? "change" : "input",
    updatePreview
  );

});

updatePreview();

/* ==========================================
SAVE RECEIPT (PROFESSIONAL VERSION)
========================================== */

const saveBtn = document.getElementById("saveReceipt");

const amountError = document.getElementById("amountError");

const currencyError = document.getElementById("currencyError");

const paymentError = document.getElementById("paymentMethodError");

function clearErrors(){

amountError.style.display="none";
currencyError.style.display="none";
paymentError.style.display="none";

}

function showError(element,message){

element.textContent=message;

element.style.display="block";

}

saveBtn.addEventListener("click", async(e)=>{

e.preventDefault();

clearErrors();

let valid=true;

/* ----------------
Amount
---------------- */

if(!amount.value || Number(amount.value)<=0){

showError(

amountError,

"Please enter a valid payment amount."

);

valid=false;

}

/* ----------------
Currency
---------------- */

if(!currency.value){

showError(

currencyError,

"Please choose a currency."

);

valid=false;

}

/* ----------------
Payment Method
---------------- */

if(!paymentMethod.value){

showError(

paymentError,

"Please choose a payment method."

);

valid=false;

}

/* ----------------
Receiver
---------------- */

if(receiverName.value.trim()===""){

receiverName.focus();

valid=false;

}

/* ----------------
Account
---------------- */

if(accountNumber.value.trim()===""){

accountNumber.focus();

valid=false;

}

if(!valid){

return;

}

/* ----------------
Loading
---------------- */

saveBtn.disabled=true;

saveBtn.textContent="Creating Receipt...";

/* ----------------
Receipt Object
---------------- */

const receipt={

trackingCode:generateTrackingCode(),

transactionID:generateTransactionID(),

amount:Number(amount.value),

currency:currency.value,

paymentMethod:paymentMethod.value,

status:status.value,

receiverName:receiverName.value.trim(),

accountNumber:accountNumber.value.trim(),

actionText:actionText.value.trim(),

buttonLink:

buttonLink.value.trim() ||

"splash.html",

createdAt:serverTimestamp()

};

try{

await addDoc(

collection(db,"receipts"),

receipt

);
  /* ==========================================
SUCCESS
========================================== */

saveBtn.textContent = "Receipt Created ✓";

const success = document.createElement("div");

success.style.marginTop = "18px";
success.style.padding = "14px";
success.style.borderRadius = "12px";
success.style.background = "#E8FFF2";
success.style.border = "1px solid #14B45C";
success.style.color = "#0D8B47";
success.style.fontWeight = "700";
success.style.lineHeight = "1.6";

success.innerHTML = `
Receipt created successfully.<br><br>

Tracking Code:<br>
<strong>${receipt.trackingCode}</strong>
`;

const oldSuccess = document.getElementById("successMessage");
if (oldSuccess) oldSuccess.remove();

success.id = "successMessage";

document
.getElementById("receiptForm")
.appendChild(success);

/* Redirect after 2 seconds */

setTimeout(() => {

window.location.href =
"payment_receipt_style.html?tracking=" +
encodeURIComponent(receipt.trackingCode);

},2000);

}

/* ==========================================
ERROR
========================================== */

catch(err){

console.error(err);

saveBtn.disabled = false;

saveBtn.textContent = "Create Receipt";

const oldSuccess = document.getElementById("successMessage");

if(oldSuccess) oldSuccess.remove();

const errorBox = document.createElement("div");

errorBox.id = "successMessage";

errorBox.style.marginTop = "18px";
errorBox.style.padding = "14px";
errorBox.style.borderRadius = "12px";
errorBox.style.background = "#FFF1F2";
errorBox.style.border = "1px solid #DC2626";
errorBox.style.color = "#B91C1C";
errorBox.style.fontWeight = "700";

errorBox.textContent =
"Unable to create receipt. Please try again.";

document
.getElementById("receiptForm")
.appendChild(errorBox);

}

});
});
