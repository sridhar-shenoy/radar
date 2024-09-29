class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            activeTab: 0,
            data: []
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch() {
        const complianceId = document.getElementById('complianceId').value;
        fetch(`http://localhost:8080/search?ComplianceId=${complianceId}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ tabs: data.tabs, data: data.data });
            });
    }

    toggleTab(index) {
        this.setState({ activeTab: index });
    }

    render() {
        const { tabs, activeTab, data } = this.state;
        return (
            <div>
                <ul className="nav nav-tabs">
                    {tabs.map((tab, index) => (
                        <li className="nav-item" key={index}>
                            <a className={`nav-link ${activeTab === index ? 'active' : ''}`}
                               onClick={() => this.toggleTab(index)}>
                                {tab}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="tab-content">
                    {activeTab === 0 && <TabContent data={data} />}
                    {activeTab === 1 && <TabContent data={data} />}
                </div>
            </div>
        );
    }
}

class TabContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expandedRow: null };
    }

    toggleRow(index) {
        this.setState({ expandedRow: this.state.expandedRow === index ? null : index });
    }

    render() {
        const { data } = this.props;
        return (
            <div>
                <table className="table">
                    <tbody>
                        {data.map((row, index) => (
                            <React.Fragment key={index}>
                                <tr className="summary-row" onClick={() => this.toggleRow(index)}>
                                    <td>{row[0]}</td>
                                </tr>
                                {this.state.expandedRow === index && (
                                    <tr>
                                        <td colSpan="1">
                                            <table className="table">
                                                <tbody>
                                                    {row.slice(1).map((detail, i) => (
                                                        <tr key={i}>
                                                            <td>{detail}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('resultContainer'));
