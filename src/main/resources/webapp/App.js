document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');

    // Inject input and button into the root div
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

        // Fetch request to /api/search
        fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `complianceId=${encodeURIComponent(complianceId)}`
        })
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => console.error('Error:', error));
    });
});
