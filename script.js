const SERVER_IP = "173.212.207.246";

const ipElement = document.getElementById("server-ip");
const copyButton = document.getElementById("copy-ip");
const toast = document.getElementById("toast");

const uptimeElement = document.getElementById("server-uptime");
const playersElement = document.getElementById("server-players");


function showToast(message) {

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);

}


function displayIP() {

    if (ipElement) {
        ipElement.textContent = SERVER_IP;
    }

}


async function checkServer() {

    if (!uptimeElement) return;

    uptimeElement.textContent = "CHECKING...";
    uptimeElement.className = "status checking";


    if (playersElement) {
        playersElement.textContent = "CHECKING PLAYERS...";
    }


    try {

        const response = await fetch(
            `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`
        );


        if (!response.ok) {
            throw new Error("API error");
        }


        const data = await response.json();


        if (data.online) {

            uptimeElement.textContent = "ONLINE";
            uptimeElement.className = "status online";


            if (playersElement) {

                const online = data.players?.online ?? 0;
                const max = data.players?.max ?? "?";

                playersElement.textContent =
                    `${online} / ${max} PLAYERS`;

            }


        } else {

            uptimeElement.textContent = "OFFLINE";
            uptimeElement.className = "status offline";


            if (playersElement) {
                playersElement.textContent = "0 / 0 PLAYERS";
            }

        }


    } catch (error) {

        uptimeElement.textContent = "UNKNOWN";
        uptimeElement.className = "status unknown";


        if (playersElement) {
            playersElement.textContent = "NO DATA";
        }

    }

}


if (copyButton) {

    copyButton.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(SERVER_IP);

            showToast("IP COPIED!");

        } catch {

            showToast("Couldn't copy the IP.");

        }

    });

}


displayIP();

checkServer();

setInterval(checkServer, 60000);
