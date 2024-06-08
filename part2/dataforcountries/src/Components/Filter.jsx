const Filter = ({handleCountryChange, value}) => {
    return(
        <div>
            find countries<input onChange={handleCountryChange} value={value} />
        </div>
    )
}

export default Filter