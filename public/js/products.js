let selectedTags = [];
let selectedRezs = [];

$(async() => {
    // load footer & header
    await loadHeader("header.html", "productsNav");
    await loadFooter("footer.html");
    var payload = parseSearchParams();
    // load data
    var data = await loadProducts(payload);
    await loadTags(selectedTags, data.tagscount);
    await loadResolutions(selectedRezs, data.rezcount);
    // add Listeners
    addEventFilterBtn();
});

function parseSearchParams() {
    // parse & validate SearchParams
    // url -> /products.html?page=1&tags=?&rezs=?&price_start=?&price_end=?
    let params = new URLSearchParams(window.location.search);
    let page = params.has('page') ? params.get('page') : 0;
    selectedTags = params.has('tags') ? params.getAll('tags') : [];
    console.log("selectedTags: ", selectedTags);
    selectedRezs = params.has('rezs') ? params.getAll('rezs') : [];
    var price_start = params.has('price_start') ? params.get('price_start') : undefined;
    var price_end = params.has('price_end') ? params.get('price_end') : undefined;
    if (price_start)
        $('#inputStartPrice').val(price_start);
    if (price_end)
        $('#inputEndPrice').val(price_end);
    return { page: page, tags: JSON.stringify(selectedTags), rezs: JSON.stringify(selectedRezs), price_start: price_start, price_end: price_end };
}

// load functions

async function loadProducts(payload) {
    // prepare payload
    var page = payload.page;
    delete payload.page;
    // build url
    var url = "/api/product/filter/page/" + page + "/?" + jQuery.param(payload);
    // make request
    const productResponse = await fetch(url);
    // parse request to json
    var productsJson = await productResponse.json();
    // check for error
    if (productsJson.error) {
        console.error("failed to fetch products");
        return;
    }
    var data = productsJson.data;
    var products = data.products;
    // change format of product-tags
    for (var i = 0; i < products.length; i++) {
        products[i].tags = products[i].tags.map(k => k.name);
    }
    console.log(products);
    // render products and pagination
    renderProducts(products);
    renderPagination(data.pagination);
    return data;
}

async function loadTags(selectedTags, count) {
    // make request
    const tagsResponse = await fetch("/api/tags/count/all/");
    // parse request to json
    var tagJson = await tagsResponse.json();
    // check for error
    if (tagJson.error) {
        console.error("failed to fetch tags");
        return;
    }
    var tags = tagJson.data;
    // render tags
    await renderTags('tagsContainer', "tag", selectedTags, tags, count);
    return tags;
}

async function loadResolutions(selectedRezs, count) {
    const rezResponse = await fetch("/api/product/resolutions/");
    var rezJson = await rezResponse.json();
    if (rezJson.error) {
        console.error("failed to fetch resolutions");
        return;
    }
    var resolutions = rezJson.data;
    await renderTags('rezContainer', "rez", selectedRezs, resolutions, count);
    return resolutions;
}

async function dynloadProducts() {
    // fetch new data
    var payload = parseSearchParams();
    var data = await loadProducts(payload);
    // update tags and resolutions
    await loadTags(selectedTags, data.tagscount);
    await loadResolutions(selectedRezs, data.rezcount);
}

// render functions

function renderProducts(products) {
    // select container for products
    const productContainer = $('#productsContainer');
    // make it empty
    productContainer.empty();
    // create products
    for (var product of products) {
        const newProduct = createProduct(product);
        productContainer.append(newProduct);
    }
}

function renderTags(containerName, type, selected, tags, count) {
    const container = $('#' + containerName);
    container.empty();
    console.log("tags: " + JSON.stringify(tags));
    console.log("counts: " + JSON.stringify(count));
    tags = tags.map(tag => {
        tag.count = (tag.name in count) ? count[tag.name] : 0;
        return tag;
    });
    tags = tags.sort((a, b) => {
        if (selectedTags.includes(a.name) && !selectedTags.includes(b.name)) return -1;
        if (!selectedTags.includes(a.name) && selectedTags.includes(b.name)) return 1;
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return a.name > b.name;
    });
    var activeHiddenTags = 0;
    // create tags and count hidden tags
    for (var [idx, tag] of tags.entries()) {
        var active = selected.includes(tag.name);
        const newTag = createTag(tag, active, type);
        if (idx >= 3) {
            newTag.hide();
            newTag.addClass("more-tags");
            if (active)
                activeHiddenTags++;
        }
        container.append(newTag);
    }
    // create loadMore-Button and add indicator if active tag is hidden
    const loadMore = $('<a href="#" class="list-group-item text-center loadMore"><span class="loadMoreText">display all</span></a>');
    if (activeHiddenTags > 0) {
        var text = loadMore.find('.loadMoreText');
        const counter = $('<span class="badge badge-info round ml-2 counter"/>');
        counter.text(activeHiddenTags);
        text.append(counter);
    }
    // laodMore-Click-Event: update text and counter on click
    loadMore.on('click', event => {
        // get button
        let clicked = $(event.currentTarget);
        // set clicked tag to active
        $(clicked).parent('#' + containerName).find('.more-tags').each((idx, tag) => {
            $(tag).toggle();
        });
        // get span element
        var innerSpan = $(clicked).find('.loadMoreText');
        // change text of span according action
        innerSpan.text(($(clicked).hasClass("loadMore")) ? "hide" : "display all");
        if (!$(clicked).hasClass("loadMore")) {
            // check if some hidden tags are active and add indicator
            var count = $(clicked).parent().find('.tag.active.more-tags').length;
            if (count > 0) {
                const counter = $('<span class="badge badge-info round ml-2 counter"/>');
                counter.text(count);
                innerSpan.append(counter);
            }
        }
        $(clicked).toggleClass("loadMore")
    });
    container.append(loadMore);
}

