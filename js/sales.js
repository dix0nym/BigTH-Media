$(async () => {
    offers = await loadOffers();
    renderOffers(offers);

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

async function loadOffers() {
    let offers =  [
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
    ];
return offers;
}

function addSetToCart(event) {
    const btn = $(event.currentTarget);
    const entryToAdd = btn.attr("data-id");

    addToCart(entryToAdd);
}

function renderOffers(offers) {
    const offersContainer = $('#offersContainer');
    offersContainer.empty();

    offers.forEach(offer => {
        const newOffer = renderOffer(offer);
        offersContainer.append(newOffer);
    });

}

function renderOffer(offer) {

    firstItem = true;

    const container = $('<div class="container mt-1 w-50"/>');
    const containerHeader = $('<h5 class="my-2 mb-0">Richtig geiles Sparpaket 1</h5>');
    const jumbotron = $('<div class="jumbotron mx-auto mb-0 w-100 bg-dark"/>');
    const carousel = $('<div id="'+offer.title+'" class="carousel slide" data-ride="carousel"/>');
    const carouselInner = $('<div class="carousel-inner"/>');
    offer.items.forEach((item) => {
        const carouselItem = $('<div class="carousel-item text-center"/>');
        if (firstItem) {
            carouselItem.addClass('active')
            firstItem = false;
        }
        const carouselImg = $('<img src="'+item.img+'" class="d-block mx-auto" alt="'+item.id+'"/>');
        carouselItem.append(carouselImg);
        carouselInner.append(carouselItem);
    });
    const carouselCtrlPrev = $('<a class="carousel-control-prev" href="#'+offer.title+'" role="button" data-slide="prev"/>');
    const carouselCtrlPrevBtn = $('<span class="carousel-control-prev-icon" aria-hidden="true"/>');
    const carouselCtrlPrevDesc = $('<span class="sr-only"/>');
    carouselCtrlPrevDesc.text("Previous");
    carouselCtrlPrev.append(carouselCtrlPrevBtn);
    carouselCtrlPrev.append(carouselCtrlPrevDesc);
    const carouselCtrlNxt = $('<a class="carousel-control-next" href="#'+offer.title+'" role="button" data-slide="next"/>');
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
    const containerFooterPriceTag = $('<h5 class=" mt-2">'+offer.price+'€</h5>');
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