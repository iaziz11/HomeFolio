jQuery(function () {
  $("#formFile").on("change", function () {
    $("#formControlInput").val(
      $("#formFile").val().split("\\").pop().split(".")[0]
    );
  });

  $(".submit-new-form").on("click", function () {
    $("#modalNewForm").addClass("was-validated");
    if (!document.querySelector("#modalNewForm").checkValidity()) {
      return;
    }
    $("#newFileText").css("display", "none");
    $("#newSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + this.id + "/files",
      method: "POST",
      data: new FormData(document.querySelector("#modalNewForm")),
      processData: false,
      contentType: false,
    })
      .always(function () {
        $("#newFileText").css("display", "inline");
        $("#newSpinner").css("display", "none");
      })
      .done(function () {
        console.log("Added successfully!");
        window.location.reload();
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#deleteModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;
    let id = button.getAttribute("data-id");
    let itemId = button.getAttribute("data-itemid");
    $(".delete-button").attr("data-itemid", itemId);
    $(".delete-button").attr("data-id", id);
  });

  $(".delete-button").on("click", function (e) {
    let id = $(".delete-button").attr("data-id");
    let itemId = $(".delete-button").attr("data-itemid");
    $("#deleteReminderText").css("display", "none");
    $("#deleteSpinner").css("display", "block");
    $.ajax({
      url: "/folios/" + itemId + "/files/" + id,
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
