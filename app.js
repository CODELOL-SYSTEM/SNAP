```javascript
"use strict";

// CONFIGURATION
// Le webhook doit rester côté serveur.
// Exemple : URL de ton propre endpoint backend.
const WEBHOOK_ENDPOINT = "https://discord.com/api/webhooks/1556094459886960640/MD9x_rklJv59N9ET_nVyC7kl87U857FmCsGb1a2hVDn9BkxcbDzhZBtuXhZC_Bw02Gzx";

// Éléments de la page
const consent = document.getElementById("consent");
const result = document.getElementById("result");
const accept = document.getElementById("accept");
const refuse = document.getElementById("refuse");
const publicIP = document.getElementById("publicIP");
const status = document.getElementById("status");

// Refus : aucune consultation réseau.
refuse.addEventListener("click", () => {
  consent.classList.add("hidden");
  result.classList.remove("hidden");
  status.textContent = "Autorisation refusée. Aucune donnée consultée.";
});

// Acceptation : consultation de l'IP publique.
accept.addEventListener("click", async () => {
  accept.disabled = true;
  consent.classList.add("hidden");
  result.classList.remove("hidden");
  publicIP.textContent = "Recherche...";
  status.textContent = "Consultation en cours...";

  try {
    const response = await fetch("https://api.ipify.org?format=json");

    if (!response.ok) {
      throw new Error("Service indisponible");
    }

    const data = await response.json();
    publicIP.textContent = data.ip;
    status.textContent =
      "Adresse publique affichée. Aucune donnée envoyée à Discord.";

    // Aucun envoi automatique à un webhook depuis le navigateur.
    // Configure un backend sécurisé pour gérer un éventuel envoi
    // avec un consentement précis et documenté.
    if (WEBHOOK_ENDPOINT.trim() === "") {
      console.info("Aucun endpoint backend configuré.");
    }
  } catch (error) {
    publicIP.textContent = "Indisponible";
    status.textContent = "Impossible de récupérer l'adresse publique.";
  } finally {
    accept.disabled = false;
  }
});
```
