"use strict"
var a_img1=[];
var a_img=[];
var a=[];
var player_num=1;
var x, y, x1, y1, input_x, input_y;
var floor1=2;
var top1=9;
var selected_id="";
var input_s_id="";
var doubled=0;
var status_q=0;      // для дамок; если 0-ход не состоялся, если 2 - возможен double, если 1 - ход закочен
var color1="blue", color2="red";
var delay=0;
var rotate_board=0;       
var board_rotated=1;    // если один - доска в стандартном положении, если 2 - доска развернута
var timer1;
var gm=0;               // generator_mode
var op=0;               // выполняется операция сохранения, загрузки, смены цвета.
var loading_code={};
var saved_games={};
saved_games["длинный ход"]="5555555555555555555555555550505050555505051525555551515150555505050505555551515150555505050505555551515150555505050505555555555555555555555555552";

var cpu_on=0;
var cpu_num=2;
var cpu_proceeding=0;
var cpu_route=[];
var route_pos=0;


function set_color()
{
    color1=jQuery("#select_color1 :selected").val();
    color2=jQuery("#select_color2 :selected").val();
    standart_form_a_img1(color1, color2);
    jQuery("#minor_menu").html("");
    op=0;
}

function cpu_set()
{
    var cpu1=0, cpu2=0;
    if(jQuery("#cpu_set_player1 :selected").val()=="computer")
        cpu1=1;
    else
        cpu1=0;
    if(jQuery("#cpu_set_player2 :selected").val()=="computer")
        cpu2=1;
    else
        cpu2=0;
    if(cpu1 && cpu2)
    {
        cpu_on=1;
        cpu_num=3;
        f_cpu();
        route_pos=0;
        cpu_proceeding=1;
        f_click();
    }
    else if(cpu1)
    {
        cpu_on=1;
        cpu_num=1;
        if(player_num==1)
        {
            f_cpu();
            route_pos=0;
            cpu_proceeding=1;
            f_click();
        }       
    }
    else if(cpu2)
    {
        cpu_on=1;
        cpu_num=2;
        if(player_num==2)
        {
            f_cpu();
            route_pos=0;
            cpu_proceeding=1;
            f_click();
        }       
    }
    else
        cpu_on=0;
    jQuery("#minor_menu").html("");
    op=0;
    if(cpu1 && cpu2)
        jQuery("#minor_menu").html('<input type="button" value="Stop" onclick="cpu_on=0; jQuery(\'#minor_menu\').html(\'\');" />');
}

function generator1()
{

    if((delay==1) || (op==1))
        if(gm==0) 
            return;
        
    if(selected_id!="")
    {
        alert("Ход не завершен");
        return;
    }
    if(gm==0)
    {
        gm=1;
        op=1;
        jQuery("#p_num").html("Edit Mode ");
        show_objects();
        jQuery("#next_move [value='p"+player_num+"']").attr("selected", "selected");
    }
    else
    { 
        gm=0;
        op=0;
        var nextMove=jQuery("#next_move :selected").val();
        if(nextMove=='p1')
            player_num=1;
        else
            player_num=2;
        jQuery("#status").css("color", player_num==1?color1:color2);
        jQuery("#p_num").html("Player "+player_num);
        jQuery("#minor_menu").html("");
    }
}

function generator_mode(t,f)
{
    var obj=jQuery("#generate :selected").val();
    if((a[t][f]!=0) && (obj!='r')) 
    {
        alert("error");
        return;
    }
    if((a[t][f]==0) && (obj=='r')) 
        return;
    if(obj=="c1") a[t][f]=11;
    if(obj=="d1") a[t][f]=10;
    if(obj=="c2") a[t][f]=22;
    if(obj=="d2") a[t][f]=20;
    if(obj=="r")  a[t][f]=0;
    if(a[t][f]!=0)
    {
        jQuery("#"+t+f).html("<div style='opacity: 0;' id='s" + t+f + "'> </div>");
        set_attributes(t,f,color1,color2); 
        for(var i=0;i<=10;i++)
            setTimeout(set_opacity, i*50, t, f, (10-i));
    }
    else
    {
        for(var i=0;i<=10;i++)
            setTimeout(set_opacity, i*50, t, f, i);
        setTimeout('jQuery("#"+t+f).html("");', 500);
    }
    
}

function remove_all()
{
    for(var i=floor1;i<=top1;i++)
        for(var j=floor1;j<=top1;j++)
        {
            if(a[i][j]!=0)
            {
                a[i][j]=0;
                for(var k=0;k<=10;k++)
                    setTimeout(set_opacity, k*50, i, j, k);
                setTimeout('jQuery("#"+t+f).html("");', 500);
            }
        }
}

