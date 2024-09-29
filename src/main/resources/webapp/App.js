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
                    <a class="nav-link active" data-toggle="tab" href="#actions">Actions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#analysis">Analysis</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" id="actions">
                    <h5>Actions</h5>
                    ${renderTable(data.actions)}
                </div>
                <div class="tab-pane fade" id="analysis">
                    <h5>Analysis</h5>
                    ${renderTable(data.analysis)}
                </div>
            </div>
        `;
    }

    function renderTable(logs) {
        return `
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th class="system-column">System</th>
                        <th class="date-column">Date</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map((log, index) => {
                        const rowClass = log.log === 'green' ? 'light-green' : log.log === 'red' ? 'light-red' : '';
                        return `
                        <tr class="collapse-row ${rowClass}" data-target="#detailsRow${index}" data-toggle="collapse">
                            <td>${log.system || "Unknown"}</td>
                            <td>${log.date || "No Date"}</td>
                            <td>${log.summary || "No Summary"}</td>
                        </tr>
                        <tr class="collapse" id="detailsRow${index}">
                            <td colspan="3">
                                <table class="details-table">
                                    ${Object.entries(log.details).map(([key, value]) => `
                                        <tr>
                                            <th>${key}</th>
                                            <td>${value}</td>
                                        </tr>
                                    `).join('')}
                                </table>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
});
