$(async() => {
    let prodcut = await loadData();

    $('.addToCart').on('click', event => {
        addProductToCart(event);

        id = renderToast(event);
        idString = '#toast' + id;

        $(idString).toast({
            autohide: true,
            delay: 2000
        });
        $(idString).toast('show');
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
    renderModal(product.data);
}

function addProductToCart(event) {
    const btn = $(event.currentTarget);
    const entryToAdd = btn.attr("data-id");

    addToCart(entryToAdd);
}

function renderProduct(data) {
    const pContainer = $('#productContainer');
    const container = $('<div class="container mt-3 margin-bottom" style="height: 100%";/>');
    const card = $('<div class="card text-white"/>');
    const modalAnchor = $(' <a class="mx-auto" data-toggle="modal" data-target="#bigViewModal"/>');

    const img = $('<img class="productImg mt-4" alt="product" style="max-width: 1100px;"/>');
    img.attr('src', '/media/compressed/' + data.filename);
    modalAnchor.append(img);
    card.append(modalAnchor);
    const cardBody = $('<div class="card-body"/>');
    const bodyHeader = $('<h5 class="card-title"/>');
    bodyHeader.text(data.title);
    const cardText = $('<div class="card-text"/>');
    const cardTextRow = $('<div class="row"/>');
    const cardTextLeft = $('<div class="col-sm-10"/>');
    data.tags.forEach(element => {
        const tag = createTag(element);
        cardText.append(tag);
    });
    const tag = $('<a href="/pages/products.html?rezs=' + data.resolution + '" class="productTag badge badge-pill badge-info"/>');
    tag.text(data.resolution);
    cardText.append(tag);
    const cardTextDetails = $('<p/>');
    cardTextDetails.text(data.details);
    cardTextLeft.append(cardTextDetails);
    cardTextRow.append(cardTextLeft);
    const cardTextRight = $('<div class="col-sm-2"/>');
    const addtToCartBtn = $('<button type="button" class="addToCart btn btn-outline-info fa fa-cart-plus fa-2x" href="#"/>');
    addtToCartBtn.attr('data-id', data.id);
    const price = $('<span class="mr-2 font-weight-bold"/>');
    price.text("$" + (data.grossprice).toFixed(2));
    cardTextRight.append(price);
    cardTextRight.append(addtToCartBtn);
    cardTextRow.append(cardTextRight);
    cardText.append(cardTextRow);
    cardBody.append(bodyHeader);
    cardBody.append(cardText);
    card.append(cardBody);
    container.append(card);
    pContainer.append(container);
}

function renderModal(data) {
    const modalContainer = $('#modalContainer');
    const modal = $('<div class="modal fade" id="bigViewModal" tabindex="-1" role="dialog" aria-labelledby="bigViewModalLabel" aria-hidden="true"/>');
    const modalDialog = $('<div class="modal-dialog" role="document"/>')
    const modalContent = $('<div class="modal-content"/>');
    const modalBody = $('<div class="modal-body"/>');
    const img = $('<img class="productImgBig mx-auto" alt="product"/>');
    img.attr('src', '/media/compressed/' + data.filename);

    modalBody.append(img);
    modalContent.append(modalBody);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    modalContainer.append(modal);
}

function createTag(data) {
    const tag = $('<a href="/pages/products.html?tags=' + data.name + '" class="productTag badge badge-pill badge-info"/>');
    tag.text(data.name);

    return tag;
}

function renderToast(event) {
    const btn = $(event.currentTarget);
    const addedEntry = btn.attr("data-id");

    const toastContainer = $('#toastContainer');
    toastContainer.empty();

    const toast = $('<div class="toast ml-auto" id="toast' + addedEntry + '" role="alert" aria-live="assertive" aria-atomic="true"/>');
    const toastHeader = $('<div class="toast-header"/>');
    const toastHeaderTitle = $('<strong class="mr-auto"/>');
    toastHeader.text("Success");
    toastHeader.append(toastHeaderTitle);
    const toastBody = $('<div class="toast-body"/>');
    toastBody.text("Added item to shopping cart.");
    toast.append(toastHeader);
    toast.append(toastBody);

    toastContainer.append(toast);

    return addedEntry;
}