function set_attributes(t,f,color1,color2)
{

    jQuery("#s"+t+f).css("display", "inline-block");
    jQuery("#s"+t+f).css("height", "40px");
    jQuery("#s"+t+f).css("width", "40px");
    jQuery("#s"+t+f).css("margin-top", "5px");
    jQuery("#s"+t+f).css("border-radius", "25px");
    jQuery("#s"+t+f).css("font-size", "30px");
    if((a[t][f]==11) || (a[t][f]==10))
        jQuery("#s"+t+f).css("background-color", color1);
    if((a[t][f]==22) || (a[t][f]==20))
        jQuery("#s"+t+f).css("background-color", color2);
    if((a[t][f]==10) || (a[t][f]==20))
        jQuery("#s"+t+f).html("A");

}

function on_off_rotations()
{
    if(rotate_board==0)
    { 
        rotate_board=1;
        jQuery("#rtbtn").attr("value", "rotations off");
    }
    else 
    {
        rotate_board=0;
        jQuery("#rtbtn").attr("value", "rotations on");
    }
    if((rotate_board==1) && (player_num==2) && (board_rotated==1))
        rotate_play_board(); 
    if((rotate_board==0) && (board_rotated==2))
        rotate_play_board(); 
}

function rotate_play_board()
{
    var k, k1, k2;
    for(var i=2;i<=9;i++)
        for(var j=2;j<=10-i;j++)
        {
            k=jQuery("#b"+i+j).html();
            jQuery("#b"+i+j).html(jQuery("#b"+(11-i)+(11-j)).html());
            jQuery("#b"+(11-i)+(11-j)).html(k);
        }
    for(var i=2, j=9; (i<=5) && (j>=6); i++, j--)
    {
        k=jQuery("#b"+i+j).html();
        jQuery("#b"+i+j).html(jQuery("#b"+(11-i)+(11-j)).html());
        jQuery("#b"+(11-i)+(11-j)).html(k);
    }
    for(var i=2, j=1; i<=5; i++)
    {
        k=jQuery("#"+i+j).html();
        jQuery("#"+i+j).html(jQuery("#"+(11-i)+j).html());
        jQuery("#"+(11-i)+j).html(k);
    }
    for(var i=1, j=2; j<=5;j++)
    {
        k=jQuery("#"+i+j).html();
        jQuery("#"+i+j).html(jQuery("#"+i+(11-j)).html());
        jQuery("#"+i+(11-j)).html(k);
    }
    board_rotated=3-board_rotated;
    $(".a_img1").hover(user_hover, user_hover_out);
    $(".a_img1").click(user_click);
}

function standart_form_a_img1(color1, color2)
{
    for(var i=1;i<10;i++)
    {
        for(var j=1;j<10;j++)
        {
            if((a[i][j]==22) || (a[i][j]==11) || (a[i][j]==10) || (a[i][j]==20))
            {
                jQuery("#"+i+j).html("<div id='s" + i+j + "'> </div>");
                set_attributes(i,j,color1,color2);                                                              
            }
            if(a[i][j]==0)
                jQuery("#"+i+j).html("");
        }
    }
    jQuery("#status").css("color", player_num==1?color1:color2);
    if(gm==0)
        jQuery("#p_num").html("Player "+player_num);
}

function save_game()
{
    if((delay==1) || (op==1))
        return;
    if(selected_id!="")
    {
        alert("Ход не завершён");
        return;
    }
    op=1;
    var forReading=1;
    jQuery("#minor_menu").html("<select id='loading_name' size='4' style='width: 170px'> </select><br/>");
    var str;
    var fkey="";
    loading_code={};
    for(var i in saved_games)
    {
        fkey=i;
        loading_code[fkey]=saved_games[i];
        jQuery("#loading_name").append('<option style="width: 50px;" value="'+fkey+'">' + fkey + '</option>');
    }
    jQuery("#minor_menu").append("<input type='text' id='saving_name'/><br/>");
    jQuery("#minor_menu").append("<input type='button' id='save_btn' value='save' onclick='write_game()'  />");
    jQuery("#minor_menu").append('<input type="button" value="delete" onclick="delete_game()"/>');
    jQuery("#minor_menu").append('<input type="button" value="cancel" onclick="f_cancel()"/>');
    jQuery("#loading_name").attr("onchange", "jQuery('#saving_name').attr('value',jQuery(\"#loading_name :selected\").val())");
}


