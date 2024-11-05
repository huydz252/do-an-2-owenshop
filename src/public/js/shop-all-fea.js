var all = document.getElementById('all')
var fea = document.getElementById('fea')

var labelAll = document.getElementById('labelAll')
var labelFea = document.getElementById('labelFea')

var allProducts = document.getElementById('all-products')
var feaProducts = document.getElementById('feature-products')

console.log(all)
console.log(fea)
console.log(labelAll)
console.log(labelFea)
console.log(allProducts)
console.log(feaProducts)

all.onclick = function () {
    all.classList.add('target')
    fea.classList.remove('target')

    allProducts.style.setProperty("display", "flex");
    feaProducts.style.setProperty("display", "none");

    labelAll.style.setProperty("display", "block");
    labelFea.style.setProperty("display", "none");

}
fea.onclick = function () {
    all.classList.remove('target')
    fea.classList.add('target')

    allProducts.style.setProperty("display", "none");
    feaProducts.style.setProperty("display", "flex");

    labelFea.style.setProperty("display", "block");
    labelAll.style.setProperty("display", "none");
}