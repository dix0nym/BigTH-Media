let tags = {};
let selectedTags = [];
let products = [];
let selectedRezs = [];
// url -> /products.html?page=1&search=?&tags=?

$(async () => {
    let params = new URLSearchParams(window.location.search);
    let page = params.has('page') ? params.get('page') : 1;
    let search = params.has('search') ? params.get('search') : undefined;
    // TODO: parse SEARCH
    tags = await loadTags();
    products = await loadProducts(search, page);
    resolutions = await loadResolutions();
});

// load functions

async function loadProducts(search, page) {
    const productResponse = await fetch("/api/product/page/" + page + "/");
    var productsJson = await productResponse.json();
    if (productsJson.error) {
        console.log("failed to fetch products");
        return;
    }
    var data = productsJson.data;
    var products = data.products;
    for(var i = 0; i < products.length; i++) {
        products[i].tags = products[i].tags.map(k => k.name);
    }
    renderProducts(products);
    renderPagination(data.pagination)
    // tags = await loadTags(products);
    return products;
}

async function loadTags() {
    const tagsResponse = await fetch("/api/tags/count/all/");
    var tagJson = await tagsResponse.json();
    if (tagJson.error) {
        console.log("failed to fetch tags");
        return;
    }
    var tags = tagJson.data;
    renderTags(tags);
    return tags;
}

async function loadResolutions() {
    const rezResponse = await fetch("/api/product/resolutions/");
    var rezJson = await rezResponse.json();
    if (rezJson.error) {
        console.log("failed to fetch resolutions");
        return;
    }
    var resolutions = rezJson.data;
    renderResoultions(resolutions);
    return resolutions;
}

// render functions

function renderProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    const tagsContainer = $('#tagsContainer');
    // tagsContainer.empty();
    for(var product of products) {
        const newProduct = createProduct(product);
        product.tags.forEach( tag => {
            if (!(tag in tags)) {
                tags[tag] = 0;
            } 
            tags[tag] += 1;
        })
        productContainer.append(newProduct);
    }

    // Object.keys(tags).forEach(key => {
    //     const tag = createTag(key, tags[key], false);
    //     tagsContainer.append(tag);
    // });
}

function renderTags(tags) {
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty()
    tags = tags.sort((a, b) => a.count < b.count);
    console.log(tags);
    for(var [idx, tag] of tags.entries()) {
        const newTag = createTag(tag);
        if (idx >= 5) {
            newTag.hide();
            newTag.addClass("more-tags")
        }
        tagsContainer.append(newTag);
    }
    const loadMore = $('<a href="#" class="list-group-item text-center"><span id="toggleTags">display all</span></a>');
    loadMore.on('click', event => {
        $('#tagsContainer > .more-tags').each( (idx, tag) => {
            $(tag).toggle();
        });
        let clicked = $(event.currentTarget);
        console.log(clicked.text());
        if (clicked.text() === 'display all') {
            clicked.text("hide");
        } else {
            clicked.text("display all");
        }
    });
    tagsContainer.append(loadMore);
}

function renderResoultions(resolutions) {
    const rezContainer = $('#rezContainer');
    rezContainer.empty();
    resolutions.sort( (a, b) => a.count < b.count);
    console.log(resolutions);
    for(var [idx, rez] of resolutions.entries()) {
        const newRez = createRezTag(rez);
        if (idx >= 5) {
            newRez.hide();
            newRez.addClass("more-rezs")
        }
        rezContainer.append(newRez);
    }
    const loadMore = $('<a href="#" class="list-group-item text-center"><span id="toggleRez">display all</span></a>');
    loadMore.on('click', event => {
        $('#rezContainer > .more-rezs').each( (idx, rez) => {
            $(rez).toggle();
        });
        let clicked = $(event.currentTarget);
        console.log(clicked.text());
        if (clicked.text() === 'display all') {
            clicked.text("hide");
        } else {
            clicked.text("display all");
        }
    });
    rezContainer.append(loadMore);
}

function renderPagination(pagination) {
    var url = "/pages/products.html?page="
    $('#pagination-prev').attr('href', url + pagination.previous);
    $('#pagination-next').attr('href', url + pagination.next);
    var tmp = $('#pagination-next').parent();
    for(var i = 1; i < pagination.numPages; i++) {
        const pageItem = $('<li class="page-item" />')
        const pageAnchor = $('<a class="page-link" href="#" />')
        if (i === pagination.current) {
            pageItem.addClass('active');
        }
        pageAnchor.attr('href', url + i);
        pageAnchor.text(i);
        pageItem.append(pageAnchor);
        pageItem.insertBefore(tmp);
    }
}

// create functions

function createProduct(data) {
    console.log(data);
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

function createTag(data) {
    const tag = $('<a href="#" class="list-group-item tag" data-id="' + data.id + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.attr("data-name", data.name)
    tag.append(counter);
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedTags.splice(0, selectedTags.length);
        $('#tagsContainer .rez.active').each((_, tag) => selectedTags.push($(tag).attr('data-name')));
        let filteredProducts = products.filter(f => selectedTags.every(tag => f.tags.includes(tag)));
        updateProducts(filteredProducts);
    });
    return tag;
}

function createRezTag(data) {
    const tag = $('<a href="#" class="list-group-item rez" data-name="' + data.name + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.append(counter);
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedRezs.splice(0, selectedRezs.length);
        $('#rezContainer .tag.active').each((_, tag) => selectedRezs.push($(tag).attr('data-name')));
        let filteredProducts = products.filter(f => selectedRezs.every(rez => f.originalresolution === rez));
        updateProducts(filteredProducts);
    });
    return tag;
}

// update functions

function updateProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    for(var k in tags) {
        tags[k] = 0;
    }
    products.forEach(product => {
        const newProduct = createProduct(product);
        productContainer.append(newProduct);
        product.tags.forEach( tag => {
            if (!(tag in tags)) {
                tags[tag] = 0;
            } 
            tags[tag] += 1;
        })
    });
    $('.tag').each( (idx, tag) => {
        var name = $(tag).attr('data-name');
        if (name in tags) {
            console.log(name, tags[name], tags[name] > 0);
            $(tag).toggle(tags[name] > 0);
            $('span', tag).text(tags[name]);
        } else {
            console.log(name, "not in tags", tags);
        }
        console.log(tags);
    });
}