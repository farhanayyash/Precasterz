const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const error = document.getElementById('error');

if (form && emailInput) {
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      if (error) error.style.display = 'block';
      return;
    }

    if (error) error.style.display = 'none';
    // You can submit the form programmatically if needed
    form.submit();
  });
}
