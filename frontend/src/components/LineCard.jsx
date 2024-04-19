import React from 'react';
import axios from "axios"

function LineCard({ line }) {
  // LineCard implementation
  const [historicalTrash, setHistoricalTrash] = useState([])
  const [count, setCount] = useState(0)
  const [nextPage, setNextPage] = useState(1)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/line/${line.id}/historical?page=0`).then(res => {
      setHistoricalTrash(res.data.trashEmpties)
      setCount(res.data.count)
    })
  }, [])

  async function loadMore() {
    const res = axios.get(`http://localhost:5000/api/line/${line.id}/historical?page=${nextPage}`)
   
    setHistoricalTrash([...historicalTrash, ...res.data.trashEmpties])
    setCount(res.data.count)
    setNextPage(nextPage + 1)
  }

  return (
    <div className="line-card">
      {/* Content of the line card */}
    </div>
  );
}

export default LineCard;