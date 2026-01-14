// Khởi tạo biến từ server
/* global , document, window, alert */
let pricePerTicket = 0
let selectedSeats = []
let selectedSeatsData = {} // {seatId: price}
let allShowtimesData = []
let currentMaLich = 0
let currentShowtimeDate = null

// Khởi tạo dữ liệu từ server (đọc từ data attributes)
function initSeatsData() {
  const dataElement = document.getElementById('seatsData')
  if (!dataElement) {
    console.warn('Không tìm thấy element seatsData')
    return
  }

  pricePerTicket = parseInt(dataElement.getAttribute('data-price-per-ticket')) || 0
  currentMaLich = parseInt(dataElement.getAttribute('data-current-ma-lich')) || 0
  currentShowtimeDate = dataElement.getAttribute('data-current-showtime-date') || null

  try {
    const showtimesJson = dataElement.getAttribute('data-all-showtimes')
    allShowtimesData = showtimesJson ? JSON.parse(showtimesJson) : []
  } catch (error) {
    console.error('Lỗi parse allShowtimes:', error)
    allShowtimesData = []
  }
}

function toggleSeat(label) {
  const checkbox = document.getElementById(label.getAttribute('for'))
  if (checkbox.disabled) return

  const seatId = checkbox.value
  const seatPrice = parseFloat(checkbox.getAttribute('data-price')) || pricePerTicket

  // Kiểm tra ghế đã được chọn chưa dựa vào mảng selectedSeats (không dựa vào checkbox.checked vì browser đã toggle trước đó)
  const isAlreadySelected = selectedSeats.includes(seatId)

  if (isAlreadySelected) {
    // Hủy chọn ghế
    checkbox.checked = false
    label.classList.remove('selected')
    selectedSeats = selectedSeats.filter((s) => s !== seatId)
    delete selectedSeatsData[seatId]
  } else {
    // Chọn ghế
    checkbox.checked = true
    label.classList.add('selected')
    selectedSeats.push(seatId)
    selectedSeatsData[seatId] = seatPrice
  }

  updateSummary()
}

function updateSummary() {
  const summaryDiv = document.getElementById('selectedSeats')
  const seatsList = document.getElementById('seatsList')
  const totalPrice = document.getElementById('totalPrice')
  const bookBtn = document.getElementById('bookBtn')

  if (!summaryDiv || !seatsList || !totalPrice || !bookBtn) {
    return
  }

  if (selectedSeats.length > 0) {
    summaryDiv.classList.add('show')
    bookBtn.classList.add('show')
    seatsList.textContent = selectedSeats.sort().join(', ')

    const total = Object.values(selectedSeatsData).reduce((sum, price) => sum + price, 0)
    totalPrice.textContent = Math.round(total).toLocaleString('vi-VN')
  } else {
    summaryDiv.classList.remove('show')
    bookBtn.classList.remove('show')
  }
}

function selectDate(dateStr) {
  // Tìm lịch chiếu đầu tiên của ngày được chọn
  const showtimesForDate = allShowtimesData.filter((st) => {
    const stDate = new Date(st.GioChieu)
    return stDate.toISOString().split('T')[0] === dateStr
  })

  if (showtimesForDate.length > 0) {
    // Redirect đến lịch chiếu đầu tiên của ngày đó
    window.location.href = '/showtimes/' + showtimesForDate[0].MaLich
  } else {
    alert('Không có lịch chiếu cho ngày này')
  }
}

function selectTime(maLich) {
  if (maLich && maLich !== currentMaLich) {
    window.location.href = '/showtimes/' + maLich
  }
}

function openTrailer(url) {
  if (url && url !== '#') {
    window.open(url, '_blank')
  }
}

// Highlight ngày và giờ được chọn khi load trang
document.addEventListener('DOMContentLoaded', function () {
  // Khởi tạo dữ liệu từ server
  initSeatsData()

  if (currentShowtimeDate) {
    const currentDate = new Date(currentShowtimeDate)
    const currentDateKey = currentDate.toISOString().split('T')[0]

    // Highlight ngày được chọn
    document.querySelectorAll('.date-btn').forEach((btn) => {
      if (btn.getAttribute('data-date') === currentDateKey) {
        btn.classList.add('selected')
      }
    })
  }

  // Highlight giờ được chọn
  document.querySelectorAll('.time-btn').forEach((btn) => {
    if (parseInt(btn.getAttribute('data-malich')) === currentMaLich) {
      btn.classList.add('selected-time')
    }
  })

  // Setup event listeners cho các seat buttons
  document.querySelectorAll('.seat-btn.available').forEach((btn) => {
    btn.addEventListener('click', function () {
      toggleSeat(this)
    })
  })

  // Setup event listeners cho date buttons
  document.querySelectorAll('.date-btn.available').forEach((btn) => {
    btn.addEventListener('click', function () {
      const dateStr = this.getAttribute('data-date')
      selectDate(dateStr)
    })
  })

  // Setup event listeners cho time buttons
  document.querySelectorAll('.time-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const maLich = parseInt(this.getAttribute('data-malich'))
      selectTime(maLich)
    })
  })

  // Setup play button
  const playButton = document.querySelector('.play-button')
  if (playButton) {
    playButton.addEventListener('click', function () {
      const trailerUrl = this.getAttribute('data-trailer')
      openTrailer(trailerUrl)
    })
  }

  // Setup form submission
  const bookingForm = document.getElementById('bookingForm')
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault()

      if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế')
        return
      }

      if (!currentMaLich || currentMaLich === 0) {
        alert('Lỗi: Không tìm thấy lịch chiếu')
        return
      }

      try { 
        // Chuẩn bị dữ liệu ghế
        const formData = selectedSeats.map((seat) => ({
          MaLich: currentMaLich,
          GheNgoi: seat,
        }))

        const totalAmount = Object.values(selectedSeatsData).reduce((sum, price) => sum + price, 0)
        const averagePrice = selectedSeats.length > 0 ? Math.round(totalAmount / selectedSeats.length) : 0

        // Gọi API DEMO để giữ ghế + tạo giao dịch PENDING
        const res = await fetch('/api/payment/demo-hold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            MaLich: currentMaLich,
            SoTien: Math.round(totalAmount),
            seatData: formData,
          }),
        })

        const data = await res.json()
        if (!res.ok || !data.success) {
          alert(data.message || 'Không thể giữ ghế, vui lòng thử lại')
          return
        }

        // Lưu thông tin vé vào sessionStorage
        sessionStorage.setItem('ticketInfo', JSON.stringify({
          MaLich: currentMaLich,
          selectedSeats: selectedSeats,
          totalAmount: Math.round(totalAmount),
          averagePrice: averagePrice,
          pricePerTicket: pricePerTicket,
          seatData: formData,
          orderId: data.orderId,
        }))

        alert('Đặt vé thành công! Vui lòng hoàn tất thanh toán trong 5 phút.')
        window.location.href = '/payment-booking'
      } catch (error) {
        console.error('Error:', error)
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.')
      }
    })
  }
})
