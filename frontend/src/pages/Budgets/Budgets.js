import React, { useEffect, useState } from 'react'
import api from '../../api'
import BudgetForm from './BudgetForm'
import Table from '../../components/table/Table'

const Budgets = () => {
    const [budgets, setBudgets] = useState([])
    const [editBudgetId, setEditBudgetId] = useState(null)
    const [categories, setCategories] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchData({ page: 1 })
        api
            .get('/api/categories/?paginate=false')
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                console.error('Error fetching currency data:', error)
            })
        api
            .get('/api/currencies/?paginate=false')
            .then(response => {
                setCurrencies(response.data)
            })
            .catch(error => {
                console.error('Error fetching currency data:', error)
            })
    }, [])

    const columns = [
        'amount',
        'currency',
        'start_date',
        'category',
        'actions'
    ]

    const fetchData = (params) => {
        api
            .get('/api/budgets/', { params })
            .then(({ data }) => {
                setBudgets(data.results.map(budget => ({
                    ...budget,
                    category: budget.category.category,
                    actions: <button onClick={() => handleEdit(budget.id)} className='btn btn-primary'>Edit</button>
                })))
                setTotalPages(data.count === 0 ? 1 : Math.max(1, Math.ceil(data.count / data.results.length)))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    const handleEdit = budgetId => {
        setEditBudgetId(budgetId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFormUpdate = updatedBudget => {
        // Update budgets list after adding/editing
        updatedBudget.actions = (
            <button onClick={() => handleEdit(updatedBudget.id)} className='btn btn-primary'>
                Edit
            </button>
        )
        updatedBudget.category = updatedBudget.category.category
        if (editBudgetId) {
            const updatedBudgets = budgets.map(budget =>
                budget.id === updatedBudget.id
                    ? updatedBudget
                    : budget
            )
            setBudgets(updatedBudgets)
        } else {
            setBudgets([updatedBudget, ...budgets])
        }
        setEditBudgetId(null)
    }

    return (
        <>
            <h1>Budgets</h1>

            <BudgetForm
                budgetId={editBudgetId}
                categories={categories}
                currencies={currencies}
                onUpdate={handleFormUpdate}
            />

            <Table
                columns={columns}
                data={budgets}
                fetchData={fetchData}
                totalPages={totalPages}
            />

        </>
    )
}

export default Budgets
