import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as todoApi from '../api/todoApi'
import { ToDo, ToDoRequest } from '../types/types'

export const QUERY_KEYS = {
  TODOS: 'todos',
  TODO: 'todo',
}

export const useTodosQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TODOS],
    queryFn: todoApi.fetchTodos,
  })
}

export const useTodoQuery = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TODO, id],
    queryFn: () => todoApi.getTodoById(id),
    enabled: !!id,
  })
}

export const useAddTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoApi.addTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData<ToDo[]>([QUERY_KEYS.TODOS], (oldTodos = []) => [
        ...oldTodos,
        newTodo,
      ])

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
    },
  })
}

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<ToDoRequest>
    }) => todoApi.updateTodo(id, updates),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<ToDo[]>([QUERY_KEYS.TODOS], (oldTodos = []) =>
        oldTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      )

      queryClient.setQueryData([QUERY_KEYS.TODO, updatedTodo.id], updatedTodo)

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
    },
  })
}

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<ToDo[]>([QUERY_KEYS.TODOS], (oldTodos = []) =>
        oldTodos.filter((todo) => todo.id !== deletedId)
      )

      queryClient.removeQueries({ queryKey: [QUERY_KEYS.TODO, deletedId] })

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
    },
  })
}

export const useDeleteMultipleTodosMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoApi.deleteMultipleTodos,
    onSuccess: (_data, deletedIds) => {
      queryClient.setQueryData<ToDo[]>([QUERY_KEYS.TODOS], (oldTodos = []) =>
        oldTodos.filter((todo) => !deletedIds.includes(todo.id))
      )

      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.TODO, id] })
      })

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
    },
  })
}
