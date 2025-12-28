/* DEBUG SCRIPT: KIỂM TRA PHẢN HỒI TỪ DISCORD 
   File: smart_spy.js
*/

var request = $request;
var url = request.url;

// --- DÁN LINK WEBHOOK MỚI CỦA BẠN VÀO DƯỚI ---
var webhookUrl = "https://discordapp.com/api/webhooks/1454906156777472165/tLAGpqP0YKRK0HjgzhHat-CTb3s6OMiFrPqzse_KZ8NfD16FsgXiNmKbqxyqyaKPX1ST";

var payload = {
    "content": "🚨 **TEST KẾT NỐI:** Shadowrocket đã bắt được request!\nTarget: `" + url + "`"
};

$httpClient.post({
    url: webhookUrl,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
}, function(error, response, data) {
    
    // LOG CHI TIẾT ĐỂ BẮT LỖI
    if (error) {
        console.log("❌ LỖI MẠNG: " + error);
    } else {
        // Kiểm tra xem Discord có chấp nhận không (Status phải là 204 hoặc 200)
        if (response.status == 204 || response.status == 200) {
            console.log("✅ GỬI THÀNH CÔNG! (Kiểm tra Discord ngay)");
        } else {
            console.log("⚠️ DISCORD TỪ CHỐI! Mã lỗi: " + response.status);
            console.log("Phản hồi từ Discord: " + data); // In ra lý do tại sao lỗi
        }
    }
    $done({});
});
