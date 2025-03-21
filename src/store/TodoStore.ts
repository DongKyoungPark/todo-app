import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface TodoUIState {
  searchQuery: string
  editingId: number | null
  selectedTodoIds: number[]

  setSearchQuery: (query: string) => void
  setEditingId: (id: number | null) => void
  selectTodo: (id: number, selected: boolean) => void
  clearSelectedTodos: () => void
}

const todoStore = create<TodoUIState>()(
  devtools(
    persist(
      (set) => ({
        searchQuery: '',
        editingId: null,
        selectedTodoIds: [],

        setSearchQuery: (query: string) => {
          set({ searchQuery: query })
          localStorage.setItem('todo-search-query', query)
        },

        setEditingId: (id: number | null) => {
          set({ editingId: id })
        },

        selectTodo: (id: number, selected: boolean) => {
          set((state) => {
            if (selected) {
              return {
                selectedTodoIds: [...state.selectedTodoIds, id],
              }
            } else {
              return {
                selectedTodoIds: state.selectedTodoIds.filter(
                  (todoId) => todoId !== id
                ),
              }
            }
          })
        },

        clearSelectedTodos: () => {
          set({ selectedTodoIds: [] })
        },
      }),
      {
        name: 'todo-ui-storage',
        partialize: (state) => ({
          searchQuery: state.searchQuery,
        }),
      }
    )
  )
)

export default todoStore
