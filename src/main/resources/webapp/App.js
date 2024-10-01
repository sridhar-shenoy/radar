document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const complianceIdInput = document.getElementById('complianceId');
    const resultsDiv = document.getElementById('results');

const spinner = `
    <div id="spinner" class="text-left my-4">
        <div class="spinner-container">
            <div class="spinner"></div>
            <p class="loading-text">Searching for logs...</p>
        </div>
    </div>
`;

const styles = `
    <style>
        .spinner-container {
            display: flex;
            align-items: center; /* Align items vertically centered */
            background-color: rgba(255, 255, 255, 0.9); /* Light white with slight transparency */
            padding: 15px 20px; /* Padding for the text */
            border-radius: 15px; /* More rounded edges */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Enhanced shadow for depth */
            max-width: fit-content; /* Fit to content */
            margin-left: 0; /* Left aligned */
            margin-top: 20px; /* Space from top */
        }
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1); /* Light border for premium feel */
            border-left-color: #007bff; /* Primary color for spinner */
            border-radius: 50%;
            width: 40px; /* Slightly larger size for visibility */
            height: 40px; /* Slightly larger size for visibility */
            animation: spin 1s linear infinite;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Shadow for the spinner itself */
        }
        .loading-text {
            margin-left: 15px; /* Space between spinner and text */
            color: #000080; /* Navy blue for contrast with background */
            font-weight: bold;
            font-size: 1.2rem; /* Slightly larger font size for prominence */
            letter-spacing: 1px; /* Spacing for a premium feel */
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
`;

// Append the styles to the head
document.head.insertAdjacentHTML('beforeend', styles);


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
                  ${renderTable(data.actions)}
              </div>
              <div class="tab-pane fade" id="analysis">
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
                    <th class="system-column">
                        System
                        <span onclick="sortTable(event, 'system')" style="cursor: pointer;">🔼</span>
                        <span onclick="sortTable(event, 'system', true)" style="cursor: pointer;">🔽</span>
                        <div class="filter-input-container">
                            <input type="text" placeholder="Filter System" oninput="filterLogs(event, 'actions', 'system')" class="filter-input">
                        </div>
                    </th>
                    <th class="date-column">
                        Date
                        <span onclick="sortTable(event, 'date')" style="cursor: pointer;">🔼</span>
                        <span onclick="sortTable(event, 'date', true)" style="cursor: pointer;">🔽</span>
                        <div class="filter-input-container">
                            <input type="text" placeholder="Filter Date" oninput="filterLogs(event, 'actions', 'date')" class="filter-input">
                        </div>
                    </th>
                    <th>
                        Summary
                        <span onclick="sortTable(event, 'summary')" style="cursor: pointer;">🔼</span>
                        <span onclick="sortTable(event, 'summary', true)" style="cursor: pointer;">🔽</span>
                        <div class="filter-input-container">
                            <input type="text" placeholder="Filter Summary" oninput="filterLogs(event, 'actions', 'summary')" class="filter-input">
                        </div>
                    </th>
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

  window.filterLogs = (event, type) => {
      const filterInputs = Array.from(document.querySelectorAll(`#${type} .filter-input`));
      const tableRows = Array.from(document.querySelectorAll(`#${type} tbody tr.collapse-row`));

      // Collect input values
      const filterValues = filterInputs.map(input => input.value.toLowerCase());

      tableRows.forEach(row => {
          const rowCells = row.children;
          const systemValue = rowCells[0].textContent.toLowerCase();
          const dateValue = rowCells[1].textContent.toLowerCase();
          const summaryValue = rowCells[2].textContent.toLowerCase();

          // Check if the row should be visible based on all filter inputs
          const isVisible = filterValues.every((filterValue, index) => {
              if (!filterValue) return true; // No filter applied for this input
              const cellValue = index === 0 ? systemValue : index === 1 ? dateValue : summaryValue;
              return cellValue.includes(filterValue);
          });

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
