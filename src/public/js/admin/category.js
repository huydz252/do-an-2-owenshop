document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const modal = document.getElementById("modal");
    const categoryForm = document.getElementById("categoryForm");
    const modalTitle = document.getElementById("modalTitle");
    let editingCategory = null;

    // Handle Add button click to open modal for adding a new category
    addBtn.addEventListener("click", () => {
        // Clear form and set up modal for adding a new category
        modalTitle.textContent = "Add Category";
        categoryForm.reset(); // Reset form fields
        editingCategory = null; // No category selected for editing
        modal.classList.remove("hidden"); // Show modal
    });

    // Handle Cancel button click to close the modal
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden"); // Hide modal
    });


    // Handle Edit button click to open modal with pre-filled data for editing
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", () => {
            // Get category data from data attributes
            const index = button.dataset.index;
            const id = button.dataset.id;
            const name = button.dataset.name;
            const description = button.dataset.description;
            const isActive = button.dataset.isActive === "true";

            // Fill the form with the existing category data
            modalTitle.textContent = "Edit Category";
            document.getElementById("name").value = name;
            document.getElementById("description").value = description;
            document.getElementById("isActive").value = isActive ? "true" : "false";

            // Set editingCategory to the selected category's data
            editingCategory = { id, name, description, isActive };

            // Show the modal
            modal.classList.remove("hidden");
        });
    });

    // Handle Delete button click
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            // Show a confirmation prompt for deletion
            if (confirm(`Are you sure you want to delete category with ID: ${id}?`)) {
                console.log(`Deleting category with ID: ${id}`);
                // Perform the delete via your fetch or other methods
            }
        });
    });
});
