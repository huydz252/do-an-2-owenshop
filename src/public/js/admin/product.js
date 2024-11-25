document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('addBtn');
    const addModal = document.getElementById('addModal');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const editModal = document.getElementById('editModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Show Add Modal
    addBtn.addEventListener('click', function () {
        addModal.classList.remove('hidden');
    });

    // Hide Add Modal
    cancelAddBtn.addEventListener('click', function () {
        addModal.classList.add('hidden');
    });

    // Show Edit Modal
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Đảm bảo bạn lấy đúng data từ button
            const productData = btn.dataset;

            // Gán giá trị vào các input
            document.getElementById('id_edit').value = productData.id;
            document.getElementById('name_edit').value = productData.name;
            document.getElementById('description_edit').value = productData.description;
            document.getElementById('price_edit').value = productData.price;
            document.getElementById('stock_edit').value = productData.stock;
            document.getElementById('category_id_edit').value = productData.categoryId;

            document.getElementById('image_edit').value = '';
            document.getElementById('isActive_edit').value = productData.isActive;

            editModal.classList.remove('hidden');
        });
    });

    // Hide Edit Modal
    cancelEditBtn.addEventListener('click', function () {
        editModal.classList.add('hidden');
    });

    // Xử lý xóa sản phẩm
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = btn.dataset.id;
            if (confirm('Are you sure you want to delete this product?')) {
                // Gửi yêu cầu xóa đến server
                fetch(`/admin/productForm/deleteProduct/${productId}`, {
                    method: 'DELETE'
                }).then(response => {
                    if (response.ok) {
                        alert('Product deleted successfully');
                    }
                    location.reload();
                }).catch(error => {
                    console.error('Error:', error);
                    alert('Failed to delete product');
                });
            }
        });
    });
});