function write_game()
{
    var sv_name=document.getElementById("saving_name").value;
    var reg=/^[a-zа-яё0-9_\s]+$/i;
    if(!reg.test(sv_name))
    {
        alert("unexpected characters");
        return;
    }
    if(!sv_name) return;
    var str="";
    for(var i=0;i<12;i++)
        for(var j=0;j<12;j++)
        {
            if(a[i][j]==-1)   str=str+"5";    //неактивная клетка
            if(a[i][j]==11)   str=str+"1";    //blue
            if(a[i][j]==22)   str=str+"2";    //red
            if(a[i][j]==10)   str=str+"3";    //blue_d
            if(a[i][j]==20)   str=str+"4";    //red_d
            if(a[i][j]==0)    str=str+"0";    //empty_black
        }
    str=str+player_num;
    loading_code[sv_name]=str;
    saved_games[sv_name]=str;

    loading_code={};
    jQuery("#minor_menu").html("");
    op=0;
}


function load_name()
{
    if((delay==1) || (op==1))
        return;
    if(selected_id!="")
    {
        alert("Ход не завершён");
        return;
    }    
    op=1;
    jQuery("#minor_menu").html("<select id='loading_name' size='4'> </select><br/>");
    var str;
    var fkey="";
    loading_code={};
    for(var i in saved_games)
    {
        fkey=i;
        loading_code[fkey]=saved_games[i];
        jQuery("#loading_name").append('<option style="width: 170px;" value="'+fkey+'">' + fkey + '</option>');
    }
    jQuery("#minor_menu").append('<input type="button" value="load" onclick="load_game()"/>');
    jQuery("#minor_menu").append('<input type="button" value="delete" onclick="delete_game()"/>');
    jQuery("#minor_menu").append('<input type="button" value="cancel" onclick="f_cancel()"/>');
}

function load_game()
{
    var ld_name=jQuery("#loading_name :selected").val();
    if(!ld_name) return;
    var str=loading_code[ld_name];
    for(var i=0;i<143;i++)
    {
        if(str[i]=='5')  a[Math.floor(i/12)][i%12]=-1;    //неактивная клетка
        if(str[i]=='1')  a[Math.floor(i/12)][i%12]=11;    //blue
        if(str[i]=='2')  a[Math.floor(i/12)][i%12]=22;    //red
        if(str[i]=='3')  a[Math.floor(i/12)][i%12]=10;    //blue_d
        if(str[i]=='4')  a[Math.floor(i/12)][i%12]=20;    //red_d
        if(str[i]=='0')  a[Math.floor(i/12)][i%12]=0;     //empty_black
    }
    player_num=Number(str[144]);
    standart_form_a_img1(color1, color2);
    loading_code={};
    jQuery("#minor_menu").html("");
    cpu_on=0;
    op=0;
}

function delete_game()
{
    var d_name=jQuery("#loading_name :selected").val();
    if(!d_name) return;
    delete saved_games[d_name];
    jQuery("#loading_name option[value="+d_name+"]").remove();
}

function f_cancel()
{
    jQuery("#minor_menu").html("");
    op=0;
}

function new_game()
{
    if((delay==1) || (op==1))
        return;
    if(selected_id!="")
    {
        alert("Ход не завершён");
        return;
    }
    a=[];
  //  rotate_board=0;
    for(var i=0;i<12;i++)
    {
        a[i]=[];
        for(var j=0;j<12;j++)
        {
            
            if((i<floor1) || (i>top1) || (j<floor1) || (j>top1) || ((i+j)%2==0))
                a[i][j]=-1;
            else if((i>=2) && (i<=4))
                a[i][j]=22;
            else if((i>=7) && (i<=9))
                a[i][j]=11;
            else a[i][j]=0;     
        }
    }
    player_num=1;
    cpu_on=0;
    standart_form_a_img1(color1, color2);
}

