document.getElementById("productList").addEventListener("click", async () => {
    await LoadProducts();
});

async function LoadProducts(){

    try {
        const response = await fetch("api/data/productTab");
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            renderProductCard(data)
        } else {
            Notiflix.Notify.failure("Product loading failed!", {
                position: 'center-top'
            });
        }
    } catch (e) {
        Notiflix.Notify.failure(e.message, {
            position: 'center-top'
        });
    }

}