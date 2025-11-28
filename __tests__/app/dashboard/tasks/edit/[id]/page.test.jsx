import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import NewTaskPage from '@/app/dashboard/tasks/new/page'
import { TodoProvider } from '@/context/TodoContext'

jest.mock('next-auth/react')
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('New Task Page', () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    })
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render create task form', async () => {
    render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
    })
  })

  it('should show validation errors for empty fields', async () => {
    render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(screen.getByText('Due date is required')).toBeInTheDocument()
    })
  })

  it('should show validation error for short title', async () => {
    render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    const titleInput = screen.getByPlaceholderText('Enter task title')
    fireEvent.change(titleInput, { target: { value: 'ab' } })

    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Title must be at least 3 characters')
      ).toBeInTheDocument()
    })
  })

  it('should show validation error for short description', async () => {
    render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    const descInput = screen.getByPlaceholderText('Enter task description')
    fireEvent.change(descInput, { target: { value: 'short' } })

    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Description must be at least 10 characters')
      ).toBeInTheDocument()
    })
  })

  it('should validate past due dates', async () => {
    const { container } = render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    // Find date input using querySelector
    const dateInput = container.querySelector('input[type="date"]')
    expect(dateInput).toBeInTheDocument()
    
    const pastDate = '2020-01-01'
    fireEvent.change(dateInput, { target: { value: pastDate } })

    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Due date cannot be in the past')
      ).toBeInTheDocument()
    })
  })

  it('should submit valid form', async () => {
    const { toast } = require('sonner')
    const { container } = render(
      <TodoProvider>
        <NewTaskPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    const titleInput = screen.getByPlaceholderText('Enter task title')
    const descInput = screen.getByPlaceholderText('Enter task description')
    const dateInput = container.querySelector('input[type="date"]')

    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    fireEvent.change(descInput, {
      target: { value: 'This is a valid description' },
    })
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } })

    const submitButton = screen.getByText('Create Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Task created successfully!')
    }, { timeout: 3000 })
  })
})