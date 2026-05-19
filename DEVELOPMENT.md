# Hướng dẫn Phát triển & Quy chuẩn Code (Development Guidelines)

Tài liệu này định nghĩa cấu trúc thư mục, quy chuẩn đặt tên, tiêu chuẩn viết code và giải pháp đa ngôn ngữ (Localization) cho dự án NestJS AuthTodo. Mọi nhà phát triển (hoặc AI trợ lý) cần tuân thủ nghiêm ngặt để đảm bảo code sạch, đồng nhất và dễ bảo trì.

---

## 1. Cấu trúc Thư mục Chuẩn (Folder Structure)

Mỗi module mới trong `src` cần tuân thủ cấu trúc thư mục sau:

```text
src/
├── <module-name>/              # Tên module (vd: auth, users)
│   ├── dto/                    # Các Data Transfer Object để validation dữ liệu đầu vào
│   │   └── <name>.dto.ts
│   ├── schemas/                # Định nghĩa các Database Model (Mongoose)
│   │   └── <name>.schema.ts
│   ├── guards/                 # Route Guards (Phân quyền, xác thực)
│   ├── strategies/             # Passport Authentication Strategies
│   ├── <name>.controller.ts    # Lớp Controller định nghĩa các API routes
│   ├── <name>.service.ts       # Lớp Service chứa logic nghiệp vụ chính
│   └── <name>.module.ts        # File cấu hình module
├── language/                   # Các file dịch đa ngôn ngữ (Localization)
│   ├── en/
│   │   └── <domain>Message.json
│   └── vi/
│       └── <domain>Message.json
```

---

## 2. Quy tắc Đặt tên (Naming Conventions)

- **Tên File**: Luôn dùng định dạng `kebab-case` kèm hậu tố vai trò.
  - *Hợp lệ*: `auth.controller.ts`, `jwt.strategy.ts`, `auth.dto.ts`.
  - *Không hợp lệ*: `jwt.stratergy.ts` (sai chính tả), `AuthController.ts` (không viết kebab-case).
- **Tên Class**: Luôn dùng định dạng `PascalCase` kèm hậu tố vai trò tương ứng.
  - *Ví dụ*: `RegisterDto`, `JwtStrategy`, `UsersService`, `AuthController`.
- **Tên Biến và Hàm**: Dạng `camelCase`.
  - *Ví dụ*: `createUser()`, `findByEmail()`, `isPasswordValid`.
- **Tên Schema (Mongoose)**:
  - Class định nghĩa Schema: `PascalCase` (vd: `User`).
  - Hằng số khởi tạo Schema: `PascalCase` + Hậu tố `Schema` (vd: `UserSchema`).

---

## 3. Hệ thống Đa ngôn ngữ (Localization - i18n)

Dự án hỗ trợ đa ngôn ngữ bằng cách lưu trữ các chuỗi thông báo trong các file JSON thuộc thư mục `src/language/<lang>/<domain>Message.json`.

### 3.1. Cấu trúc file JSON dịch (`authMessage.json`)
Các file dịch được nhóm theo phân cấp để dễ quản lý:
```json
{
    "auth": {
        "emailNotValid": "Email not valid",
        "passwordMustBe": "Password must be at least 6 characters long",
        "nameNotEmpty": "Name not be empty",
        "passwordNotEmpty": "Password not be empty"
    }
}
```

### 3.2. Quy tắc sử dụng Key dịch trong DTO
- Thay vì truyền cứng chuỗi tiếng Anh hoặc tiếng Việt vào các decorator validation, ta truyền **dạng key phân cấp**: `domain.subKey` (vd: `auth.emailNotValid`).
- **Ví dụ chuẩn trong `auth.dto.ts`**:
```typescript
@IsEmail({}, { message: 'auth.emailNotValid' })
email: string;
```

### 3.3. Cách triển khai Bộ dịch (Translation Handler)
Để các key này (ví dụ `auth.emailNotValid`) được dịch tự động trước khi trả về client:
1. Tạo một Custom Validation Pipe hoặc Custom Exception Filter trong NestJS.
2. Đọc header `Accept-Language` từ Request của client (hoặc ngôn ngữ mặc định là `vi` hoặc `en`).
3. Đọc file JSON tương ứng (ví dụ: `src/language/en/authMessage.json` nếu là `en`).
4. Phân tích key lỗi (ví dụ: `auth.emailNotValid`) để tìm giá trị tương ứng trong JSON và phản hồi về cho client thông báo đã được dịch.

---

## 4. Quy chuẩn Database & Schema (Mongoose)

- **Timestamps**: Luôn kích hoạt `{ timestamps: true }` trong decorator `@Schema` để tự động lưu `createdAt` và `updatedAt`.
- **Bảo mật dữ liệu nhạy cảm**: Tuyệt đối không trả mật khẩu (`password`) về cho client. Trong service, luôn loại bỏ mật khẩu khi lấy thông tin user:
  ```typescript
  async findById(id: string): Promise<User | null> {
      return this.userModel.findById(id).select('-password').exec();
  }
  ```
- **Query Execution**: Luôn thêm `.exec()` ở cuối các câu truy vấn Mongoose để nhận được đúng định dạng Native Promise thay vì Mongoose Query helper.

---

## 5. Xử lý lỗi & Phản hồi (Error & Exception Handling)

- **HTTP Exceptions**: Luôn sử dụng các lớp Exception chuẩn có sẵn của NestJS từ `@nestjs/common` (ví dụ: `BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ForbiddenException`).
- **Thông báo Exception**: Nên sử dụng các key dịch nếu Exception đó phản hồi về client cho UI hiển thị, hoặc truyền chuỗi mô tả rõ ràng.
- **Tính năng xác thực**: Sử dụng `AuthGuard` kết hợp `PassportStrategy` chuẩn để bảo vệ tài nguyên.

---

## 6. Checklist Kiểm tra Code (Code Review Checklist)
Trước khi commit hoặc hoàn thành bất kỳ task nào, hãy tự kiểm tra:
- [ ] Tên file và tên class đã tuân thủ đúng định dạng `kebab-case` và `PascalCase` chưa?
- [ ] Không có lỗi chính tả trong tên file/class (ví dụ: viết đúng `Strategy`, không viết `Stratergy`).
- [ ] Các thông báo validation trong DTO đã chuyển thành key dạng `auth.<key>` chưa?
- [ ] Mật khẩu đã được loại bỏ khi truy vấn người dùng chưa?
- [ ] Các truy vấn database (findOne, findById, v.v.) có gọi `.exec()` không?
