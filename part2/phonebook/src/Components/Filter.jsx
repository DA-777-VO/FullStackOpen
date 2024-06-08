const Filter = ({handleSearchChange, searchTerm}) => {
    return (
        <div>
            filter shown with<input onChange={handleSearchChange} value={searchTerm}/>
        </div>
    )
}

export default Filter