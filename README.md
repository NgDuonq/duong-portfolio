# Dương — portfolio v2

Portfolio cá nhân sử dụng HTML, CSS và JavaScript thuần.

Mở `index.html` bằng trình duyệt. Giữ `index.html`, `style.css` và `script.js` cùng thư mục. Không cần cài thư viện hay build.

## Có gì mới
- Trang giới thiệu, dự án, công cụ và liên hệ; menu dẫn tới đúng từng phần.
- Bố cục cho máy tính và điện thoại, hỗ trợ bàn phím và giảm chuyển động.
- Giao diện sáng/tối, ưu tiên lựa chọn đã lưu và dùng giao diện hệ thống khi chưa chọn.
- Công cụ đổi số nguyên giữa hệ 2, 8, 10, 16; dùng BigInt để giữ độ chính xác.
- Nhận số âm, prefix 0b/0o/0x theo đúng hệ đầu vào; kiểm tra dữ liệu và sao chép kết quả.
- Không gửi dữ liệu ra máy chủ; chỉ lưu lựa chọn giao diện trên trình duyệt.

## Cá nhân hóa
Sửa phần `#about` trong index.html để cập nhật giới thiệu. Sửa các thẻ `.project-card` để thêm dự án. Phần `#contact` đang ghi rõ chưa có liên hệ: thay nội dung này bằng email/GitHub thật của bạn khi sẵn sàng công khai. Thẻ dự án thứ ba là ý tưởng chưa bắt đầu.

Khi mở trực tiếp bằng file://, trình duyệt có thể hạn chế clipboard hoặc localStorage. Nút sao chép sẽ chọn nội dung để bạn nhấn Ctrl+C/⌘C nếu clipboard không khả dụng.

## Kiểm tra
JavaScript đã được kiểm tra cú pháp và các ca chuyển đổi số thường, số âm, số lớn và dữ liệu không hợp lệ. Chưa xác minh hình ảnh bằng trình duyệt trong môi trường tạo file do trình duyệt kiểm thử không khả dụng.

## v2 — Công cụ học hệ cơ số
- Chế độ số nguyên tự do, không dấu hoặc bù hai 8/16/32 bit.
- Phân biệt nhập giá trị số và nhập mẫu bit (mẫu bit chỉ dùng hệ 2/8/16).
- BIN/OCT/HEX ở chế độ cố định độ rộng hiển thị mẫu bit có đệm 0; DEC hiển thị giá trị theo chế độ.
- Báo vượt phạm vi, không tự cắt bit; ví dụ FF trong bù hai 8 bit là −1 khi chọn đầu vào mẫu bit.
- Nhóm 4 bit đối chiếu hex, giải thích trọng số, phép chia liên tiếp và bù hai. Phần minh họa được rút gọn với số rất dài, kết quả vẫn đầy đủ.
- Kiểm tra 512 trường hợp diễn giải mẫu bit 8 bit, mốc biên 8/16/32 bit, số lớn, nhập sai, đệm 0 và nội dung giải thích. Chưa kiểm thử giao diện trực tiếp bằng trình duyệt.

## Làm việc với GitHub

```bash
git clone https://github.com/NgDuonq/duong-portfolio.git
cd duong-portfolio
```

Có thể dùng VS Code Live Server, hoặc chạy máy chủ tĩnh nếu có Python:

```bash
python3 -m http.server 8000
```

Sau đó mở http://localhost:8000.

- `index.html`: nội dung và bố cục.
- `style.css`: giao diện, sáng/tối và bố cục điện thoại.
- `script.js`: đổi hệ cơ số, bù hai và tương tác.

Trước mỗi lần sửa: `git pull --ff-only`. Sau khi sửa và kiểm tra:

```bash
git add index.html style.css script.js README.md
git commit -m "Describe your change"
git push
```

Không cần npm, API key hoặc bước build. Email và liên kết liên hệ chưa được cấu hình.
