import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const table = document.getElementById("receiptTable");

const totalReceipts = document.getElementById("totalReceipts");

const pendingReceipts = document.getElementById("pendingReceipts");

const completedReceipts = document.getElementById("completedReceipts");

const cancelledReceipts = document.getElementById("cancelledReceipts");

const searchInput = document.getElementById("search");

let receipts = [];

loadReceipts();

async function loadReceipts() {

    try {

        const q = query(

            collection(db, "receipts"),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        receipts = [];

        snapshot.forEach(doc => {

            receipts.push({

                id: doc.id,

                ...doc.data()

            });

        });

        updateCards();

        displayReceipts(receipts);

    }

    catch (error) {

        console.error(error);

        table.innerHTML = `

        <tr>

            <td colspan="6">

                Failed to load receipts

            </td>

        </tr>

        `;

    }

}

function updateCards() {

    totalReceipts.textContent = receipts.length;

    pendingReceipts.textContent = receipts.filter(r =>

        r.status === "Payment Pending"

    ).length;

    completedReceipts.textContent = receipts.filter(r =>

        r.status === "Payment Completed"

    ).length;

    cancelledReceipts.textContent = receipts.filter(r =>

        r.status === "Payment Cancelled"

    ).length;

}

function displayReceipts(data) {

    if (data.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6">

                No receipts found

            </td>

        </tr>

        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(receipt => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${receipt.trackingCode}</td>

        <td>${receipt.receiverName}</td>

        <td>${receipt.currency} ${receipt.amount}</td>

        <td>${receipt.status}</td>

        <td>${
            receipt.createdAt
                ? receipt.createdAt.toDate().toLocaleDateString()
                : "-"
        }</td>

        <td>

            <button

                onclick="window.location='payment_receipt_style.html?tracking=${receipt.trackingCode}'">

                View

            </button>

        </td>

        `;

        table.appendChild(row);

    });

}

searchInput.addEventListener("keyup", () => {

    const keyword = searchInput.value.toLowerCase();

    const filtered = receipts.filter(r =>

        (r.trackingCode || "").toLowerCase().includes(keyword)

        ||

        (r.receiverName || "").toLowerCase().includes(keyword)

    );

    displayReceipts(filtered);

});