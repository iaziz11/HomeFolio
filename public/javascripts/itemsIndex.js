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
    const button = e.relatedTarget;
    const name = button.nextSibling.nextSibling.innerText;
    const color = $(button).parent().parent().attr('data-color')
    const id = button.getAttribute('data-bs-id')
    const modalInputName = this.querySelector('.modal-body form input[type=text]')
    const modalInputColor = this.querySelector('.modal-body form input[type=color]')
    const modalSubmit = this.querySelector('.modal-footer .submit-edit-form')
    modalSubmit.setAttribute('id', id)
    modalInputName.value = name;
    modalInputColor.value = color;
})

$("#newModal").on('show.bs.modal', function (e) {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const modalInputColor = this.querySelector('.modal-body form input[type=color]');
    modalInputColor.value = randomColor;
})

$('.submit-edit-form').on('click', function () {
    $('#editItemText').css('display', 'none');
    $('#editSpinner').css('display', 'block');
    $.ajax({
        url: '/items/' + this.id,
        method: 'PUT',
        data: new FormData(document.querySelector('#modalEditForm')),
        processData: false,
        contentType: false
    })
        .always(function () {
            $('#editItemText').css('display', 'inline');
            $('#editSpinner').css('display', 'none');
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
    $('#newItemText').css('display', 'none');
    $('#newSpinner').css('display', 'block');
    $.ajax({
        url: '/items',
        method: 'POST',
        data: new FormData(document.querySelector('#modalNewForm')),
        processData: false,
        contentType: false
    })
        .always(function () {
            $('#newItemText').css('display', 'inline');
            $('#newSpinner').css('display', 'none');
        })
        .done(function () {
            console.log('Added successfully!')
            window.location.reload()
        })
        .fail(function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem! Please try again!");
            console.log("Error: " + errorThrown);
            console.log("Status: " + status);
            console.dir(xhr);
        })
})