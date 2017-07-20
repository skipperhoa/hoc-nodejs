var express =  require('express');
var mysql = require('mysql');//goi mysql 
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');// cài đặt module này dùng lấy dữ liệu từ form bên html của chúng ta
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'));

//tao kết nối mysql
var connection = mysql.createConnection({
	host:'localhost',
	user:'skipperhoa',
	password:'0975595084',
	database:'basic_nodejs'
});
connection.connect();//gọi kết nói đến database trong xampp

app.get('/',function(req,res){
	//lấy danh sách sinh viên ra và trả về cho view hiển thị
	connection.query('select * from sinhvien', function (error, results, fields) {
	  if (error) throw error;
	  res.render('index',{results});//tại file index.ejs
	}); 
});

//themsinhvien
app.get('/themsv',function(req,res){
	res.render('add_sv');//fiel add_sv.ejs
});
//
app.post('/add/themsv',urlencodedParser,function(req,res){
	var masv = req.body.masv;
	var tensv = req.body.hoten;
	var gioitinh = req.body.gioitinh;
	//console.log("masv"+masv+"/tensv:"+tensv+"/gioitinh:"+gioitinh);
	//cau lệnh thêm sinh vien
	var sql="insert into sinhvien(masv,tensv,gioitinh) values('"+masv+"','"+tensv+"',"+gioitinh+")";
	connection.query(sql,function(error){
		if (error) {
            console.log(error.message);
        } else {
      
            console.log('success');   
        }
		
	});
	res.redirect('/');
});

//cap nhat sinh vien
app.get('/sua_sv/:id',function(req,res){
	var sql="select * from sinhvien where idsv="+req.params.id;//lấy thông tin cần sửa hiển thị ra view 
	connection.query(sql,function(error,results,fields){
		if(error) throw error;
		else{
			res.render('edit_sv',{results});//file edit_sv.ejs
		}
	});
});
app.post('/sua_sv/:id',urlencodedParser,function(req,res){
var idsv = req.params.id;//lấy idsv
var sql = "Update sinhvien set `MASV`='"+req.body.masv+"',`tensv`='"+req.body.hoten+"',`gioitinh`="+req.body.gioitinh+" where `idsv`="+idsv;
	connection.query(sql,function(error){
		if(error) console.log(error.message);
		else{
			console.log("Cập nhật thành công!");
		}
	});
	return res.redirect('/');//return về trang hiển thị danh sách sinh viên
});
//xoa sinh vien trong database
app.get('/xoa_sv/:id',function(req,res){
	var sql= "delete from `sinhvien` where `idsv`="+req.params.id;
	connection.query(sql,function(error){
		if(error) console.log(error.message);
		else{
			res.redirect('/');
		}
	});
});
http.listen(process.env.PORT || 8888, function(){
  console.log('listening on *:8888');
});