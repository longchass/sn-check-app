Check Serial Number Cisco

# Problem
Để check được product information dựa trên Serial Number, hiện nay IPS phải đăng nhập vào tài khoản partner được Cisco cung cấp và vào trang web https://ccrc.cisco.com/ServiceContract/contract/ Điều này tốn rất nhiều thời gian cộng với việc trang web service constract vào rất lâu. Hơn thế nữa, IPS muốn lưu lại toàn bị dữ liệu của product khi họ search serial number vào database
# Solution
IPS phát hiện ra được URL hoặc API endpoint (https://ccrc.cisco.com/ServiceContract/ccrcesservices/contracts/lines) mà cisco dùng để lấy thông tin product trên trang Service Contract (trang web dùng AngularJS). Để dùng được endpoint này thì Headers cần kèm Authorization Token (được generate khi đăng nhập và vào trang service contract).
Việc dùng automation tool như Puppeteer hoặc Selenium giúp IPS có để tự động đăng nhập vào Cisco với tài khoản partner của IPS, sau khi đăng nhập thì lưu lại toàn bộ cookie để giữ lấy authorization/token.

# Folder Structure
Project được chưa thành back-end (Express) và front-end (React)
tất cả các file ở root thuộc về Back-end. Folder có tên là client thuộc về Front-end

## Back-end
- migrations: chứa các migration cho database được generate bởi sequelize-cli
- config: chứa các configuration để kết nối tới database
- models: chứa các schema để nodejs - express giao tiếp với database table (ORM)
- middleware: chứa các middle cho các route
- public: folder để express render template (không quan trọng vì front-end dùng react)
- routes: chứa các route api của project
- util: chứa các file cùng các function quan trọng để dùng cho mục đích chính của project này (check serial number, sẽ được giải thích thêm ở dưới)

## Util/Pupperteer
Đây là file chứa các function quan trọng với mục đích duy nhất là lấy Authorization token trong trang web service contract của 

# Risk and Maintain
## HTML thay đổi
Việc dùng puppeteer để automation cần 