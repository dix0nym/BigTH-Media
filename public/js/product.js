$(async () => {
    let prodcut = await loadData();
    
    $('.addToCart').on('click', event => {
        addProductToCart(event);

        /*id = renderToast(event);        
        idString = '#toast'+id;

        $(idString).toast({
            autohide: true,
            delay: 2000
        });
        $(idString).toast('show');*/
    });
});

async function loadData() {
    let searchParams = new URLSearchParams(window.location.search);
    if (!(searchParams.has('id'))) {
        console.log("ERROR");
    }
    let id = searchParams.get('id');
    try {
        const response = await fetch("/api/product/get/" + id);
        var product = await response.json();
    } catch (exception) {
        console.log(exception);
        return;
    }
    renderProduct(product.data);
}

function addProductToCart(event) {
    const btn = $(event.currentTarget);
    const entryToAdd = btn.attr("data-id");

    addToCart(entryToAdd);
}

function renderProduct(data) {
    console.log(data);
    const pContainer = $('#productContainer');
    const container = $('<div class="container mt-3" style="height: 100%";/>');
    const card = $('<div class="card text-white"/>');
    const modalAnchor = $(' <a class="mx-auto" data-toggle="modal" data-target="#bigViewModal"/>');
    const img = $('<img class="productImg mt-4" alt="product"/>');
    img.attr('src', '/media/compressed/'+data.filename);
    modalAnchor.append(img);
    card.append(modalAnchor);
    const cardBody = $('<div class="card-body"/>');
    const bodyHeader = $('<h5 class="card-title"/>');
    bodyHeader.text(data.title);
    const cardText = $('<p class="card-text"/>');
    cardText.text(data.details);
    const addtToCartBtn = $('<button type="button" class="addToCart btn btn-outline-info fa fa-cart-plus fa-2x" href="#"/>');
    addtToCartBtn.attr('data-id', data.id);
    cardBody.append(bodyHeader);
    cardBody.append(cardText);
    cardBody.append(addtToCartBtn);
    card.append(cardBody);
    container.append(card);
    pContainer.append(container);
}
