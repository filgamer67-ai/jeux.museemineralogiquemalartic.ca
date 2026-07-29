"use strict";

/*
    Ce fichier contient les données du jeu.

    Pour modifier une question, il suffit normalement
    de modifier son texte ou ses réponses ici.
*/

const donneesJeu = {
    titre: "Mini-jeux du Musée minéralogique de Malartic",

    quetes: [
        {
            id: 1,
            titre: "Vrai ou Faux",
            description: "Teste tes connaissances sur les minéraux et les métaux.",
            pointsMaximum: 30,

            questions: [
                {
                    id: 1,
                    texte: "Le cuivre conduit l'électricité.",
                    reponses: [
                        "Vrai",
                        "Faux"
                    ],
                    bonneReponse: 0,
                    points: 10,
                    explication:
                        "Exact. Le cuivre est un excellent conducteur électrique."
                },

                {
                    id: 2,
                    texte:
                        "Le tungstène est utilisé dans la fabrication de certains aciers.",
                    reponses: [
                        "Vrai",
                        "Faux"
                    ],
                    bonneReponse: 0,
                    points: 10,
                    explication:
                        "Exact. Le tungstène peut être ajouté à certains alliages d'acier."
                },

                {
                    id: 3,
                    texte: "La pyrite n'existe pas.",
                    reponses: [
                        "Vrai",
                        "Faux"
                    ],
                    bonneReponse: 1,
                    points: 10,
                    explication:
                        "Exact. La pyrite existe bel et bien. Elle est parfois surnommée « l'or des fous »."
                }
            ]
        },

        {
    id: 2,

    titre: "Les minéraux dans les jeux vidéo",

    description:
        "Découvre les liens entre les minéraux réels et les univers vidéoludiques.",

    pointsMaximum: 20,

    questions: [
        {
            id: 1,

            texte:
                "Quel minéral se trouve seulement au Québec ?",

            reponses: [
                "La carlétonite",
                "L'or",
                "Le lapis-lazuli"
            ],

            bonneReponse: 0,

            points: 10,

            explication:
                "Exact. La carlétonite est la réponse recherchée."
        },

        {
            id: 2,

            texte:
                "Quel minéral aurait inspiré la redstone dans Minecraft ?",

            reponses: [
                "La calcite",
                "L'obsidienne",
                "Le cinabre"
            ],

            bonneReponse: 2,

            points: 10,

            explication:
                "Exact. Le cinabre est la réponse recherchée."
        }
    ]
},

            {
            id: 3,

            titre:
                "Les femmes dans l'industrie minière",

            description:
                "Regarde une vidéo et réponds à une question sur la place des femmes dans les mines.",

            video:
                "videos/femmes-industrie-miniere.mp4",

            pointsMaximum: 10,

            questions: [
                {
                    id: 1,

                    texte:
                        "Quelle affirmation décrit le mieux la place des femmes dans l'industrie minière aujourd'hui ?",

                    reponses: [
                        "Les femmes occupent seulement des emplois administratifs.",
                        "Les femmes peuvent occuper une grande variété de métiers dans l'industrie minière.",
                        "Les femmes ne peuvent pas travailler dans les mines souterraines."
                    ],

                    bonneReponse: 1,

                    points: 10,

                    explication:
                        "Les femmes peuvent aujourd'hui occuper une grande variété de métiers dans l'industrie minière, autant sur les sites miniers que dans les domaines scientifiques, techniques, administratifs et de gestion."
                }
            ]
        }
    ]
};