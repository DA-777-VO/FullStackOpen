import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const getAll = ()=>{
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const remove = id => {
    return axios.delete(`http://localhost:3001/persons/${id}`)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default {getAll, create, remove, update}
