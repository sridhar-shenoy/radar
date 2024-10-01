document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const complianceIdInput = document.getElementById('complianceId');
    const resultsDiv = document.getElementById('results');

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
                    ${renderFilters(data.actions, 'actions')}
                    ${renderTable(data.actions)}
                </div>
                <div class="tab-pane fade" id="analysis">
                    <h5>Analysis</h5>
                    ${renderFilters(data.analysis, 'analysis')}
                    ${renderTable(data.analysis)}
                </div>
            </div>
        `;
    }

    function renderFilters(logs, type) {
        return `
            <div class="filter-inputs mb-3">
                <input type="text" placeholder="System" oninput="filterLogs(event, '${type}', 'system')" class="filter-input">
                <input type="text" placeholder="Date" oninput="filterLogs(event, '${type}', 'date')" class="filter-input">
                <input type="text" placeholder="Summary" oninput="filterLogs(event, '${type}', 'summary')" class="filter-input">
            </div>
        `;
    }

    function renderTable(logs) {
        return `
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th class="system-column">System <span onclick="sortTable(event, 'system')" style="cursor: pointer;">🔼</span><span onclick="sortTable(event, 'system', true)" style="cursor: pointer;">🔽</span></th>
                        <th class="date-column">Date <span onclick="sortTable(event, 'date')" style="cursor: pointer;">🔼</span><span onclick="sortTable(event, 'date', true)" style="cursor: pointer;">🔽</span></th>
                        <th>Summary <span onclick="sortTable(event, 'summary')" style="cursor: pointer;">🔼</span><span onclick="sortTable(event, 'summary', true)" style="cursor: pointer;">🔽</span></th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    ${logs.map((log, index) => {
                        const rowClass = getRowClass(log.log);
                        return `
                        <tr class="collapse-row ${rowClass}" data-target="#detailsRow${index}" data-toggle="collapse">
                            <td>${log.system || "Unknown"}</td>
                            <td>${log.date || "No Date"}</td>
                            <td>${log.summary || "No Summary"}</td>
                        </tr>
                        <tr class="collapse" id="detailsRow${index}">
                            <td colspan="3" style="padding: 0;">
                                <table class="details-table table table-bordered">
                                    <tbody>
                                        ${Object.entries(log.details).map(([key, value]) => `
                                            <tr>
                                                <th>${key}</th>
                                                <td>${value}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    window.filterLogs = (event, type, column) => {
        const inputValue = event.target.value.toLowerCase();
        const tableRows = Array.from(document.querySelectorAll(`#${type} tbody tr.collapse-row`));

        tableRows.forEach(row => {
            const rowCells = row.children;
            const cellValue = rowCells[column === 'system' ? 0 : column === 'date' ? 1 : 2].textContent.toLowerCase();
            const isVisible = cellValue.includes(inputValue);
            row.style.display = isVisible ? '' : 'none';
        });
    };

    let sortOrder = {};

    window.sortTable = (event, column, descending = false) => {
        const tableBody = event.target.closest('table').querySelector('tbody');
        const rows = Array.from(tableBody.rows).filter(row => row.classList.contains('collapse-row'));

        if (!sortOrder[column]) {
            sortOrder[column] = 'asc'; // Default to ascending
        } else if (sortOrder[column] === 'asc' && !descending) {
            sortOrder[column] = 'desc';
        } else {
            sortOrder[column] = 'asc';
        }

        const sortedRows = rows.sort((a, b) => {
            const aText = a.cells[column === 'system' ? 0 : column === 'date' ? 1 : 2].textContent;
            const bText = b.cells[column === 'system' ? 0 : column === 'date' ? 1 : 2].textContent;

            return sortOrder[column] === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        tableBody.innerHTML = '';
        sortedRows.forEach(row => tableBody.appendChild(row));
    };

    function getRowClass(logValue) {
        switch (logValue) {
            case 'green':
                return 'light-green';
            case 'yellow':
                return 'light-yellow';
            case 'red':
                return 'light-red';
            default:
                return '';
        }
    }
});
