 function changeLanguage(lang) {
        alert("Lingua selezionata: " + lang);
    }

    function toggleMenu() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('active');
    }

    function home() {
        document.querySelectorAll('header, nav, section, footer').forEach(el => {
            el.style.display = ''; // Ripristina il valore predefinito
        });
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.style.display = 'none';
    }

    function showLeaderboard() {
        document.querySelectorAll('header, nav, section, footer').forEach(el => {
            el.style.display = 'none';
        });
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.style.display = 'block';
        loadLeaderboard(); 
    }

    async function loadLeaderboard() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Carmincir45/Speed-Legends-sports/main/players.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const players = await response.json(); // Converti i dati in un array
            updateLeaderboard(players); // Aggiorna la classifica
        } catch (error) {
            console.error("Errore nel caricamento della classifica:", error);
        }
    }

    // Funzione per aggiornare la classifica
    function updateLeaderboard(players) {
        if (!Array.isArray(players)) {
            console.error("Dati non validi per la classifica");
            return;
        }
        const tbody = document.getElementById('leaderboard-rows');
        tbody.innerHTML = ''; // Pulire le righe precedenti

        // Ordina i giocatori in base ai punti (dal più alto al più basso)
        players.sort((a, b) => b.points - a.points);

        // Aggiungi i giocatori alla tabella
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.points}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Carica la classifica al caricamento della pagina
    loadLeaderboard();

    // Aggiorna la classifica ogni 60 secondi
    setInterval(loadLeaderboard, 60000);
    

    // Funzione per aggiornare il countdown
    let eventDate = null; // Variabile globale per la data dell'evento
    let events = {}; // Variabile globale per memorizzare gli eventi caricati
    
    // Funzione per aggiornare il countdown
    function updateCountdown() {
        if (!eventDate) return; // Se non è stata selezionata una data, non fare nulla
    const now = new Date(); // Data attuale
    const eventDateTime = new Date(eventDate); // Data dell'evento

    if (eventDateTime > now) {
        const timeDifference = eventDateTime - now; // Differenza in millisecondi

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `
                <p><span id="days">${days}</span> giorni</p>
                <p><span id="hours">${hours}</span> ore</p>
                <p><span id="minutes">${minutes}</span> minuti</p>
                <p><span id="seconds">${seconds}</span> secondi</p>
            `;
    } else {
        document.getElementById("countdown").innerHTML = "<p>L'evento è in corso o si è già concluso!</p>";
        
    }
}


    // Funzione per caricare un evento specifico
    function loadEvent(country) {
        if (events[country]) {
            eventDate = events[country].date; // Imposta la data dell'evento
            document.getElementById("event-name").textContent = "Prossimo Evento: " + events[country].name;
            updateCountdown();
            
        } else {
            alert("Nessun evento trovato per questa nazionalità!");
        }
    }

    // Funzione per trovare l'evento più vicino
    function findClosestEvent() {
        let closestEvent = null;
        let closestDate = null;

        for (const country in events) {
            const event = events[country];
            const eventTime = new Date(event.date).getTime();
            const now = Date.now();

            if (eventTime > now && (!closestDate || eventTime < closestDate)) {
                closestDate = eventTime;
                closestEvent = country;
            }
        }

        if (closestEvent) {
            loadEvent(closestEvent); // Carica l'evento più vicino
            document.getElementById("country-selector").value = closestEvent; // Aggiorna il menu a tendina
        }
    }

    // Funzione per caricare gli eventi dal file JSON
    async function loadEvents() {
        try {
            const response = await fetch("https://raw.githubusercontent.com/Carmincir45/Speed-Legends-sports/refs/heads/main/event.json"); // Percorso al tuo file JSON
            if (!response.ok) throw new Error("Errore nel caricamento del file JSON.");
            events = await response.json(); // Converte il file JSON in un oggetto

            // Popola la tendina con i dati degli eventi
            const countrySelector = document.getElementById("country-selector");
            countrySelector.innerHTML = ''; // Pulisce la tendina esistente
            for (const country in events) {
                const option = document.createElement("option");
                option.value = country;
                option.textContent = events[country].name;
                countrySelector.appendChild(option);
            }

            findClosestEvent(); // Trova e carica l'evento più vicino al caricamento
        } catch (error) {
            console.error("Errore:", error);
        }
    }

    // Avvia il countdown
    setInterval(updateCountdown, 1000);

    // Carica gli eventi al caricamento della pagina
    loadEvents();
    


    // Funzione per i risultati del gran premio
    function updateResultsLink(granPremio) {
        const resultsLink = document.getElementById('results-link');
        resultsLink.href = `risultati.html?gp=${granPremio}`;
    }