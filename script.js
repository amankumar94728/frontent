// script.js

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModal = document.getElementsByClassName('close')[0];
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumberDisplay = document.getElementById('page-number');
    const themeToggle = document.getElementById('theme-toggle');

    let items = [];
    let currentPage = 1;
    const itemsPerPage = 3;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    const fetchItems = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            items = data.items;
            renderItems();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderItems = () => {
        app.innerHTML = '';
        const filteredItems = items.filter(item => 
            item.title.toLowerCase().includes(searchInput.value.toLowerCase())
        );

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredItems.slice(start, end);

        paginatedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <button class="details-btn">Show Details</button>
            `;
            app.appendChild(itemElement);

            itemElement.querySelector('.details-btn').addEventListener('click', () => {
                modalDetails.innerHTML = `
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <p>Author: ${item.details.author}</p>
                    <p>Date: ${item.details.date}</p>
                    <p>${item.details.moreInfo}</p>
                `;
                modal.style.display = 'block';
            });
        });

        updatePagination(filteredItems.length);
    };

    const updatePagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pageNumberDisplay.textContent = `${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    };

    searchInput.addEventListener('input', renderItems);

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderItems();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderItems();
        }
    });

    closeModal.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    fetchItems();
});
