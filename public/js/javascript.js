window.onload = () => {
  console.log("Page Loaded");

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const xhr = new XMLHttpRequest();

  const newUserBtn = $("#submit-new-user");
  const searchBtn = $("#search-btn");
  const loginLink = $("#loginLink");
  const modal = $("#modal");
  const close = $("#modal__close");
  const menu = $$(".collapsible-menu");

  $("#login-btn").addEventListener("click", login);

  close.addEventListener("click", closeModal);
  modal.addEventListener("click", outsideClick);

  if (loginLink) {
    loginLink.addEventListener("click", openModal);
  }

  if (newUserBtn) {
    newUserBtn.addEventListener("click", createUser);
  }

  for (let i = 0; i < menu.length; i++) {
    menu[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      console.log("content", content);
      const icon = this.children[0];
      if (content.style.display === "block") {
        content.style.display = "none";
        icon.className = "im im-plus-circle";
      } else {
        content.style.display = "block";
        icon.className = "im im-minus-circle";
      }
    });
  }



  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function outsideClick(e) {
    if (e.target == modal || e.target == close) {
      modal.style.display = "none";
    }

  }


  // function uncheck() {
  //   let navLogin = $(".login-checkbox");
  //   if (navLogin !== null && navLogin.checked) {
  //     navLogin.checked = false;
  //   }
  // }


  function checkStatus() {
    xhr.open("GET", '/user/status', true);
    xhr.onload = function() {
      if (this.status == 200) {
        user = JSON.parse(this.responseText);
        console.log("responseText", user);

      }
    }
    xhr.send();
  }






  function login(e) {
    e.preventDefault();
    const email = $(".login-email").value;
    const pass = $(".login-pass").value;

    let userData = {
      email: email,
      password: pass
    };

    xhr.open("POST", "/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (this.status == 200) {
        if (this.responseText) {
          window.location.reload();
        }
      }
    }
    xhr.send(JSON.stringify(userData));
  }





  function createUser(e) {
    e.preventDefault();
    let form = $("#new-user-form");
    let formInput = form.getElementsByTagName("input");
    let formData = {};

    for (let i = 0; i < formInput.length; i++) {
      let name = formInput[i].name;
      let value = formInput[i].value;
      if (name == "password") {
        formData[name] = value;
      } else {
        formData[name] = value.toLowerCase();
      }
    }

    xhr.open("POST", "/user/new", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (this.status == 200) {
        let userReturn = JSON.parse(this.responseText);
        window.location = userReturn.reroute;
      }
    }
    xhr.send(JSON.stringify(formData));
  }



  // checkStatus();

}
