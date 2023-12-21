import React, { useEffect, useState } from "react";
import SearchTable from "./SearchTable";
import Table from "./Table";


const SearchableTable = ({ data, columns, searchHandler }) => {
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (searchTerm, selectedColumn) => {
        if (searchHandler) {
            searchHandler(searchTerm, selectedColumn);
        }
        else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            // Use filter to find rows that match the search term in the specified column
            const filteredRows = data.filter(row =>
                String(row[selectedColumn]).toLowerCase().includes(lowerCaseSearchTerm)
            );

            setFilteredData(filteredRows);
        }
    };

    return (
        <>
            <SearchTable columns={columns} onSearch={handleSearch} />
            <Table data={filteredData} columns={columns} />
        </>
    );
};

export default SearchableTable;