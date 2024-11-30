document.addEventListener('DOMContentLoaded', function () {

    // Sự kiện cho checkbox sản phẩm (Desktop)
    document.querySelectorAll('.product-checkbox_desktop').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateTotalCart(); // Gọi hàm để cập nhật tổng tiền khi có sự thay đổi checked
            let id_pro = checkbox.dataset.id
            console.log('check id_pro: ', id_pro)
            let checked = true
            if (!checkbox.checked) {
                checked = false
            }
            updateCheckedProducts(id_pro, checked)
        });
    });

    // Sự kiện cho checkbox sản phẩm (Mobile)
    document.querySelectorAll('.product-checkbox_mobile').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateTotalCartMobile(); // Gọi hàm để cập nhật tổng tiền khi có sự thay đổi checked
            let id_pro = checkbox.dataset.id
            console.log('check id_pro: ', id_pro)
            let checked = true
            if (!checkbox.checked) {
                checked = false
            }
            updateCheckedProducts(id_pro, checked)
        });

    });

    function updateCheckedProducts(id_pro, checked) {
        fetch('/cart/updateCheckedProducts', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id_pro, checked: checked })
        })
    }

    // Sử dụng event delegation để đăng ký sự kiện cho nút tăng/giảm (Desktop)
    document.querySelector('#cart_content_desktop').addEventListener('click', function (event) {
        if (event.target.classList.contains('increase_desktop') || event.target.classList.contains('decrease_desktop')) {
            const button = event.target;
            const isIncrease = button.classList.contains('increase_desktop');

            let quantityInput = isIncrease ? button.previousElementSibling : button.nextElementSibling;
            let quantity = parseInt(quantityInput.value);

            if (isIncrease) {
                quantity++; // Tăng số lượng
            } else if (quantity > 1) {
                quantity--; // Giảm số lượng
            }

            const id = button.getAttribute('data-id');
            const price = parseFloat(button.getAttribute('data-price'));
            const checkbox = button.closest('tr').querySelector('.product-checkbox_desktop');

            if (!id) {
                console.error('data-id is undefined');
                return;
            }

            // Cập nhật lại giá trị trong input
            quantityInput.value = quantity;

            // Tính lại tổng giá cho sản phẩm hiện tại
            const total = price * quantity;
            button.closest('tr').querySelector('.total-price-product_desktop').textContent = '$' + total;

            // Gửi yêu cầu cập nhật số lượng lên server
            updateQuantityOnServer(id, quantity);

            // Nếu sản phẩm được checked thì cập nhật tổng giá trị giỏ hàng
            if (checkbox && checkbox.checked) {
                updateTotalCart();
            }

            // Cập nhật tổng số lượng giỏ hàng
            const totalQuantity = getTotalCart();
            document.querySelector('#quantity').textContent = totalQuantity;
        }
    });

    // Sử dụng event delegation để đăng ký sự kiện cho nút tăng/giảm (Mobile)
    document.querySelector('#cart_content_mobile').addEventListener('click', function (event) {
        if (event.target.classList.contains('increase_mobile') || event.target.classList.contains('decrease_mobile')) {
            const button = event.target;
            const isIncrease = button.classList.contains('increase_mobile');

            let quantityInput = isIncrease ? button.previousElementSibling : button.nextElementSibling;
            let quantity = parseInt(quantityInput.value);

            if (isIncrease) {
                quantity++; // Tăng số lượng
            } else if (quantity > 1) {
                quantity--; // Giảm số lượng
            }

            const id = button.getAttribute('data-id');
            const price = parseFloat(button.getAttribute('data-price'));
            const checkbox = button.closest('.pro').querySelector('.product-checkbox_mobile');

            if (!id) {
                console.error('data-id is undefined');
                return;
            }

            // Cập nhật lại giá trị trong input
            quantityInput.value = quantity;

            // Tính lại tổng giá cho sản phẩm hiện tại
            const total = price * quantity;
            button.closest('.pro').querySelector('.total-price-product_mobile').textContent = 'Total $' + total;

            // Gửi yêu cầu cập nhật số lượng lên server
            updateQuantityOnServer(id, quantity);

            // Nếu sản phẩm được checked thì cập nhật tổng giá trị giỏ hàng
            if (checkbox && checkbox.checked) {
                updateTotalCartMobile();
            }

            // Cập nhật tổng số lượng giỏ hàng
            const totalQuantity = getTotalCartMobile();
            document.querySelector('#quantity').textContent = totalQuantity;
        }
    });

    // Cập nhật tổng giá trị của giỏ hàng (Desktop)
    function updateTotalCart() {
        let total = 0;

        // Tính toán tổng giá trị giỏ hàng dựa trên tất cả các sản phẩm đã checked
        document.querySelectorAll('.product-checkbox_desktop:checked').forEach(checkedCheckbox => {
            const price = parseFloat(checkedCheckbox.getAttribute('data-price'));
            const quantity = parseInt(checkedCheckbox.closest('tr').querySelector('.count_desktop').value);
            total += price * quantity;
        });

        // Cập nhật tổng giá trị trong giao diện
        document.getElementById('total-price-cart_desktop').textContent = 'Total: $' + total;
        document.getElementById('total-price-pay').textContent = 'Total: $' + total;
    }

    // Cập nhật tổng giá trị của giỏ hàng (Mobile)
    function updateTotalCartMobile() {
        let total = 0;

        // Tính toán tổng giá trị giỏ hàng dựa trên tất cả các sản phẩm đã checked
        document.querySelectorAll('.product-checkbox_mobile:checked').forEach(checkedCheckbox => {
            const price = parseFloat(checkedCheckbox.getAttribute('data-price'));
            const quantity = parseInt(checkedCheckbox.closest('.pro').querySelector('.count').value);
            total += price * quantity;
        });

        // Cập nhật tổng giá trị trong giao diện
        document.getElementById('total-price-cart_mobile').textContent = 'Total: $' + total;
        document.getElementById('total-price-pay').textContent = 'Total: $' + total;
    }

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

    // Tính tổng số lượng trong giỏ hàng (Desktop)
    function getTotalCart() {
        let totalQuantity = 0;
        document.querySelectorAll('.count_desktop').forEach(quantity => {
            totalQuantity += parseInt(quantity.value) || 0;
        });
        console.log('check total cart (desktop): ', totalQuantity);
        return totalQuantity;
    }

    // Tính tổng số lượng trong giỏ hàng (Mobile)
    function getTotalCartMobile() {
        let totalQuantity = 0;
        document.querySelectorAll('.count').forEach(quantity => {
            totalQuantity += parseInt(quantity.value) || 0;
        });
        console.log('check total cart (mobile): ', totalQuantity);
        return totalQuantity;
    }

    // Mở modal (Desktop)
    document.querySelector("#openModalBtn_desktop").onclick = function () {
        console.log('open modal');
        document.getElementById("paymentModal").style.display = "block";
        fetch('/cart/getCheckedProducts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    const productCheckedContainer = document.querySelector('.product-checked');
                    productCheckedContainer.innerHTML = '';

                    data.checkedProducts.forEach(product => {
                        const productHTML = `
                        <div class="pro">
                            <input type="number" name="id_pay" value="${product.id}" hidden>
                            <input type="number" name="quantity_pay" value="${product.quantity}" hidden>
                            <input type="text" name="size_pay" value="${product.size}" hidden>
                            <a href="/shop/proDetails/${product.id}">
                                <img src="imgs/products/${product.image_url}" alt="">
                                <div class="des">
                                    <h5>${product.name}</h5>
                                    <div class="star">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <h4>$${product.price}</h4>
                                </div>
                            </a>
                        </div>
                        `;
                        productCheckedContainer.insertAdjacentHTML('beforeend', productHTML);
                    });
                }
            });
    };

    // Mở modal (Mobile)
    document.querySelector("#openModalBtn_mobile").onclick = function () {
        console.log('open modal');
        document.getElementById("paymentModal").style.display = "block";
        fetch('/cart/getCheckedProducts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    const productCheckedContainer = document.querySelector('.product-checked');
                    productCheckedContainer.innerHTML = '';

                    data.checkedProducts.forEach(product => {
                        const productHTML = `
                        <div class="pro">
                            <input type="number" name="id_pay" value="${product.id}" hidden>
                            <input type="number" name="quantity_pay" value="${product.quantity}" hidden>
                            <input type="text" name="size_pay" value="${product.size}" hidden>
                            <a href="/shop/proDetails/${product.id}">
                                <img src="imgs/products/${product.image_url}" alt="">
                                <div class="des">
                                    <h5>${product.name}</h5>
                                    <div class="star">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <h4>$${product.price}</h4>
                                </div>
                            </a>
                        </div>
                        `;
                        productCheckedContainer.insertAdjacentHTML('beforeend', productHTML);
                    });
                }
            });
    };

    // Đóng modal
    document.getElementById("closeModalBtn").onclick = function () {
        document.getElementById("paymentModal").style.display = "none";
        console.log('close modal');
    };

    document.getElementById("closeFooterBtn").onclick = function () {
        document.getElementById("paymentModal").style.display = "none";
    };

    // Đóng modal khi click ra ngoài
    window.onclick = function (event) {
        if (event.target === document.getElementById("paymentModal")) {
            document.getElementById("paymentModal").style.display = "none";
        }
    };
});
