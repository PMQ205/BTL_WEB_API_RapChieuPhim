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
async function payAgain(orderId) {
  try {
    const res = await fetch(`/api/payment/pending/${orderId}`)
    const data = await res.json()
    if (!res.ok || !data.success) {
      alert(data.message || 'Không tìm thấy thông tin vé chờ thanh toán')
      return
    }

    const info = data.data
    const selectedSeats = info.seatData.map((s) => s.GheNgoi)
    const totalAmount = info.totalAmount
    const averagePrice = info.averagePrice

    sessionStorage.setItem(
      'ticketInfo',
      JSON.stringify({
        MaLich: info.MaLich,
        selectedSeats,
        totalAmount,
        averagePrice,
        pricePerTicket: averagePrice,
        seatData: info.seatData,
        orderId,
      })
    )

    window.location.href = '/payment-booking'
  } catch (error) {
    console.error('payAgain error', error)
    alert('Không thể tải lại thông tin thanh toán')
  }
}

async function cancelHold(orderId) {
  if (!confirm('Bạn có chắc muốn hủy ghế?')) return
  const res = await fetch(`/api/payment/cancel/${orderId}`, { method:'POST' })
  location.reload()
}
