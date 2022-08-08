'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const inputCountry = document.querySelector(`.inputCountry`);

///////////////////////////////////////
const getJSON = function (url, errorMsg = `Something went wrong`){
    return fetch(url).then(response => {

        if (!response.ok) throw new Error(`${errorMsg}`);
        return response.json()
    });  
};
const renderCountry = function(data, className = ``){
    const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
    `;
    countriesContainer.insertAdjacentHTML(`beforeend`, html);
    countriesContainer.style.opacity = 1;
};

const renderError = function (msg){
    countriesContainer.insertAdjacentText(`beforeend`, msg);
    countriesContainer.style.opacity = 1;
};


// const getCountryAndNeighbour = function(country){
// const request = new XMLHttpRequest();
// request.open(`GET`, `https://restcountries.com/v2/name/${country}`);
// request.send();

// request.addEventListener(`load`, function(){
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data); 
//     const [neighbour] = data.borders;
//     if(!neighbour) return;
//     const request2 = new XMLHttpRequest();
//     request2.open(`GET`, `https://restcountries.com/v2/alpha/${neighbour}`);
//     request2.send();
//         request2.addEventListener(`load`, function(){
//         const data2 = JSON.parse(this.responseText);
//         renderCountry(data2, `neighbour`);
//         });

// });
// };

const getCountryData = function(country){
     getJSON(`https://restcountries.com/v2/name/${country}`, `Country is incorrect`)
    .then(data => {
         renderCountry(data[0]);
    
         const neighbour = data[0].borders[0];
         if (!neighbour) throw new Error(`No neighbour found`);

         return getJSON (`https://restcountries.com/v2/alpha/${neighbour}`,`Country is incorrect` );
    })
    .then(data=>renderCountry(data, `neighbour`)) 
    .catch(err=> {
        console.log(`${err}`);
        renderError(`Something went wrong. ${err.message}`);
})
};

btn.addEventListener(`click`, function(){
    getCountryData(`${inputCountry.value}`); 
});
