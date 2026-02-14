// Tạo pool số cho mỗi cột (cột 1: 1-9, cột 2: 10-19, ... cột 9: 80-90)
function createNumberPools() {
    const pools = [];
    for (let col = 0; col < 9; col++) {
        const pool = [];
        const start = col === 0 ? 1 : col * 10;
        const end = col === 8 ? 90 : (col + 1) * 10 - 1;
        
        for (let num = start; num <= end; num++) {
            pool.push(num);
        }
        pools.push(pool);
    }
    return pools;
}

// Shuffle mảng
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Đánh dấu ô khi click
function toggleCell(cell) {
    if (cell.classList.contains('empty')) return;
    
    cell.classList.toggle('marked');
    checkWin(cell);
}

// Kiểm tra thắng
function checkWin(cell) {
    const row = cell.parentElement;
    const cells = row.querySelectorAll('td:not(.empty)');
    const markedCells = row.querySelectorAll('td.marked');
    
    // Nếu đủ 5 số được đánh dấu (tất cả số trong hàng)
    if (markedCells.length === cells.length && cells.length === 5) {
        row.classList.add('win');
        
        // Hiệu ứng thắng
        setTimeout(() => {
            showWinMessage();
        }, 300);
    } else {
        row.classList.remove('win');
    }
}

// Hiển thị thông báo thắng
function showWinMessage() {
    const message = document.createElement('div');
    message.className = 'win-message';
    message.innerHTML = '🎉 KINH! THẮNG RỒI! 🎉';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Tạo bảng loto theo quy tắc chuẩn
function createTable(tableId, rows, numbersPerRow, numberPools) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        const positions = [];
        
        // Chọn 5 cột ngẫu nhiên trong 9 cột
        while (positions.length < numbersPerRow) {
            const pos = Math.floor(Math.random() * 9);
            if (!positions.includes(pos)) {
                positions.push(pos);
            }
        }
        positions.sort((a, b) => a - b);
        
        // Tạo các ô
        for (let j = 0; j < 9; j++) {
            const cell = row.insertCell();
            
            if (positions.includes(j)) {
                // Lấy số ngẫu nhiên từ pool của cột này
                const pool = numberPools[j];
                if (pool.length > 0) {
                    const randomIndex = Math.floor(Math.random() * pool.length);
                    const number = pool.splice(randomIndex, 1)[0];
                    cell.textContent = number;
                    cell.onclick = function() { toggleCell(this); };
                    cell.style.cursor = 'pointer';
                } else {
                    cell.classList.add('empty');
                }
            } else {
                cell.classList.add('empty');
            }
        }
    }
}

// Tạo vé mới
function generateCard() {
    // Chọn màu ngẫu nhiên cho vé
    const colors = ['color-red', 'color-green', 'color-yellow', 'color-purple', 'color-blue', 'color-pink', 'color-orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Xóa tất cả class màu cũ
    const card = document.getElementById('lotoCard');
    colors.forEach(color => card.classList.remove(color));
    
    // Thêm màu mới
    card.classList.add(randomColor);
    
    // Tạo pool số cho toàn bộ vé (4 bảng dùng chung pool để không trùng số)
    const numberPools = createNumberPools();
    
    // Tạo 4 bảng, mỗi bảng 3 hàng, mỗi hàng 5 số
    createTable('table1', 3, 5, numberPools);
    createTable('table2', 3, 5, numberPools);
    createTable('table3', 3, 5, numberPools);
    createTable('table4', 3, 5, numberPools);
}

// Tạo vé mặc định khi load trang
window.onload = function() {
    generateCard();
};
