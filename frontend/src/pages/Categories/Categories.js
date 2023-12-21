import React, { useEffect, useState } from 'react'
import api from '../../api'
import CategoryForm from './CategoryForm'
import SearchableTable from '../../components/table/SearchableTable'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [editCategoryId, setEditCategoryId] = useState(null)

    const columns = [
        'description',
        'category',
        'income',
        'actions'
    ]

    const fetchData = (filter = null, filter_value = null) => {
        let url = `/api/categories/`
        if (filter && filter_value) {
            url += `&filter=${filter}&filter_value=${filter_value}`
        }
        api
            .get(url)
            .then(response => {
                setCategories(response.data.map(category => ({
                    ...category,
                    actions: <button onClick={() => handleEdit(category.id)} className='btn btn-primary'>Edit</button>
                })))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = categoryId => {
        setEditCategoryId(categoryId)
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

            <SearchableTable
                columns={columns}
                data={categories}
            />

        </>
    )
}

export default Categories
