## CSS

**_ Css ở trong component thì sẽ được ánh xạ global ở bất cứ component nào có nghĩa ta có thể không cần phải chia tách file _**

Để giải quyết vấn đề này thì ở thẻ style trong component thì ta thêm thuộc tính scope thì css chỉ ảnh hưởng trong thẻ template của component đó thôi

Muốn import các file css ở thư mục asset thì ta chỉ cần vào main.js để import những file đó vào

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

