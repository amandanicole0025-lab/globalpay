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

// ---------- Save ----------
document
.getElementById("saveReceipt")
.addEventListener("click", async () => {

  if (!amount.value) {
    alert("Enter Amount");
    return;
  }

  if (!receiverName.value.trim()) {
    alert("Enter Receiver Name");
    return;
  }

  if (!accountNumber.value.trim()) {
    alert("Enter Account Number");
    return;
  }

  const receipt = {

    trackingCode: generateTrackingCode(),

    transactionID: generateTransactionID(),

    amount: Number(amount.value),

    currency: currency.value,

    paymentMethod: paymentMethod.value,

    status: status.value,

    receiverName: receiverName.value,

    accountNumber: accountNumber.value,

    actionText: actionText.value,

    buttonLink: buttonLink.value,

    createdAt: serverTimestamp()

  };

  try {

    await addDoc(collection(db, "receipts"), receipt);

    alert(
      "Receipt created successfully.\n\nTracking Code:\n\n" +
      receipt.trackingCode
    );

    window.location.href =
"payment_receipt_style.html?tracking=" +
receipt.trackingCode;

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

});