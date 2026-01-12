/*global document, alert, window*/
// payment.js - Xử lý thanh toán VNPay
class PaymentHandler {
  constructor() {
    this.selectedSeats = [];
    this.totalAmount = 0;
    this.moviePrice = 0;
    this.MaLich = null;
  }

  // Khởi tạo payment handler
  init() {
    this.attachEventListeners();
  }

  // Gắn event listeners
  attachEventListeners() {
    // Chọn/bỏ chọn ghế
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('seat')) {
        this.toggleSeat(e.target);
      }
    });

    // Nút thanh toán
    const paymentBtn = document.getElementById('payment-btn');
    if (paymentBtn) {
      paymentBtn.addEventListener('click', () => this.proceedToPayment());
    }

    // Nút hủy
    const cancelBtn = document.getElementById('cancel-payment-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closePaymentModal());
    }
  }

  // Tạo sơ đồ ghế (10 hàng x 10 cột)
  generateSeats() {
    const seatGrid = document.getElementById('seat-grid');
    if (!seatGrid) return;

    seatGrid.innerHTML = ''; // Xóa ghế cũ

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const cols = 10;

    rows.forEach((row) => {
      for (let col = 1; col <= cols; col++) {
        const seatCode = `${row}${col}`;
        const seat = document.createElement('button');
        seat.type = 'button';
        seat.className = 'seat available';
        seat.dataset.seat = seatCode;
        seat.textContent = seatCode;
        seat.style.cursor = 'pointer';
        seatGrid.appendChild(seat);
      }
    });
  }

  // Toggle chọn/bỏ chọn ghế
  toggleSeat(seatElement) {
    const seatCode = seatElement.dataset.seat;
    
    if (seatElement.classList.contains('selected')) {
      // Bỏ chọn
      seatElement.classList.remove('selected');
      seatElement.classList.add('available');
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatCode);
      this.totalAmount -= this.moviePrice;
    } else if (!seatElement.classList.contains('booked')) {
      // Chọn
      seatElement.classList.remove('available');
      seatElement.classList.add('selected');
      this.selectedSeats.push(seatCode);
      this.totalAmount += this.moviePrice;
    }

    this.updatePaymentUI();
  }

  // Cập nhật giao diện thanh toán
  updatePaymentUI() {
    const seatDisplay = document.getElementById('selected-seats-display');
    const amountDisplay = document.getElementById('total-amount-display');
    const seatCountDisplay = document.getElementById('selected-seats-count');
    const paymentBtn = document.getElementById('payment-btn');

    if (seatDisplay) {
      seatDisplay.textContent = this.selectedSeats.length > 0 
        ? this.selectedSeats.join(', ') 
        : 'Chưa chọn ghế';
    }

    if (amountDisplay) {
      amountDisplay.textContent = this.formatCurrency(this.totalAmount);
    }

    if (seatCountDisplay) {
      seatCountDisplay.textContent = this.selectedSeats.length;
    }

    // Disable nút thanh toán nếu chưa chọn ghế
    if (paymentBtn) {
      paymentBtn.disabled = this.selectedSeats.length === 0;
    }
  }

  // Format tiền tệ
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  // Xử lý thanh toán
  async proceedToPayment() {
    if (this.selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }

    if (!this.MaLich) {
      alert('Không tìm thấy lịch chiếu');
      return;
    }

    try {
      // Gọi API tạo URL thanh toán
      const response = await fetch('/api/payment/create-payment-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MaLich: parseInt(this.MaLich),
          SoTien: this.totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Lưu thông tin vé tạm thời vào localStorage
        sessionStorage.setItem('ticketInfo', JSON.stringify({
          MaLich: this.MaLich,
          selectedSeats: this.selectedSeats,
          totalAmount: this.totalAmount,
          orderId: data.orderId,
        }));

        // Redirect sang VNPay
        window.location.href = data.paymentUrl;
      } else {
        alert('Lỗi: ' + (data.message || 'Không thể tạo URL thanh toán'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Lỗi khi tạo thanh toán: ' + error.message);
    }
  }

  // Đóng modal thanh toán
  closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    // Reset dữ liệu
    this.selectedSeats = [];
    this.totalAmount = 0;
  }

  // Set giá vé
  setMoviePrice(price) {
    this.moviePrice = price;
  }

  // Mở modal thanh toán
  openPaymentModal(MaLich, moviePrice) {
    this.MaLich = MaLich;
    this.setMoviePrice(moviePrice);
    this.selectedSeats = [];
    this.totalAmount = 0;
    
    // Tạo sơ đồ ghế
    this.generateSeats();
    
    this.updatePaymentUI();
    
    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.paymentHandler = new PaymentHandler();
  window.paymentHandler.init();
});