import { useState, useEffect, memo, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'

interface TodoSearchProps {
  onSearch: (query: string) => void
}

const SearchContainer = styled.div`
  max-width: 440px;
  margin-bottom: 20px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`

const SEARCH_QUERY_KEY = 'todo-search-query'

const TodoSearch: React.FC<TodoSearchProps> = memo(({ onSearch }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const savedQuery = localStorage.getItem(SEARCH_QUERY_KEY)
    if (savedQuery) {
      setQuery(savedQuery)
      onSearch(savedQuery)
    }
  }, [onSearch])

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      onSearch(newQuery)

      localStorage.setItem(SEARCH_QUERY_KEY, newQuery)
    },
    [onSearch]
  )

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="할 일 검색..."
        value={query}
        onChange={handleSearch}
      />
    </SearchContainer>
  )
})

export default TodoSearch
