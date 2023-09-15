(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if ($("#password").val() !== $("#confirm-password").val()) {
          $(".form-text").hide();
          $("#confirm-password-feedback").text("Passwords must match.");
          $("#confirm-password").addClass("is-invalid");
          event.preventDefault();
          event.stopPropagation();
          form.classList.add("was-validated");
          return;
        }
        if (!form.checkValidity()) {
          $(".form-text").hide();
          $("#confirm-password-feedback").text("");
          event.preventDefault();
          event.stopPropagation();
          form.classList.add("was-validated");
        }
      },
      false
    );
  });
})();
