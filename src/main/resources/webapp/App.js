document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const complianceIdInput = document.getElementById('complianceId');
    const resultsDiv = document.getElementById('results');

    // Create a spinner element
    const spinner = `
        <div id="spinner" class="text-left my-4">
            <div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="ml-2 d-inline" style="color: #007bff;">Searching for logs...</p>
        </div>
    `;

    searchBtn.addEventListener('click', async () => {
        const complianceId = complianceIdInput.value;
        if (!complianceId) {
            alert("Please enter a Compliance ID");
            return;
        }

        // Clear previous results and show the spinner
        resultsDiv.innerHTML = spinner;

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
        // Clear spinner and show the results
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
                        const rowClass = getRowClass(log.log);
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

    function getRowClass(logValue) {
        switch (logValue) {
            case 'green':
                return 'light-green';  // Add this class in your CSS for pale green
            case 'yellow':
                return 'light-yellow'; // Add this class in your CSS for pale yellow
            case 'red':
                return 'light-red';    // Add this class in your CSS for pale red
            // You can add more colors here as needed
            default:
                return ''; // No specific class if logValue is unknown
        }
    }
});
