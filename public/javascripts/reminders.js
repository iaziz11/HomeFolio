jQuery(function () {
  function getFormattedDate(oldDate) {
    const convertDate = new Date(oldDate);
    const formatter = Intl.DateTimeFormat("en-US", {
      timeZone: "Etc/UTC",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    let returnDate = formatter.format(convertDate);
    let [date, time] = returnDate.split(", ");
    const [month, day, year] = date.split("/");
    const [hour, minute] = time.split(":");
    const newMonth = month < 10 ? `0${month}` : month;
    const newDay = day < 10 ? `0${day}` : day;
    const newHour = hour % 24 < 10 ? `0${hour % 24}` : hour % 24;
    let newDateString = `${year}-${newMonth}-${newDay}T${newHour}:${minute}`;
    return newDateString;
  }
  function getFormData(object) {
    let formData = "";
    Object.keys(object).forEach(
      (key) => (formData += `${key}=${object[key]}&`)
    );
    console.log(formData);
    return formData.slice(0, -1);
  }

  $("#modalNewForm #newCheck").on("change", function () {
    if ($("#modalNewForm #newCheck").is(":checked")) {
      $("#newRemindText").text("Remind Me Starting:");
      $("#newEveryContainer").show();
      $("#everyPeriod").attr("required", true);
    } else {
      $("#newRemindText").text("Remind Me On:");
      $("#newEveryContainer").hide();
      $("#everyPeriod").attr("required", false);
    }
  });

  $("#modalEditForm #editCheck").on("change", function () {
    if ($("#modalEditForm #editCheck").is(":checked")) {
      $("#editRemindText").text("Remind Me Starting:");
      $("#editEveryContainer").show();
      $("#editEveryPeriod").attr("required", true);
    } else {
      $("#editRemindText").text("Remind Me On:");
      $("#editEveryContainer").hide();
      $("#editEveryPeriod").attr("required", false);
    }
  });

  $(".submit-new-form").on("click", function () {
    $("#modalNewForm").addClass("was-validated");
    if (!document.querySelector("#modalNewForm").checkValidity()) {
      return;
    }
    $("#newReminderText").css("display", "none");
    $("#newSpinner").css("display", "block");
    // sendData = $("#modalNewForm").serialize();

    var formEl = document.forms.modalNewForm;
    var formData = new FormData(formEl);
    let allEntries = Object.fromEntries(formData);
    allEntries["reminder[nextDate]"] = getFormattedDate(
      allEntries["reminder[nextDate]"]
    );
    const newData = getFormData(allEntries);
    $.ajax({
      url: "/folios/" + this.id + "/reminders",
      method: "POST",
      data: newData,
    })
      .always(function () {
        $("#newReminderText").css("display", "inline");
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

  $("table .form-check-input").on("change", function () {
    let sendData = this.name + "=" + this.checked;
    let url =
      "/folios/" +
      $(this).attr("data-itemid") +
      "/reminders/" +
      $(this).attr("data-id") +
      "/toggleCompleted";
    $.ajax({
      url,
      method: "PUT",
      data: sendData,
    })
      .done(function () {
        console.log("Changed successfully!");
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#editModal").on("show.bs.modal", function (e) {
    const button = e.relatedTarget;
    $.ajax({
      url:
        "/folios/" +
        button.getAttribute("data-bs-itemid") +
        "/reminders/" +
        button.getAttribute("data-bs-id"),
      method: "GET",
    })
      .done(function (data) {
        let newDate = new Date(data.nextDate);
        let editDate =
          newDate.getFullYear() +
          "-" +
          ("0" + (newDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + newDate.getDate()).slice(-2) +
          "T" +
          ("0" + newDate.getHours()).slice(-2) +
          ":" +
          ("0" + newDate.getMinutes()).slice(-2);
        console.log(newDate);
        let everyPeriod = 0;
        for (let [i, v] of data.every.entries()) {
          if (v > 0) {
            data.every[i] = 1;
            everyPeriod = v;
          }
        }
        $("#modalEditForm #editReminderName").val(data.text);
        $("#modalEditForm #editCheck")
          .prop("checked", data.recurring)
          .trigger("change");
        $("#modalEditForm #editNextDate").val(editDate);
        $(
          `#modalEditForm #editEvery option[value='${data.every.join(" ")}']`
        ).attr("selected", "true");
        $("#modalEditForm #editEveryPeriod").val(everyPeriod);
        $(".submit-edit-form").attr(
          "data-itemid",
          $(button).attr("data-bs-itemid")
        );
        $(".submit-edit-form").attr("data-id", $(button).attr("data-bs-id"));
      })
      .fail(function (xhr, status, errorThrown) {
        alert("Sorry, there was a problem!");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });
  });

  $("#editModal").on("hide.bs.modal", function (e) {
    $("#editRemindText").text("Remind Me On:");
    $("#modalEditForm").removeClass("was-validated");
    $("#editEveryContainer").hide();
    $("#modalEditForm")[0].reset();
  });

  $("#newModal").on("hide.bs.modal", function (e) {
    $("#modalNewForm").removeClass("was-validated");
  });

  $(".submit-edit-form").on("click", function () {
    $("#modalEditForm").addClass("was-validated");
    if (!document.querySelector("#modalEditForm").checkValidity()) {
      return;
    }
    $("#editReminderText").css("display", "none");
    $("#editSpinner").css("display", "block");
    let itemId = $(this).attr("data-itemid");
    let id = $(this).attr("data-id");
    $.ajax({
      url: "/folios/" + itemId + "/reminders/" + id,
      method: "PUT",
      data: $("#modalEditForm").serialize(),
    })
      .always(function () {
        $("#editReminderText").css("display", "inline");
        $("#editSpinner").css("display", "none");
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
      url: "/folios/" + itemId + "/reminders/" + id,
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
