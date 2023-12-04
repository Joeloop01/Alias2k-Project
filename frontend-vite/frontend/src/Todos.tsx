import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'

function Todos() {
    const [data, setData] = useState([])
    let params = useParams();
    const url = `http://localhost:6969/users/${params.client_id}/todos`;

    const fetchInfo = () => {
        return fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f`
            }
        })
            .then((res) => res.json())
            .then((d) => setData(d))
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return <div>{JSON.stringify(data)}</div>
}

export default Todos;