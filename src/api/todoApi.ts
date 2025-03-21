import axios from 'axios'
import { ToDo, ToDoRequest, APIResponse } from '../types/types'

const API_URL = '/api/todos'

export const fetchTodos = async (): Promise<ToDo[]> => {
  const response = await axios.get<APIResponse<ToDo[]>>(API_URL)
  const result = response.data

  if (result.code === 200 && result.data) {
    return result.data
  }

  throw new Error(result.message || '할 일 목록을 불러오는데 실패했습니다.')
}

export const addTodo = async (newTodo: ToDoRequest): Promise<ToDo> => {
  const response = await axios.post<APIResponse<ToDo>>(API_URL, newTodo)
  const result = response.data

  if (result.code === 200 && result.data) {
    return result.data
  }

  throw new Error(result.message || '할 일 추가에 실패했습니다.')
}

export const getTodoById = async (id: number): Promise<ToDo> => {
  const response = await axios.get<APIResponse<ToDo>>(`${API_URL}/${id}`)
  const result = response.data

  if (result.code === 200 && result.data) {
    return result.data
  }

  throw new Error(result.message || '할 일을 찾을 수 없습니다.')
}

export const updateTodo = async (
  id: number,
  updates: Partial<ToDoRequest>
): Promise<ToDo> => {
  const response = await axios.get<APIResponse<ToDo>>(`${API_URL}/${id}`)
  const currentTodo = response.data.data

  if (!currentTodo) {
    throw new Error('업데이트할 할 일을 찾을 수 없습니다.')
  }

  const updatedTodo: ToDoRequest = {
    text: currentTodo.text,
    done: currentTodo.done,
    deadline: currentTodo.deadline,
    ...updates,
  }

  const updateResponse = await axios.put<APIResponse<ToDo>>(
    `${API_URL}/${id}`,
    updatedTodo
  )
  const result = updateResponse.data

  if (result.code === 200 && result.data) {
    return result.data
  }

  throw new Error(result.message || '할 일 업데이트에 실패했습니다.')
}

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await axios.delete<APIResponse<void>>(`${API_URL}/${id}`)
  const result = response.data

  if (result.code !== 200) {
    throw new Error(result.message || '할 일 삭제에 실패했습니다.')
  }
}

export const deleteMultipleTodos = async (ids: number[]): Promise<void> => {
  const deletePromises = ids.map((id) =>
    axios.delete<APIResponse<void>>(`${API_URL}/${id}`).then((res) => res.data)
  )

  const results = await Promise.all(deletePromises)
  const allSuccess = results.every((result) => result.code === 200)

  if (!allSuccess) {
    throw new Error('일부 항목 삭제에 실패했습니다.')
  }
}
