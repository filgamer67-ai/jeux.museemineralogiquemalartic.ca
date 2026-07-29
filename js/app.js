console.log("app.js est bien chargé");
"use strict";

/*
    Logique principale du jeu :
    - score;
    - progression;
    - réponses;
    - déverrouillage;
    - sauvegarde.
*/

const SCORE_MAXIMUM = 60;

let etatJeu = {
    score: 0,
    queteActuelle: null,
    questionActuelle: 0,
    quetesDebloquees: [1],
    quetesTerminees: [],
    pointsQueteActuelle: 0
};


/**
 * Démarre l'application.
 */
function initialiserJeu() {
    chargerProgression();
    connecterBoutonsMenu();
    actualiserInterface();
    afficherAccueil();
}


/**
 * Relie les boutons du menu aux fonctions du jeu.
 */
function connecterBoutonsMenu() {
    const boutonQuete1 =
        document.getElementById("boutonQuete1");

    const boutonQuete2 =
        document.getElementById("boutonQuete2");

    const boutonQuete3 =
        document.getElementById("boutonQuete3");

    const boutonReset =
        document.getElementById("boutonReset");

    if (boutonQuete1) {
        boutonQuete1.addEventListener(
            "click",
            () => {
                demarrerQuete(1);
            }
        );
    } else {
        console.error(
            "Le bouton de la quête 1 est introuvable."
        );
    }

    if (boutonQuete2) {
        boutonQuete2.addEventListener(
            "click",
            () => {
                demarrerQuete(2);
            }
        );
    }

   if (boutonQuete3) {
    boutonQuete3.addEventListener(
        "click",
        () => {
            demarrerQuete(3);
        }
    );
}

    if (boutonReset) {
        boutonReset.addEventListener(
            "click",
            reinitialiserProgression
        );
    }
}


/**
 * Retourne une quête selon son identifiant.
 *
 * @param {number} idQuete
 * @returns {Object|null}
 */
function obtenirQuete(idQuete) {
    return donneesJeu.quetes.find(
        (quete) => quete.id === idQuete
    ) || null;
}


/**
 * Vérifie si une quête est déverrouillée.
 *
 * @param {number} idQuete
 * @returns {boolean}
 */
function queteEstDebloquee(idQuete) {
    return etatJeu.quetesDebloquees.includes(idQuete);
}


/**
 * Démarre une quête déverrouillée.
 *
 * @param {number} idQuete
 */
function demarrerQuete(idQuete) {
    if (!queteEstDebloquee(idQuete)) {
        console.warn(
            `La quête ${idQuete} est encore verrouillée.`
        );

        return;
    }

    const quete =
        obtenirQuete(idQuete);

    if (!quete) {
        console.error(
            `La quête ${idQuete} est introuvable dans data.js.`
        );

        return;
    }

    if (!Array.isArray(quete.questions)) {
        console.error(
            `Les questions de la quête ${idQuete} sont invalides.`
        );

        return;
    }

    if (quete.questions.length === 0) {
        afficherMessageQueteEnConstruction(
            idQuete
        );

        return;
    }

    etatJeu.queteActuelle =
        idQuete;

    etatJeu.questionActuelle =
        0;

    etatJeu.pointsQueteActuelle =
        0;

    /*
        Si la quête possède une vidéo,
        on montre d'abord son écran vidéo.
    */
    if (quete.video) {
        afficherIntroductionVideo(
            quete,
            afficherQuestionActuelle
        );

        return;
    }

    afficherQuestionActuelle();
}


/**
 * Affiche la question correspondant à l'état actuel.
 */
function afficherQuestionActuelle() {
    const quete = obtenirQuete(
        etatJeu.queteActuelle
    );

    if (!quete) {
        afficherAccueil();
        return;
    }

    const question =
        quete.questions[etatJeu.questionActuelle];

    afficherQuestion(
        quete,
        question,
        etatJeu.questionActuelle + 1,
        quete.questions.length,
        verifierReponse
    );
}


/**
 * Vérifie la réponse choisie.
 *
 * @param {number} indexReponse
 * @param {HTMLButtonElement} boutonClique
 */
function verifierReponse(indexReponse, boutonClique) {
    const quete = obtenirQuete(
        etatJeu.queteActuelle
    );

    if (!quete) {
        return;
    }

    const question =
        quete.questions[etatJeu.questionActuelle];

    const estCorrecte =
        indexReponse === question.bonneReponse;

    desactiverBoutonsReponse();

    if (estCorrecte) {
        boutonClique.classList.add("bonne-reponse");

        ajouterPoints(question.points);

        afficherCorrection(
            true,
            question.explication
        );
    } else {
        boutonClique.classList.add("mauvaise-reponse");

        const boutons =
            document.querySelectorAll(".bouton-reponse");

        const boutonBonneReponse =
            boutons[question.bonneReponse];

        if (boutonBonneReponse) {
            boutonBonneReponse.classList.add("bonne-reponse");
        }

        afficherCorrection(
            false,
            `Ce n'est pas la bonne réponse. ${question.explication}`
        );
    }

    const estDerniereQuestion =
        etatJeu.questionActuelle ===
        quete.questions.length - 1;

    afficherBoutonContinuer(
        estDerniereQuestion
            ? "Terminer la quête"
            : "Question suivante",
        estDerniereQuestion
            ? terminerQueteActuelle
            : passerQuestionSuivante
    );
}


