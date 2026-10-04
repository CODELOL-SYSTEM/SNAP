"use strict";

// ============================================================
// DÉBLOQUE EXOPOGATIUIT - APP.JS
// ============================================================

// Récupération des éléments HTML
const startButton = document.getElementById("startButton");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");
const closeButton = document.getElementById("closeButton");

const consentModal = document.getElementById("consentModal");
const result = document.getElementById("result");

const publicIP = document.getElementById("publicIP");
const status = document.getElementById("status");

// Vérification des éléments
if (
    !startButton ||
    !confirmButton ||
    !cancelButton ||
    !closeButton ||
    !consentModal ||
    !result ||
    !publicIP ||
    !status
) {
    console.error(
        "❌ Erreur : un ou plusieurs éléments HTML sont introuvables."
    );
} else {

    // ========================================================
    // BOUTON COMMENCER
    // ========================================================

    startButton.addEventListener("click", function () {
        consentModal.classList.remove("hidden");
    });


    // ========================================================
    // BOUTON REFUSER
    // ========================================================

    cancelButton.addEventListener("click", function () {
        consentModal.classList.add("hidden");

        result.classList.add("visible");

        publicIP.textContent = "Non récupérée";

        status.textContent =
            "❌ Autorisation refusée. Aucune adresse IP n'a été consultée.";
    });


    // ========================================================
    // BOUTON AUTORISER
    // ========================================================

    confirmButton.addEventListener("click", async function () {

        // Ferme la fenêtre
        consentModal.classList.add("hidden");

        // Affiche le résultat
        result.classList.add("visible");

        // État de chargement
        publicIP.textContent = "Recherche...";

        status.textContent =
            "📡 Récupération de votre adresse IP publique...";

        // Empêche les doubles clics
        confirmButton.disabled = true;

        try {

            // Récupération de l'IP publique
            const response = await fetch(
                "https://api.ipify.org?format=json",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

            // Vérification de la réponse
            if (!response.ok) {
                throw new Error(
                    "Impossible de récupérer l'adresse IP."
                );
            }

            // Conversion JSON
            const data = await response.json();

            // Vérification de l'IP
            if (!data || !data.ip) {
                throw new Error(
                    "Aucune adresse IP n'a été retournée."
                );
            }

            // Affichage de l'IP
            publicIP.textContent = data.ip;

            status.textContent =
                "✅ Adresse IP récupérée avec votre autorisation.";

        } catch (error) {

            console.error(
                "Erreur lors de la récupération de l'IP :",
                error
            );

            publicIP.textContent =
                "Impossible à récupérer";

            status.textContent =
                "❌ Impossible de récupérer votre adresse IP. Vérifiez votre connexion.";
        }

        // Réactive le bouton
        confirmButton.disabled = false;
    });


    // ========================================================
    // BOUTON FERMER
    // ========================================================

    closeButton.addEventListener("click", function () {

        result.classList.remove("visible");

    });


    // ========================================================
    // TOUCHE ESC
    // ========================================================

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            consentModal.classList.add("hidden");

            result.classList.remove("visible");

        }

    });


    // ========================================================
    // MESSAGE DE CHARGEMENT
    // ========================================================

    console.log(
        "✅ DÉBLOQUE EXOPOGATIUIT : app.js chargé correctement."
    );
}
