import React, { useState, useEffect } from 'react'
import api from '../../api'
import { Form, Button, Alert } from 'react-bootstrap'

const CategoryForm = ({ categoryId, onUpdate }) => {
    const initialFormData = Object.freeze({
        income: '',
        category: '',
        description: '',
    })
    const [formData, setFormData] = useState(initialFormData)

    const [currentCategoryId, setCurrentCategoryId] =
        useState(categoryId)
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        setCurrentCategoryId(categoryId)

        if (categoryId) {
            api
                .get(`/api/categories/${categoryId}`)
                .then(response => {
                    setFormData(response.data)
                })
                .catch(error => {
                    console.error('Error fetching category data:', error)
                })
        }
    }, [categoryId])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleClear = () => {
        setFormData(initialFormData)
        setCurrentCategoryId(null)
    }

    const handleSubmit = e => {
        e.preventDefault()

        const apiUrl = currentCategoryId
            ? `/api/categories/${currentCategoryId}/`
            : '/api/categories/'

        api({
            method: currentCategoryId ? 'put' : 'post',
            url: apiUrl,
            data: formData
        })
            .then(response => {
                const action = currentCategoryId ? 'updated' : 'created'
                setSuccessMessage(`Category successfully ${action}!`)
                setErrorMessage(null)
                onUpdate(response.data)
                handleClear()
            })
            .catch(error => {
                setSuccessMessage(null)
                setErrorMessage(error.response.data)
                console.error('Error submitting category data:', error.response.data)
            })
    }

    return (
        <Form onSubmit={handleSubmit}>

            <Form.Group className='mb-3'>
                <Form.Label>Category:</Form.Label>
                <Form.Control
                    type='text'
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
            </Form.Group>


            <Form.Group className='mb-3'>
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Check
                    type='switch'
                    label='Income'
                    checked={formData.income}
                    onChange={handleChange}
                />
            </Form.Group>

            {
                successMessage && (
                    <Alert variant='success' className='mt-3'>
                        {successMessage}
                    </Alert>
                )
            }

            {
                errorMessage && (
                    <Alert variant='danger' className='mt-3'>
                        {errorMessage}
                    </Alert>
                )
            }

            <div className='mb-3'>
                <Button type='submit' variant='primary'>
                    {currentCategoryId ? 'Update' : 'Create'}
                </Button>
                <Button
                    type='button'
                    onClick={handleClear}
                    variant='secondary'
                    className='ml-2'
                >
                    Clear
                </Button>
            </div>
        </Form >
    )
}

export default CategoryForm
