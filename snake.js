const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// Mendeteksi keyboard ditekan
document.addEventListener("keydown", direction);

// Import gambar
const ground = new Image();
ground.src = "ground_snake.png";

const imgFood = new Image();
imgFood.src = "food.png";

// Import audio
const nabrak = new Audio();
nabrak.src = "nabrak.mp3";

const atas = new Audio();
atas.src = "pindah.mp3";

const bawah = new Audio();
bawah.src = "pindah.mp3";

const kanan = new Audio();
kanan.src = "pindah.mp3";

const kiri = new Audio();
kiri.src = "pindah.mp3";

const makan = new Audio();
makan.src = "makan.mp3";

// Ukuran kotak disesuaikan dengan ukuran grid pada gambar
let box = 33; // Ukuran kotak 33x33 piksel

// Ukuran area permainan
const maxGrid = 14; // Ukuran grid pada canvas (dalam kotak)

// Posisi awal ular
let snake = [];
snake[0] = {
    x: 9 * box, // Pastikan muncul di grid yang tepat
    y: 10 * box
};

// Posisi makanan (diacak agar muncul di dalam grid)
let food = spawnFood();

// Skor
let score = 0;

// Arah
let d;

// Munculin high score
let nilaiTertinggi = localStorage.getItem("highscore") || 0; // Default ke 0 jika tidak ada

// Fungsi untuk menggambar komponen permainan
function draw() {
    // Gambar latar belakang
    ctx.drawImage(ground, 0, 0);

    // Gambar ular
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white"; // Kepala ular berwarna hijau
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        // Border di sekitar setiap segmen ular
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Gambar makanan pada posisinya
    ctx.drawImage(imgFood, food.x, food.y);

    // Gambar skor
    ctx.fillStyle = "white";
    ctx.font = "30px Helvetica";
    ctx.fillText(score, 2 * box, 1.6 * box); // Menampilkan skor saat ini
    ctx.fillText(nilaiTertinggi, 4.8 * box, 1.6 * box); // Menampilkan high score

    // Posisi kepala yang lama
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Mengatur arah gerakan ular
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Cek apakah ular memakan makanan
    if (snakeX === food.x && snakeY === food.y) {
        score++; // Tambah skor
        makan.play(); // Putar suara makan
        food = spawnFood(); // Spawn makanan di lokasi baru

        // Perbarui nilai tertinggi jika skor baru lebih tinggi
        if (score > nilaiTertinggi) {
            nilaiTertinggi = score;
            localStorage.setItem("highscore", nilaiTertinggi);
        }
    } else {
        // Menghapus array paling belakang jika tidak memakan makanan
        snake.pop();
    }

    // Cek apakah ular menabrak dinding atau tubuhnya
    if (snakeX < 0 || snakeX >= (maxGrid + 1) * box || snakeY < 0 || snakeY >= (maxGrid + 1) * box || collision(snakeX, snakeY)) {
        clearInterval(game); // Hentikan permainan
        nabrak.play(); // Putar suara nabrak
        alert("Game Over! Score: " + score); // Tampilkan pesan Game Over
        return; // Keluar dari fungsi draw
    }

    // Posisi kepala baru
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Menambahkan nilai baru ke snake array
    snake.unshift(newHead);
}

// Fungsi untuk memeriksa apakah ular menabrak tubuhnya sendiri
function collision(headX, headY) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk menentukan arah
function direction(event) {
    if (event.key === "ArrowLeft" && d !== "RIGHT") {
        kiri.play();
        d = "LEFT";
    } else if (event.key === "ArrowUp" && d !== "DOWN") {
        atas.play();
        d = "UP";
    } else if (event.key === "ArrowRight" && d !== "LEFT") {
        kanan.play();
        d = "RIGHT";
    } else if (event.key === "ArrowDown" && d !== "UP") {
        bawah.play();
        d = "DOWN";
    }
}

// Fungsi untuk spawn makanan di lokasi acak di dalam grid yang valid
function spawnFood() {
    let foodX = Math.floor(Math.random() * (maxGrid + 1)) * box;
    let foodY = Math.floor(Math.random() * (maxGrid + 1)) * box;
    return { x: foodX, y: foodY };
}

// Refresh game screen every 100 milliseconds
let game = setInterval(draw, 100);
