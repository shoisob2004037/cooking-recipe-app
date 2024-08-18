document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    showContent();
});

function showContent() {
    const meals = ['sushi', 'Kumpir', 'Tamiya', 'Big Mac', 'Lasagne', 'Poutine', 'Timbits', 'Koshari', 'Kapsalon'];
    const primaryShow = document.querySelector('.primary-show');

    meals.forEach(meal => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then(res => res.json())
            .then(data => {
                const mealData = data.meals[0];
                primaryShow.innerHTML += `
                <div class="container">
                    <div class="row">
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xxl-12 mb-4">
                            <h1 style="font-size:35px;">${mealData.strMeal}</h1>
                            <h2 style="color:green;margin-bottom:10px;">Category : ${mealData.strCategory}</h2>
                            <img style="text-align:center; width:200px; height:200px; border-radius:10px;" src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                            <br>
                            <button onclick="showDetails('${mealData.idMeal}')">View Details</button>
                        </div>
                    </div>
                </div>
                `;
            })
            .catch(error => console.error('Error fetching meal:', error));
    });
}

function searchMeal() {
    const inputValue = document.getElementById('input').value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const primaryShow = document.querySelector('.primary-show');
            primaryShow.style.display = 'none'; 
            const heading = document.getElementById('heading');
            heading.innerText = `Results for ${inputValue}:`; 
            heading.style.display = 'block'; 
            const spaceDiv = document.getElementById('space');
            spaceDiv.innerHTML = '';
            if (data.meals) {
                for (let i = 0; i < data.meals.length; i++) {
                    const meal = data.meals[i];
                    const divNew = document.createElement('div');
                    divNew.className = 'meal-div';
                    divNew.innerHTML = `
                        <h1>${meal.strMeal}</h1>
                        <img style="text-align:center; border-radius:10px;" src="${meal.strMealThumb}" alt="${meal.strMeal}"><br>
                        <button onclick="showDetails('${meal.idMeal}')">View Details</button>
                    `;
                    spaceDiv.appendChild(divNew);
                }
            } else {
                spaceDiv.innerHTML = '<p>No results found</p>';
            }
        });
}

function showDetails(mealId) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            const popupDetails = document.getElementById('popup-details');
            popupDetails.innerHTML = `
                <h1 style="text-align:center;color:green;">${meal.strMeal}</h1>
                <h2 style="text-align:center;color:rgb(86, 88, 206);">${meal.strCategory}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:250px; display:block; margin:0 auto; margin-bottom:10px; border-radius:15px">
                <h3 style="text-align:center;">Ingredients:</h3>
                <ul style="text-align:center; list-style-type:none;">${getIngredients(meal)}</ul>
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
                ${meal.strYoutube ? `<h3 style="text-align:center;">You can visit the YouTube video for the recipe: <a href="${meal.strYoutube}" target="_blank"><button>Watch here</button></a></h3>` : ''}
            `;
            document.getElementById('popup').style.display = 'flex';
            document.body.classList.add('no-scroll');
        });
}

function getIngredients(meal) {
    let ingredients = '';
    for (let j = 1; j <= 20; j++) {
        if (meal[`strIngredient${j}`]) {
            ingredients += `<li>${meal[`strIngredient${j}`]} - ${meal[`strMeasure${j}`]}</li>`;
        }
    }
    return ingredients;
}

function closePopup() {
document.getElementById('popup').style.display = 'none';
document.body.classList.remove('no-scroll'); // Restore scrolling on the body
}