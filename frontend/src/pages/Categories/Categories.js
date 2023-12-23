import React, { useEffect, useState } from 'react'
import api from '../../api'
import CategoryForm from './CategoryForm'
import Table from '../../components/table/Table'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [editCategoryId, setEditCategoryId] = useState(null)
    const [totalPages, setTotalPages] = useState(1)

    const columns = [
        'description',
        'category',
        'income',
        'actions'
    ]

    const fetchData = (params) => {
        api
            .get('/api/categories/', { params })
            .then(({ data }) => {
                setCategories(data.results.map(category => ({
                    ...category,
                    income: category.income ? 'Yes' : 'No',
                    actions: <button onClick={() => handleEdit(category.id)} className='btn btn-primary'>Edit</button>
                })))
                setTotalPages(data.count === 0 ? 1 : Math.max(1, Math.ceil(data.count / data.results.length)))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData({ page: 1 })
    }, [])

    const handleEdit = categoryId => {
        setEditCategoryId(categoryId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFormUpdate = updatedCategory => {
        // Update categories list after adding/editing
        updatedCategory.actions = (
            <button onClick={() => handleEdit(updatedCategory.id)} className='btn btn-primary'>
                Edit
            </button>
        )
        if (editCategoryId) {
            const updatedCategories = categories.map(category =>
                category.id === updatedCategory.id
                    ? updatedCategory
                    : category
            )
            setCategories(updatedCategories)
        } else {
            setCategories([updatedCategory, ...categories])
        }
        setEditCategoryId(null)
    }

    return (
        <>
            <h1>Categories</h1>

            <CategoryForm
                categoryId={editCategoryId}
                onUpdate={handleFormUpdate}
            />

            <Table
                columns={columns}
                data={categories}
                fetchData={fetchData}
                totalPages={totalPages}
            />

        </>
    )
}

export default Categories
