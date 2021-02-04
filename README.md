1) lancer le serveur redis
2) lancer l'apllication nodeJS.
    - un message apparait si la connecxion au serveur redis s'est bien passé
3) ouvrir le navigateur avec l'url "http://localhost:8081/"
4) saisir un nombre d'élément à envoyer 

NB: pour eviter les envois multiples le bouton d'envoie est désactivé le temps du traitement.
il se réactive en cas de fin de traitement ou d'erreur 


// *** TESTS ***//
1) launch_test
    npm run test_launch -- --instance <nb>
2) stress_test
    npm run test_stress -- --messages <nb> --sockets <nb> --count <nb>

Difficultés:
 - redis: jamais utilisé, ne connaissant pas cette base noSql, je me suis renseigné sur internet (stackoverflow.com et la doc de redis https://redis.io/commands)
 - Problèmes sur un nombre d'envoi supérieur à 300 éléments: 
    -> je ne maitrise pas la librairie async de node. je me suis documenté sur le async.eachLimit()
    -> je me suis aussi documenté sur la facon de pouvoir envoyer un tableau à redis et non resultat par resultat

 - les script de test: je manque de pratique sur les script de test.: documentation sur mocha
