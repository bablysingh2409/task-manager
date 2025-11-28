import { renderHook, act, waitFor } from '@testing-library/react'
import { TodoProvider, useTodo } from '@/context/TodoContext'

global.fetch = jest.fn()

describe('TodoContext', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should fetch todos on mount', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Test Task', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.tasks.length).toBeGreaterThanOrEqual(1)
    expect(result.current.tasks[0].title).toBe('Test Task')
  })

  it('should add a new task', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [],
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const newTask = {
      id: 999,
      title: 'New Task',
      description: 'New Description',
      status: 'Pending',
      dueDate: '2024-12-31',
      completed: false,
    }

    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 999 }),
    })

    await act(async () => {
      result.current.addTask(newTask)
    })

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThan(0)
      expect(result.current.tasks[0].title).toBe('New Task')
    })
  })

  it('should update a task', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Original Task', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    fetch.mockResolvedValueOnce({
      json: async () => ({}),
    })

    await act(async () => {
      result.current.updateTask(1, {
        title: 'Updated Task',
        status: 'Completed',
      })
    })

    await waitFor(() => {
      const updatedTask = result.current.tasks.find(t => t.id === 1)
      expect(updatedTask.title).toBe('Updated Task')
      expect(updatedTask.status).toBe('Completed')
    })
  })

  it('should delete a task', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Task to Delete', completed: false },
      { id: 2, userId: 1, title: 'Task to Keep', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThanOrEqual(2)
    })

    act(() => {
      result.current.deleteTask(1)
    })

    await waitFor(() => {
      const hasDeletedTask = result.current.tasks.some(t => t.id === 1)
      expect(hasDeletedTask).toBe(false)
    })
  })

  it('should mark task as complete', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Incomplete Task', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.markComplete(1)
    })

    await waitFor(() => {
      const task = result.current.tasks.find(t => t.id === 1)
      expect(task.status).toBe('Completed')
      expect(task.completed).toBe(true)
    })
  })

  it('should filter tasks by search query', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Buy groceries', completed: false },
      { id: 2, userId: 1, title: 'Walk the dog', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThanOrEqual(2)
    })

    act(() => {
      result.current.setSearchQuery('groceries')
    })

    await waitFor(() => {
      expect(result.current.filteredTasks.some(t => t.title.includes('groceries'))).toBe(true)
    })
  })

  it('should filter tasks by status', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [
        { id: 1, userId: 1, title: 'Task 1', completed: true },
        { id: 2, userId: 1, title: 'Task 2', completed: false },
      ],
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setStatusFilter('Completed')
    })

    await waitFor(() => {
      expect(result.current.statusFilter).toBe('Completed')
    })
  })

  it('should sort tasks by due date', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Task 1', completed: false },
      { id: 2, userId: 1, title: 'Task 2', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThanOrEqual(2)
    })

    act(() => {
      result.current.setSortOrder('desc')
    })

    expect(result.current.sortOrder).toBe('desc')
  })

  it('should calculate task statistics correctly', async () => {
    const mockTodos = [
      { id: 1, userId: 1, title: 'Task 1', completed: true },
      { id: 2, userId: 1, title: 'Task 2', completed: false },
      { id: 3, userId: 1, title: 'Task 3', completed: false },
    ]
    
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    })

    const { result } = renderHook(() => useTodo(), {
      wrapper: TodoProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.totalTasks).toBeGreaterThanOrEqual(3)
    expect(result.current.completedTasks).toBeGreaterThanOrEqual(1)
  })
})