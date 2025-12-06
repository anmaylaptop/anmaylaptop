# Yêu cầu hệ thống quản lý "Ăn mày laptop"

## 1. Tổng quan dự án

### 1.1. Bối cảnh
Dự án "Ăn mày laptop" là một hoạt động từ thiện nhằm:
- Thu gom laptop cũ, hỏng để sửa chữa và tặng cho sinh viên có hoàn cảnh khó khăn
- Mở rộng hỗ trợ xe máy cho sinh viên cần sử dụng làm công cụ mưu sinh
- Kết nối nhà hảo tâm với sinh viên cần hỗ trợ (laptop, xe máy, linh kiện, học phí)
- Đảm bảo tính minh bạch thông qua báo cáo công khai trên Facebook

### 1.2. Nguyên tắc hoạt động
- Không nhận tiền trực tiếp, chỉ kết nối nhà hảo tâm với sinh viên
- Linh kiện được hỗ trợ thông qua đặt hàng trực tiếp theo mẫu mã cụ thể
- Tất cả hoạt động được công khai và báo cáo trên Facebook

---

## 2. Đối tượng sử dụng hệ thống

### 2.1. Quản trị viên
- Người điều hành dự án "Ăn mày laptop"
- Quản lý toàn bộ thông tin trong hệ thống
- Xử lý đơn đăng ký từ nhà hảo tâm và sinh viên
- Tạo báo cáo và công khai thông tin

---

## 3. Yêu cầu chức năng

### 3.1. Quản lý đơn đăng ký

#### 3.1.1. Đơn đăng ký nhà hảo tâm
**Mục đích:** Thu thập thông tin từ các nhà hảo tâm muốn hỗ trợ dự án

**Thông tin cần thu thập:**
- Thông tin liên hệ cơ bản (xem mục 4.1)
- Khả năng giúp đỡ:
  - Loại hỗ trợ: Laptop, xe máy, linh kiện, học phí
  - Mức độ hỗ trợ: Một lần / Định kỳ (có thời hạn)
  - Chi tiết khả năng hỗ trợ (nếu có)

**Chức năng:**
- Tạo mới đơn đăng ký
- Xem danh sách đơn đăng ký
- Xử lý đơn (duyệt/từ chối)
- Chuyển đổi đơn đăng ký thành thông tin nhà hảo tâm chính thức

#### 3.1.2. Đơn đăng ký sinh viên
**Mục đích:** Thu thập thông tin từ sinh viên cần hỗ trợ

**Thông tin cần thu thập:**
- Thông tin liên hệ cơ bản (xem mục 4.1)
- Thông tin sinh viên:
  - Năm học (1, 2, 3, 4)
- Hoàn cảnh khó khăn (mô tả)
- Nhu cầu cần hỗ trợ:
  - Laptop
  - Xe máy
  - Học phí
  - Linh kiện (nếu có laptop cần sửa)

**Chức năng:**
- Tạo mới đơn đăng ký
- Xem danh sách đơn đăng ký
- Xử lý đơn (duyệt/từ chối)
- Xác minh hoàn cảnh khó khăn
- Chuyển đổi đơn đăng ký thành thông tin sinh viên chính thức

---

### 3.2. Quản lý thông tin nhà hảo tâm

**Mục đích:** Quản lý thông tin các nhà hảo tâm đã được duyệt

**Thông tin quản lý:**
- Thông tin liên hệ cơ bản (xem mục 4.1)
- Khả năng giúp đỡ:
  - Loại hỗ trợ: Laptop, xe máy, linh kiện, học phí
  - Mức độ hỗ trợ: Một lần / Định kỳ (có thời hạn)
  - Chi tiết khả năng hỗ trợ
- Lịch sử hỗ trợ:
  - Đã hỗ trợ cho sinh viên nào
  - Thời gian hỗ trợ
  - Loại hỗ trợ đã thực hiện

**Chức năng:**
- Xem danh sách nhà hảo tâm
- Thêm/sửa/xóa thông tin nhà hảo tâm
- Tìm kiếm, lọc nhà hảo tâm theo:
  - Loại hỗ trợ có thể cung cấp
  - Mức độ hỗ trợ
