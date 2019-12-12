let tags = {};
let selectedTags = [];
let products = [];


$(async () => {
    products = await loadProducts();
});

async function loadProducts() {
    const productResponse = await fetch("/api/product/all/");
    var products = await productResponse.json();
    if (products.error) {
        console.log("failed to fetch products");
        return;
    }
    var products = products.data;
    for(var i = 0; i < products.length; i++) {
        const tagsResponse = await fetch("/api/product/" + products[i].id + "/tags");
        var tagsR = await tagsResponse.json();
        if (tagsR.error) {
            console.log("failed to fetch tags");
            return;
        }
        products[i].tags = tagsR.data.map(k => k.name);
    }
    renderProducts(products);
    tags = await loadTags(products);
    return products;
}

async function loadTags(products) {
    const tagsResponse = await fetch("/api/tags/all/");
    var tagJson = await tagsResponse.json();
    if (tagJson.error) {
        console.log("failed to fetch tags");
        return;
    }
    var tags = tagJson.data.reduce(function(map, obj) {
        map[obj.name] = {name: obj.name, id: obj.id, count: 0};
        return map;
    }, {});
    console.log("loaded tags: ", tags);
    products.forEach(product => {
        product.tags.forEach(tag => {
            tags[tag].count += 1;
        })
    })
    renderTags(tags);
    return tags;
}

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

function renderProducts(products) {
    const productContainer = $('#productsContainer');
    productContainer.empty();
    const tagsContainer = $('#tagsContainer');
    tagsContainer.empty();
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
    for(var tagid in tags) {
        const newTag = createTag(tagid, tags[tagid]);
        tagsContainer.append(newTag);
    }
}

function createProduct(data) {
    console.log(data);
    const product = $('<div class="card m-2" style="width: 15rem;" href="/product.html?id=' + data.id + '"/>');
    let img = $('<img class="card-img-top"/>');
    img.attr('src', "../media/resized/" + data.filename);
    const body = $('<div class="card-body"/>');
    const title = $('<h5 class="card-title"/>');
    title.text(data.title);
    body.append(title);
    product.append(img);
    product.append(body);
    return product;
}

function createTag(tagid, data) {
    const tag = $('<a href="#" class="list-group-item tag" data-id="' + tagid + '"/>')
    const counter = $('<span class="float-right badge badge-light round"/>')
    counter.text(data.count)
    tag.text(data.name);
    tag.attr("data-name", data.name)
    tag.append(counter);
    tag.on('click', event => {
        let clickedTag = $(event.currentTarget);
        clickedTag.toggleClass('active');
        selectedTags.splice(0, selectedTags.length);
        $('#tagsContainer .tag.active').each((_, tag) => selectedTags.push($(tag).attr('data-name')));
        let filteredProducts = products.filter(f => selectedTags.every(tag => f.tags.includes(tag)));
        updateProducts(filteredProducts);
    });
    return tag;
}

