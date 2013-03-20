  var canvas = document.getElementById("realCanvas");
  var tmp_board = document.getElementById("tempCanvas");
  var b_width = canvas.width, b_height = canvas.height;
  var ctx = canvas.getContext("2d");
  var tmp_ctx = tmp_board.getContext("2d");
  var x, y; 
  var saved = false, hold = false, fill = false, stroke = true, tool = 'rectangle';

  var data = {"rectangle": [], "circle": []};

  function curr_tool(selected){tool = selected;}

  function attributes(){
    if (document.getElementById("fill").checked)
      fill = true;
    else
      fill = false;
    if (document.getElementById("outline").checked)
      stroke = true;
    else
      stroke = false;
  }

  function clears(){
    ctx.clearRect(0, 0, b_width, b_height);
    tmp_ctx.clearRect(0, 0, b_width, b_height);
    data = {"rectangle": [], "circle": []};
  }

  function color(scolor){  
    tmp_ctx.strokeStyle = scolor;
   if (document.getElementById("fill").checked)
      tmp_ctx.fillStyle =  scolor; 
}
 
  tmp_board.onmousedown = function(e) {
        attributes();
        hold = true;
        x = e.pageX - this.offsetLeft;
        y = e.pageY -this.offsetTop;
        begin_x = x;
        begin_y = y;
        tmp_ctx.beginPath();
        tmp_ctx.moveTo(begin_x, begin_y);    
  }

  tmp_board.onmousemove = function(e) {
        if (x == null || y == null) {
          return;
        }
        if(hold){
          x = e.pageX - this.offsetLeft;
          y = e.pageY - this.offsetTop;
          Draw();
        }
  }
     
  tmp_board.onmouseup = function(e) {
        ctx.drawImage(tmp_board,0, 0);
        tmp_ctx.clearRect(0, 0, tmp_board.width, tmp_board.height);
        end_x = x;
        end_y = y;
        x = null;
        y = null;
        Draw();
        hold = false;
  }

  function Draw(){
if (tool == 'rectangle'){
      if(!x && !y){
        data.rectangle.push({"x": begin_x, "y": begin_y, "width": end_x-begin_x, "height": end_y-begin_y,
                                 "stroke": stroke, "strk_clr": tmp_ctx.strokeStyle, 
                                 "fill": fill, "fill_clr": tmp_ctx.fillStyle });
        return;
      }  
      tmp_ctx.clearRect(0, 0, b_width, b_height);
      tmp_ctx.beginPath();
      if(stroke)
        tmp_ctx.strokeRect(begin_x, begin_y, x-begin_x, y-begin_y);
      if(fill) 
        tmp_ctx.fillRect(begin_x, begin_y, x-begin_x, y-begin_y);
      tmp_ctx.closePath();
    }
    else if (tool == 'circle'){   
      if(!x && !y){
        data.circle.push({"x": begin_x, "y": begin_y, "radius": end_x-begin_x, 
                               "stroke": stroke, "strk_clr": tmp_ctx.strokeStyle,
                              "fill": fill, "fill_clr": tmp_ctx.fillStyle });   
        return;
      }   
      tmp_ctx.clearRect(0, 0, b_width, b_height);
      tmp_ctx.beginPath();
      tmp_ctx.arc(begin_x, begin_y, Math.abs(x-begin_x), 0 , 2 * Math.PI, false);
      if(stroke) 
        tmp_ctx.stroke();
      if(fill) 
        tmp_ctx.fill();
      tmp_ctx.closePath();
    }

  }
function is_there(fname){
    for(var each in py_data){
      if(each == fname) 
        return true;
    }
    return false;
  }

  function save(){
    var f_name =  document.getElementById("fname").value;
    var title = document.getElementById('name').innerHTML;
    if(!f_name){
      alert("Enter a Filename to save!");
      return;
    }
    var exist = is_there(f_name);
    if(!saved && exist){
      alert("File name already exists!");
      return;
    } 
    $.post("/",{fname: f_name, whole_data: JSON.stringify(data)}); 
    title = f_name;
    alert("Saved....!");
  }

 $(".img_files").click(function(){ 
    var img_fname = $(this).text();
    document.getElementById('name').innerHTML = img_fname;
    document.getElementById("fname").value = img_fname;
    clears();
    iter_py_data(img_fname);
  });

  function iter_py_data(img_name){
    saved = true;
    for(var key in py_data){
      if(key == img_name){
        file_data = JSON.parse(py_data[key]);
        for(var ptool in file_data){
          if(file_data[ptool].length != 0){
            for(var i=0; i<file_data[ptool].length; i++){
              data[ptool].push(file_data[ptool][i]);
              shape_draw(ptool, file_data[ptool][i]);
            }
          }
         }
       }
     }
  }
 

  function createNew(){
    window.location = "/";    
  }

   
  function shape_draw(ctool, shape){
    if (ctool == 'rectangle'){
      var r_x = shape.x, r_y = shape.y, width = shape.width, height = shape.height;
          stroke = shape.stroke, fill = shape.fill;   
      ctx.beginPath();
      ctx.lineWidth = shape.thick;
      ctx.strokeStyle = shape.strk_clr;
      ctx.fillStyle = shape.fill_clr;
      if(stroke)
        ctx.strokeRect(r_x, r_y, width, height);
      if(fill) 
        ctx.fillRect(r_x, r_y, width, height);
        ctx.closePath();  
    }
    else if (ctool == 'circle'){   
      var c_x = shape.x, c_y = shape.y, width = shape.radius, stroke = shape.stroke,
      fill = shape.fill;
      ctx.beginPath();
      ctx.lineWidth = shape.thick;
      ctx.strokeStyle = shape.strk_clr;
      ctx.fillStyle = shape.fill_clr;
      ctx.arc(c_x, c_y, Math.abs(width), 0 , 2 * Math.PI, false);
      if(stroke) 
        ctx.stroke();
      if(fill) 
        ctx.fill();
      ctx.closePath();  
    }
    
  }
  
  
