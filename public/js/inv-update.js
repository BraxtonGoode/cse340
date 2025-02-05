const form = document.getElementById("updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.getElementById("button")
      updateBtn.removeAttribute("disabled")
    })