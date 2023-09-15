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
      url: "/items/" + this.id + "/files",
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

  $(".delete-button").on("click", function () {
    $.ajax({
      url: "/items/" + $(this).attr("data-itemid") + "/files/" + this.id,
      type: "DELETE",
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
