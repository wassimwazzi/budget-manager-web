import React, { useEffect, useState } from "react";
import SearchTable from "./SearchTable";

const Table = ({ data, columns }) => {
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (searchTerm, selectedColumn) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Use filter to find rows that match the search term in the specified column
        const filteredRows = data.filter(row =>
            String(row[selectedColumn]).toLowerCase().includes(lowerCaseSearchTerm)
        );

        setFilteredData(filteredRows);
    };

    return (
        <div>
            <SearchTable columns={columns} onSearch={handleSearch} />

            <table className='table table-striped'>
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            {columns.map(column => (
                                <td key={column}>{row[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;