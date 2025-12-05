# Setup Guide - Hệ thống "Ăn mày laptop"

## Cài đặt Database

### 1. Khởi tạo Supabase Local

Nếu bạn muốn chạy local, cài đặt Supabase CLI và khởi chạy:

```bash
# Cài đặt Supabase CLI (nếu chưa có)
npm install -g supabase

# Khởi động Supabase local
cd connect-uplift
supabase start
```

### 2. Chạy Migrations

Migrations đã được tạo sẵn trong thư mục `supabase/migrations/`. Để áp dụng vào database:

**Cho local development:**
```bash
supabase db reset
```

**Cho production (Supabase Cloud):**
1. Đăng nhập vào Supabase Dashboard (https://app.supabase.com)
2. Chọn project của bạn
3. Vào SQL Editor
4. Copy nội dung file `supabase/migrations/20251206000000_create_applications_tables.sql`
5. Paste và chạy SQL

### 3. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục `connect-uplift`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Lấy thông tin này từ:
- **Local:** Sau khi chạy `supabase start`, CLI sẽ hiển thị URL và anon key
- **Production:** Vào Supabase Dashboard > Settings > API

## Cài đặt Dependencies

```bash
cd connect-uplift
npm install
```

## Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Kiểm tra các tính năng đã triển khai

### 1. Đăng ký Nhà hảo tâm
1. Đăng nhập vào hệ thống (tạo account qua trang /auth)
2. Vào trang "Đơn đăng ký" (/don-dang-ky)
3. Chọn tab "Nhà hảo tâm"
4. Click nút "Thêm mới"
5. Điền form đăng ký với các thông tin:
   - Thông tin liên hệ: Họ tên, năm sinh, SĐT, địa chỉ, Facebook
   - Khả năng hỗ trợ: Chọn loại hỗ trợ (Laptop/Xe máy/Linh kiện/Học phí)
   - Mức độ: Một lần hoặc Định kỳ
6. Submit form

### 2. Đăng ký Sinh viên
1. Vào trang "Đơn đăng ký" (/don-dang-ky)
2. Chọn tab "Sinh viên"
3. Click nút "Thêm mới"
4. Điền form đăng ký với các thông tin:
   - Thông tin liên hệ: Họ tên, năm sinh, SĐT, địa chỉ, Facebook
   - Thông tin sinh viên: Năm học (1-4), hoàn cảnh khó khăn
   - Nhu cầu: Chọn các loại hỗ trợ cần (Laptop/Xe máy/Học phí/Linh kiện)
5. Submit form

## Cấu trúc Database đã tạo

### Tables

1. **donor_applications** - Đơn đăng ký nhà hảo tâm
2. **student_applications** - Đơn đăng ký sinh viên
3. **donors** - Nhà hảo tâm đã được duyệt
4. **students** - Sinh viên đã được duyệt

### Enums

- **application_status**: pending, approved, rejected
- **support_type**: laptop, motorbike, components, tuition
- **support_frequency**: one_time, recurring
- **academic_year**: 1, 2, 3, 4

## Tính năng đã hoàn thành

✅ Database schema cho đơn đăng ký nhà hảo tâm và sinh viên
✅ Form đăng ký nhà hảo tâm với validation
✅ Form đăng ký sinh viên với validation
✅ Tích hợp forms vào trang Applications với Dialog
✅ Responsive UI
✅ Form validation với Zod
✅ Toast notifications khi submit thành công/thất bại

## Tính năng tiếp theo cần phát triển

- [ ] Hiển thị danh sách đơn đăng ký từ database (thay mock data)
- [ ] Chức năng xem chi tiết đơn đăng ký
- [ ] Chức năng duyệt/từ chối đơn đăng ký
- [ ] Chức năng chuyển đổi đơn đăng ký thành donor/student chính thức
- [ ] Trang quản lý Nhà hảo tâm
- [ ] Trang quản lý Sinh viên
- [ ] Trang quản lý Laptop
- [ ] Trang quản lý Xe máy
- [ ] Trang quản lý Linh kiện
- [ ] Trang báo cáo và thống kê

## Lưu ý

- Form validation đã được cài đặt đầy đủ theo requirements
- Tất cả đơn đăng ký mặc định có status là "pending"
- RLS (Row Level Security) đã được bật, hiện tại cho phép tất cả authenticated users
- Cần cấu hình admin role riêng trong production để hạn chế quyền truy cập
