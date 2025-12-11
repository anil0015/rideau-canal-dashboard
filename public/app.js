const API_URL = "http://localhost:3000/api/data";

async function fetchData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        updateTable(data);
        console.log("Updated:", data);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function updateTable(data) {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");

        let badgeClass = "";
        if (item.safety_status === "Safe") badgeClass = "status-safe";
        else if (item.safety_status === "Caution") badgeClass = "status-caution";
        else badgeClass = "status-unsafe";

        tr.innerHTML = `
            <td>${item.location}</td>
            <td>${item.window_end}</td>
            <td>${item.avg_ice_thickness.toFixed(1)} cm</td>
            <td>${item.avg_surface_temp.toFixed(1)} °C</td>
            <td>${item.max_snow_accumulation.toFixed(1)} cm</td>
            <td>${item.avg_external_temp.toFixed(1)} °C</td>
            <td><span class="${badgeClass}">${item.safety_status}</span></td>
        `;

        tbody.appendChild(tr);
    });
}

// Manual Refresh
document.getElementById("refreshBtn").onclick = fetchData;

// Auto refresh
let interval = null;
document.getElementById("autoRefresh").onchange = function () {
    if (this.checked) {
        interval = setInterval(fetchData, 10000);
    } else {
        clearInterval(interval);
    }
};

// Initial load
fetchData();
