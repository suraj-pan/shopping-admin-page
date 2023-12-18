document.addEventListener("DOMContentLoaded", function() {
    const productForm = document.getElementById('productForm');
    const displayData = document.getElementById('displayData');


        // Function to fetch products from the server
        function fetchProducts() {
            axios.get('https://crudcrud.com/api/8f0bc4d4d2c74896a8172c07621dc93d/products')
                .then(response => {
                    displayData.innerHTML = ''; // Clear previous data
                    response.data.forEach(product => {
                        // Display fetched data
                        const entry = document.createElement('div');
                        entry.innerHTML = `
                            <p>Product Name: ${product.name}, Product Rate: ${product.rate}</p>
                            <button class="deleteBtn" data-id="${product.id}">Delete</button>
                            <button class="editBtn" data-id="${product.id}">Edit</button>
                        `;
                        displayData.appendChild(entry);
                    });
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }

        fetchProducts();

    productForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const rate = document.getElementById('rate').value;

        // Display data
        // const newEntry = document.createElement('div');
        // newEntry.innerHTML = `
        //     <p>Product Name: ${name}, Product Rate: ${rate}</p>
        //     <button class="deleteBtn">Delete</button>
        //     <button class="editBtn">Edit</button>
        // `;
        // displayData.appendChild(newEntry);


        axios.post('https://crudcrud.com/api/8f0bc4d4d2c74896a8172c07621dc93d/products', { name, rate })
        .then(response => {
            console.log('Product added successfully:', response.data);
            fetchProducts(); // Fetch updated data after successful addition
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });

        // Clear form fields after submission
        document.getElementById('name').value = '';
        document.getElementById('rate').value = '';
    });

    displayData.addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteBtn')) {
            // event.target.parentElement.remove();
            const productId = event.target.dataset.id;

            // Delete product from the server
            axios.delete(`https://crudcrud.com/api/8f0bc4d4d2c74896a8172c07621dc93d/products/${productId}`)
                .then(response => {
                    console.log('Product deleted successfully:', response.data);
                    fetchProducts(); // Fetch updated data after successful deletion
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
        } else if (event.target.classList.contains('editBtn')) {
            const entry = event.target.parentElement;
            const name = entry.querySelector('p').textContent.split(',')[0].split(': ')[1];
            const rate = entry.querySelector('p').textContent.split(',')[1].split(': ')[1];
            

            
            const newName = prompt('Enter new product name', name);
            const newRate = prompt('Enter new product rate', rate);
            const productId = event.target.dataset.id;

            axios.put(`https://crudcrud.com/api/8f0bc4d4d2c74896a8172c07621dc93d/products/${productId}`, {
                name: `${newName}`,
                price:`${newRate}`,
                // Other fields to update
            })
            .then(response => {
                console.log('Product updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });

            if (newName !== null && newRate !== null) {
                entry.querySelector('p').textContent = `Product Name: ${newName}, Product Rate: ${newRate}`;
            }
        }
    });
});