document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const complianceIdInput = document.getElementById('complianceId');
    const resultsDiv = document.getElementById('results');

    searchBtn.addEventListener('click', async () => {
        const complianceId = complianceIdInput.value;
        if (!complianceId) {
            alert("Please enter a Compliance ID");
            return;
        }

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ complianceId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            renderResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        }
    });

    function renderResults(data) {
        resultsDiv.innerHTML = `
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#Actions">Actions</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" id="Actions">
                    <h5>Actions Data</h5>
                    ${renderActionsTable(data.Actions)}
                </div>
            </div>
        `;
    }

    function renderActionsTable(actions) {
        return `
            <div>
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" id="filterSystem" class="form-control" placeholder="Filter by System">
                    </div>
                    <div class="col">
                        <input type="text" id="filterDate" class="form-control" placeholder="Filter by Date">
                    </div>
                    <div class="col">
                        <input type="text" id="filterLog" class="form-control" placeholder="Filter by Log">
                    </div>
                </div>
                <table class="table table-bordered table-hover" id="actionsTable">
                    <thead>
                        <tr>
                            <th style="width: 150px;">System</th>
                            <th style="width: 200px;">Date</th>
                            <th>Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actions.map((action, index) => {
                            const logSnippet = action.log ? action.log : "No log data available";
                            const logColorClass = getLogColorClass(action.type);
                            return `
                                <tr class="${logColorClass} collapse-row" data-target="#jsonRow${index}" data-toggle="collapse">
                                    <td>${action.system || "Unknown"}</td>
                                    <td>${action.date || "Unknown"}</td>
                                    <td>${logSnippet}...</td>
                                </tr>
                                <tr class="collapse" id="jsonRow${index}">
                                    <td colspan="3">
                                        <div>${JSON.stringify(action, null, 2)}</div>
                                    </td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function getLogColorClass(type) {
        if (type === "error") {
            return "table-danger"; // Red
        } else if (type === "success") {
            return "table-success"; // Green
        } else if (type === "warning") {
            return "table-warning"; // Yellow
        }
        return ""; // Default no color class
    }

    // Add filtering functionality
    document.querySelectorAll('#filterSystem, #filterDate, #filterLog').forEach(input => {
        input.addEventListener('keyup', filterTable);
    });

    function filterTable() {
        const systemFilter = document.getElementById('filterSystem').value.toLowerCase();
        const dateFilter = document.getElementById('filterDate').value.toLowerCase();
        const logFilter = document.getElementById('filterLog').value.toLowerCase();

        const rows = document.querySelectorAll('#actionsTable tbody tr.collapse-row');
        rows.forEach(row => {
            const systemText = row.cells[0].textContent.toLowerCase();
            const dateText = row.cells[1].textContent.toLowerCase();
            const logText = row.cells[2].textContent.toLowerCase();
            row.style.display = (systemText.includes(systemFilter) &&
                                 dateText.includes(dateFilter) &&
                                 logText.includes(logFilter)) ? '' : 'none';
        });
    }
});
