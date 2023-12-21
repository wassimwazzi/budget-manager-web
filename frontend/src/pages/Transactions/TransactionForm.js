import React, { useState, useEffect } from 'react'
import api from '../../api'
import { Form, Button } from 'react-bootstrap'

const TransactionForm = ({ transactionId, onUpdate }) => {
  const [formData, setFormData] = useState({
    date: '',
    code: '',
    description: '',
    category: '',
    amount: '',
    currency: ''
  })

  const [categories, setCategories] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [currentTransactionId, setCurrentTransactionId] =
    useState(transactionId)

  useEffect(() => {
    setCurrentTransactionId(transactionId)
    api
      .get('/api/categories')
      .then(response => {
        setCategories(response.data)
      })
      .catch(error => {
        console.error('Error fetching currency data:', error)
      })
    api
      .get('/api/currencies')
      .then(response => {
        setCurrencies(response.data)
      })
      .catch(error => {
        console.error('Error fetching currency data:', error)
      })

    if (transactionId) {
      api
        .get(`/api/transactions/${transactionId}`)
        .then(response => {
          setFormData({
            ...response.data,
            category: response.data.category.id
          })
        })
        .catch(error => {
          console.error('Error fetching transaction data:', error)
        })
    }
  }, [transactionId])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleClear = () => {
    setFormData({
      date: '',
      code: '',
      description: '',
      category: '',
      amount: '',
      currency: ''
    })
    setCurrentTransactionId(null)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const apiUrl = currentTransactionId
      ? `/api/transactions/${currentTransactionId}/`
      : '/api/transactions/'

    api({
      method: currentTransactionId ? 'put' : 'post',
      url: apiUrl,
      data: formData
    })
      .then(response => {
        onUpdate(response.data)
        handleClear()
      })
      .catch(error => {
        console.error('Error submitting transaction data:', error)
      })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Date:</Form.Label>
        <Form.Control
          type='date'
          name='date'
          value={formData.date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Code:</Form.Label>
        <Form.Control
          type='text'
          name='code'
          value={formData.code}
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
          required
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Category:</Form.Label>
        <Form.Select
          name='category'
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value=''>Select category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Amount:</Form.Label>
        <Form.Control
          type='number'
          name='amount'
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Currency:</Form.Label>
        <Form.Select
          name='currency'
          value={formData.currency}
          onChange={handleChange}
          required
        >
          <option value=''>Select currency</option>
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className='mb-3'>
        <Button type='submit' variant='primary'>
          {currentTransactionId ? 'Update' : 'Create'}
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
    </Form>
  )
}

export default TransactionForm
