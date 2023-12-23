import React, { useEffect, useState } from 'react'
import api from '../../api'
import FileUploadForm from './FileUploadForm'
import Table from '../../components/table/Table'

const Files = () => {
    const [files, setFiles] = useState([])
    const [totalPages, setTotalPages] = useState(1)

    const columns = [
        'date',
        'file',
        'status',
        'message'
    ]

    const fetchData = (params) => {
        api
            .get('/api/uploads/', { params })
            .then(({ data }) => {
                setFiles(data.results)
                setTotalPages(data.count === 0 ? 1 : Math.max(1, Math.ceil(data.count / data.results.length)))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData({ page: 1 })
    }, [])

    const handleFormUpdate = () => {
        fetchData({ page: 1 })
    }

    return (
        <>
            <h1>Files</h1>

            <FileUploadForm
                onUpdate={handleFormUpdate}
            />

            <Table
                columns={columns}
                data={files}
                totalPages={totalPages}
                fetchData={fetchData}
            />

        </>
    )
}

export default Files
