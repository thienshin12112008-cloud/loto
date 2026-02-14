// Khởi tạo game
let availableNumbers = [];
let drawnNumbers = [];
let isSpinning = false;
let autoPlayInterval = null;
let isAutoPlay = false;

// Tạo lưới số
function createNumberGrid() {
    const grid = document.getElementById('numberGrid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 90; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.textContent = i;
        cell.id = 'cell-' + i;
        grid.appendChild(cell);
    }
}

// Reset game
function resetGame() {
    // Dừng auto play trước
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    isAutoPlay = false;
    
    // Reset dữ liệu
    availableNumbers = [];
    for (let i = 1; i <= 90; i++) {
        availableNumbers.push(i);
    }
    drawnNumbers = [];
    isSpinning = false;
    
    // Reset giao diện
    document.getElementById('currentNumber').textContent = '--';
    document.getElementById('countDrawn').textContent = '0';
    document.getElementById('countRemaining').textContent = '90';
    
    // Reset tất cả ô
    for (let i = 1; i <= 90; i++) {
        const cell = document.getElementById('cell-' + i);
        if (cell) {
            cell.classList.remove('drawn', 'latest');
        }
    }
    
    // Tự động bắt đầu quay sau 1 giây
    setTimeout(() => {
        startAutoPlay();
    }, 1000);
}

// Quay số
function quaySo() {
    if (isSpinning || availableNumbers.length === 0) return;
    
    isSpinning = true;
    const currentNumberDiv = document.getElementById('currentNumber');
    
    currentNumberDiv.classList.add('spinning');
    
    // Hiệu ứng quay số
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 90) + 1;
        currentNumberDiv.textContent = randomNum;
        spinCount++;
        
        if (spinCount >= 20) {
            clearInterval(spinInterval);
            
            // Chọn số thật
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const drawnNumber = availableNumbers.splice(randomIndex, 1)[0];
            drawnNumbers.push(drawnNumber);
            
            // Hiển thị số
            currentNumberDiv.textContent = drawnNumber;
            currentNumberDiv.classList.remove('spinning');
            
            // Đánh dấu ô
            const cell = document.getElementById('cell-' + drawnNumber);
            
            // Xóa class latest từ ô trước
            document.querySelectorAll('.number-cell.latest').forEach(c => {
                c.classList.remove('latest');
            });
            
            cell.classList.add('drawn', 'latest');
            
            // Cập nhật thống kê
            document.getElementById('countDrawn').textContent = drawnNumbers.length;
            document.getElementById('countRemaining').textContent = availableNumbers.length;
            
            // Đọc số bằng tiếng Việt
            setTimeout(() => {
                speakNumber(drawnNumber);
            }, 200);
            
            isSpinning = false;
            
            // Dừng auto play nếu hết số
            if (availableNumbers.length === 0) {
                stopAutoPlay();
            }
        }
    }, 50);
}

// Đọc số bằng tiếng Việt
function speakNumber(number) {
    if ('speechSynthesis' in window) {
        // Hủy bỏ các lời nói đang chờ
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance();
        
        // Chuyển số thành chữ tiếng Việt
        const numberText = convertNumberToVietnamese(number);
        utterance.text = numberText;
        
        // Cài đặt giọng nói tiếng Việt
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9; // Tốc độ đọc (0.1 - 10)
        utterance.pitch = 1; // Cao độ (0 - 2)
        utterance.volume = 1; // Âm lượng (0 - 1)
        
        // Thử tìm giọng tiếng Việt
        const voices = window.speechSynthesis.getVoices();
        const vietnameseVoice = voices.find(voice => 
            voice.lang === 'vi-VN' || voice.lang.startsWith('vi')
        );
        
        if (vietnameseVoice) {
            utterance.voice = vietnameseVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// Chuyển số thành chữ tiếng Việt
function convertNumberToVietnamese(num) {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    if (num === 0) return 'không';
    if (num < 10) return ones[num];
    
    const ten = Math.floor(num / 10);
    const one = num % 10;
    
    if (num === 10) return 'mười';
    if (num < 20) {
        if (one === 5) return 'mười lăm';
        return 'mười ' + ones[one];
    }
    
    if (one === 0) return tens[ten];
    if (one === 1) return tens[ten] + ' mốt';
    if (one === 5 && ten > 1) return tens[ten] + ' lăm';
    
    return tens[ten] + ' ' + ones[one];
}

// Bắt đầu tự động quay
function startAutoPlay() {
    if (isAutoPlay) return;
    
    isAutoPlay = true;
    const btnToggle = document.getElementById('btnToggleAuto');
    if (btnToggle) {
        btnToggle.textContent = 'TẠM DỪNG';
        btnToggle.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
    }
    
    autoPlayInterval = setInterval(() => {
        if (availableNumbers.length > 0 && !isSpinning) {
            quaySo();
        } else if (availableNumbers.length === 0) {
            stopAutoPlay();
        }
    }, 5000);
}

// Dừng tự động quay
function stopAutoPlay() {
    isAutoPlay = false;
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    
    const btnToggle = document.getElementById('btnToggleAuto');
    if (btnToggle) {
        btnToggle.textContent = 'TIẾP TỤC';
        btnToggle.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
    }
}

// Toggle auto play
function toggleAutoPlay() {
    if (isAutoPlay) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

// Khởi tạo khi load trang
window.onload = function() {
    createNumberGrid();
    resetGame();
    
    // Load giọng nói
    if ('speechSynthesis' in window) {
        // Đợi giọng nói load xong
        window.speechSynthesis.onvoiceschanged = function() {
            const voices = window.speechSynthesis.getVoices();
            console.log('Giọng nói có sẵn:', voices.filter(v => v.lang.startsWith('vi')));
        };
    }
    
    // Tự động bắt đầu quay sau 1 giây
    setTimeout(() => {
        startAutoPlay();
    }, 1000);
};
