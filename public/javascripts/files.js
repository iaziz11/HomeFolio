jQuery(function () {
    $('.submit-new-form').on('click', function () {
        $.ajax({
            url: '/items/' + this.id + "/files",
            method: 'POST',
            data: new FormData(document.querySelector('#modalNewForm')),
            processData: false,
            contentType: false
        })
            .done(function () {
                console.log('Added successfully!')
                window.location.reload()
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })

    $(".delete-button").on('click', function () {
        console.log($(this).attr('data-itemid'))
        console.log(this.id)
        $.ajax({
            url: "/items/" + $(this).attr('data-itemid') + '/files/' + this.id,
            type: 'DELETE'
        })
            .done(function () {
                console.log('Deleted successfully!')
                window.location.reload()
            })
            .fail(function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!");
                console.log("Error: " + errorThrown);
                console.log("Status: " + status);
                console.dir(xhr);
            })
    })
})