/**
 * Ajoute des points au joueur.
 * Une quête déjà terminée peut être rejouée,
 * mais elle ne rapporte pas de nouveaux points.
 *
 * @param {number} points
 */
function ajouterPoints(points) {
    const queteDejaTerminee =
        etatJeu.quetesTerminees.includes(
            etatJeu.queteActuelle
        );

    if (queteDejaTerminee) {
        return;
    }

    etatJeu.score += points;
    etatJeu.pointsQueteActuelle += points;

    sauvegarderProgression();
    actualiserInterface();
}


/**
 * Passe à la question suivante.
 */
function passerQuestionSuivante() {
    etatJeu.questionActuelle += 1;

    afficherQuestionActuelle();
}

/**
 * Termine la quête active,
 * sauvegarde sa réussite
 * et déverrouille la suivante.
 */
function terminerQueteActuelle() {
    const idQuete =
        etatJeu.queteActuelle;

    const quete =
        obtenirQuete(idQuete);

    if (!quete) {
        console.error(
            "La quête actuelle est introuvable."
        );

        return;
    }

    const queteDejaTerminee =
        etatJeu.quetesTerminees.includes(
            idQuete
        );

    if (!queteDejaTerminee) {
        etatJeu.quetesTerminees.push(
            idQuete
        );
    }

    const prochaineQuete =
        idQuete + 1;

    const existeQueteSuivante =
        Boolean(
            obtenirQuete(prochaineQuete)
        );

    if (
        existeQueteSuivante &&
        !etatJeu.quetesDebloquees.includes(
            prochaineQuete
        )
    ) {
        etatJeu.quetesDebloquees.push(
            prochaineQuete
        );
    }

    sauvegarderProgression();
    actualiserInterface();

    afficherFinQuete(
        quete,
        etatJeu.pointsQueteActuelle,
        retournerMenu,
        existeQueteSuivante
    );
}

/**
 * Retourne à l'écran d'accueil.
 */
function retournerMenu() {
    etatJeu.queteActuelle = null;
    etatJeu.questionActuelle = 0;
    etatJeu.pointsQueteActuelle = 0;

    afficherAccueil();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/**
 * Actualise le score, la barre
 * et les cartes de quêtes.
 */
function actualiserInterface() {
    afficherScore(etatJeu.score);

    const progression =
        (etatJeu.score / SCORE_MAXIMUM)
        * 100;

    afficherProgression(progression);

    etatJeu.quetesDebloquees.forEach(
        (idQuete) => {
            afficherQueteDebloquee(
                idQuete
            );
        }
    );

    etatJeu.quetesTerminees.forEach(
        (idQuete) => {
            afficherQueteTerminee(
                idQuete
            );
        }
    );
}


/**
 * Affiche un message temporaire pour les quêtes futures.
 *
 * @param {number} idQuete
 */
function afficherMessageQueteEnConstruction(idQuete) {
    const quete = obtenirQuete(idQuete);
    const zoneJeu = document.getElementById("jeu");

    zoneJeu.innerHTML = `
        <div class="ecran-construction">
            <h2>${quete ? quete.titre : "Quête"}</h2>

            <p>
                Cette quête est déverrouillée, mais son contenu
                sera ajouté à la prochaine étape.
            </p>

            <button
                type="button"
                id="retourAccueilTemporaire"
                class="bouton-retour"
            >
                Retourner au menu
            </button>
        </div>
    `;

    document
        .getElementById("retourAccueilTemporaire")
        .addEventListener("click", retournerMenu);
}


/**
 * Enregistre la progression dans le navigateur.
 */
function sauvegarderProgression() {
    try {
        const sauvegarde = {
            score: etatJeu.score,
            quetesDebloquees:
                etatJeu.quetesDebloquees,
            quetesTerminees:
                etatJeu.quetesTerminees
        };

        localStorage.setItem(
            "miniJeuxMuseeProgression",
            JSON.stringify(sauvegarde)
        );
    } catch (erreur) {
        console.warn(
            "La progression n'a pas pu être sauvegardée.",
            erreur
        );
    }
}


/**
 * Charge une progression existante.
 */
function chargerProgression() {
    try {
        const sauvegardeTexte = localStorage.getItem(
            "miniJeuxMuseeProgression"
        );

        if (!sauvegardeTexte) {
            return;
        }

        const sauvegarde =
            JSON.parse(sauvegardeTexte);

        if (Number.isFinite(sauvegarde.score)) {
            etatJeu.score = sauvegarde.score;
        }

        if (
            Array.isArray(
                sauvegarde.quetesDebloquees
            )
        ) {
            etatJeu.quetesDebloquees =
                sauvegarde.quetesDebloquees;
        }

        if (
            Array.isArray(
                sauvegarde.quetesTerminees
            )
        ) {
            etatJeu.quetesTerminees =
                sauvegarde.quetesTerminees;
        }
    } catch (erreur) {
        console.warn(
            "La progression enregistrée est invalide.",
            erreur
        );
    }
}

/*
    L'application démarre lorsque le HTML
    a fini de se charger.
*/
document.addEventListener(
    "DOMContentLoaded",
    initialiserJeu
);
