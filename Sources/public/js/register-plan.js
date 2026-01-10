/* global , document */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.plan-select-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const plan = this.getAttribute('data-plan')
      document.getElementById('selectedPlan').value = plan
      document.getElementById('planName').textContent = plan.toUpperCase()
      document.getElementById('registerModal').style.display = 'flex'
    })
  })

  // Close modal when clicking outside
  const registerModal = document.getElementById('registerModal')
  if (registerModal) {
    registerModal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeModal()
      }
    })
  }
})

function closeModal() {
  document.getElementById('registerModal').style.display = 'none'
}
