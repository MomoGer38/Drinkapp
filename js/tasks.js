// ============================================================
//  AUFGABEN-POOL
//
//  Struktur jeder Aufgabe: { text, category, level }
//
//  category: Schlüssel aus CATEGORIES
//  level:    1 = harmlos, 2 = härter, 3 = brutal
//
//  Neue Aufgaben einfach als Objekt ans Array anhängen.
// ============================================================

'use strict';

const CATEGORIES = {
    trinken:   { label: 'Trinken & Mutig',    icon: '🍺' },
    koerper:   { label: 'Körperlich',         icon: '💪' },
    kreativ:   { label: 'Kreativ & Peinlich', icon: '🎭' },
    sozial:    { label: 'Sozial & Mutig',     icon: '👀' },
    handy:     { label: 'Handy-Aktionen',     icon: '📱' },
    rollen:    { label: 'Rollen & Verhalten', icon: '🎪' },
    wissen:    { label: 'Wissen',             icon: '🧠' },
    schmerzen: { label: 'Schmerzen',          icon: '⚡' },
    ekel:      { label: 'Ekel',              icon: '🤢' },
};

const TASKS = [

    // ══════════════════════════════════════════════════════════
    //  TRINKEN & MUTIG
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Trink 3 Schlücke und erkläre dabei mit todernster Miene, warum Ananas auf Pizza gehört.', category: 'trinken', level: 1 },
    { text: 'Trink deinen nächsten Schluck komplett ohne Hände – nur mit dem Mund.', category: 'trinken', level: 1 },
    { text: 'Trink einen Shot in einem Zug. Kein Nachschenken erlaubt.', category: 'trinken', level: 1 },
    { text: 'Tausche dein Glas für die nächsten 2 Runden mit der Person zu deiner Linken.', category: 'trinken', level: 1 },
    { text: 'Bestelle beim nächsten Trinken etwas, das jemand anderes für dich aussucht.', category: 'trinken', level: 1 },
    { text: 'Alle am Tisch heben gleichzeitig die Hand – als letzter trinkst du 2 Schlücke.', category: 'trinken', level: 1 },
    { text: 'Trink deinen nächsten Schluck mit dem kleinen Finger gestreckt – wie bei der Queen.', category: 'trinken', level: 1 },

    // Stufe 2
    { text: 'Fülle dein Glas mindestens halb auf und trink es in einem Zug leer.', category: 'trinken', level: 2 },
    { text: 'Die Person rechts bestimmt, wie viel du trinkst. Die links bestimmt, wie schnell.', category: 'trinken', level: 2 },
    { text: 'Alle nennen gleichzeitig eine Zahl von 1–5. Du trinkst so viel Schlücke wie die höchste Zahl.', category: 'trinken', level: 2 },
    { text: 'Trink deinen nächsten Schluck – aber rückwärts auf deinem Stuhl kniend.', category: 'trinken', level: 2 },
    { text: 'Waterfall: Du trinkst, die Person links trinkt, die nächste trinkt usw. Du hörst zuerst auf.', category: 'trinken', level: 2 },
    { text: 'Du trinkst, bis die Person links von dir "Stopp!" sagt. Sie wartet bewusst etwas.', category: 'trinken', level: 2 },

    // Stufe 3
    { text: 'Mische je einen Schluck aller verschiedenen Getränke am Tisch und trink das Ergebnis.', category: 'trinken', level: 3 },
    { text: 'Die Gruppe entscheidet per Abstimmung, wie viel du trinkst. Mehrheit gewinnt – kein Veto.', category: 'trinken', level: 3 },
    { text: 'Trink deinen gesamten Glasinhalt auf ex – danach sofort nachfüllen.', category: 'trinken', level: 3 },
    { text: 'Biersturzrennen gegen die Person gegenüber: Wer langsamer ist, trinkt nochmal dasselbe.', category: 'trinken', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  KÖRPERLICH
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Mache 10 Liegestütze. Wer aufhört, trinkt.', category: 'koerper', level: 1 },
    { text: 'Halte 30 Sekunden eine Plank. Schaffst du es nicht, trinkst du zusätzlich.', category: 'koerper', level: 1 },
    { text: 'Mache so lange Hampelmänner, bis die Gruppe "Stop!" ruft.', category: 'koerper', level: 1 },
    { text: 'Mache 20 Kniebeugen ohne Pause.', category: 'koerper', level: 1 },
    { text: 'Bleibe 30 Sekunden auf einem Bein stehen. Verlierst du die Balance: trinken.', category: 'koerper', level: 1 },
    { text: 'Mache 15 Sit-ups. Für jeden fehlenden: ein Schluck.', category: 'koerper', level: 1 },

    // Stufe 2
    { text: 'Trage die Person zu deiner Rechten 5 Schritte im Huckepack.', category: 'koerper', level: 2 },
    { text: 'Mache 20 Burpees. Für jede nicht geschaffte: ein Schluck.', category: 'koerper', level: 2 },
    { text: 'Halte 60 Sekunden die Wandsitz-Position (Rücken gerade, Schenkel waagrecht). Gibst du auf: trinken.', category: 'koerper', level: 2 },
    { text: 'Mache einen Handstand an der Wand für mindestens 10 Sekunden. Gelingt es nicht: trinken.', category: 'koerper', level: 2 },
    { text: 'Liegestütz-Duell gegen die Person gegenüber: Wer zuerst aufgibt, trinkt doppelt.', category: 'koerper', level: 2 },

    // Stufe 3
    { text: 'Halte 90 Sekunden die Plank ohne Unterbrechung.', category: 'koerper', level: 3 },
    { text: 'Mache 30 Liegestütze in einem Zug. Für jede fehlende: ein Schluck.', category: 'koerper', level: 3 },
    { text: 'Trage nacheinander jede Person am Tisch für 3 Schritte im Huckepack. Weigerung = 5 Schlücke.', category: 'koerper', level: 3 },
    { text: 'Mache 50 Kniebeugen in 90 Sekunden. Gruppe zählt laut mit. Jede fehlende: ein Schluck.', category: 'koerper', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  KREATIV & PEINLICH
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Singe die ersten 30 Sekunden deines Lieblingssongs – a cappella, volle Lautstärke.', category: 'kreativ', level: 1 },
    { text: 'Imitiere eine berühmte Persönlichkeit – die Gruppe rät. Rät niemand: trinken.', category: 'kreativ', level: 1 },
    { text: 'Die Gruppe wählt ein Tier – imitiere es überzeugend für 30 Sekunden.', category: 'kreativ', level: 1 },
    { text: 'Erzähle einen Witz. Wenn niemand auch nur schmunzelt, trinkst du.', category: 'kreativ', level: 1 },
    { text: 'Halte eine 30-sekündige Lobrede auf dich selbst, als wärst du für den Nobelpreis nominiert.', category: 'kreativ', level: 1 },
    { text: 'Erkläre dem Rest der Gruppe ein fiktives Produkt und versuche es zu verkaufen.', category: 'kreativ', level: 1 },
    { text: 'Tue so, als würdest du eine Shampoo-Werbung drehen. 30 Sekunden, volle Überzeugung.', category: 'kreativ', level: 1 },

    // Stufe 2
    { text: 'Schreibe in 60 Sekunden ein Gedicht über die Person zu deiner Rechten und trage es vor.', category: 'kreativ', level: 2 },
    { text: 'Erkläre Quantenmechanik so, als wärst du 5 Jahre alt. Mindestens 30 Sekunden.', category: 'kreativ', level: 2 },
    { text: 'Imitiere jemanden am Tisch für 30 Sekunden – der Rest muss raten. Rät niemand: trinken.', category: 'kreativ', level: 2 },
    { text: 'Tanze 45 Sekunden zu einem Song, den die Gruppe auswählt. Volle Energie, kein Abbremsen.', category: 'kreativ', level: 2 },
    { text: 'Führe ein Casting-Gespräch als überheblicher Regisseur durch – interviewe jede Person 15 Sekunden.', category: 'kreativ', level: 2 },

    // Stufe 3
    { text: 'Erfinde spontan einen Rap über das Spiel. Mindestens 8 Zeilen, kein Abbrechen.', category: 'kreativ', level: 3 },
    { text: 'Mache für 3 Minuten auf Schauspieler – reagiere auf alles übertrieben dramatisch. Stoppt die Gruppe.', category: 'kreativ', level: 3 },
    { text: 'Führe eine 60-Sekunden-Stummfilm-Szene auf (Thema wählt Gruppe). Kein einziges Wort.', category: 'kreativ', level: 3 },
    { text: 'Improvisiere eine 60-Sekunden-Stand-up-Comedy über deine eigenen Schwächen.', category: 'kreativ', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  SOZIAL & MUTIG
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Zeige das letzte Foto in deiner Galerie, ohne es vorher anzusehen.', category: 'sozial', level: 1 },
    { text: 'Zeige deinen letzten Google- oder YouTube-Suchbegriff.', category: 'sozial', level: 1 },
    { text: 'Lies die letzte Nachricht vor, die du geschrieben hast.', category: 'sozial', level: 1 },
    { text: 'Erzähle deinen peinlichsten Moment aus den letzten 12 Monaten.', category: 'sozial', level: 1 },
    { text: 'Beantworte die nächste Frage der Gruppe vollkommen ehrlich.', category: 'sozial', level: 1 },
    { text: 'Nenne einen Fehler, den du gemacht hast und der noch niemandem in der Runde bekannt ist.', category: 'sozial', level: 1 },

    // Stufe 2
    { text: 'Zeige den letzten Chat-Verlauf (oberster offener Chat) für 10 Sekunden der Gruppe.', category: 'sozial', level: 2 },
    { text: 'Erzähle das Peinlichste, das dir je auf einer Party passiert ist. Keine Auslassungen.', category: 'sozial', level: 2 },
    { text: 'Beantworte 3 Fragen der Gruppe vollkommen ehrlich – keine Joker, kein Ausweichen.', category: 'sozial', level: 2 },
    { text: 'Nenne eine Person am Tisch und nenne ehrlich 2 Dinge, die dich an ihr nerven.', category: 'sozial', level: 2 },
    { text: 'Zeige deinen App-Verlauf der letzten Stunde – alle können sehen.', category: 'sozial', level: 2 },

    // Stufe 3
    { text: 'Zeige deinen App-Nutzungsverlauf der letzten 24 Stunden komplett der Gruppe.', category: 'sozial', level: 3 },
    { text: 'Beantworte 5 Minuten lang jede Frage der Gruppe vollkommen ehrlich. Niemanden aussparend.', category: 'sozial', level: 3 },
    { text: 'Erzähle etwas über dich, das noch niemand in der Runde weiß und dir etwas peinlich ist.', category: 'sozial', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  HANDY-AKTIONEN
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Schreibe einem zufälligen Kontakt (Gruppe wählt) eine Sprachnachricht: "Hey, ich vermisse dich."', category: 'handy', level: 1 },
    { text: 'Ruf jemanden an und singe "Happy Birthday" – egal ob Geburtstag oder nicht.', category: 'handy', level: 1 },
    { text: 'Schreibe blind (Augen geschlossen) eine Nachricht an jemanden deiner Wahl und schicke sie ab.', category: 'handy', level: 1 },
    { text: 'Schreibe deinem ältesten Chat-Kontakt: "Hey, wie geht\'s dir so?"', category: 'handy', level: 1 },
    { text: 'Mache ein Selfie mit einer Person im Raum (Gruppe wählt wen) und zeige es allen.', category: 'handy', level: 1 },
    { text: 'Zeige dein letztes gesendetes Meme oder GIF.', category: 'handy', level: 1 },

    // Stufe 2
    { text: 'Ändere deinen WhatsApp-Status zu etwas, das die Gruppe bestimmt – bleibt für die nächste Stunde.', category: 'handy', level: 2 },
    { text: 'Schreibe einem Ex oder alten Schwarm: "Ich denke manchmal an damals." Zeige vorher den leeren Chat.', category: 'handy', level: 2 },
    { text: 'Die Gruppe diktiert eine Nachricht – du schickst sie blind an jemanden deiner Wahl.', category: 'handy', level: 2 },
    { text: 'Ruf jemanden an, mit dem du länger keinen Kontakt hattest, und rede mindestens 2 Minuten.', category: 'handy', level: 2 },

    // Stufe 3
    { text: 'Ändere dein Profilbild auf eines, das die Gruppe aussucht – bleibt bis morgen früh.', category: 'handy', level: 3 },
    { text: 'Poste eine Story oder einen Status, den die Gruppe für dich schreibt. Bleibt mindestens 1 Stunde.', category: 'handy', level: 3 },
    { text: 'Rufe live deine Mutter oder deinen Vater an – die Gruppe flüstert dir vor, was du sagst.', category: 'handy', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  ROLLEN & VERHALTEN
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Tue für die nächsten 3 Runden so, als wärst du betrunken. Wer es vergisst: trinken.', category: 'rollen', level: 1 },
    { text: 'Rede für eine ganze Runde ausschließlich mit einem selbstgewählten Akzent.', category: 'rollen', level: 1 },
    { text: 'Gib der Person zu deiner Linken ein ehrliches Kompliment. Klingt es unecht: trinken.', category: 'rollen', level: 1 },
    { text: 'Beschreibe die Person zu deiner Rechten nur mit negativen Eigenschaften – sie muss sich erkennen.', category: 'rollen', level: 1 },
    { text: 'Tausche für eine Runde deinen Sitzplatz mit der Person gegenüber.', category: 'rollen', level: 1 },
    { text: 'Rede für 3 Minuten ausschließlich im Flüsterton. Sprichst du lauter: trinken.', category: 'rollen', level: 1 },

    // Stufe 2
    { text: 'Rede für die nächsten 5 Runden nur, wenn du gefragt wirst – sonst trinkst du.', category: 'rollen', level: 2 },
    { text: 'Tue für 3 Runden so, als hättest du Tourette – rufe zufällig Tiernamen aus.', category: 'rollen', level: 2 },
    { text: 'Versuche, die Person rechts von dir zum Lachen zu bringen – ohne Berührung. 60 Sekunden.', category: 'rollen', level: 2 },
    { text: 'Sprich für 5 Minuten nur in Fragen. Keine einzige normale Aussage erlaubt.', category: 'rollen', level: 2 },

    // Stufe 3
    { text: 'Tue für 10 Minuten so, als könntest du kein Deutsch. Nur Englisch – oder du trinkst.', category: 'rollen', level: 3 },
    { text: 'Jede Person am Tisch darf dir einmal einen harmlosen Befehl geben. Du musst gehorchen.', category: 'rollen', level: 3 },
    { text: 'Imitiere für eine gesamte Spielrunde die Person links von dir. Stimme, Gesten, Mimik – alles.', category: 'rollen', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  WISSEN & CHALLENGE
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Nenne 5 Länder auf einem Kontinent (Gruppe wählt) in 10 Sekunden. Schaffst du es nicht: trinken.', category: 'wissen', level: 1 },
    { text: 'Zähle rückwärts von 50 auf 1 in 20 Sekunden. Fehler oder Stocken = trinken.', category: 'wissen', level: 1 },
    { text: 'Sage das ABC rückwärts ohne Pause. Kommst du ins Stocken: trinken.', category: 'wissen', level: 1 },
    { text: 'Nenne 10 Hauptstädte in Europa in 20 Sekunden.', category: 'wissen', level: 1 },
    { text: 'Nenne 5 Hauptstädte in Asien in 15 Sekunden. Schaffst du es nicht: trinken.', category: 'wissen', level: 1 },

    // Stufe 2
    { text: 'Löse 17 × 13 = ? in 10 Sekunden im Kopf – kein Handy. Liegst du falsch: trinken.', category: 'wissen', level: 2 },
    { text: 'Nenne alle 16 deutschen Bundesländer. Für jedes fehlende: ein Schluck.', category: 'wissen', level: 2 },
    { text: 'Nenne 10 Länder, die mit "S" beginnen, in 15 Sekunden.', category: 'wissen', level: 2 },
    { text: 'Nenne zu den Buchstaben A bis J je einen Sänger oder eine Band – 30 Sekunden, einer pro Buchstabe.', category: 'wissen', level: 2 },

    // Stufe 3
    { text: 'Nenne 15 Länder Afrikas in 30 Sekunden. Für jedes fehlende: ein Schluck.', category: 'wissen', level: 3 },
    { text: 'Erkläre den Unterschied zwischen Relativitätstheorie und Quantenmechanik in 30 Sekunden. Gruppe bewertet.', category: 'wissen', level: 3 },
    { text: 'Alle 12 Monate rückwärts, dann alle 7 Wochentage rückwärts – in einem Zug, kein Stocken.', category: 'wissen', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  SCHMERZEN
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Halte einen Eiswürfel 20 Sekunden in der geschlossenen Faust.', category: 'schmerzen', level: 1 },
    { text: 'Kneife dir selbst 3 Sekunden in die Wange.', category: 'schmerzen', level: 1 },
    { text: 'Die Person links darf dir einmal leicht auf den Unterarm schnipsen.', category: 'schmerzen', level: 1 },
    { text: 'Halte deinen Arm 45 Sekunden senkrecht über den Kopf gestreckt. Lässt du ihn sinken: trinken.', category: 'schmerzen', level: 1 },
    { text: 'Klopfe dir 10 Mal mit der Faust auf den Oberschenkel – mit etwas Schwung.', category: 'schmerzen', level: 1 },

    // Stufe 2
    { text: 'Halte einen Eiswürfel 45 Sekunden in der Hand. Lässt du los: trinken.', category: 'schmerzen', level: 2 },
    { text: 'Die Person rechts von dir darf dir einmal kräftig in den Oberarm kneifen.', category: 'schmerzen', level: 2 },
    { text: 'Bekomme eine leichte Ohrfeige von der Person links von dir. Stärke per Gruppenentscheid: "leicht".', category: 'schmerzen', level: 2 },
    { text: 'Lass dir von der Person rechts 5 Sekunden leicht an den Haaren ziehen.', category: 'schmerzen', level: 2 },

    // Stufe 3
    { text: 'Halte die Faust 60 Sekunden in einem Glas mit Eiswasser.', category: 'schmerzen', level: 3 },
    { text: 'Bekomme eine normale Ohrfeige (keine volle Kraft) von der Person, die du selbst auswählst.', category: 'schmerzen', level: 3 },
    { text: 'Die Gruppe einigt sich auf eine kleine körperliche Strafe (muss harmlos sein) – du hast kein Veto.', category: 'schmerzen', level: 3 },
    { text: 'Knie 30 Sekunden auf einem harten Untergrund. Gibst du auf: trinken.', category: 'schmerzen', level: 3 },

    // ══════════════════════════════════════════════════════════
    //  EKEL
    // ══════════════════════════════════════════════════════════

    // Stufe 1
    { text: 'Lecke einmal kurz über den Tisch.', category: 'ekel', level: 1 },
    { text: 'Rieche 10 Sekunden lang intensiv an deinen eigenen Socken oder Schuhen.', category: 'ekel', level: 1 },
    { text: 'Trink einen Schluck aus dem Glas der Person zu deiner Linken.', category: 'ekel', level: 1 },
    { text: 'Lecke deinen eigenen Ellenbogen ab.', category: 'ekel', level: 1 },
    { text: 'Halte 30 Sekunden die Nase der Person zu deiner Rechten zu. Sie darf sich nicht wegbewegen.', category: 'ekel', level: 1 },

    // Stufe 2
    { text: 'Trink einen kleinen Schluck aus einem Mix aller Getränke am Tisch.', category: 'ekel', level: 2 },
    { text: 'Lecke kurz an deinem eigenen Schuh ab.', category: 'ekel', level: 2 },
    { text: 'Iss einen Löffel eines Mixes aus allem Essbaren/Trinkbaren, das die Gruppe zusammenstellt (keine Allergene!).', category: 'ekel', level: 2 },
    { text: 'Lecke den Boden eines Tischbeins ab.', category: 'ekel', level: 2 },

    // Stufe 3
    { text: 'Trink einen ordentlichen Schluck eines Mixes aus allem auf dem Tisch – ohne Vorgeschmack.', category: 'ekel', level: 3 },
    { text: 'Lecke an dem Schuh der Person ab, die am längsten auf dieser Feier ist.', category: 'ekel', level: 3 },
    { text: 'Iss etwas Essbares, das die Gruppe dir aussucht und reicht – du siehst erst danach, was es war.', category: 'ekel', level: 3 },

];
