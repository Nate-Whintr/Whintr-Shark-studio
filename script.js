(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var navList = document.getElementById('nav-list');

  if (menuToggle && navList) {
    menuToggle.setAttribute('aria-expanded', 'false');

    function setMenu(open) {
      navList.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    }

    menuToggle.addEventListener('click', function () {
      setMenu(!navList.classList.contains('open'));
    });

    // Close the menu when a link is chosen
    navList.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    // Close the menu with the Escape key and return focus to the toggle
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navList.classList.contains('open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Replace with your real endpoint (e.g. a Formspree form URL).
  // While it still contains YOUR_FORM_ID, the form runs in demo mode.
  var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var successMessage = document.getElementById('form-success');
  var formError = document.getElementById('form-error');
  var submitButton = form.querySelector('button[type="submit"]');

  var rules = {
    name: function (value) {
      return value.trim().length > 0 ? '' : 'Enter your name.';
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ''
        : 'Enter a valid email address, like name@example.com.';
    },
    message: function (value) {
      return value.trim().length >= 10
        ? ''
        : 'Enter a message of at least 10 characters.';
    }
  };

  // Validate one field, show or clear its error, return true if valid
  function validateField(input) {
    var errorText = rules[input.name](input.value);
    document.getElementById(input.name + '-error').textContent = errorText;
    input.setAttribute('aria-invalid', errorText ? 'true' : 'false');
    return errorText === '';
  }

  function clearStatusMessages() {
    successMessage.textContent = '';
    formError.textContent = '';
  }

  // Errors appear on submit, then update live as the user fixes them.
  // Any new typing also clears an old success or failure message.
  Object.keys(rules).forEach(function (fieldName) {
    var input = form.elements[fieldName];

    input.addEventListener('input', function () {
      clearStatusMessages();
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearStatusMessages();

    // Validate every field and remember the first invalid one
    var allValid = true;
    var firstInvalid = null;

    Object.keys(rules).forEach(function (fieldName) {
      var input = form.elements[fieldName];
      if (!validateField(input)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!allValid) {
      firstInvalid.focus();
      return;
    }

    // Demo mode: be honest that nothing was actually sent
    if (FORM_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
      successMessage.textContent =
        'Demo only: your details were valid, but no message was actually sent.';
      form.reset();
      return;
    }

    // Real submission
    submitButton.disabled = true;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        successMessage.textContent = 'Thanks! Your message was sent.';
        form.reset();
      })
      .catch(function () {
        formError.textContent =
          'Sorry, something went wrong sending your message. Please try again.';
      })
      .finally(function () {
        submitButton.disabled = false;
      });
  });
})();
