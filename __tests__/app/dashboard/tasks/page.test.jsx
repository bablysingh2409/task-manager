import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import TasksPage from '@/app/dashboard/tasks/page'
import { TodoProvider } from '@/context/TodoContext'

jest.mock('next-auth/react')

describe('Tasks Page', () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    })
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, userId: 1, title: 'Test Task', completed: false },
          ]),
      })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render tasks list', async () => {
    render(
      <TodoProvider>
        <TasksPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument()
    })
  })

  it('should filter tasks by search query', async () => {
    render(
      <TodoProvider>
        <TasksPage />
      </TodoProvider>
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search tasks...')
      expect(searchInput).toBeInTheDocument()
      fireEvent.change(searchInput, { target: { value: 'Test' } })
    })
  })

  it('should filter tasks by status', async () => {
    render(
      <TodoProvider>
        <TasksPage />
      </TodoProvider>
    )

    await waitFor(() => {
      const statusFilter = screen.getByDisplayValue('All Status')
      expect(statusFilter).toBeInTheDocument()
      fireEvent.change(statusFilter, { target: { value: 'Completed' } })
    })
  })

  it('should sort tasks by due date', async () => {
    render(
      <TodoProvider>
        <TasksPage />
      </TodoProvider>
    )

    await waitFor(() => {
      const sortSelect = screen.getByDisplayValue('Due Date (Earliest)')
      expect(sortSelect).toBeInTheDocument()
      fireEvent.change(sortSelect, { target: { value: 'desc' } })
    })
  })

  it('should show add new task button', async () => {
    render(
      <TodoProvider>
        <TasksPage />
      </TodoProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument()
    })
  })
})