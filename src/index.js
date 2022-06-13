import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;

const debounce = require('lodash.debounce');

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
    
}

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(event) {
    event.preventDefault();
    const searchForm = event.target.value.trim();
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    
    if (searchForm !== '') {
      fetchCountries(searchForm)
        .then(renderCountryCard)
        .catch(onFetchError)
        // .finally(() => searchForm.reset());  
    }
            
}

function onFetchError(error) {
   error = Notify.failure("Oops, there is no country with that name")
}


function renderCountryCard(countries) {
    if (countries.length > 10) {
        Notify.info(`Too many matches found. Please enter a more specific name.`);
    }
    if (countries.length < 10 && countries.length > 1) {
        const createMarkup = countries
            .map(({ flags, name }) => {
                return `
            <div class="card">
            <h2 class="card-title"><img src="${flags.svg}" alt="${name.official}" width=40px>${name.official}</h2>
        </div>`;
            }).join('');
        refs.countryList.insertAdjacentHTML('beforeend', createMarkup);
    }
    if (countries.length === 1) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        const createMarkupForOne = countries
            .map(({ name, capital, population, flags, languages }) => {
                const language = Object.values(languages);
                return `
            <div class="card-one">
            <h2 class="card-title"><img src="${flags.svg}" alt="${name.official} width=40px">${name.official}</h2>
            <p  class="card-text">Capital: ${capital}</p>
            <p  class="card-text">Population: ${population}</p>
            <p  class="card-text">Languages: ${language}</p>
        </div>`;
            }).join('');
        refs.countryList.innerHTML = '';
        refs.countryInfo.insertAdjacentHTML('beforeend', createMarkupForOne);
        
    }
}
