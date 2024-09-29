document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');

    // Inject the input and button into the root div
    root.innerHTML = `
        <div class="form-group">
            <input type="text" id="complianceId" class="form-control rounded-pill" placeholder="Enter Compliance ID">
        </div>
        <button id="searchBtn" class="btn btn-primary">Search</button>
        <div id="results"></div>
    `;

    // Add event listener to the button after the DOM is fully loaded
    document.getElementById('searchBtn').addEventListener('click', function () {
        const complianceId = document.getElementById('complianceId').value;

        // Fetch request to /search API
        fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `complianceId=${complianceId}`
        })
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            // Inject the result data into the UI with tabs and collapsible tables
            resultsDiv.innerHTML = `
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="analysis-tab" data-toggle="tab" href="#analysis" role="tab">Analysis</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="actions-tab" data-toggle="tab" href="#actions" role="tab">Actions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="locates-tab" data-toggle="tab" href="#locates" role="tab">Locates</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="analysis" role="tabpanel">${data.Analysis}</div>
                    <div class="tab-pane fade" id="actions" role="tabpanel">
                        <table class="table">
                            ${data.Actions.map(action => `
                                <tr data-toggle="collapse" data-target="#collapse-${action[0].replace(' ', '-')}">
                                    <td>${action[0]}</td>
                                </tr>
                                <tr id="collapse-${action[0].replace(' ', '-')}" class="collapse">
                                    <td>${action[1]}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                    <div class="tab-pane fade" id="locates" role="tabpanel">${data.Locates}</div>
                </div>
            `;
        })
        .catch(error => console.error('Error:', error));
    });
});
