//let sales = [];

$(async () => {
    sales = await loadSales();
    renderSales(sales);

    /*
    TODO Sven: Dafuer sorgen, dass ein Toast pro Click erscheint; ggf auch style.css ueberarbeiten
    */

    $('.addToCart').on('click', event => {
        addSetToCart(event);

        id = renderToast(event);        
        idString = '#toast'+id;

        $(idString).toast({
            autohide: true,
            delay: 2000
        });
        $(idString).toast('show');
    });
});

async function loadSales() {
    let searchParams = new URLSearchParams(window.location.search);
    try {
        const response = await fetch("/api/sales/all/");
        var sales = await response.json();
    } catch (exception) {
        console.log(exception);
        return;
    }
    
    return sales.data;
}

function addSetToCart(event) {
    const btn = $(event.currentTarget);
    const entryToAdd = btn.attr("data-id");

    addToCart(entryToAdd);
}

function renderSales(sales) {
    const salesContainer = $('#salesContainer');
    salesContainer.empty();

    sales.forEach(sale => {
        const newSale = renderSale(sale);
        salesContainer.append(newSale);
    });

}

function renderSale(sale) {
    firstItem = true;

    console.log(sale);
    

    const container = $('<div class="container mt-2 w-60 margin-bottom"/>');
    const containerHeader = $('<h5 class="text-center font-weight-bold">'+sale.title+'</h5>');

    const jumbotron = $('<div class="jumbotron mx-auto mb-0 w-100 py-2 bg-dark"/>');
    const carousel = $('<div id="Sale'+sale.id+'" class="carousel slide" data-ride="carousel"/>');
    const carouselInner = $('<div class="carousel-inner"/>');
    sale.items.forEach((item) => {
        const carouselItem = $('<div class="carousel-item text-center"/>');
        if (firstItem) {
            carouselItem.addClass('active')
            firstItem = false;
        }
        const carouselImg = $('<img src="/media/compressed/'+item.filename+'" class="d-block mx-auto carouselImg" alt="'+item.id+'"/>');
        carouselItem.append(carouselImg);
        carouselInner.append(carouselItem);
    });
    const carouselCtrlPrev = $('<a class="carousel-control-prev w-10" href="#Sale'+sale.id+'" role="button" data-slide="prev"/>');
    const carouselCtrlPrevBtn = $('<span class="carousel-control-prev-icon" aria-hidden="true"/>');
    const carouselCtrlPrevDesc = $('<span class="sr-only"/>');
    carouselCtrlPrevDesc.text("Previous");
    carouselCtrlPrev.append(carouselCtrlPrevBtn);
    carouselCtrlPrev.append(carouselCtrlPrevDesc);
    const carouselCtrlNxt = $('<a class="carousel-control-next w-10" href="#Sale'+sale.id+'" role="button" data-slide="next"/>');
    const carouselCtrlNxtBtn = $('<span class="carousel-control-next-icon" aria-hidden="true"/>');
    const carouselCtrlNxtDesc = $('<span class="sr-only"/>');
    carouselCtrlNxtDesc.text("Next");
    carouselCtrlNxt.append(carouselCtrlNxtBtn);
    carouselCtrlNxt.append(carouselCtrlNxtDesc);
    carousel.append(carouselInner);
    carousel.append(carouselCtrlPrev);
    carousel.append(carouselCtrlNxt);
    const containerFooter = $('<div class="salesFooter d-flex flex-row-reverse"/>');
    const containerFooterAddToCartBtn = $('<button type="button" class="addToCart btn btn-outline-light border-0 mb-1 fa fa-cart-plus fa-2x" aria-hidden="true"/>');
    containerFooterAddToCartBtn.attr('data-id', sale.id);
    const containerFooterPriceTag = $('<h5 class=" mt-2">'+sale.price+'€</h5>');
    containerFooter.append(containerFooterAddToCartBtn);
    containerFooter.append(containerFooterPriceTag);

    jumbotron.append(carousel);
    container.append(containerHeader);
    container.append(jumbotron);
    container.append(containerFooter);
    
    return container;
}

function renderToast(event) {
    const btn = $(event.currentTarget);
    const addedEntry = btn.attr("data-id");

    const toastContainer = $('#toastContainer');
    toastContainer.empty();

    const toast = $('<div class="toast ml-auto" id="toast'+addedEntry+'" role="alert" aria-live="assertive" aria-atomic="true"/>');
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