import { useState, useEffect } from 'react'
import axios from 'axios'

const getData = async (endpoint) => {
  try {
    const response = await axios.get(endpoint)
    return response.data
  } catch (error) {
    throw new Error('Failed to retrieve data')
  }
}

const useGetData = (endpoint) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(endpoint)
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, isLoading, error }
}

export default useGetData
