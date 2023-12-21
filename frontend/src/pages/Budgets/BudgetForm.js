import React, { useState, useEffect } from 'react'
import api from '../../api'
import { Form, Button, Alert } from 'react-bootstrap'

const BudgetForm = ({ budgetId, categories, currencies, onUpdate }) => {
    const initialFormData = Object.freeze({
        amount: '',
        currency: '',
        start_date: '',
        category: '',
    })
    const [formData, setFormData] = useState(initialFormData)

    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        if (budgetId) {
            api
                .get(`/api/budgets/${budgetId}`)
                .then(response => {
                    setFormData(response.data)
                })
                .catch(error => {
                    console.error('Error fetching budget data:', error)
                })
        }
    }, [budgetId])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleClear = () => {
        setFormData(initialFormData)
    }

    const handleSubmit = e => {
        e.preventDefault()

        const apiUrl = budgetId
            ? `/api/budgets/${budgetId}/`
            : '/api/budgets/'

        api({
            method: budgetId ? 'put' : 'post',
            url: apiUrl,
            data: formData
        })
            .then(response => {
                const action = budgetId ? 'updated' : 'created'
                setSuccessMessage(`Budget successfully ${action}!`)
                setErrorMessage(null)
                onUpdate(response.data)
                handleClear()
            })
            .catch(error => {
                setSuccessMessage(null)
                setErrorMessage(error.response.data)
                console.error('Error submitting budget data:', error.response.data)
            })
    }

    return (
        <Form onSubmit={handleSubmit}>

            <Form.Group className='mb-3'>
                <Form.Label>Start Month</Form.Label>
                <Form.Control
                    type='month'
                    name='start_date'
                    value={formData.start_date.split('-').slice(0, 2).join('-')}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label>Amount:</Form.Label>
                <Form.Control
                    type='number'
                    name='amount'
                    value={formData.amount}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Label>Currency:</Form.Label>
                <Form.Control
                    as='select'
                    name='currency'
                    value={formData.currency}
                    onChange={handleChange}
                >
                    <option value=''>Select a currency</option>
                    {
                        currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>{currency.code}</option>
                        ))
                    }
                </Form.Control>
            </Form.Group>


            <Form.Group className='mb-3'>
                <Form.Label>Category:</Form.Label>
                <Form.Select
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value=''>Select category</option>
                    {
                        categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.category}
                            </option>
                        ))
                    }
                </Form.Select>
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
                    {budgetId ? 'Update' : 'Create'}
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

export default BudgetForm
