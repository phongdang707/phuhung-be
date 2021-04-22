const _ = require("lodash");

//isEmpty check xem object or array có phần tử nào hay ko ?
const obj = {};
console.log("Check binh thuong", Object.keys(obj).length === 0);
//_.isEmpty
console.log("check empty with lodash", _.isEmpty(obj));
//_.get
let obj2 = {};
//==== obj2 = result sau khi gan gia tri vao obj2
//can lay obj2.content.id
//truoc tien phai kiểm tra trong result trả về có content hay ko, content.attributes có hay ko, content.attributes.id có hay ko.
const id = obj2.content && obj2.content.attributes && obj2.content.attributes.id
console.log(id)
// Khi dùng lodash
// lodash sẽ kiểm tra result có chưa content.attributes.id hay ko
console.log("lấy ID vói lodash",_.get(obj2,"content.attributes.id","content.attributes.id ko tồn tại"))
//if (_.get(obj2,"content.attributes.id")) {}

// .set
_.set(obj2,"content.attributes.id","2")
