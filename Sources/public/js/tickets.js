// Hiển thị thông báo success nếu có trong URL
/* global , document, window, alert, confirm, location */
window.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === '1') {
    const successMsg = document.getElementById('successMessage')
    if (successMsg) {
      successMsg.style.display = 'block'
      setTimeout(() => {
        successMsg.style.display = 'none'
        // Xóa query parameter
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 5000)
    }
  }
})

async function deleteTicket(maVe) {
  if (!confirm('Bạn có chắc chắn muốn hủy vé này?')) {
    return
  }

  try {
    const response = await fetch(`/api/ve/${maVe}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    const result = await response.json()

    if (response.ok) {
      alert('Hủy vé thành công')
      location.reload()
    } else {
      alert(result.message || 'Hủy vé thất bại')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Đã có lỗi xảy ra. Vui lòng thử lại.')
  }
}

function printTicket(maVe) {
  window.print()
}
