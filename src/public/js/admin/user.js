document.addEventListener('DOMContentLoaded', function () {
    const deleteBtns = document.querySelectorAll('.delete_btn');
    if (deleteBtns) {
        deleteBtns.forEach(deleteBtn => {
            deleteBtn.addEventListener('click', function () {
                const userId = deleteBtn.dataset.id;
                if (confirm(`Do you want to delete the user with id = ${userId}?`)) {
                    fetch(`/admin/userForm/deleteUser/${userId}`, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                alert('User deleted successfully');
                                location.reload();
                            } else {
                                alert('Failed to delete this user!');
                            }
                        })
                        .catch(error => {
                            console.log('Error: ', error);
                            alert('An error occurred while deleting the user!');
                        });
                }
            });
        });
    }
});