function check_false(current_p, opposite_p)
{
    var opposite_c=opposite_p*10+opposite_p;
    var current_c=current_p*10+current_p;
    var current_d=current_p*10;
    for(var i=2; i<=9; i++)
        for(var j=2; j<=9; j++)
        {
            if(a[i][j]==current_c)
                if(((Math.floor(a[i+1][j+1]/10)==opposite_p) && (a[i+2][j+2]==0)) ||
                  ((Math.floor(a[i-1][j+1]/10)==opposite_p) && (a[i-2][j+2]==0)) ||
                  ((Math.floor(a[i+1][j-1]/10)==opposite_p) && (a[i+2][j-2]==0)) ||
                  ((Math.floor(a[i-1][j-1]/10)==opposite_p) && (a[i-2][j-2]==0)))
                  {
                      a[i][j]=0;
                      alert("gutter");
                      f_remove(i,j);
                      return;
                  }
            if(a[i][j]==current_d)
            {
                for(var t=i+1, f=j+1; t<top1 && f<top1; t++, f++)
                    if(a[t][f]!=0)
                        if((Math.floor(a[t][f]/10)==opposite_p) && (a[t+1][f+1]==0))
                        {
                            a[i][j]=0;
                            alert("gutter");
                            f_remove(i,j);
                            return;
                        }
                        else break;
                for(var t=i-1, f=j+1; t>floor1 && f<top1; t--, f++)
                    if(a[t][f]!=0)
                        if((Math.floor(a[t][f]/10)==opposite_p) && (a[t-1][f+1]==0))
                        {
                            a[i][j]=0;
                            alert("gutter");
                            f_remove(i,j);
                            return;
                        }
                        else break;
                for(var t=i+1, f=j-1; t<top1 && f>floor1; t++, f--)
                    if(a[t][f]!=0)
                        if((Math.floor(a[t][f]/10)==opposite_p) && (a[t+1][f-1]==0))
                        {
                            a[i][j]=0;
                            alert("gutter");
                            f_remove(i,j);
                            return;
                        }
                        else break;
                for(var t=i-1, f=j-1; t>floor1 && f>floor1; t--, f--)
                    if(a[t][f]!=0)
                        if((Math.floor(a[t][f]/10)==opposite_p) && (a[t-1][f-1]==0))
                        {
                            a[i][j]=0;
                            alert("gutter");
                            f_remove(i,j);
                            return;
                        }
                        else break;
            }
        }
}

function possible_double_kill(t,f,opposite_p)
{
    if(((Math.floor(a[t+1][f+1]/10)==opposite_p) && (a[t+2][f+2]==0)) ||
       ((Math.floor(a[t-1][f+1]/10)==opposite_p) && (a[t-2][f+2]==0)) ||
       ((Math.floor(a[t+1][f-1]/10)==opposite_p) && (a[t+2][f-2]==0)) ||
       ((Math.floor(a[t-1][f-1]/10)==opposite_p) && (a[t-2][f-2]==0)))
       {
        return 1;
       }
    return 0;
}

function d_possible_double_kill(i,j,opposite_p)
{
    for(var t=i+1, f=j+1; t<top1 && f<top1; t++, f++)
        if(a[t][f]!=0)
            if((Math.floor(a[t][f]/10)==opposite_p) && (a[t+1][f+1]==0))
            {
                return 1;
            }
            else break;
    for(var t=i-1, f=j+1; t>floor1 && f<top1; t--, f++)
        if(a[t][f]!=0)
            if((Math.floor(a[t][f]/10)==opposite_p) && (a[t-1][f+1]==0))
            {
                return 1;
            }
            else break;
    for(var t=i+1, f=j-1; t<top1 && f>floor1; t++, f--)
        if(a[t][f]!=0)
            if((Math.floor(a[t][f]/10)==opposite_p) && (a[t+1][f-1]==0))
            {
                return 1;
            }
            else break;
    for(var t=i-1, f=j-1; t>floor1 && f>floor1; t--, f--)
        if(a[t][f]!=0)
            if((Math.floor(a[t][f]/10)==opposite_p) && (a[t-1][f-1]==0))
            {
                return 1;
            }
            else break;
    return 0;
}

function highlight_checker(t,f)
{
    jQuery("#"+t+f).css("background-color", "green");
}


function reset_highlight(t,f)
{
    jQuery("#"+t+f).css("background-color", "black");
}

function convert_to_d()
{
    if((player_num==1) && (x1==2) && (a[x1][y1]))
    {
        a[x1][y1]=10;
        jQuery("#s"+x1+y1).html("A");
    }
    if((player_num==2) && (x1==9) && (a[x1][y1]))
    {
        a[x1][y1]=20;
        jQuery("#s"+x1+y1).html("A");
    }
}

function f_pace(i,sign_top,sign_left, p, q)
{
    jQuery("#s"+p+q).css("position", "relative");
    jQuery("#s"+p+q).css("top", sign_top*i+"px");
    jQuery("#s"+p+q).css("left", sign_left*i+"px");
}