- Xem lịch sử hỗ trợ của từng nhà hảo tâm
- Kết nối nhà hảo tâm với sinh viên phù hợp

---

### 3.3. Quản lý thông tin sinh viên

**Mục đích:** Quản lý thông tin các sinh viên đã được xác minh và duyệt

**Thông tin quản lý:**
- Thông tin liên hệ cơ bản (xem mục 4.1)
- Thông tin sinh viên:
  - Năm học (1, 2, 3, 4)
- Hoàn cảnh khó khăn (mô tả)
- Nhu cầu hiện tại:
  - Laptop (đã nhận / chưa nhận)
  - Xe máy (đã nhận / chưa nhận)
  - Học phí (đang được hỗ trợ / chưa được hỗ trợ)
  - Linh kiện (nếu có laptop cần sửa)
- Lịch sử nhận hỗ trợ:
  - Đã nhận từ nhà hảo tâm nào
  - Thời gian nhận
  - Loại hỗ trợ đã nhận

**Chức năng:**
- Xem danh sách sinh viên
- Thêm/sửa/xóa thông tin sinh viên
- Tìm kiếm, lọc sinh viên theo:
  - Năm học
  - Nhu cầu cần hỗ trợ
  - Trạng thái (đã nhận / chưa nhận hỗ trợ)
- Xem lịch sử nhận hỗ trợ của từng sinh viên
- Cập nhật trạng thái nhận hỗ trợ

---

### 3.4. Quản lý danh mục laptop

**Mục đích:** Quản lý thông tin các laptop đã nhận và quá trình sửa chữa, tặng

**Thông tin quản lý:**
- Thông tin cơ bản:
  - Mã laptop (tự động hoặc thủ công)
  - Mẫu mã / Model
  - Hãng sản xuất
- Thông tin người cho tặng:
  - Tên người cho tặng
  - Thông tin liên hệ (nếu có)
- Tình trạng:
  - Đã nhận
  - Đang sửa chữa
  - Đã sửa xong, sẵn sàng tặng
  - Đã tặng cho sinh viên
  - Không thể sửa được
- Vấn đề gặp phải:
  - Hư hỏng phần cứng (mô tả)
  - Lỗi pin
  - Lỗi màn hình
  - Lỗi bàn phím
  - Các lỗi khác (mô tả)
- Thông tin người nhận (nếu đã tặng):
  - Tên sinh viên nhận
  - Ngày tặng
- Ghi chú (nếu có)

**Chức năng:**
- Thêm laptop mới vào danh mục
- Cập nhật thông tin laptop
- Cập nhật trạng thái laptop
- Tìm kiếm, lọc laptop theo:
  - Trạng thái
  - Mẫu mã
  - Người cho tặng
  - Sinh viên nhận
- Xem lịch sử sửa chữa và tặng

---

### 3.5. Quản lý danh mục linh kiện cần hỗ trợ

**Mục đích:** Quản lý các linh kiện cần được nhà hảo tâm đặt hàng và gửi đến

**Thông tin quản lý:**
- Thông tin linh kiện:
  - Loại linh kiện (Pin, RAM, Ổ cứng, Màn hình, Bàn phím, ...)
  - Mẫu mã cụ thể
  - Số lượng cần
  - Số lượng đã nhận
- Thông tin đặt hàng:
  - Link đặt hàng (URL)
  - Giá tiền
  - Nơi bán (tên shop/website)
- Laptop cần linh kiện:
  - Mã laptop hoặc thông tin laptop
  - Mô tả vấn đề cần linh kiện
- Trạng thái:
  - Đang cần hỗ trợ
  - Đã có nhà hảo tâm đăng ký hỗ trợ
  - Đã nhận linh kiện
  - Đã lắp đặt
- Thông tin nhà hảo tâm hỗ trợ (nếu có):
  - Tên nhà hảo tâm
  - Ngày đăng ký hỗ trợ
  - Ngày nhận linh kiện

**Chức năng:**
- Thêm linh kiện cần hỗ trợ
- Cập nhật thông tin linh kiện
- Cập nhật trạng thái linh kiện
- Liên kết linh kiện với laptop
- Tìm kiếm, lọc linh kiện theo:
  - Loại linh kiện
  - Trạng thái
  - Laptop cần linh kiện

