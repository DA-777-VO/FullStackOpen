const filterReducer = (state = '', action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
    case 'FILL_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = filter => {
  return {
    type: 'FILL_FILTER',
    payload: filter,
  }
}

export default filterReducer