function f_move(p,q,p1,q1)
{
    if(a[x1][y1]!=0)
    {
        delay=1;
        var sign_top=1;
        var sign_left=1;
        if(p1-p<0)
            sign_top=(-1);
        if(q1-q<0)
            sign_left=(-1);
        if(board_rotated==2)
        {
            sign_top*=(-1);
            sign_left*=(-1);
        }
        var i;
        for(i=1;i<=50*Math.abs(p-p1);i++)
            setTimeout(f_pace, i*10/Math.abs(p-p1), i, sign_top, sign_left, p, q);
        timer1=i*10/Math.abs(p-p1);
    }
    setTimeout(function()
    {
        jQuery("#status").css("color", player_num==1?color1:color2);
        jQuery("#p_num").html("Player "+player_num);
        jQuery("#destcoord").html("");
        jQuery("#sourcecoord").html("["+String.fromCharCode(65+Number(q1)-2)+", "+(p1-1)+"]");
        if(a[x1][y1]!=0)
        {
            jQuery("#s"+p+q).remove();
            jQuery("#"+p1+q1).html("<div id='s" + p1+q1 + "'> </div>");
            set_attributes(p1, q1, color1, color2); 
            delay=0;       
        }                                                         
    }, timer1);
}

function set_opacity(t,f,k)
{
    jQuery("#s"+t+f).css("opacity", (10-k)*0.1+"");
}

function f_remove(t,f)
{
    delay=1;
    for(var i=1;i<=10;i++)
        setTimeout(set_opacity, i*50, t, f, i);

    setTimeout(function()
    {
        jQuery("#s"+t+f).remove();
        delay=0;
    }, 500);
}


function move_checker()
{
    if(doubled)
    {
        a[x][y]=0;
        alert("gutter");
        f_remove(x,y);
    }
    else
        check_false(player_num, 3-player_num);
    a[x1][y1]=a[x][y];
    a[x][y]=0;
    reset_highlight(x,y);
    f_move(x,y,x1,y1);
    convert_to_d();
}



function d_move(current_p, opposite_p)
{
    if(Math.abs(x1-x)!=Math.abs(y1-y) || a[x1][y1]!=0)
    {
        return 0;
    }
    var t=(x1-x)/Math.abs(x1-x);
    var f=(y1-y)/Math.abs(y1-y);
    var enemies=0;
    var enemy_x;
    var enemy_y;
    for(var i=x+t, j=y+f; i!=x1 && j!=y1; i=i+t, j=j+f)
    {
        if(Math.floor(a[i][j]/10)==current_p)
        {
            enemies=2;                                 // при наличии на пути своей шашки ход не возможен, как и при наличии 2х чужих
            return 0;
        }
        if(Math.floor(a[i][j]/10)==opposite_p)
        {
            enemies++;
            enemy_x=i;
            enemy_y=j;
        }
    }
    if(enemies>1)
        return 0;
    if(enemies==0)
    {
        if(doubled)
        {
            a[x][y]=0;
            alert("gutter");
            f_remove(x,y);
        }
        else
            check_false(player_num, 3-player_num);
    }
    a[x1][y1]=a[x][y];
    a[x][y]=0;
    f_move(x,y,x1,y1);
    reset_highlight(x,y);
    if(enemies==1)
    {
        a[enemy_x][enemy_y]=0;
        f_remove(enemy_x, enemy_y);
        if(d_possible_double_kill(x1,y1,3-player_num))
            return 2;
    }
    return 1;
}
function f()
{
    alert("hello");
    var b=[];
    for(var i=0;i<12;i++)
    {
        a[i]=[];
        for(var j=0;j<12;j++)
        {
            a_img[i]=[];
            a_img1[i]=[];
            a_img[i][j]=document.createElement('div');
            a_img[i][j].id="b"+i+j;
            a_img1[i][j]=document.createElement('div');
            a_img1[i][j].id=""+i+j;
            if(((j>0) && (j<10)) && ((i>0) && (i<10)))
            {
                document.getElementById("body").appendChild(a_img[i][j]);
                document.getElementById("b"+i+j).appendChild(a_img1[i][j]);
            }
            if((i<floor1) || (j<floor1) || (i>top1) || (j>top1))
            {
                a[i][j]=-1;
            }
            else if((i+j)%2==0)
            {
                a[i][j]=-1;
            }
            else if(i<=4)
            {
                a[i][j]=22;
                jQuery("#"+i+j).attr("class", "a_img1");
                
            }
            else if(i>=7)
            {
                a[i][j]=11;
                jQuery("#"+i+j).attr("class", "a_img1");
            }
            else
            {
                a[i][j]=0;
                jQuery("#"+i+j).attr("class", "a_img1");
            }
            jQuery("#"+i+j).css("display", "inline-block");
            jQuery("#"+i+j).css("width", "50px");
            jQuery("#"+i+j).css("height", "50px");
            jQuery("#"+i+j).css("vertical-align", "top");
            jQuery("#b"+i+j).css("display", "inline-block");
            jQuery("#b"+i+j).css("width", "50px");
            jQuery("#b"+i+j).css("height", "50px");
            jQuery("#b"+i+j).css("vertical-align", "top");
            if(((i+j)%2!=0) && (i>1) && (j>1))
            {
                jQuery("#"+i+j).css("background-color", "black");
            }
            if((j==1) || (i==1))
            {
                var f_content;
                if((i==1) && (j==1)) f_content="";
                if((i==1) && (j!=1)) f_content=String.fromCharCode(65+j-2);
                if((j==1) && (i!=1)) f_content=i-1;
                jQuery("#"+i+j).html("<div style= 'font-size: 40px; color: white;'>" + f_content +" </div>");
            }

        }
        b[i]=document.createElement('br');
        b[i].id="br"+i;
        if((i>0) && (i<9))
            document.getElementById("body").appendChild(b[i]);  
            
									
									
    }  
    jQuery("#body").append('<div style="text-align: left; padding-left: 50px;">'+
                           '<div id="status" style="font-size: 20pt;"><span id=\'p_num\'>Player 1</span>: <span id="sourcecoord"> </span> <span id="destcoord"> </span></div>'+'</div>');
    jQuery("#body").append('<div id="footer" style="text-align: left; padding-left: 50px;"> </div>');
    menu_btn();
    standart_form_a_img1(color1, color2);


    $(".a_img1").hover(user_hover, user_hover_out);
    $(".a_img1").click(user_click);
  
}

