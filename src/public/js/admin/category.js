document.addEventListener("DOMContentLoaded", () => {
    // Modal references
    const addModal = document.getElementById("addModal");
    const editModal = document.getElementById("editModal");

    // Buttons
    const addBtn = document.getElementById("addBtn");
    const cancelAddBtn = document.getElementById("cancelAddBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    // Add Button: Open Add Modal
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            addModal.classList.remove("hidden");
        });
    }

    // Cancel Add Modal
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener("click", () => {
            addModal.classList.add("hidden");
        });
    }

    // Handle Edit Button Click
    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const name = button.getAttribute("data-name");
            const description = button.getAttribute("data-description");
            const isActive = button.getAttribute("data-is-active");

            // Fill the form in the edit modal
            document.getElementById("id_edit").value = id;
            document.getElementById("name_edit").value = name;
            document.getElementById("description_edit").value = description;
            document.getElementById("isActive_edit").value =
                isActive === "1" ? "true" : "false";

            // Show edit modal
            editModal.classList.remove("hidden");
        });
    });

    // Cancel Edit Modal
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", () => {
            editModal.classList.add("hidden");
        });
    }

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute("data-id");
            if (confirm('are u sure delete this category ?')) {
                try {
                    await fetch('/admin/categoryForm/deleteCategory', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: id })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Server updated successfully');
                        })
                        .catch(error => {
                            console.error('Error updating category on server:', error);
                        });
                    location.reload()
                } catch (error) {
                    console.log("error: ", error)
                    alert('can\'t delete this category')
                }
            }
        })
    })
});