---

### 3.6. Quản lý danh mục xe máy

**Mục đích:** Quản lý thông tin các xe máy đã nhận và quá trình sửa chữa, tặng

**Thông tin quản lý:**
- Thông tin cơ bản:
  - Mã xe máy (tự động hoặc thủ công)
  - Loại xe (Honda, Yamaha, ...)
  - Biển số (nếu có)
  - Năm sản xuất (nếu biết)
- Thông tin người cho tặng:
  - Tên người cho tặng
  - Thông tin liên hệ (nếu có)
- Tình trạng:
  - Đã nhận
  - Đang kiểm tra
  - Sử dụng tốt, sẵn sàng tặng
  - Đã bảo dưỡng, sẵn sàng tặng
  - Hư hỏng, cần sửa chữa
  - Đang sửa chữa
  - Đã sửa xong, sẵn sàng tặng
  - Đã tặng cho sinh viên
  - Không thể sửa được
- Mô tả tình trạng chi tiết (nếu có)
- Thông tin người nhận (nếu đã tặng):
  - Tên sinh viên nhận
  - Ngày tặng
- Ghi chú (nếu có)

**Chức năng:**
- Thêm xe máy mới vào danh mục
- Cập nhật thông tin xe máy
- Cập nhật trạng thái xe máy
- Tìm kiếm, lọc xe máy theo:
  - Trạng thái
  - Loại xe
  - Người cho tặng
  - Sinh viên nhận
- Xem lịch sử sửa chữa và tặng

---

### 3.7. Báo cáo và thống kê

**Mục đích:** Cung cấp cái nhìn tổng quan về hoạt động dự án để báo cáo công khai

#### 3.7.1. Báo cáo tổng quan
**Thông tin hiển thị:**
- Tổng số nhà hảo tâm (theo trạng thái: đang hoạt động, tạm dừng)
- Tổng số sinh viên (theo trạng thái: đã nhận hỗ trợ, chưa nhận hỗ trợ)
- Tổng số laptop (theo trạng thái: đã nhận, đang sửa, sẵn sàng tặng, đã tặng)
- Tổng số xe máy (theo trạng thái: đã nhận, đang sửa, sẵn sàng tặng, đã tặng)
- Tổng số linh kiện (theo trạng thái: đang cần, đã có người hỗ trợ, đã nhận)

#### 3.7.2. Báo cáo nhu cầu và khả năng
**Thông tin hiển thị:**
- Số sinh viên cần giúp đỡ (theo loại: laptop, xe máy, học phí)
- Số nhà hảo tâm sẵn sàng giúp đỡ (theo loại hỗ trợ)
- Danh sách sinh viên chưa được hỗ trợ (theo nhu cầu)
- Danh sách nhà hảo tâm chưa được kết nối

#### 3.7.3. Báo cáo hoạt động theo thời gian
**Thông tin hiển thị:**
- Hoạt động tuần:
  - Số đơn đăng ký mới (nhà hảo tâm, sinh viên)
  - Số laptop/xe máy nhận được
  - Số laptop/xe máy đã tặng
  - Số linh kiện nhận được
  - Số kết nối nhà hảo tâm - sinh viên
- Hoạt động tháng:
  - Tương tự hoạt động tuần nhưng tổng hợp theo tháng
  - So sánh với tháng trước (nếu có)

#### 3.7.4. Chức năng báo cáo
- Xem báo cáo tổng quan
- Xem báo cáo theo tuần/tháng
- Xuất báo cáo (để đăng lên Facebook)
- Lọc báo cáo theo khoảng thời gian

---

## 4. Yêu cầu dữ liệu

### 4.1. Thông tin liên hệ cơ bản
Áp dụng cho: Nhà hảo tâm, Sinh viên, Người cho tặng

**Các trường dữ liệu:**
- Họ và tên
- Năm sinh
- Số điện thoại
- Địa chỉ liên lạc
- Link Facebook

### 4.2. Thông tin bổ sung cho sinh viên
- Năm học: 1, 2, 3, hoặc 4

---

## 5. Yêu cầu phi chức năng