function user_click()
{
    if(gm==1)
    {
        generator_mode(this.id[0], this.id[1]);
        return;
    }
    if((delay==1) || (op==1))
        return;
    if(((cpu_num==player_num) || (cpu_num==3)) && (cpu_on))
        return;
    f_click(this);
}

function f_click(e_this)
{

    if((cpu_on) && ((cpu_num==player_num) || (cpu_num==3)))
    {
        input_x=cpu_route[route_pos][0];
        input_y=cpu_route[route_pos][1];
        f_hover(input_x,input_y);
        route_pos++;
        input_s_id=""+input_x+input_y;
        if(route_pos==cpu_route.length)
        {
            cpu_proceeding=0;                                             // ход сру закончен
        }
    }
    else
    {
        input_x=Number(e_this.id[0]);
        input_y=Number(e_this.id[1]);
        input_s_id=""+input_x+input_y;
    }
    if(!(selected_id)) 
    {
        if(((player_num==1) && ((a[input_x][input_y]==11) || (a[input_x][input_y]==10))) ||
           ((player_num==2) && ((a[input_x][input_y]==22) || (a[input_x][input_y]==20))))
        {
            selected_id=input_s_id;
            x=input_x;
            y=input_y;
            highlight_checker(x,y);
        }
    }
    else
    {
        x1=input_x;
        y1=input_y;
        if(a[x][y]%10==0)
        {
            status_q=d_move(player_num, 3-player_num);
            if(status_q==1)
            {
                player_num=3-player_num;
                selected_id="";
                reset_highlight(x1,y1);
                doubled=0;
            }
            if(status_q==2)              // возможен double дамкой
            {
                x=x1;
                y=y1;
                highlight_checker(x,y);
                doubled=1;
            } 
            if((status_q==0) && (doubled==0))
            {
                selected_id="";
                reset_highlight(x,y);
            }               
        }
        else if((((x-x1==1) && (Math.abs(y1-y)==1) && (player_num==1)) || ((x1-x==1) && (Math.abs(y1-y)==1) && (player_num==2))) && (a[x1][y1]==0) && (a[x][y]%10!=0))
        {
            move_checker();
            player_num=3-player_num;
            selected_id="";
            doubled=0;
        }
        else if((a[x1][y1]==0) && (Math.abs(x-x1)==2) && (Math.abs(y-y1)==2) && (Math.floor(a[(x+x1)/2][(y+y1)/2]/10)==3-player_num))
        {
            a[x1][y1]=a[x][y];
            a[x][y]=0;
            a[(x+x1)/2][(y+y1)/2]=0;
            reset_highlight(x,y);
            f_move(x,y,x1,y1);
            f_remove((x+x1)/2,(y+y1)/2);
            convert_to_d();
            if((a[x1][y1]%10)==0)
            {
                if(d_possible_double_kill(x1, y1, 3-player_num))
                {
                    x=x1;
                    y=y1;
                    highlight_checker(x,y);
                    doubled=1;
                }
                else
                {
                    player_num=3-player_num;
                    selected_id="";
                    doubled=0;
                }
                       
            }
            else if((possible_double_kill(x1,y1,3-player_num)==0) && (a[x1][y1]%10!=0))
            {
                player_num=3-player_num;
                selected_id="";
                doubled=0;
            }
            else
            {
                x=x1;
                y=y1;
                highlight_checker(x,y);
                doubled=1;
            }  
        }
        else 
        if(doubled==0)
        {
            reset_highlight(x,y);                      //если хода не состоялось (неверный ход)
            selected_id="";
        }
            
    }
    if(cpu_on) f_hover_out(input_x, input_y);
    if((cpu_on) && ((cpu_num==player_num) || (cpu_num==3)))
    {
        if(cpu_proceeding==0)
        {
            f_cpu();
            route_pos=0;
            cpu_proceeding=1;
        }
        setTimeout(f_click, 600);
    }
    checkers_left();
    movings_left();
}

