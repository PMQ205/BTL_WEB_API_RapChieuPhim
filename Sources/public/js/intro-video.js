// Ẩn intro video sau khi chạy xong + fade-out mượt
/* global , document */
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('intro-vid')
  const wrapper = document.getElementById('intro-video')

  if (video && wrapper) {
    video.onended = () => {
      wrapper.classList.add('fade-out')
      setTimeout(() => {
        wrapper.style.display = 'none'
      }, 500)
    }
  }
})
