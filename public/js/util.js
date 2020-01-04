async function loadHeader(path, activeId) {
    $("#header").load(path, () => {
        setNavItemActive(activeId)
        addListeners();
    });
}

async function loadFooter(path) {
    $("#footer").load(path);
}

function setNavItemActive(id) {
    $("li.nav-item").each((idx, item) => {
        let nav = $(item);
        if (nav.attr('id') === id) {
            nav.addClass('active');
            nav.removeClass('disabled');
        } else {
            nav.addClass('disabled')
            nav.removeClass('active')
        }
    });
}

function addListeners() {
    var timer;
    $('#live-search-input').on('change paste keyup', (event) => {
        clearTimeout(timer);
        timer = setTimeout(function() {
            search(event);
        }, 200);
    });
    $('#livesearchBtn').on('click', (event) => {
        event.preventDefault();
        var tags = $("#live-search-input").val().trim().split(" ")
        var url = "/pages/products.html?tags=" + tags.join("&tags=");
        window.location.href = url
    });

}

function search(event) {
    var searchterm = $(event.currentTarget).val().toLowerCase();
    var resultDropdown = $(event.currentTarget).siblings(".live-search-result");
    console.log(searchterm);
    if (searchterm.includes(" ")) {
        var tmp = searchterm.split(" ");
        searchterm = tmp[Math.max(tmp.length - 1, 0)];
    }
    console.log(searchterm)
    if (searchterm.length >= 2) {
        resultDropdown.show();
        $(resultDropdown).siblings('span.toggle-helper').dropdown('toggle');
        resultDropdown.children('.dropdown-item').remove();
        $.post(
            "/api/livesearch", { search: searchterm }
        ).done((response) => {
            console.log(response)
            var data = response.data;
            if (data.length > 0) {
                resultDropdown.empty();
                for (var entry of data.slice(0, 10)) {
                    const k = $('<div class="dropdown-item live-search-items" data-name="' + entry.name + '">' + entry.name.replace(searchterm, "<strong>" + searchterm + "</strong>") + '</div > ');
                    k.on('click', event => {
                        let clickedEntry = $(event.currentTarget);
                        var input = $('#live-search-input');
                        const pattern = new RegExp("(:?^||\\s)" + searchterm + "$", "g")
                        input.val(input.val().replace(pattern, " " + clickedEntry.attr("data-name")).trim());

                        resultDropdown.hide();
                        resultDropdown.empty();
                    });
                    resultDropdown.append(k)
                }
            } else {
                resultDropdown.hide();
            }
        });
    } else {
        resultDropdown.empty();
    }
}

function getCart() {
    if ('cart' in sessionStorage) {
        return JSON.parse(sessionStorage.getItem('cart'));
    } else {
        return {}
    }
}

function setCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id) {
    let cart = getCart();
    console.log(JSON.stringify(cart));
    if (id in cart) {
        cart[id] += 1;
    } else {
        cart[id] = 1;
    }
    setCart(cart);
    console.log(JSON.stringify(cart));
}

function removeFromCart(item) {
    let cart = getCart();
    if (item.id in card) {
        delete card[item.id];
        setCart(cart);
    }
}

function setCustomer(customer) {
    sessionStorage.setItem('customer', JSON.stringify(customer));
}

function getCustomer() {
    return JSON.parse(sessionStorage.getItem('customer'));
}