/*
  DEBUG VERSION: Kiểm tra kết nối Discord
  File: smart_spy.js
*/

var request = $request;
var url = request.url;

// --- QUAN TRỌNG: THAY LINK WEBHOOK MỚI CỦA BẠN VÀO ĐÂY ---
var webhookUrl = "https://discord.com/api/webhooks/THAY_LINK_WEBHOOK_MOI_O_DAY";

var payload = {
    "username": "Test Bot",
    "content": "✅ **KẾT NỐI THÀNH CÔNG!**\nShadowrocket đã bắt được request từ:\n`" + url + "`"
};

$httpClient.post({
    url: webhookUrl,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
}, function(error, response, data) {
    if (error) {
        console.log("Lỗi gửi Discord: " + error);
    } else {
        console.log("Đã gửi log thành công!");
    }
    $done({});
});
