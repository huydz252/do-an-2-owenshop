// Sự kiện cho checkbox sản phẩm
document.querySelectorAll('.product-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        let total = 0;
        const id = parseFloat(checkbox.getAttribute('data-id'));
        let checked = checkbox.checked;

        document.querySelectorAll('.product-checkbox:checked').forEach(checkedCheckbox => {
            const price = parseFloat(checkedCheckbox.getAttribute('data-price'));
            const quantity = parseInt(checkedCheckbox.getAttribute('data-quantity'));
            total += price * quantity;
        });

        document.getElementById('total-price-cart').textContent = 'Total: $' + total.toFixed(2);
        updateTotalOnServer(id, total, checked);
    });
});

// Cập nhật tổng tiền trên server
function updateTotalOnServer(id, total, checked) {
    fetch('/cart/update-cart-total', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id, total: total, checked: checked })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server updated successfully');
        })
        .catch(error => {
            console.error('Error updating total on server:', error);
        });
}

// Sự kiện giảm số lượng
document.querySelectorAll('.decrease').forEach(decrease => {
    decrease.addEventListener('click', function () {
        let quantity = decrease.nextElementSibling.value;
        if (quantity > 1) {
            quantity--;
        }

        const id = decrease.getAttribute('data-id');
        const price = decrease.getAttribute('data-price');

        updateQuantityOnServer(id, quantity);
        decrease.nextElementSibling.value = parseInt(quantity);

        const total = parseFloat(price * quantity);
        decrease.closest('tr').querySelector('.total-price-product').textContent = '$' + total.toFixed(2);

        const totalQuantity = getTotalCart();
        document.querySelector('.quantity').textContent = totalQuantity;
    });
});

// Sự kiện tăng số lượng
document.querySelectorAll('.increase').forEach(increase => {
    increase.addEventListener('click', function () {
        let quantity = increase.previousElementSibling.value;
        quantity++;

        const id = increase.getAttribute('data-id');
        const price = increase.getAttribute('data-price');

        updateQuantityOnServer(id, quantity);
        increase.previousElementSibling.value = parseInt(quantity);

        const total = parseFloat(price * quantity);
        increase.closest('tr').querySelector('.total-price-product').textContent = '$' + total.toFixed(2);
    });
});

// Cập nhật số lượng trên server
function updateQuantityOnServer(id, quantity) {
    fetch('/cart/update-quantity-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id, quantity: quantity })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server updated successfully');
        })
        .catch(error => {
            console.error('Error updating total on server:', error);
        });
}

// Tính tổng số lượng trong giỏ hàng
function getTotalCart() {
    let totalQuantity = 0;
    document.querySelectorAll('.count').forEach(quantity => {
        totalQuantity += parseInt(quantity.value) || 0;
    });
    return totalQuantity;
}
