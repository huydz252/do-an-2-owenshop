function openDetailsModal(event) {
    const index = event.target.dataset.index;
    const rows = JSON.parse(document.getElementById('purchasedProductData').textContent);
    const data = rows[index];

    document.getElementById('view_user_name').value = data.name_user;
    document.getElementById('view_quantity').value = data.quantity;
    document.getElementById('view_size').value = data.size;
    document.getElementById('view_order_date').value = data.order_date;

    document.getElementById('detailsModal').classList.remove('hidden');
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.add('hidden');
}