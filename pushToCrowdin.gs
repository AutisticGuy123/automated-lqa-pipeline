function pushToCrowdin() {
  // === CÁC BIẾN CẤU HÌNH (Điền thông tin vào đây) ===
  const GOOGLE_DRIVE_FILE_ID = "1rpOuKgPRfJ6wieQ2eM6LJjMsffVzAkXW"; // ID của file en.json trên Google Drive
  const CROWDIN_PROJECT_ID = "885240";   // ID của dự án trên Crowdin
  const CROWDIN_FILE_ID = "6";      // ID của file cần cập nhật trên dự án Crowdin
  const CROWDIN_PAT = "4529cdce83f8ba9446e41d0b7571e11e64783c7afd7963dfd082da37df5e8bdf8991c43dd8eb2522"; // Personal Access Token của Crowdin

  // Header xác thực dùng chung
  const authHeaders = {
    "Authorization": "Bearer " + CROWDIN_PAT
  };

  try {
    // 1. Đọc nội dung file từ Google Drive
    const file = DriveApp.getFileById(GOOGLE_DRIVE_FILE_ID);
    const fileBlob = file.getBlob();
    const fileName = file.getName();

    // 2. Bước Storage: Upload file lên bộ nhớ tạm của Crowdin
    const storageUrl = "https://api.crowdin.com/api/v2/storages";
    
    // Yêu cầu thêm header 'Crowdin-API-FileName' để Crowdin nhận diện tên file
    const storageHeaders = Object.assign({
      "Crowdin-API-FileName": fileName
    }, authHeaders);

    const storageOptions = {
      "method": "post",
      "headers": storageHeaders,
      "payload": fileBlob, // Đẩy trực tiếp blob vào payload
      "muteHttpExceptions": true // Tránh việc GAS tự động ném ngoại lệ để tự xử lý lỗi
    };

    const storageResponse = UrlFetchApp.fetch(storageUrl, storageOptions);
    const storageStatusCode = storageResponse.getResponseCode();
    
    if (storageStatusCode >= 400) {
      throw new Error("Lỗi gọi API Storage: " + storageResponse.getContentText());
    }

    const storageResult = JSON.parse(storageResponse.getContentText());
    const storageId = storageResult.data.id;
    console.log("Upload Storage thành công. Storage ID: " + storageId);

    // 3. Bước Update: Cập nhật file vào dự án Crowdin
    const updateUrl = `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/files/${CROWDIN_FILE_ID}`;
    
    // Gộp header xác thực với Content-Type cho JSON request
    const updateHeaders = Object.assign({
      "Content-Type": "application/json"
    }, authHeaders);

    const updatePayload = {
      "storageId": storageId
    };

    const updateOptions = {
      "method": "put",
      "headers": updateHeaders,
      "payload": JSON.stringify(updatePayload),
      "muteHttpExceptions": true
    };

    const updateResponse = UrlFetchApp.fetch(updateUrl, updateOptions);
    const updateStatusCode = updateResponse.getResponseCode();

    if (updateStatusCode >= 400) {
      throw new Error("Lỗi gọi API Update File: " + updateResponse.getContentText());
    }

    console.log("Cập nhật file thành công! Phản hồi từ Crowdin: " + updateResponse.getContentText());

  } catch (error) {
    // 4. Bắt và log lỗi ra console
    console.error("Lỗi trong quá trình thực thi pushToCrowdin: " + error.message);
  }
}