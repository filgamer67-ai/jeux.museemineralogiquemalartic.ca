"use strict";

/*
    Fonctions d'affichage de l'interface.
    Ce fichier ne décide pas si une réponse est correcte.
    Il construit les éléments visibles.
*/

/**
 * Vide la zone principale du jeu.
 */
function viderZoneJeu() {
    const zoneJeu = document.getElementById("jeu");

    zoneJeu.innerHTML = "";
}


/**
 * Affiche l'écran d'accueil dans la zone de jeu.
 */
function afficherAccueil() {
    const zoneJeu = document.getElementById("jeu");

    zoneJeu.innerHTML = `
        <div class="ecran-accueil">
            <h2>Bienvenue !</h2>

            <p>
                Termine les trois quêtes pour remplir ta barre
                de progression.
            </p>

            <p>
                Commence par la quête 1 : Vrai ou Faux.
            </p>
        </div>
    `;
}


/**
 * Affiche une question et ses boutons de réponse.
 *
 * @param {Object} quete - La quête sélectionnée.
 * @param {Object} question - La question à afficher.
 * @param {number} numeroQuestion - Position actuelle.
 * @param {number} totalQuestions - Nombre total de questions.
 * @param {Function} fonctionReponse - Fonction appelée au clic.
 */
function afficherQuestion(
    quete,
    question,
    numeroQuestion,
    totalQuestions,
    fonctionReponse
) {
    const zoneJeu = document.getElementById("jeu");

    zoneJeu.innerHTML = "";

    const conteneur = document.createElement("div");
    conteneur.className = "conteneur-question";

    const petitTitre = document.createElement("p");
    petitTitre.className = "numero-question";
    petitTitre.textContent =
        `Question ${numeroQuestion} sur ${totalQuestions}`;

    const titre = document.createElement("h2");
    titre.textContent = quete.titre;

    const texteQuestion = document.createElement("p");
    texteQuestion.className = "texte-question";
    texteQuestion.textContent = question.texte;

    const zoneReponses = document.createElement("div");
    zoneReponses.className = "zone-reponses";

    question.reponses.forEach((reponse, index) => {
        const bouton = document.createElement("button");

        bouton.type = "button";
        bouton.className = "bouton-reponse";
        bouton.textContent = reponse;
        bouton.dataset.index = index;

        bouton.addEventListener("click", () => {
            fonctionReponse(index, bouton);
        });

        zoneReponses.appendChild(bouton);
    });

    const zoneMessage = document.createElement("div");
    zoneMessage.id = "messageReponse";
    zoneMessage.className = "message-reponse";
    zoneMessage.setAttribute("aria-live", "polite");

    conteneur.appendChild(petitTitre);
    conteneur.appendChild(titre);
    conteneur.appendChild(texteQuestion);
    conteneur.appendChild(zoneReponses);
    conteneur.appendChild(zoneMessage);

    zoneJeu.appendChild(conteneur);
}


/**
 * Affiche la correction après une réponse.
 *
 * @param {boolean} estCorrecte
 * @param {string} explication
 */
function afficherCorrection(estCorrecte, explication) {
    const zoneMessage = document.getElementById("messageReponse");

    if (!zoneMessage) {
        return;
    }

    zoneMessage.className = estCorrecte
        ? "message-reponse message-correct"
        : "message-reponse message-incorrect";

    zoneMessage.textContent = explication;
}


/**
 * Désactive tous les boutons de réponse.
 */
function desactiverBoutonsReponse() {
    const boutons = document.querySelectorAll(".bouton-reponse");

    boutons.forEach((bouton) => {
        bouton.disabled = true;
    });
}


/**
 * Ajoute un bouton pour passer à la question suivante.
 *
 * @param {string} texte
 * @param {Function} action
 */
function afficherBoutonContinuer(texte, action) {
    const zoneMessage = document.getElementById("messageReponse");

    if (!zoneMessage) {
        return;
    }

    const boutonContinuer = document.createElement("button");

    boutonContinuer.type = "button";
    boutonContinuer.className = "bouton-continuer";
    boutonContinuer.textContent = texte;

    boutonContinuer.addEventListener("click", action);

    zoneMessage.appendChild(boutonContinuer);
}


/**
 * Affiche l'écran de fin d'une quête.
 *
 * @param {Object} quete
 * @param {number} pointsGagnes
 * @param {Function} retourMenu
 * @param {boolean} existeQueteSuivante
 */
