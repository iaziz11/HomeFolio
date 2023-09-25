jQuery(function () {
  $("#editModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;
    const name = button.nextSibling.nextSibling.innerText;
    const color = $(button).parent().parent().attr("data-color");
    const id = button.getAttribute("data-bs-id");
    const modalInputName = this.querySelector(
      ".modal-body form input[type=text]"
    );
    const modalInputColor = this.querySelector(
      ".modal-body form input[type=color]"
    );
    const modalSubmit = this.querySelector(".modal-footer .submit-edit-form");
    modalSubmit.setAttribute("id", id);
    modalInputName.value = name;
    modalInputColor.value = color;
  });

  $("#newModal").on("show.bs.modal", function (e) {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const modalInputColor = this.querySelector(
      ".modal-body form input[type=color]"
    );
    modalInputColor.value = randomColor;
  });

  $(".submit-edit-form").on("click", function () {
    $("#modalEditForm").addClass("was-validated");
    if (!document.querySelector("#modalEditForm").checkValidity()) {
      return;
    }
    $("#editItemText").css("display", "none");
    $("#editSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + this.id,
      method: "PUT",
      data: new FormData(document.querySelector("#modalEditForm")),
      processData: false,
      contentType: false,
    })
      .always(function () {
        $("#editItemText").css("display", "inline");
        $("#editSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Edited successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $(".submit-new-form").on("click", function () {
    $("#modalNewForm").addClass("was-validated");
    if (!document.querySelector("#modalNewForm").checkValidity()) {
      return;
    }
    $("#newItemText").css("display", "none");
    $("#newSpinner").css("display", "block");
    $.ajax({
      url: "/folios",
      method: "POST",
      data: new FormData(document.querySelector("#modalNewForm")),
      processData: false,
      contentType: false,
    })
      .always(function () {
        $("#newItemText").css("display", "inline");
        $("#newSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Added successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem! Please try again!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#editModal").on("hide.bs.modal", function (e) {
    $("#modalEditForm").removeClass("was-validated");
    $("#modalEditForm")[0].reset();
  });

  $("#newModal").on("hide.bs.modal", function (e) {
    $("#modalNewForm").removeClass("was-validated");
  });

  $("#deleteModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;
    let itemId = button.getAttribute("data-itemid");
    $(".delete-button").attr("data-itemid", itemId);
  });

  $(".delete-button").on("click", function (e) {
    let itemId = $(".delete-button").attr("data-itemid");
    $("#deleteReminderText").css("display", "none");
    $("#deleteSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + itemId,
      type: "DELETE",
    })
      .always(function () {
        $("#deleteReminderText").css("display", "inline");
        $("#deleteSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Deleted successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });
});