function user_hover()
{
    if((delay==1) || (op==1))
        if(gm==0)
            return;
    if(((cpu_num==player_num) || (cpu_num==3)) && (cpu_on))
        return;   
    if((rotate_board) || (board_rotated==2))
    {
        if((board_rotated!=player_num) || (rotate_board==0))              //если доска развернута, вращение отмененио и ход второго игрока            
        {
            rotate_play_board();
            return;
        }
    } 
    f_hover(this.id[0], this.id[1]);
}


function user_hover_out()
{ 
    f_hover_out(this.id[0], this.id[1]);
}

function f_hover(p, q)
{
    if(document.getElementById(""+p+q).style.backgroundColor=="black")
        jQuery("#"+p+q).css("background-color", "gray");
    if(!selected_id)
    {
        jQuery("#sourcecoord").html("["+String.fromCharCode(65+Number(q)-2)+", "+(p-1)+"]");
        jQuery("#destcoord").html("");
    }
    else
        jQuery("#destcoord").html(" &#8594 ["+String.fromCharCode(65+Number(q)-2)+", "+(p-1)+"]");
}

function f_hover_out(p, q)
{
    if(document.getElementById(""+p+q).style.backgroundColor=="gray")
        jQuery("#"+p+q).css("background-color", "black");
    if(delay==1)
        return;
    if(!selected_id)
    {
        jQuery("#sourcecoord").html("");
        jQuery("#destcoord").html("");
    }
    else
        jQuery("#destcoord").html("");
}

function checkers_left()
{
    var p1=0, p2=0;
    for(var i=floor1; i<=top1; i++)
        for(var j=floor1; j<=top1; j++)
        {
            if(Math.floor(a[i][j]/10)==1)
                p1++;
            if(Math.floor(a[i][j]/10)==2)
                p2++;
        }
    if(p1==0)
    {
        //jQuery("#source").html("Player1 has won the game");
        if((cpu_on==1) && (cpu_num==3))
        {
            cpu_on=0; 
            jQuery('#minor_menu').html('');
        }
    }
    if(p2==0)
    {
        //jQuery("#source").html("Player2 has won the game");
        if((cpu_on==1) && (cpu_num==3))
        {
            cpu_on=0; 
            jQuery('#minor_menu').html('');
        }
    }
}


function movings_left()
{
    var mov=0;
    for(var i=floor1; i<=top1; i++)
        for(var j=floor1; j<=top1; j++)
        {
            if(a[i][j]!=-1)
            {
                if(Math.floor(a[i][j]/10)==player_num)
                {
                    if((a[i+1][j+1]==0) || (a[i+2][j+2]==0) ||
                       (a[i-1][j+1]==0) || (a[i-2][j+2]==0) ||
                       (a[i+1][j-1]==0) || (a[i+2][j-2]==0) ||
                       (a[i-1][j-1]==0) || (a[i-2][j-2]==0))
                        mov++;
                }
            }
        }
    if(mov==0)
    {
        //jQuery("#source").html("Player"+(3-player_num)+ " has won the game");
        if((cpu_on==1) && (cpu_num==3))
        {
            cpu_on=0;
            jQuery('#minor_menu').html('');
        }
    }
}