function afficherFinQuete(
    quete,
    pointsGagnes,
    retourMenu,
    existeQueteSuivante
) {
    const zoneJeu =
        document.getElementById("jeu");

    const messageProgression =
        existeQueteSuivante
            ? "La quête suivante est maintenant déverrouillée."
            : "Félicitations ! Tu as terminé les trois quêtes du Musée.";

    const iconeFin =
        existeQueteSuivante
            ? "✅"
            : "🏆";

    zoneJeu.innerHTML = `
        <div class="fin-quete">

            <div class="icone-reussite">
                ${iconeFin}
            </div>

            <h2>
                Quête terminée !
            </h2>

            <p>
                Tu as terminé la quête
                <strong>${quete.titre}</strong>.
            </p>

            <p class="points-gagnes">
                Points gagnés : ${pointsGagnes}
            </p>

            <p>
                ${messageProgression}
            </p>

        </div>
    `;

    const boutonRetour =
        document.createElement("button");

    boutonRetour.type =
        "button";

    boutonRetour.className =
        "bouton-retour";

    boutonRetour.textContent =
        "Retourner au menu";

    boutonRetour.addEventListener(
        "click",
        retourMenu
    );

    zoneJeu
        .querySelector(".fin-quete")
        .appendChild(boutonRetour);
}


/**
 * Met à jour le texte du score.
 *
 * @param {number} score
 */
function afficherScore(score) {
    const scoreElement = document.getElementById("score");

    if (!scoreElement) {
        return;
    }

    const motPoint = score > 1 ? "points" : "point";

    scoreElement.textContent = `Score : ${score} ${motPoint}`;
}


/**
 * Met à jour la barre de progression.
 *
 * @param {number} pourcentage
 */
function afficherProgression(pourcentage) {
    const barre = document.getElementById("progressBar");
    const conteneur = document.getElementById("progressContainer");

    const valeurLimitee = Math.min(
        Math.max(pourcentage, 0),
        100
    );

    barre.style.width = `${valeurLimitee}%`;
    conteneur.setAttribute(
        "aria-valuenow",
        Math.round(valeurLimitee)
    );
}


/**
 * Modifie l'apparence d'une carte déverrouillée.
 *
 * @param {number} numeroQuete
 */
function afficherQueteDebloquee(numeroQuete) {
    const carte = document.getElementById(
        `carteQuete${numeroQuete}`
    );

    const bouton = document.getElementById(
        `boutonQuete${numeroQuete}`
    );

    const titre = document.getElementById(
        `titreQuete${numeroQuete}`
    );

    if (!carte || !bouton) {
        return;
    }

    carte.classList.remove("verrouillee");
    carte.classList.add("disponible");

    bouton.disabled = false;
    bouton.textContent = "Jouer";

    if (titre) {
        titre.textContent =
            `🪨 Quête ${numeroQuete}`;
    }
}


/**
 * Réactive visuellement le bouton de la quête 1.
 */
function afficherQuete1Disponible() {
    const bouton = document.getElementById("boutonQuete1");

    if (bouton) {
        bouton.disabled = false;
        bouton.textContent = "Jouer";
    }
}
/**
 * Modifie l'apparence d'une quête terminée.
 *
 * @param {number} numeroQuete
 */
function afficherQueteTerminee(numeroQuete) {
    const carte =
        document.getElementById(
            `carteQuete${numeroQuete}`
        );

    const bouton =
        document.getElementById(
            `boutonQuete${numeroQuete}`
        );

    const titre =
        document.getElementById(
            `titreQuete${numeroQuete}`
        );

    if (!carte || !bouton) {
        return;
    }

    carte.classList.remove(
        "verrouillee",
        "disponible"
    );

    carte.classList.add("terminee");

    bouton.disabled = false;
    bouton.textContent = "Rejouer";

    if (titre) {
        titre.textContent =
            `✅ Quête ${numeroQuete}`;
    }
}

/**
 * Affiche la vidéo d'introduction d'une quête.
 *
 * @param {Object} quete
 * @param {Function} continuer
 */
function afficherIntroductionVideo(
    quete,
    continuer
) {
    const zoneJeu =
        document.getElementById("jeu");

    if (!zoneJeu) {
        console.error(
            "La zone principale du jeu est introuvable."
        );

        return;
    }

    zoneJeu.innerHTML = `
        <div class="ecran-video">

            <p class="numero-quete">
                Quête ${quete.id}
            </p>

            <h2>
                ${quete.titre}
            </h2>

            <p class="description-video">
                ${quete.description}
            </p>

            <video
                id="videoQuete"
                class="video-quete"
                controls
                playsinline
                preload="metadata"
            >
                <source
                    src="${quete.video}"
                    type="video/mp4"
                >

                Ton navigateur ne peut pas lire cette vidéo.
            </video>

            <p
                id="messageVideo"
                class="message-video"
            >
                Regarde la vidéo pour déverrouiller la question.
            </p>

            <button
                type="button"
                id="boutonQuestionVideo"
                class="bouton-continuer"
                disabled
            >
                Répondre à la question
            </button>

        </div>
    `;

    const video =
        document.getElementById(
            "videoQuete"
        );

    const boutonQuestion =
        document.getElementById(
            "boutonQuestionVideo"
        );

    const messageVideo =
        document.getElementById(
            "messageVideo"
        );

    video.addEventListener(
        "ended",
        () => {
            boutonQuestion.disabled = false;

            messageVideo.textContent =
                "La vidéo est terminée. Tu peux maintenant répondre à la question.";
        }
    );

    boutonQuestion.addEventListener(
        "click",
        continuer
    );
}
