$(async () => {
    console.log("loaded");
    await loadHeader("header2.html");
    await loadFooter("footer.html");
});

$('#personal-information').on('submit', () => {
    var formData = JSON.stringify($("form#personal-information").serializeArray());
    console.log($("#personal-information"))
    console.log(formData);
    // $.ajax({
    //     type: "POST",
    //     url: "/api/customer",
    //     data: 
    // })
    return false;
});