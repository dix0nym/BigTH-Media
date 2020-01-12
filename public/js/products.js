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
    await renderTags(selectedTags, tags, count);
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
    renderResoultions(selectedRezs, resolutions, count);
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

// TODO: merge renderTags and renderResolution - doing same things - needs attribute to differ tags from resolution in url
function renderTags(selectedTags, tags, count) {
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty()
    console.log("tags: " + JSON.stringify(tags));
    console.log("counts: " + JSON.stringify(count));
    // update tag count from received query
    tags = tags.map(tag => {
        tag.count = (tag.name in count) ? count[tag.name] : 0;
        return tag;
    });
    // sort tags by select-status > count > name
    tags = tags.sort((a, b) => {
        if (selectedTags.includes(a.name) && !selectedTags.includes(b.name)) return -1;
        if (!selectedTags.includes(a.name) && selectedTags.includes(b.name)) return 1;
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return a.name > b.name;
    });
    var selectedTagHidden = 0;
    // create tags and count hidden tags
    for (var [idx, tag] of tags.entries()) {
        var active = selectedTags.includes(tag.name);
        const newTag = createTag(tag, active, count);
        if (idx >= 3) {
            newTag.hide();
            newTag.addClass("more-tags")
            if (active)
                selectedTagHidden++;
        }
        tagsContainer.append(newTag);
    }
    // create loadMore-Button and add indicator if active tag is hidden
    const loadMore = $('<a href="#" class="list-group-item text-center loadMore"><span id="toggleTags">display all</span></a>');
    if (selectedTagHidden > 0) {
        var text = loadMore.find('#toggleTags');
        const counter = $('<span class="badge badge-info round ml-2 counter"/>');
        counter.text(selectedTagHidden);
        text.append(counter);
    }
    // laodMore-Click-Event: update text and counter on click
    loadMore.on('click', event => {
        $('#tagsContainer > .more-tags').each((idx, tag) => {
            $(tag).toggle();
        });
        // get button
        let clicked = $(event.currentTarget);
        // get span element
        var innerSpan = $(clicked).find('#toggleTags');
        // change text of span according action
        innerSpan.text(($(clicked).hasClass("loadMore")) ? "hide" : "display all");
        if (!$(clicked).hasClass("loadMore")) {
            // check if some hidden tags are active and add indicator
            var count = $("#tagsContainer > .tag.active.more-tags").length;
            if (count > 0) {
                const counter = $('<span class="badge badge-info round ml-2 counter"/>');
                counter.text(count);
                innerSpan.append(counter);
            }
        }
        $(clicked).toggleClass("loadMore")
    });
    tagsContainer.append(loadMore);
}

function renderResoultions(selectedRezs, resolutions, count) {
    const rezContainer = $('#rezContainer');
    rezContainer.empty();
    resolutions = resolutions.map(rez => {
        rez.count = (rez.name in count) ? count[rez.name] : 0;
        return rez;
    })
    resolutions.sort((a, b) => a.count < b.count);
    resolutions = resolutions.sort((a, b) => {
        if (selectedRezs.includes(a.name) && !selectedRezs.includes(b.name)) return -1;
        if (!selectedRezs.includes(a.name) && selectedRezs.includes(b.name)) return 1;
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return a.name > b.name;
    });
    var selectedTagHidden = 0;
    for (var [idx, rez] of resolutions.entries()) {
        var active = selectedRezs.includes(rez.name);
        const newRez = createRezTag(rez, active, count);
        if (idx >= 3) {
            newRez.hide();
            newRez.addClass("more-rezs")
            if (active)
                selectedTagHidden++;
        }
        rezContainer.append(newRez);
    }
    const loadMore = $('<a href="#" class="list-group-item text-center"><span id="toggleRez">display all</span></a>');
    if (selectedTagHidden > 0) {
        var text = loadMore.find('#toggleRez');
        const counter = $('<span class="badge badge-info round ml-2"/>');
        counter.text(selectedTagHidden);
        text.append(counter);
    }
    loadMore.on('click', event => {
        $('#rezContainer > .more-rezs').each((idx, rez) => {
            $(rez).toggle();
        });
        let clicked = $(event.currentTarget);
        var innerSpan = $(clicked).find('#toggleRez');
        innerSpan.text(($(clicked).hasClass("loadMore")) ? "hide" : "display all");
        if (!$(clicked).hasClass("loadMore")) {
            var count = $("#rezContainer > .rez.active.more-rezs").length;
            if (count > 0) {
                const counter = $('<span class="badge badge-info round ml-2 counter"/>');
                counter.text(count);
                innerSpan.append(counter);
            }
        }
        $(clicked).toggleClass("loadMore")
    });
    rezContainer.append(loadMore);
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

function createTag(data, active) {
    const tag = $('<a href="#" class="list-group-item tag" data-id="' + data.id + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.attr("data-name", data.name)
    tag.append(counter);
    if (active)
        tag.addClass("active");
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedTags.splice(0, selectedTags.length);
        $('#tagsContainer .tag.active').each((_, tag) => selectedTags.push($(tag).attr('data-name')));
        var url = new URL(window.location.href);
        url.searchParams.delete("tags");
        for (var tag of selectedTags) {
            url.searchParams.append("tags", tag);
        }
        window.history.pushState({ "html": "products.html" }, "", url);
        dynloadProducts();
    });
    return tag;
}
// TODO: same as createTag-function -> merge
function createRezTag(data, active) {
    const tag = $('<a href="#" class="list-group-item rez" data-name="' + data.name + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.append(counter);
    if (active)
        tag.addClass("active");
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedRezs.splice(0, selectedRezs.length);
        $('#rezContainer .rez.active').each((_, tag) => selectedRezs.push($(tag).attr('data-name')));
        var url = new URL(window.location.href);
        url.searchParams.delete("rezs");
        for (var rez of selectedRezs) {
            url.searchParams.append("rezs", rez);
        }
        window.history.pushState({ "html": "products.html" }, "", url);
        dynloadProducts();
    });
    return tag;
}

// events

// TODO: price filtering somehow doesnt work - maybe error in service/dao?????
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