function renderPagination(pagination) {
    // hide pagination if no pages
    if (pagination.numPages === 0) {
        $("nav.pagination > ul").hide();
        return;
    }
    // remove all pages
    $('ul.pagination > li.page-num').remove();
    // add data-page to next and previous - can be undefined
    $('#pagination-prev').attr("data-page", pagination.previous);
    $('#pagination-next').attr("data-page", pagination.next);
    // check if prev/next is undefined and set disabled accordingly
    $('#pagination-prev').parent('li.page-item').toggleClass('disabled', pagination.previous === undefined);
    $('#pagination-next').parent('li.page-item').toggleClass('disabled', pagination.next === undefined);

    var tmp = $('#pagination-next').parent();
    // create elements for pages 0 - numPages
    for (var i = 0; i < pagination.numPages; i++) {
        const pageItem = $('<li class="page-item page-num" />')
        const pageAnchor = $('<a class="page-link" href="#" />')
        if (i === (pagination.current)) {
            pageItem.addClass('active');
        }
        pageAnchor.attr("data-page", i);
        pageAnchor.text(i + 1);
        pageItem.append(pageAnchor);
        pageItem.insertBefore(tmp);
    }
    // add click event for pagination item => dynamically load next page
    $('a.page-link').on('click', event => {
        var clicked = $(event.currentTarget);
        // get data-page
        var page = $(clicked).attr("data-page");
        // return if page is undefined
        if (page === undefined) return;
        // update url without reloading
        var url = new URL(window.location.href);
        url.searchParams.set('page', page)
        window.history.pushState({ "html": "products.html" }, "", url);
        // load next page
        dynloadProducts();
    });
}

// create functions

function createProduct(data) {
    const product = $('<div class="card m-2" style="width: 15rem;" />');
    let img = $('<img class="card-img-top products-preview-img"/>');
    img.attr('src', "../media/resized/" + data.filename);
    const anchor = $('<a href="product.html?id=' + data.id + '"/>');
    const body = $('<div class="card-body products-body align-items-center d-flex justify-content-center"/>');
    const title = $('<h5 class="card-title mb-0">' + data.title + '</h5>');
    body.append(title);
    anchor.append(img);
    anchor.append(body);
    product.append(anchor);
    return product;
}

function createTag(data, active, type) {
    const tag = $('<a href="#" class="list-group-item tag" data-id="' + data.id + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.attr("data-name", data.name)
    tag.attr("data-type", type)
    tag.append(counter);
    if (active)
        tag.addClass("active");
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        let type = $(clickedTag).attr("data-type");
        clickedTag.toggleClass('active');
        let selectedList = (type === "tag") ? selectedTags : selectedRezs;

        selectedList.splice(0, selectedList.length);
        $(clickedTag).parent().find('.tag.active').each((_, tag) => selectedList.push($(tag).attr('data-name')));
        var url = new URL(window.location.href);
        url.searchParams.delete((type === "tag") ? "tags" : "rezs");
        for (var tag of selectedList) {
            url.searchParams.append((type === "tag") ? "tags" : "rezs", tag);
        }
        url.searchParams.set("page", 0);
        window.history.pushState({ "html": "products.html" }, "", url);
        dynloadProducts();
    });
    return tag;
}

// events

function addEventFilterBtn() {
    $('#filterBtn').on('click', event => {
        event.preventDefault();
        var price_start = $('#inputStartPrice').val();
        var price_end = $('#inputEndPrice').val();

        var url = new URL(window.location.href);
        if (price_start) {
            price_start = parseInt(price_start);
            if (price_start > 0) {
                url.searchParams.set("price_start", price_start);
            }
        }
        if (price_end) {
            price_end = parseInt(price_end);
            if (price_end > 0) {
                url.searchParams.set("price_end", price_end);
            }
        }
        window.history.pushState({ "html": "products.html" }, "", url);
        dynloadProducts();
    });
}