const bar = document.getElementById('bar')
const close = document.getElementById('close')
const nav = document.getElementById('navbar')
const cart = document.getElementById('cart')

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
        cart.style.display = "none"

    })

    if (close) {
        close.addEventListener('click', () => {
            nav.classList.remove('active')
        })
    }
}
