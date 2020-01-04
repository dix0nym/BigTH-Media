let selectedTags = [];
let selectedRezs = [];

$(async() => {
    // load footer & header
    await loadHeader("header.html", "productsNav");
    await loadFooter("footer.html");
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
    // load data
    var data = await loadProducts(selectedTags, selectedRezs, page, price_start, price_end);
    await loadTags(selectedTags, data.tagscount);
    await loadResolutions(selectedRezs, data.rezcount);
    // add Listeners
    addEventFilterBtn();
});

// load functions

async function loadProducts(tags, rezs, page, price_start, price_end) {
    var payload = { tags: JSON.stringify(tags), rezs: JSON.stringify(rezs), price_start: price_start, price_end: price_end };
    var needToFilter = (!isEmptyArray(tags) || !isEmptyArray(rezs));
    console.log(JSON.stringify({ needToFilter: needToFilter, tags: isEmptyArray(tags), resz: isEmptyArray(rezs) }));
    var url = (needToFilter) ? "/api/product/filter/page/" + page + "/?" + jQuery.param(payload) : "/api/product/page/" + page + "/";
    const productResponse = await fetch(url);
    var productsJson = await productResponse.json();
    if (productsJson.error) {
        console.error("failed to fetch products");
        return;
    }
    var data = productsJson.data;
    var products = data.products;
    for (var i = 0; i < products.length; i++) {
        products[i].tags = products[i].tags.map(k => k.name);
    }
    renderProducts(products);
    renderPagination(data.pagination);
    return data;
}

async function loadTags(selectedTags, count) {
    const tagsResponse = await fetch("/api/tags/count/all/");
    var tagJson = await tagsResponse.json();
    if (tagJson.error) {
        console.error("failed to fetch tags");
        return;
    }
    var tags = tagJson.data;
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

// render functions

function renderProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    for (var product of products) {
        const newProduct = createProduct(product);
        productContainer.append(newProduct);
    }
}

function renderTags(selectedTags, tags, count) {
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty()
    tags = tags.sort((a, b) => a.count < b.count);
    var selectedTagHidden = 0;
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
    const loadMore = $('<a href="#" class="list-group-item text-center"><span id="toggleTags">display all</span></a>');
    if (selectedTagHidden > 0) {
        var text = loadMore.find('#toggleTags');
        const counter = $('<span class="badge badge-info round ml-2"/>');
        counter.text(selectedTagHidden);
        text.append(counter);
    }
    loadMore.on('click', event => {
        $('#tagsContainer > .more-tags').each((idx, tag) => {
            $(tag).toggle();
        });
        let clicked = $(event.currentTarget);
        if (clicked.text() === 'display all') {
            clicked.text("hide");
        } else {
            clicked.text("display all");
        }
    });
    tagsContainer.append(loadMore);
}

function renderResoultions(selectedRezs, resolutions, count) {
    const rezContainer = $('#rezContainer');
    rezContainer.empty();
    resolutions.sort((a, b) => a.count < b.count);
    var selectedTagHidden = 0;
    for (var [idx, rez] of resolutions.entries()) {
        var active = selectedRezs.includes(rez.name);
        const newRez = createRezTag(rez, selectedRezs.includes(rez.name), count);
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
        if (clicked.text() === 'display all') {
            clicked.text("hide");
        } else {
            clicked.text("display all");
        }
    });
    rezContainer.append(loadMore);
}

function renderPagination(pagination) {
    if (pagination.numPages === 0) {
        $("nav.pagination > ul").hide();
        return;
    }
    var url = "/pages/products.html?"
    let params = new URLSearchParams(window.location.search);
    params.set('page', pagination.previous);
    $('#pagination-prev').attr('href', url + params.toString());
    params.set('page', pagination.next)
    $('#pagination-next').attr('href', url + params.toString());
    var tmp = $('#pagination-next').parent();
    for (var i = 0; i < pagination.numPages; i++) {
        const pageItem = $('<li class="page-item" />')
        const pageAnchor = $('<a class="page-link" href="#" />')
        if (i === (pagination.current)) {
            pageItem.addClass('active');
        }
        params.set('page', i);
        pageAnchor.attr('href', url + params.toString());
        pageAnchor.text(i + 1);
        pageItem.append(pageAnchor);
        pageItem.insertBefore(tmp);
    }
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

function createTag(data, active, count) {
    const tag = $('<a href="#" class="list-group-item tag" data-id="' + data.id + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text((data.name in count) ? count[data.name] : data.count)
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
        window.location.href = url;
    });
    return tag;
}

function createRezTag(data, active, count) {
    const tag = $('<a href="#" class="list-group-item rez" data-name="' + data.name + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text((data.name in count) ? count[data.name] : data.count)
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
        window.location.href = url;
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
        window.location.href = url;
    });
}