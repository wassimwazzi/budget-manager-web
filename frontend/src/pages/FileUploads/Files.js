import React, { useEffect, useState } from 'react'
import api from '../../api'
import FileUploadForm from './FileUploadForm'
import SearchableTable from '../../components/table/SearchableTable'

const Files = () => {
    const [files, setFiles] = useState([])

    const columns = [
        'date',
        'file',
        'status',
        'message'
    ]

    const fetchData = (filter = null, filter_value = null) => {
        let url = `/api/uploads/`
        if (filter && filter_value) {
            url += `&filter=${filter}&filter_value=${filter_value}`
        }
        api
            .get(url)
            .then(response => {
                setFiles(response.data.results)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleFormUpdate = updatedFile => {
        setFiles([updatedFile, ...files])
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
            />

        </>
    )
}

export default Files
