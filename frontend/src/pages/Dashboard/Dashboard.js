import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../../api'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SummaryForm = ({ onUpdate }) => {
    const initialFormData = Object.freeze({
        month: '',
    })
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        onUpdate(formData)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId='formMonth' className='mb-3'>
                <Form.Label>Month</Form.Label>
                <Form.Control
                    type='month'
                    name='month'
                    value={formData.month}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant='primary' type='submit' className='mb-3'>
                Submit
            </Button>
        </Form>
    )

};

function getCurrentMonth() {
    // month in YYYY-MM format
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // Months are zero-based, so we add 1 to get the current month
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    return `${year}-${month}`;
}

function convertToMonthYear(yyyyMM) {
    const [year, month] = yyyyMM.split('-');
    const date = new Date(Date.UTC(year, month, 1));

    const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
    const yearFormatter = new Intl.DateTimeFormat('en', { year: 'numeric' });

    const monthName = monthFormatter.formatToParts(date).find(part => part.type === 'month').value;
    const fullYear = yearFormatter.formatToParts(date).find(part => part.type === 'year').value;

    return `${monthName} ${fullYear}`;
}

const SummaryTable = ({ data }) => {
    const cols = [
        'category',
        'budget',
        'actual',
        'remaining'
    ]
    const totalsRow = {
        category: 'Total',
        budget: data.reduce((acc, row) => acc + row.budget, 0),
        actual: data.reduce((acc, row) => acc + row.actual, 0),
        remaining: data.reduce((acc, row) => acc + row.remaining, 0)
    }

    const getRowColor = row => {
        const ratio = row.ratio;
        const color = getColorForRatio(ratio);
        return `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
    };

    const getColorForRatio = ratio => {
        // 0 means you are over the budget, 1 means you are under the budget, 0.5 means you are at the budget
        const green = Math.floor(255 * ratio);
        const red = 255 - green;
        return [red, green, 0];
    }
    return (
        <table className='table' style={{ border: '1px solid #ddd' }}>
            <thead>
                <tr style={{ backgroundColor: '#e0e9f0' }}>
                    {cols.map(column => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: getRowColor(row) }}>
                        {cols.map(column => (
                            <td key={`${index}-${column}`}>{row[column]}</td>
                        ))}
                    </tr>
                ))}
                <tr key={'total'} style={{ backgroundColor: '#e0e9f0' }}>
                    {cols.map(column => (
                        <td key={`total-${column}`}>{totalsRow[column]}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

const BudgetVsActualBarChart = ({ summaryData }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };
    const labels = summaryData.map(item => item.category);
    summaryData.sort((a, b) => b.budget - a.budget);

    const data = {
        labels,
        datasets: [
            {
                label: 'Budget',
                data: summaryData.map(item => item.budget),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                maxBarThickness: 75,
            },
            {
                label: 'Actual Spend',
                data: summaryData.map(item => item.actual),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                maxBarThickness: 75,
            },
        ],
    };

    return (
        <Bar data={data} options={options} />
    );
};

const RemainingFromBudgetBarChart = ({ summaryData }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };
    const labels = summaryData.map(item => item.category);
    summaryData.sort((a, b) => b.remaining - a.remaining);

    const data = {
        labels,
        datasets: [
            {
                label: 'Remaining',
                data: summaryData.map(item => item.remaining),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                maxBarThickness: 150,
            }
        ],
    };

    return (
        <Bar data={data} options={options} />
    );
}

const Dashboard = () => {
    const [budgetSummary, setBudgetSummary] = useState([])
    const [month, setMonth] = useState(getCurrentMonth())
    const sigmoid = x => 1 / (1 + Math.exp(-x));

    useEffect(() => {
        api
            .get('/api/budgets/summary/?month=' + month)
            .then(response => {
                setBudgetSummary(response.data.map(row => ({
                    ...row,
                    ratio: row.budget === 0 ? 0 : (row.remaining > 0 ? sigmoid(row.remaining / row.budget) : sigmoid(-1 * row.actual / row.budget))
                })).sort((a, b) => a.ratio - b.ratio))
            })
            .catch(error => {
                console.error('Error fetching budget summary:', error)
            })
    }, [month])

    const handleUpdate = formData => {
        setMonth(formData.month)
    }

    return (
        <>
            <h1>Budget Summary for {convertToMonthYear(month)}</h1>
            <SummaryForm onUpdate={handleUpdate} />
            <SummaryTable data={budgetSummary} />
            <BudgetVsActualBarChart summaryData={budgetSummary} />
            <RemainingFromBudgetBarChart summaryData={budgetSummary} />
        </>
    );
};

export default Dashboard;
