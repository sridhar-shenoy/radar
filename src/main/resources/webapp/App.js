document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');

    // Inject input and button into the root div
    root.innerHTML = `
        <div class="form-group">
            <input type="text" id="complianceId" class="form-control rounded-pill" placeholder="Enter Compliance ID">
        </div>
        <button id="searchBtn" class="btn btn-primary">Search</button>
        <div id="results" class="mt-4"></div>
    `;

    // Add event listener to the button after the DOM is fully loaded
    document.getElementById('searchBtn').addEventListener('click', function () {
        const complianceId = document.getElementById('complianceId').value;

        // Fetch request to /api/search
        fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `complianceId=${encodeURIComponent(complianceId)}`
        })
        .then(response => response.json())
        .then(data => renderTabs(data))
        .catch(error => console.error('Error:', error));
    });

    // Function to render tabs with the fetched data
    function renderTabs(data) {
        const resultsDiv = document.getElementById('results');

        // Define colorful tab headers and content
        resultsDiv.innerHTML = `
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active bg-info text-white" id="analysis-tab" data-toggle="tab" href="#analysis" role="tab" aria-controls="analysis" aria-selected="true">Analysis</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link bg-success text-white" id="actions-tab" data-toggle="tab" href="#actions" role="tab" aria-controls="actions" aria-selected="false">Actions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link bg-warning text-dark" id="locates-tab" data-toggle="tab" href="#locates" role="tab" aria-controls="locates" aria-selected="false">Locates</a>
                </li>
            </ul>
            <div class="tab-content mt-3">
                <div class="tab-pane fade show active" id="analysis" role="tabpanel" aria-labelledby="analysis-tab">
                    <p>${data.Analysis}</p>
                </div>
                <div class="tab-pane fade" id="actions" role="tabpanel" aria-labelledby="actions-tab">
                    ${renderActionsTable(data.Actions)}
                </div>
                <div class="tab-pane fade" id="locates" role="tabpanel" aria-labelledby="locates-tab">
                    <p>${data.Locates}</p>
                </div>
            </div>
        `;
    }

    // Function to render the collapsible Actions table
    function renderActionsTable(actions) {
        let tableHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Summary</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
        `;

        actions.forEach((action, index) => {
            tableHTML += `
                <tr data-toggle="collapse" data-target="#details${index}" class="accordion-toggle">
                    <td>${action[0]}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm">View Details</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="hiddenRow">
                        <div id="details${index}" class="collapse">
                            <p>${action[1]}</p>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        return tableHTML;
    }
});
