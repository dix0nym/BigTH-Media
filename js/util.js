async function loadHeader(path, activeId) {
    $("#header").load(path, () => {
        setNavItemActive(activeId)
    });
}

async function loadFooter(path) {
    $("#footer").load(path);
}

function setNavItemActive(id) {
    $("li.nav-item").each( (idx, item) => {
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