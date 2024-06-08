import { useState, useEffect } from 'react'
import Filter from "./Components/Filter";
import countriesService from "./services/countries.js";
import Countries from "./Components/Countries";

function App() {
  const [country, setCountry] = useState([])
  const [newCountry, setNewCountry] = useState('')


  useEffect(() => {
    countriesService
        .getAll()
        .then(countries =>
            setCountry(countries))
  }, []);

  console.log(country)

  const handleCountryChange = (event)=>{
    console.log(event.target.value)
    setNewCountry(event.target.value)
  }

  const filteredCountries = newCountry ?
      country.filter(country => country.name.common.toLowerCase()
          .includes(newCountry.toLowerCase()))
            : null;

  const handleCountryShow = (showCountry) => {
    setNewCountry(showCountry)
    console.log(newCountry)
  }

  return (
    <div>
      <Filter handleCountryChange={handleCountryChange} value={newCountry}/>
      <Countries filteredCountries={filteredCountries} handleCountryShow={handleCountryShow}/>
    </div>
  )
}

export default App
