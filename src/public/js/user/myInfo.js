document.addEventListener('DOMContentLoaded', function () {
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            console.log('click')
            const userData = btn.dataset;
            document.getElementById('id_edit').value = userData.id
            document.getElementById('name_edit').value = userData.name
            document.getElementById('email_edit').value = userData.email
            document.getElementById('address_edit').value = userData.address
            document.getElementById('phone_edit').value = userData.phone
            editModal.classList.remove('hidden')
        })
    })

    // Hide Edit Modal
    cancelEditBtn.addEventListener('click', function () {
        editModal.classList.add('hidden');
    });
})