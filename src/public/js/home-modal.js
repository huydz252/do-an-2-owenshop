
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var productImage = document.getElementById("modalProductImage");

// When the user clicks the button, open the modal 
Array.from(btn).forEach(element => {
    element.onclick = function () {
        productImage.src = "/imgs/products/" + element.getAttribute("data-image");
        modal.style.display = "block";
    }
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}