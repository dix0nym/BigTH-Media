//let sales = [];

$(async () => {
    sales = await loadSales();
    renderSales(sales);

    /*
    TODO Sven: Dafuer sorgen, dass ein Toast pro Click erscheint; ggf auch style.css ueberarbeiten

    TODO Sven: Offers in Sales umbenennen
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
    /*let offers =  [
        {
            title: "Spezialangebot1",
            id: 1000,
            price: 19.99,
            items: [
                {img: "https://via.placeholder.com/150", id: 1, title: "Test", tags: ["animals"], photograph: "Unkown", price: 1000.33},
                {img: "https://via.placeholder.com/150", id: 2, title: "Test2", tags: ["animals", "rom"], photograph: "BigTH", price: 7777.33},
                {img: "https://via.placeholder.com/150", id: 3, title: "Test3", tags: ["hiking", "alpen"], photograph: "Unkown", price: 135.33}
            ]
        },
        {
            title: "Spezialangebot2",
            id: 1000,
            price: 29.99,
            items: [
                {img: "https://via.placeholder.com/150", id: 4, title: "Test4", tags: ["china", "country"], photograph: "BigTH", price: 5000.33},
                {img: "https://via.placeholder.com/150", id: 5, title: "Test5", tags: ["cars"], photograph: "Unkown", price: 100.33},
                {img: "https://via.placeholder.com/150", id: 6, title: "Test6", tags: ["nachaufnamen"], photograph: "BigTH", price: 2000.33},
                {img: "https://via.placeholder.com/150", id: 7, title: "Test7", tags: ["china", "country"], photograph: "BigTH", price: 5000.33},
                {img: "https://via.placeholder.com/150", id: 8, title: "Test8", tags: ["cars"], photograph: "Unkown", price: 100.33},
                {img: "https://via.placeholder.com/150", id: 9, title: "Test9", tags: ["nachaufnamen"], photograph: "BigTH", price: 2000.33},
            ]
        }
    ];*/
    /*
        TODO Sven: Service zum Abfragen der Angebote aus der Datenbank einbinden
    */
    let searchParams = new URLSearchParams(window.location.search);
    try {
        const response = await fetch("/api/sales/all/");
        //console.log(response);
        var sales = await response.json();
        //console.log(sales.daten);
    } catch (exception) {
        console.log(exception);
        return;
    }
    
    return sales.daten;
}

function addSetToCart(event) {
    const btn = $(event.currentTarget);
    const entryToAdd = btn.attr("data-id");

    addToCart(entryToAdd);
}

function renderSales(sales) {
    const salesContainer = $('#salesContainer');
    salesContainer.empty();

    //console.log(sales);

    sales.forEach(sale => {
        const newSale = renderSale(sale);
        salesContainer.append(newSale);
    });

}

function renderSale(sale) {

    firstItem = true;

    console.log(sale);
    console.log(sale.items);

    const container = $('<div class="container mt-1 w-60"/>');
    const containerHeader = $('<h5 class="my-2 mb-0">'+sale.title+'</h5>');
    const jumbotron = $('<div class="jumbotron mx-auto mb-0 w-100 bg-dark"/>');
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
    const containerFooter = $('<div class="d-flex flex-row-reverse"/>');
    const containerFooterAddToCartBtn = $('<button type="button" class="addToCart btn btn-lite fa fa-cart-plus fa-2x" aria-hidden="true" data-id="1000"/>');
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