function f_menu()
{
    jQuery("#footer").html("");
    jQuery("#footer").append('<div id="menu" style="width: 100px; float: left;">'+
    '<input type="button" value="new game" onclick="new_game()"/> <br/>'+
    '<input type="button" value="save game" onclick="save_game()"/> <br/>'+
    '<input type="button" value="load game" onclick="load_name()"/> <br/>'+
    '<input type="button" id="rtbtn" value="rotations on" onclick="on_off_rotations()"/> <br/>'+
    '<input type="button" id="cpubtn" value="human/cpu set" onclick="cpu_menu()"/> <br/>'+
    '<input type="button" value="edit mode" onclick="generator1()" />'+
    '<input type="button" value="Change Color" onclick="chgcolor()" />'+
    '<input type="button" value="Hide" onclick="menu_btn()" />'+
    '</div>');
    jQuery("input").each(function()
    {
        jQuery(this).css("width", "100px");
    });
    jQuery("#footer").append('<span id="minor_menu" style="text-align: left;"></span>');
}

function chgcolor()
{
    if((delay==1) || (op==1))
        return;
    if(selected_id!="")
    {
        alert("Ход не завершён");
        return;
    }
    op=1;  
    jQuery("#minor_menu").html('<span> Player 1 </span>'+
        '<select id="select_color1">'+
        '<option value="blue"> Blue </option>'+
        '<option value="red"> Red </option>'+
        '<option value="yellow"> Yellow </option>'+
        '<option value="orange"> Orange </option>'+
        '<option value="purple"> Purple </option>'+
        '<option value="brown"> Brown </option>'+
        '<option value="white"> White </option>'+
        '<option value="olive"> Olive </option>'+
        '<option value="fuchsia"> Pink </option>'+
        '<option value="teal"> Teal </option>'+
    '</select><br/>'+
    '<span> Player 2 </span>'+
    '<select id="select_color2">'+
        '<option value="blue"> Blue </option>'+
        '<option value="red" selected="selected"> Red </option>'+
        '<option value="yellow"> Yellow </option>'+
        '<option value="orange"> Orange </option>'+
        '<option value="purple"> Purple </option>'+
        '<option value="brown"> Brown </option>'+
        '<option value="white"> White </option>'+
        '<option value="olive"> Olive </option>'+
        '<option value="fuchsia"> Pink </option>'+
        '<option value="teal"> Teal </option>'+
    '</select><br/> <input type="button" value="Ok" onclick="set_color()"/> <br/>');

    jQuery("#select_color1 [value='"+  color1 +"']").attr("selected", "selected");
    jQuery("#select_color2 [value='"+  color2 +"']").attr("selected", "selected");
}

function cpu_menu()
{
    if((gm==1) || (op==1) || (delay==1))
        return;  
    op=1;  
    jQuery("#minor_menu").html('<span> Player 1 </span>'+
        '<select id="cpu_set_player1">'+
        '<option value="human"> Human </option>'+
        '<option value="computer"> Computer </option>'+
        '</select><br/>'+
    '<span> Player 2 </span>'+
        '<select id="cpu_set_player2">'+
        '<option value="human"> Human </option>'+
        '<option value="computer"> Computer </option>'+
        '</select><br/>'+
    '<input type="button" value="Ok" onclick="cpu_set();" />');
    if(((cpu_num==1) || (cpu_num==3)) && (cpu_on))
        jQuery("#cpu_set_player1 [value='computer']").attr("selected", "selected");
    if(((cpu_num==2) || (cpu_num==3)) && (cpu_on))
        jQuery("#cpu_set_player2 [value='computer']").attr("selected", "selected");
}

function show_objects()
{
    jQuery("#minor_menu").html('<select id="generate">'+
        '<option value="c1"> Player1 - checker </option>'+
        '<option value="d1"> Player1 - damka </option>'+
        '<option value="c2"> Player2 - checker </option>'+
        '<option value="d2"> Player2 - damka </option>'+
        '<option value="r"> Remove object </option>'+
    '</select> <br/>'+
    '<input type="button" value="Remove All" onclick="remove_all()"/> <br/>'+
    'Next Move: <br/>'+
    '<select id="next_move">'+
        '<option value="p1"> Player1 </option>'+
        '<option value="p2"> Player2 </option>'+
    '</select> <br/>'+
    '<input type="button" value="Play Mode" onclick="generator1()"/>');
}

function menu_btn()
{
    if((gm==1) || (op==1))
        return;
    jQuery("#footer").html("");
    jQuery("#footer").append('<input id="menu_btn" type="button" value="menu" style="width: 100px;" onclick="f_menu()" />');
}