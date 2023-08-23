$("button.delete-button").each(function () {
    let button = this;
    button.addEventListener('click', function () {
        $.ajax({
            url: "/items/" + button.id,
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

$("#editModal").on('show.bs.modal', function (e) {
    const button = e.relatedTarget
    const name = button.nextSibling.nextSibling.innerText;
    const id = button.getAttribute('data-bs-id')
    const modalInput = this.querySelector('.modal-body form input[type=text]')
    const modalSubmit = this.querySelector('.modal-footer .submit-edit-form')
    modalSubmit.setAttribute('id', id)
    modalInput.value = name;
})

$('.submit-edit-form').on('click', function () {
    $.ajax({
        url: '/items/' + this.id,
        method: 'PUT',
        data: new FormData(document.querySelector('#modalEditForm')),
        processData: false,
        contentType: false
    })
        .done(function () {
            console.log('Edited successfully!')
            window.location.reload()
        })
        .fail(function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        })
})


$('.submit-new-form').on('click', function () {
    $.ajax({
        url: '/items',
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