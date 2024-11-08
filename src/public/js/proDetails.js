const related_products = document.getElementsByClassName('small-img');
const mainImg = document.getElementsById('MainImg');
related_products.forEach(element => {
    element.addEventListener('click', () => {
        let src = element.src
        mainImg.src = src
    })
});