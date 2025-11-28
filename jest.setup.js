import '@testing-library/jest-dom'

// Mock next/navigation with proper jest.fn() mocks
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockPrefetch = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
  })),
  usePathname: jest.fn(() => ''),
  useParams: jest.fn(() => ({})),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: { name: 'Test User', email: 'test@example.com' },
    },
    status: 'authenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({
    innerRef: jest.fn(),
    droppableProps: {},
    placeholder: null,
  }),
  Draggable: ({ children, draggableId, index }) => children({
    innerRef: jest.fn(),
    draggableProps: {},
    dragHandleProps: {},
  }, {}),
}))

// Mock window.fetch
global.fetch = jest.fn()

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})