# SCADA Wastewater Treatment Dashboard

Hệ thống giám sát xử lý nước thải giao diện SCADA công nghiệp.

## Tính năng nổi bật
- **Giao diện chuẩn công nghiệp**: Dark Theme SCADA giảm mỏi mắt, tối ưu cho vận hành liên tục.
- **Đa ngôn ngữ**: Hỗ trợ Tiếng Việt và Tiếng Nhật (chuyển đổi tức thì).
- **Dynamic Grid**: Tự động chia lưới màn hình thông minh, hiển thị tất cả camera/HMI trên một màn hình duy nhất không cần cuộn.
- **PWA (Progressive Web App)**: Có thể cài đặt trực tiếp như một ứng dụng độc lập trên máy tính (Windows/macOS) và điện thoại.

## Cài đặt qua trình duyệt (PWA)
1. Mở ứng dụng trên trình duyệt Chrome, Edge hoặc Safari.
2. Nhìn lên thanh địa chỉ (Address bar), nhấn vào biểu tượng **Install App** (Cài đặt ứng dụng).
3. Ứng dụng sẽ được cài đặt vào máy và chạy trong một cửa sổ độc lập, không có thanh công cụ của trình duyệt, mang lại trải nghiệm như phần mềm Native.

## Triển khai lên Vercel
Dự án này đã được cấu hình sẵn file `vercel.json` để tương thích hoàn hảo với Vercel.
1. Đẩy (Push) mã nguồn này lên một repository trên **GitHub**.
2. Đăng nhập vào [Vercel](https://vercel.com).
3. Chọn **Add New Project** và import repository từ GitHub.
4. Vercel sẽ tự động nhận diện framework là **Vite** và tiến hành build.
5. Nhấn **Deploy** và chờ trong giây lát để nhận link public.

## Phát triển cục bộ (Local Development)
Cài đặt dependencies:
```bash
npm install
```

Chạy server dev:
```bash
npm run dev
```

Build production:
```bash
npm run build
```