### 5.1. Bảo mật
- Bảo vệ thông tin cá nhân của nhà hảo tâm và sinh viên
- Chỉ quản trị viên mới có quyền truy cập đầy đủ thông tin
- Có thể ẩn một số thông tin nhạy cảm khi xuất báo cáo công khai

### 5.2. Dễ sử dụng
- Giao diện đơn giản, dễ hiểu
- Thao tác nhanh chóng, không phức tạp
- Hỗ trợ tìm kiếm và lọc dữ liệu hiệu quả

### 5.3. Tính minh bạch
- Dễ dàng tạo báo cáo để công khai
- Theo dõi được lịch sử hoạt động
- Quản lý được trạng thái của từng đối tượng

---

## 6. Quy trình nghiệp vụ

### 6.1. Quy trình xử lý đơn đăng ký nhà hảo tâm
1. Nhận đơn đăng ký
2. Xem xét thông tin
3. Duyệt đơn → Chuyển thành thông tin nhà hảo tâm chính thức
4. Hoặc từ chối đơn (có ghi chú lý do nếu cần)

### 6.2. Quy trình xử lý đơn đăng ký sinh viên
1. Nhận đơn đăng ký
2. Xem xét thông tin và hoàn cảnh
3. Xác minh hoàn cảnh khó khăn
4. Duyệt đơn → Chuyển thành thông tin sinh viên chính thức
5. Hoặc từ chối đơn (có ghi chú lý do nếu cần)

### 6.3. Quy trình xử lý laptop
1. Nhận laptop từ người cho tặng
2. Ghi nhận thông tin laptop vào hệ thống
3. Kiểm tra và xác định vấn đề
4. Cập nhật trạng thái: Đang sửa chữa
5. Nếu cần linh kiện: Tạo yêu cầu linh kiện
6. Sửa chữa laptop
7. Cập nhật trạng thái: Sẵn sàng tặng
8. Kết nối với sinh viên phù hợp
9. Tặng laptop cho sinh viên
10. Cập nhật trạng thái: Đã tặng

### 6.4. Quy trình xử lý xe máy
1. Nhận xe máy từ người cho tặng
2. Ghi nhận thông tin xe máy vào hệ thống
3. Kiểm tra tình trạng
4. Nếu sử dụng tốt: Cập nhật trạng thái: Sẵn sàng tặng
5. Nếu cần bảo dưỡng: Bảo dưỡng → Sẵn sàng tặng
6. Nếu cần sửa chữa: Cập nhật trạng thái: Đang sửa chữa → Sửa xong → Sẵn sàng tặng
7. Kết nối với sinh viên phù hợp
8. Tặng xe máy cho sinh viên
9. Cập nhật trạng thái: Đã tặng

### 6.5. Quy trình xử lý linh kiện
1. Xác định laptop cần linh kiện
2. Tạo yêu cầu linh kiện với thông tin đặt hàng cụ thể
3. Công khai yêu cầu (trên Facebook)
4. Nhà hảo tâm đăng ký hỗ trợ
5. Cập nhật trạng thái: Đã có người hỗ trợ
6. Nhà hảo tâm đặt hàng và gửi đến
7. Nhận linh kiện
8. Cập nhật trạng thái: Đã nhận
9. Lắp đặt vào laptop
10. Cập nhật trạng thái: Đã lắp đặt

### 6.6. Quy trình kết nối nhà hảo tâm - sinh viên (học phí)
1. Xác định sinh viên cần hỗ trợ học phí
2. Tìm nhà hảo tâm phù hợp (có khả năng hỗ trợ học phí)
3. Kết nối hai bên (không qua hệ thống, chỉ ghi nhận)
4. Ghi nhận lịch sử hỗ trợ
5. Cập nhật trạng thái sinh viên và nhà hảo tâm

---

## 7. Lưu ý

- Hệ thống chỉ quản lý thông tin, không xử lý giao dịch tiền mặt
- Tất cả giao dịch tiền mặt được thực hiện trực tiếp giữa nhà hảo tâm và sinh viên
- Hệ thống hỗ trợ kết nối và theo dõi, đảm bảo tính minh bạch
- Báo cáo được sử dụng để công khai trên Facebook
