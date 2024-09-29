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
                ${Object.keys(data).map(key => `
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#${key}">${key}</a>
                    </li>`).join('')}
            </ul>
            <div class="tab-content">
                ${Object.keys(data).map(key => `
                    <div class="tab-pane fade" id="${key}">
                        <h5>${key} Data</h5>
                        ${key === 'Actions' ? renderActionsTable(data[key]) : `<pre>${JSON.stringify(data[key], null, 2)}</pre>`}
                    </div>`).join('')}
            </div>
        `;
    }

    function renderActionsTable(actions) {
        return `
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>System</th>
                        <th>Log</th>
                    </tr>
                </thead>
                <tbody>
                    ${actions.map((action, index) => {
                        const logSnippet = action.log ? action.log.substring(0, 50) : "No log data available";
                        return `
                        <tr class="collapse-row" data-target="#jsonRow${index}" data-toggle="collapse">
                            <td>${action.system || "Unknown"}</td>
                            <td>${logSnippet}...</td>
                        </tr>
                        <tr class="collapse" id="jsonRow${index}">
                            <td colspan="2">
                                <table class="table json-table">
                                    ${Object.keys(action).map(key => `
                                        <tr>
                                            <td><strong>${key}</strong></td>
                                            <td>${JSON.stringify(action[key], null, 2)}</td>
                                        </tr>`).join('')}
                                </table>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
});
