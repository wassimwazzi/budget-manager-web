import React, { useEffect, useState } from 'react'
import api from '../../api'
import FileUploadForm from './FileUploadForm'
import SearchableTable from '../../components/table/SearchableTable'
import TableNavigator from '../../components/table/TableNavigator'

const Files = () => {
    const [files, setFiles] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedColumn, setSelectedColumn] = useState('')

    const columns = [
        'date',
        'file',
        'status',
        'message'
    ]

    const fetchData = (page, filter, filter_value) => {
        let url = `/api/uploads/?page=${page}`
        if (filter && filter_value) {
            url += `&filter=${filter}&filter_value=${filter_value}`
        }
        api
            .get(url)
            .then(({ data }) => {
                setFiles(data.results)
                setTotalPages(data.count === 0 ? 1 : Math.max(1, Math.ceil(data.count / data.results.length)))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData(1, selectedColumn, searchTerm)
    }, [searchTerm, selectedColumn])

    const handleFormUpdate = updatedFile => {
        setFiles([updatedFile, ...files])
    }

    const searchHandler = (searchTerm, selectedColumn) => {
        setSearchTerm(searchTerm)
        setSelectedColumn(selectedColumn)
    };

    const pageHandler = page => {
        fetchData(page, selectedColumn, searchTerm)
    }

    return (
        <>
            <h1>Files</h1>

            <FileUploadForm
                onUpdate={handleFormUpdate}
            />

            <SearchableTable
                columns={columns}
                data={files}
                searchHandler={searchHandler}
            />

            <TableNavigator
                totalPages={totalPages}
                fetchData={pageHandler}
            />

        </>
    )
}

export default Files
