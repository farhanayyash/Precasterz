const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const error = document.getElementById('error');

form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form submission

  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    error.style.display = 'block';
    return;
  }

  error.style.display = 'none';
  //alert('Email is valid. Form submitted!');
  // You can submit the form programmatically if needed
  form.submit();
});
