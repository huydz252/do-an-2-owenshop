function toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    sidebar.classList.toggle('active');

    const closeBtn = document.querySelector('.sidebarClose');
    if (sidebar.classList.contains('active')) {
        closeBtn.classList.remove('hidden');
    } else {
        closeBtn.classList.add('hidden');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    sidebar.classList.remove('active');

    const closeBtn = document.querySelector('.sidebarClose');
    closeBtn.classList.add('hidden');
}

document.querySelector('.sidebarClose').addEventListener('click', closeSidebar);

